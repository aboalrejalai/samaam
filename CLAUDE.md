# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**صِمَام (Samaam)** — a policy gateway that sits between a radiology technologist's console and a CT scanner / contrast injector, and returns `403 Forbidden — Policy Violation` when requested settings breach Saudi regulation. Built for the ITU AI Readiness Hackathon (KSA, Health/Radiology track), where it won 3rd Prize. Live deployment: see `DEPLOY.md` (single Docker container, host port 3172).

`docs/Hackathon-Guide.md` was the spec of record. `README.md` is the public-facing summary and stays in sync with the code (API table, record counts, latency figures).

## Commands

```bash
# one-time setup (from repo root)
python -m venv .venv && .venv/bin/pip install -r requirements.txt
cp .env.example .env                       # SAMAAM_LLM_API_KEY is optional
.venv/bin/python -m app.ingest --reset     # build kb/chroma (gitignored)

# backend — boots in ~15 s because it loads the local embedding model
.venv/bin/uvicorn app.main:app --reload --port 8000

# the three scenarios end-to-end in the terminal; prints "N/3 matched expected"
.venv/bin/python run_demo.py
.venv/bin/python run_demo.py 2                                  # one scenario
.venv/bin/python run_demo.py 2 --override "Dr. X, Consultant"   # override path

# frontend (web/) — dev server on :5173 (landing on /, system on /app), talks to :8000
npm install && npm run dev
npm run typecheck
npm run build                              # tsc -b && vite build → web/dist

# full image: frontend build + KB index baked in, one port
docker compose up -d --build
```

There is no test suite and no linter config. Verification is `run_demo.py` (every scenario must match its `expected_verdict`; it does **not** exit non-zero on a mismatch — read the last line), `npm run typecheck`, and hitting the API (`POST /device/execute` with SC-02 must return 403).

Re-run `app.ingest --reset` after any change to `kb/records/health-regulatory.json` or `kb/sources/`. The Docker image indexes at build time, so a KB change also needs a rebuild — never mount a volume over `kb/chroma`.

## Architecture

The pipeline follows ITU-T Y.3172 node for node: `SRC → C → PP → M → P → D → SINK`. Code and docs use these symbols verbatim, and the mapping is part of the pitch, so every new module should state which node it belongs to.

