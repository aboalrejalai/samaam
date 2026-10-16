# صِمَام · Samaam — Web

Landing page and operator interface for the Samaam policy gateway. React 19 · TypeScript 5.7 ·
Vite 6 · Tailwind v4 · shadcn/ui under the Saudi Soft identity · TanStack Query v5 ·
react-router v7 · motion (landing page only).

> بيانات محاكاة لأغراض الهاكاثون فقط — synthetic data, hackathon use only.

## Running it

The FastAPI service must be up first; it takes about 15 seconds to boot because it loads a
local embedding model.

```bash
# from the repository root
.venv/bin/uvicorn app.main:app --reload --port 8000

# then, in web/
npm install
npm run dev          # http://localhost:5173 — landing; the system is at /app
```

The service origin defaults to `http://localhost:8000` and can be pointed elsewhere with
`VITE_API_BASE_URL`. CORS on the service is already open for `:5173`. No key is read here —
the frontend never talks to a model provider.

| Script | What it does |
| :--- | :--- |
| `npm run dev` | Dev server on `:5173` |
| `npm run build` | `tsc -b` then a production build into `dist/` |
| `npm run typecheck` | Types only |
| `npm run preview` | Serves the built output |

Sanity check that the wiring is live: the sidebar footer, and the footer of the landing
page's gateway preview, should read `45 · 6 · 1338` — the knowledge-base counts from
`GET /health`. Anything else there means the service is down.

## Routes

`/` is the landing page (`routes/HomePage.tsx`, lazy-loaded so the system's screens never
load `motion`). The system lives under `/app` (`APP_BASE` in `lib/routes.ts`): `/app` is the
console, then `/app/data`, `/app/connectors`, `/app/kb`, `/app/gaps`, `/app/audit`,
`/app/readiness`, `/app/slides`. The old top-level paths (`/kb`, `/audit`, …) redirect.

## Layout

```
src/
  index.css              Tailwind + the design tokens + the shadcn role mapping
  types/api.ts           Wire types, mirroring app/main.py and app/policy_node.py
  lib/api.ts             Typed client. 403 is a result here, not an exception
  lib/queries.ts         TanStack Query hooks and query keys
  lib/i18n.ts            i18next; also owns <html lang> and <html dir>
  lib/theme.tsx          The .dark class on <html>
  lib/routes.ts          APP_BASE, the page inventory, legacy redirects
  components/home/       The landing page. home-data.ts holds every fact it states,
                         each with a `source:` comment; copy lives under `home.*`
  components/primitives/ Measured · BasisBadge · VerdictBanner · CheckRow ·
                         CitationCard · VerificationChip
  components/ui/         shadcn. Generated — regenerate rather than edit
  routes/                One file per screen
```

## Things worth knowing before editing

**Saudi Soft identity.** `src/index.css` carries the Soft theme block from
`.claude/skills/saudi-soft/references/theme-bridge.css` verbatim, between its
`saudi-soft-theme:start/end` markers. The only edit is the brand ladder `--sa-50…900` (light
and `.dark`), which is Samaam's medical blue instead of SA green; to retint, change those ten
values per `rebrand.md` and nothing else. Soft fixes the rest: IBM Plex Sans Arabic 400–700,
radii 8/10/12/16 (`rounded-sm/md/lg|xl/2xl`), sidebar 280px (`--sidebar-width`), top bar 64px
(`--topbar-height`), lucide-react icons only, `gap` rather than `space-*`, light and dark only.

Colour comes from tokens, never from literals. In Soft, `accent` and `secondary` are saturated
brand blues with white text — not the light neutrals shadcn presets use — so subtle panels take
`bg-muted` or `bg-primary/5`. Status uses Soft's `success` / `warning` / `destructive` /
`info`. Those hues are fills: as small text on white, success and warning fall short of 4.5:1,
so text and 1px edges use `success-strong` / `warning-strong` / `destructive-strong`, an
extension kept *outside* the Soft markers so re-applying the bridge never removes it.

**Logical properties only.** `ps-4`, `me-2`, `text-start`, `border-s` — never `pl`, `mr`,
`text-left`, `border-l`. A `dir="ltr"` snippet (an id, a value with its unit) inside Arabic
text goes on an inline span, not on the block, or its `text-start` and padding flip with it. The Arabic toggle flips the whole document, including the sidebar,
which is why `AppSidebar` passes `side` from the current direction.

**Compose from shadcn.** Only `Measured` and `BasisBadge` are hand-written here, plus
`PipelineRail` when it lands. Writing `<div className="rounded-lg border p-4">` means
rebuilding `Card`.

**Never restate a decision.** Thresholds, verdicts and citations live in the service. The
frontend renders what arrived and computes nothing — no invented limit, no invented citation,
no invented link.

**The landing page states nothing the repository does not.** Every number, identifier and
link it shows is in `components/home/home-data.ts` with a `source:` comment; change the
source and the data file together. Motion runs under `<MotionConfig reducedMotion="user">`,
and the two pinned sections (the SC-02 story and the sources rail) fall back to plain
layouts on phones and under `prefers-reduced-motion` through `motion-safe:md:` classes.
Any x offset that means "toward the end" is multiplied by `useDirSign()`.

Do not translate quoted statutory text, record ids (`MOH-CM-PROPHYLAXIS`), verdict names
(`VIOLATION`), basis names (`STATUTORY`), or measured values and units.

## Gate page

`/app/dev/primitives` renders every primitive in every state. Print it in greyscale: if
`STATUTORY` still reads differently from `NATIONAL_PROTOCOL`, the shape channel is working.
