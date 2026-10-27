---
goal: Unify web/ on the Saudi Soft identity (blue ladder) and add an animated landing page on "/"
version: 1.0
date_created: 2026-10-12
status: 'In progress'
tags: [feature, refactor, design-system, frontend]
---

# Implementation Plan: Saudi Soft identity + Samaam landing page

![Status: In progress](https://img.shields.io/badge/status-in_progress-yellow)

## Overview
**Current State:** `web/` uses the shadcn `radix-maia` preset (OKLCH palette, multiplicative radius, pill buttons), hugeicons inside seven shadcn files, a 56px header, the default 16rem sidebar, and the console sits on `/`. There is no marketing page.
**Target State:** `web/src/index.css` carries the Saudi Soft `theme-bridge.css` verbatim, with only the `--sa-50…900` ladders swapped for the existing medical blue (light + dark). Radii follow 8/10/12/16, the sidebar is 280px, and the top bar is 64px. Icons are lucide-react only, and hugeicons is uninstalled. `/` is an animated bilingual landing page (motion/react) whose facts come from one data file. The system lives under `/app/*`, and every old path redirects there.

## 1. Requirements & Constraints
- **REQ-001**: Soft theme block from `.claude/skills/saudi-soft/references/theme-bridge.css` pasted verbatim; only `--sa-*` hex values changed (rebrand.md).
- **REQ-002**: Light `--sa-600` = current primary blue (Tailwind blue-700 `#1d4ed8` = `oklch(0.488 0.243 264.376)`); ladder built around it; `.dark` ladder lifted for contrast.
- **REQ-003**: IBM Plex Sans Arabic 400–700 only (drop 100/200/300 imports).
- **REQ-004**: Radii 8/10/12/16 (+ `rounded-full` for pills). No `rounded-3xl`/`4xl`/`pill`/arbitrary radii.
- **REQ-005**: Sidebar 280px (`--sidebar-width`), top bar 64px (`--topbar-height`), Soft active-nav recipe, theme capsule.
- **REQ-006**: `gap` instead of `space-*`; logical properties; tokens only, no hex/oklch in components.
- **REQ-007**: lucide-react only; remove `@hugeicons/*` from package.json; `components.json` `iconLibrary: lucide`.
- **REQ-008**: Light + dark only, light default (already true in `lib/theme.tsx`).
- **REQ-009**: Landing on `/`; system on `/app/*`; old paths (`/data`, `/kb`, …) redirect to `/app/...`; "لوحة التحكم" CTA in header, hero and closing → `/app`.
- **REQ-010**: motion/react: hero with live system preview, sticky scroll story, bento, counters, tabs, horizontal scroll, transitions; correct RTL; `useReducedMotion` respected.
- **REQ-011**: Every number/feature from code or docs, in one data file `src/components/home/home-data.ts`; all copy in `ar.json`/`en.json`.
- **REQ-012**: Synthetic-data notice visible on the landing page.
- **CON-001**: No push. Local commit only.
- **CON-002**: Backend untouched; the frontend computes no decision.

## 2. Architecture & Alternatives
- Status colours: Soft names `--success` / `--warning` / `--destructive` / `--info` become the vocabulary. The app's `warn`/`danger` classes are renamed to `warning`/`destructive`. The `-strong` text variants are kept as a documented extension *outside* the Soft markers (customization.md "Adding Custom Colors"), because Soft's raw status hues fall below 4.5:1 as small text.
- Landing lives in `src/components/home/*` + `src/routes/HomePage.tsx`, outside `AppShell`; the router gets `{ path: '/', Component: HomePage }` and `{ path: '/app', Component: AppShell, children }`.
- Hero "live preview" = a real mini render of the pipeline/decision using the existing primitives (VerdictBanner / CheckRow) fed with SC-02 values from the data file — not a screenshot.
- **ALT-001**: Run `apply-theme.js` — rejected as the only step: it injects the green ladder; we still need to edit the ladder and remove the maia palette, so the block is pasted and edited by hand.
- **ALT-002**: Keep `warn`/`danger` as aliases — rejected; two names for one colour is the drift the old CSS warned about.

## 2.1 No-Touch Zones
- `app/**`, `kb/**`, `scenarios/**` — backend and corpus are the source of truth for numbers.
- `reference/organizers/**` — read-only.
- `~/Desktop/Project/ubp/**` — reference only.

## 3. Dependencies & Files
- **DEP-001**: `motion` (motion/react) — the user mandated it for scroll-linked animation; CSS alone cannot drive scroll-progress transforms portably.
- **DEP-002**: remove `@hugeicons/react`, `@hugeicons/core-free-icons`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `web/src/index.css` | modify | Soft bridge + blue ladder + extensions |
| `web/components.json` | modify | iconLibrary lucide |
| `web/src/components/ui/*.tsx` | modify | hugeicons → lucide; radius classes |
| `web/src/components/AppShell.tsx`, `app-sidebar.tsx`, `nav-main.tsx`, `ThemeToggle.tsx` | modify | Soft shell |
| `web/src/router.tsx`, `lib/routes.ts` | modify | `/app/*` + redirects |
| `web/src/routes/HomePage.tsx`, `components/home/*` | create | landing |
| `web/src/locales/{ar,en}.json` | modify | `home.*` keys |
| many `web/src/**` | modify | space-* → gap, warn/danger rename |

## 4. Task Tracking & Phases

### Phase 1: Identity foundation
- [ ] TASK-001: Soft theme block with the blue ladder in index.css
- [ ] TASK-002 [P]: hugeicons → lucide, uninstall, components.json
- [ ] TASK-003 [P]: Radius, space-*, status token migration across src
- Checkpoint: typecheck + build pass; console renders blue, Soft radii.

### Phase 2: Shell + routing
- [ ] TASK-004: AppShell 64px top bar, 280px sidebar, Soft active nav, theme capsule
- [ ] TASK-005: `/app/*` routes, redirects from old paths, internal links updated
- Checkpoint: every `/app` link opens; old URLs redirect.

### Phase 3: [US1] Landing page
- [ ] TASK-006 [US1]: `home-data.ts` from the fact inventory (sources commented)
- [ ] TASK-007 [US1]: motion kit (Reveal, Stagger, CountUp, reduced motion, RTL x)
- [ ] TASK-008 [US1]: header, hero + live preview, sticky story, pipeline, bento, counters, tabs, horizontal scroll, CTA, footer
- [ ] TASK-009 [US1]: i18n `home.*` ar/en
- Checkpoint: typecheck + build; browser light/dark, ar/en, 375px.

### Phase 4: Review + ship
- [ ] TASK-010: Review agent (numbers, Soft rules, RTL, a11y, i18n parity) and fixes
- [ ] TASK-011: Browser verification and local commit (no push); serve locally

## 5. Detailed Task Definitions

### TASK-001: Soft theme block with blue ladder
**Description:** Replace the maia palette with the Soft bridge verbatim; swap only the `--sa-*` ladders for blue; keep the focus-visible rule and add the documented `-strong` extensions.
**Acceptance criteria:**
- [ ] Markers `saudi-soft-theme:start/end` present; content identical to the bridge except the `--sa-*` values
- [ ] No 100/200/300 font imports
**Verification:**
- [ ] Build succeeds: `cd web && npm run build`
- [ ] Manual check: primary buttons blue in light and dark
**Dependencies:** None
**Files likely touched:** `web/src/index.css`
**Estimated scope:** Small

### TASK-002: Icons to lucide
**Description:** Replace `HugeiconsIcon` usages in the seven shadcn files with lucide equivalents; uninstall packages; set `iconLibrary`.
**Acceptance criteria:**
- [ ] `grep -r hugeicons web/src web/package.json` empty
**Verification:**
- [ ] Tests pass: `cd web && npm run typecheck`
- [ ] Manual check: select chevrons, dialog/sheet close, toasts show icons
**Dependencies:** None
**Files likely touched:** `web/src/components/ui/{sheet,breadcrumb,dialog,sonner,sidebar,select,dropdown-menu}.tsx`, `web/package.json`, `web/components.json`
**Estimated scope:** Medium

### TASK-003: Radius, spacing, status tokens
**Description:** Map `rounded-3xl/4xl/pill/[Npx]` to Soft steps, `space-*` → flex/grid + gap, `warn`→`warning`, `danger`→`destructive`.
**Acceptance criteria:**
- [ ] No `space-[xy]-`, `rounded-(3xl|4xl|pill|\[)`, `-warn\b`, `-danger` in `web/src`
**Verification:**
- [ ] Tests pass: `cd web && npm run typecheck`
- [ ] Manual check: console SC-02 renders red/amber states correctly
**Dependencies:** TASK-001
**Files likely touched:** `web/src/**`
**Estimated scope:** Large (mechanical)

### TASK-004: Soft app shell
**Description:** 64px top bar (`h-(--topbar-height)`, `bg-card`, `border-b border-border/30`), `--sidebar-width` 280px, active item `bg-primary-subtle` + start pill, theme capsule.
**Acceptance criteria:**
- [ ] Header measures 64px; sidebar 280px expanded
**Verification:**
- [ ] Manual check: computed sizes in browser devtools
**Dependencies:** TASK-001
**Files likely touched:** `AppShell.tsx`, `app-sidebar.tsx`, `nav-main.tsx`, `ThemeToggle.tsx`, `ui/sidebar.tsx`
**Estimated scope:** Medium

### TASK-005: Routing
**Description:** Router nests the system under `/app`; `Navigate` redirects for `/data`, `/connectors`, `/kb`, `/gaps`, `/audit`, `/readiness`, `/slides`, `/dev/primitives`; all internal `Link`s and `isCurrent` use the new paths.
**Acceptance criteria:**
- [ ] `/kb` → `/app/kb`; `/app` shows the console
**Verification:**
- [ ] Manual check: visit each old and new path
**Dependencies:** None
**Files likely touched:** `router.tsx`, `lib/routes.ts`, `nav-main.tsx`, `app-sidebar.tsx`, `AppShell.tsx`
**Estimated scope:** Small

### TASK-006–009: Landing
**Description:** Build the landing per the design & motion guide; facts only from the inventory with source comments; copy in i18n.
**Acceptance criteria:**
- [ ] No literal user-facing string in `components/home/*` except proper nouns/ids
- [ ] Every number in `home-data.ts` carries a `// source:` comment
- [ ] Reduced motion → no transforms, content fully visible
**Verification:**
- [ ] Build succeeds: `cd web && npm run build`
- [ ] Manual check: ar/en, light/dark, 375px, no horizontal page scroll
**Dependencies:** TASK-001..005
**Files likely touched:** `components/home/*`, `routes/HomePage.tsx`, `locales/*.json`, `router.tsx`
**Estimated scope:** Large (split by section)

### TASK-010–011: Review and ship
**Description:** Independent review agent fixes defects; final browser pass; local commit.
**Acceptance criteria:**
- [ ] typecheck + build green; `git log -1` present; nothing pushed
**Verification:**
- [ ] Build succeeds: `cd web && npm run typecheck && npm run build`
**Dependencies:** all
**Files likely touched:** various
**Estimated scope:** Medium

## 6. Risks and Assumptions
| ID | Risk / Assumption | Impact | Mitigation / Note |
|----|-------------------|--------|-------------------|
| RISK-001 | Soft status hues under 4.5:1 as text | Med | Keep `-strong` text extensions outside the Soft markers |
| RISK-002 | `/audit` and `/connectors` are also API paths; moving SPA routes under `/app` removes the collision, but redirects from old paths still rely on the backend's Accept-header SPA middleware | Low | Works in prod; in vite dev, SPA fallback is native |
| RISK-003 | Invented claims on the landing | High | Inventory agent + review agent cross-check every figure |
| ASM-001 | "Medical blue" = current `--primary` (blue-700 family) | - | Ladder anchored on it |

## 7. Open Questions
- None blocking; user directive is explicit.

## 8. Rollback Plan
- Single local commit; `git revert <sha>` or `git reset --hard HEAD~1` restores the previous UI. Nothing is pushed.