| Node | Where |
| :--- | :--- |
| C | `app/connectors/fhir.py` (read-only HL7 FHIR R4 client, defaults to public HAPI) · `app/connectors/mwl.py` (DICOM Modality Worklist C-FIND **server** on :11112, started in FastAPI's lifespan) |
| PP | `Samaam.preprocess` in `app/pipeline.py` (drops direct identifiers, computes eGFR) · `app/ingest.py` (chunking/embedding) |
| M | `app/llm.py` + `EXPLAIN_SYSTEM` in `app/pipeline.py`, used only to write the explanation |
| P | `app/policy_node.py`, the core of the system |
| D | `PolicyNode._resolve` (citations) · `MockCTScanner._log` (audit) |
| SINK | `app/device_api.py` (`MockCTScanner`) · the React UI |

### P is deterministic and contains no model

`policy_node.py` must never import `app.llm`. The block/allow decision is plain rule logic. If the model is deleted, every block must still happen. The LLM only writes prose about a decision that has already been made, and the frontend fetches that prose separately from `POST /explain` after the verdict has arrived. That is why the UI calls `/evaluate` and `/device/execute` with `explain: false`. With no API key or an unreachable provider, `/explain` returns `source: "unavailable"` and nothing else degrades.

Key concepts that span several files:

- **Verdict vs Action are orthogonal.** `Verdict` is the regulatory classification, one of the six required verdicts: `COMPLIANT` · `VIOLATION` · `AMBIGUITY` · `CONFLICT` · `POTENTIAL_GAP` · `INSUFFICIENT_EVIDENCE`. `Action` is operational: `PROCEED` · `CONFIRM` · `AUTHORISE` · `PROHIBITED`. A decision's action is the most severe action among its checks, and `blocked` means `action != PROCEED`. This split came out of a consultant radiologist's review: a clinical block is a *hold for a named authoriser*, not a prohibition. No eGFR value forbids contrast outright.
- **`Basis` must never be blurred.** `STATUTORY` means binding by Royal Decree (SFDA DRLs, PDPL). `NATIONAL_PROTOCOL` means an MoH clinical protocol, not penal law. The explanation prompt and the UI both preserve this distinction. Never describe a protocol breach as a legal one.
- **Checks cite KB records by explicit ID, not by semantic search,** so the legal basis can't drift with query wording. `_resolve` fetches each ID via `kb.get` and refuses to cite anything not marked `VERIFIED`. When adding a rule: add or verify the record in `kb/records/health-regulatory.json` (direct document URL, never a ministry homepage), re-ingest, then reference its ID in `Check.cites`. Thresholds live as constants at the top of `policy_node.py`, each with a comment citing its source page.
- **`INSUFFICIENT_EVIDENCE` wins over everything.** Any check returning `NO_EVIDENCE` sets the verdict to `INSUFFICIENT_EVIDENCE`, even when other checks fail.
- **Two evaluation paths.** `evaluate` covers the device path (scenarios 1–2): DRL, renal prophylaxis, metformin, nephrotoxic meds. A named `override_by` can release it. `evaluate_data_request` covers the privacy path (scenario 3): PDPL minimisation, lawful basis, cross-border. It is `overridable=False` on purpose, because no clinician can authorise what the PDPL forbids.
- **`Check.readings` and `band` are display-only.** They carry the measured numbers to the UI, and no condition reads them. Don't make logic depend on them, and don't make the frontend parse numbers out of `detail` text.
- **State is in-memory and process-global.** One `Samaam` instance in `app/main.py` holds the `MockCTScanner` state (IDLE/EXECUTED/LOCKED) and the audit trail. Both reset on restart. The MWL server evaluates every scenario on each C-FIND and *withholds* blocked entries from the worklist, logging `MWL_WITHHELD` / `MWL_SERVED`.

### Knowledge base

ChromaDB with **local** embeddings (`intfloat/multilingual-e5-small`; no key, works offline, and the multilingual model is required because queries are Arabic). It has three collections: `policies` (structured records), `sources` (PDF chunks from `kb/sources/`), and `gaps` (Samaam's own gap analysis, kept separate so it never competes with regulation in retrieval). e5 needs its `query: ` / `passage: ` prefixes; `kb.py` adds them.

### Serving

In production FastAPI serves `web/dist` from the same origin, so there is no CORS and no `VITE_API_BASE_URL`. The SPA catch-all must stay registered last in `main.py`. The system's screens live under `/app/*`, so they no longer share paths with API endpoints; the old top-level paths (`/audit`, `/connectors`, …) still work because the Accept-header middleware in `main.py` hands browser navigations to the SPA, which redirects them.

### Frontend (`web/`)

React 19 · Vite · Tailwind v4 · shadcn/ui · TanStack Query · react-router v7 · i18next (ar/en) · `motion` (landing page only). `/` is a landing page (`routes/HomePage.tsx` + `components/home/`, lazy-loaded); the system is under `/app` (`APP_BASE` in `lib/routes.ts`). Read `web/README.md` before editing. The rules that matter most:

- **Saudi Soft identity** (skill in `.claude/skills/saudi-soft/`). `src/index.css` holds Soft's `theme-bridge.css` verbatim between its markers; the only edit is the `--sa-50…900` ladder, which carries the medical blue. Retint by editing those values only. Soft fixes the rest: IBM Plex Sans Arabic 400–700, radii 8/10/12/16, sidebar 280px, top bar 64px, lucide-react only, `gap` not `space-*`, light/dark only. In Soft, `accent`/`secondary` are saturated brand colours, so subtle panels use `bg-muted` or `bg-primary/5`. Status text uses the `*-strong` extension (outside the Soft markers) for contrast.
- **The frontend computes nothing.** Thresholds, verdicts, and citations come from the service; the UI renders them. The landing page's facts all live in `components/home/home-data.ts`, each with a `source:` comment — no invented feature or number.
- **A 403 is a result, not an error.** `lib/api.ts` resolves 403s with the decision from FastAPI's `detail` envelope. Transport failure raises `SamaamOfflineError` so that "server down" and "request refused" never look alike.
- `src/types/api.ts` mirrors `app/main.py` and `policy_node.py` by hand, so update it when the wire shape changes.
- Use logical CSS properties only (`ps-`, `me-`, `text-start`), because the Arabic toggle flips the whole document. Put `dir="ltr"` on inline spans around ids and values, not on blocks. `components/ui/` is generated shadcn code: regenerate it, don't hand-edit it.
- Never translate record IDs, verdict/basis names, statutory quotations, or measured values/units. `en.json` and `ar.json` must keep identical key sets.

## Rules that still bind

- **100% synthetic data.** Every UI screen and document carries `بيانات محاكاة لأغراض الهاكاثون فقط` (`SyntheticNotice` component; `SYNTHETIC_NOTICE` in `main.py`). Never add realistic patient records. Hospital site profiles in `main.py` deliberately have empty endpoints; don't invent hospital network addresses.
- **Zero hallucination.** Never invent a law name, article number, threshold, or URL, whether in code, prompts, KB records, or docs. If the evidence isn't there, the answer is `INSUFFICIENT_EVIDENCE`.
- The repository is public (MIT). Secrets come only from `.env` via `SAMAAM_*` env vars (`app/config.py`, pydantic-settings).
- `submission/TECHNICAL-REPORT.md` must stay within 5 pages as a PDF.

## Conventions

- Backend comments and docstrings are written in **Arabic**, frontend comments in English. Match the file you're in. Comments explain *why* a decision was made, often citing a document page, and are kept dense.
- `changelog/CHANGELOG.md` (Arabic, `MAJOR.MINOR.PATCH`) records each completed phase, including what was verified and how.
- `submission/slides.html` and `web/public/deck/index.html` are the same deck; the second is what `/slides` embeds. Keep them identical.
- `reference/organizers/` is the organizers' reference code: read-only, never import from it.
- `map/` is an Obsidian vault of per-node notes. `.obsidian/` and `Samaam/` are untracked vault artifacts.
