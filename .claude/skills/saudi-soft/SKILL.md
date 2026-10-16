---
name: saudi-soft
description: >
  Builds complete React apps with upstream shadcn/ui under the Saudi Soft
  identity — SA green (#1B8354), IBM Plex Sans Arabic, lucide icons, 10/12px
  radius, RTL, light/dark tokens, Soft app shell and KPI/hub card recipes.
  Covers init, add, search, compose, theme, forms, charts, dashboards, and
  chat UI. Use when the user mentions Saudi Soft, Soft theme, Saudi green
  branding on shadcn, studio/portfolio/SaaS with Soft colors, RTL Arabic UI,
  Soft sidebar/dashboard, or asks to scaffold a Soft project. Self-contained:
  does not require any other skill folder.
user-invocable: false
allowed-tools: Bash(npx shadcn@latest *), Bash(pnpm dlx shadcn@latest *), Bash(bunx --bun shadcn@latest *)
---

# Saudi Soft

Self-contained skill: **upstream shadcn/ui** + Soft identity (theme, typography,
radius, lucide, RTL, dark mode). Copy this entire `saudi-soft/` folder into any
project and use it alone — no other skill dependencies.

> **IMPORTANT:** Run CLI via the project's package runner: `npx shadcn@latest`,
> `pnpm dlx shadcn@latest`, or `bunx --bun shadcn@latest`. Examples use `npx`.

Skill scripts (evaluate / apply theme) live next to this file:

```bash
node path/to/saudi-soft/scripts/evaluate-project.js
node path/to/saudi-soft/scripts/apply-theme.js
```

---

## Current Project Context

```json
!`npx shadcn@latest info --json`
```

Use `npx shadcn@latest docs <component>` for docs/examples/API. Never guess APIs.

---

## Soft Identity (always)

Full tables: [`references/identity.md`](./references/identity.md). Theme file:
[`references/theme-bridge.css`](./references/theme-bridge.css). Apply via
[`customization.md`](./customization.md).

- **Primary:** `#1B8354` (hover `#166A45`) via CSS variables — never `bg-green-*`
- **Radius:** controls ≈ 10px, cards/dialogs ≈ 12px
- **Font:** IBM Plex Sans Arabic 400–700 as `--font-sans`
- **Icons:** `lucide-react` only (`iconLibrary: lucide`) → [`rules/icons.md`](./rules/icons.md)
- **RTL:** `dir="rtl"` for Arabic; logical `ms`/`me`/`ps`/`pe`/`start`/`end`
- **Dark:** class `.dark` + Soft bridge; `next-themes` or equivalent
- **Charts:** shadcn `chart` + Soft `--chart-1..5`

**Forbidden:** `platformscode-new-react`; guessing icon libraries; replacing Soft
primary with random presets without user approval.

Composition recipes: [`references/recipes.md`](./references/recipes.md).

---

## Evaluate first

```bash
node path/to/saudi-soft/scripts/evaluate-project.js
```

| Mode | When | Action |
| --- | --- | --- |
| **A** | Empty / no shadcn | Scaffold + `shadcn init` + lucide + Soft theme (**Soft-native** from day one) |
| **B** | shadcn present, Soft theme missing | `apply-theme.js` only — do not rewrite pages |
| **C** | Soft-ready | `shadcn add <name>` + compose per rules |
| **Ask** | Large / non-Soft patterns (raw palette, wrong icons, no tokens) | **Ask before acting** — do not assume |

### Soft-native vs legacy (ask before bulk work)

If evaluate (or a quick scan) shows a large existing app that is **not** Soft-native,
ask which path the user wants — never default to rewriting hundreds of pages:

1. **Theme-only** — inject/update Soft tokens for colors and **new** UI only; leave
   old pages as-is unless the user points at specific files.
2. **Soft-native for new work** — every new screen follows Soft 100%; migrate old
   pages only when touched.
3. **Full Soft migration** — only if the user explicitly approves.

Later brand-color changes: [`references/rebrand.md`](./references/rebrand.md)
(explicit request only; Soft-native apps = one theme block).

---

## Mode A — New project

1. Scaffold Vite + React (or Next.js) with **Tailwind v4**.
2. `npx shadcn@latest init` (prefer `--rtl`). Confirm `"iconLibrary": "lucide"`.
3. `npm install lucide-react` if missing.
4. `node path/to/saudi-soft/scripts/apply-theme.js`
5. Load IBM Plex Sans Arabic; set `lang` / `dir` for Arabic.
6. Wire `.dark` via `ThemeProvider` (`attribute="class"`) or SPA toggle.
7. If the ask is an **app with navigation / dashboard**, follow the **app shell**
   recipe in [`references/recipes.md`](./references/recipes.md). Forms or dialogs
   alone need tokens only — no sidebar required.
8. Greenfield Soft-native means later rebrands edit the theme ladder only — see
   [`references/rebrand.md`](./references/rebrand.md).

---

## Mode B — Theme existing shadcn app

1. Do not overwrite UI wrappers unless asked.
2. Run `apply-theme.js` (or merge Soft markers into `tailwindCssFile`).
3. Ensure lucide + `iconLibrary: lucide`.
4. Migrate raw greens to `bg-primary` / semantic tokens over time.

---

## Mode C — Add / compose

```bash
npx shadcn@latest add button card dialog
npx shadcn@latest docs button
```

Follow Critical Rules below. After third-party registry adds, fix imports to
project aliases and swap non-lucide icons to `lucide-react`.

- **Dashboard / hub / Soft UI shell** → compose from
  [`references/recipes.md`](./references/recipes.md): page header → KPI row →
  hub grid (and app shell when navigation exists).
- **Everything else** → shadcn docs + Critical Rules as usual.

---

## Principles

1. **Use existing components first.** `npx shadcn@latest search` before custom UI.
2. **Compose, don't reinvent.** Settings = Tabs + Field forms. Dashboard / hub =
   Soft recipes (shell + header + KPI + hub cards) — see
   [`references/recipes.md`](./references/recipes.md).
3. **Built-in variants first.** `variant="outline"`, `size="sm"`.
4. **Semantic colors.** `bg-primary`, `text-muted-foreground` — never raw palette classes.

---

## Critical Rules

Always enforced. Incorrect/Correct pairs in the linked files.

### Styling & Tailwind → [rules/styling.md](./rules/styling.md)

- **`className` = layout + Soft identity exceptions** (tints, Soft gradients,
  `CardTitle text-base`, KPI lift). Never `bg-green-*` / hex / brand `dark:`.
- **No `space-x-*` / `space-y-*`.** Use `flex` + `gap-*`.
- **Use `size-*` when width = height.**
- **Use `truncate` shorthand.**
- **No manual `dark:` color overrides.** Soft tokens roll over.
- **Use `cn()` for conditional classes.**
- **No manual `z-index` on overlays.**

### Forms & Inputs → [rules/forms.md](./rules/forms.md)

- **Forms use `FieldGroup` + `Field`.**
- **`InputGroup` uses `InputGroupInput` / `InputGroupTextarea`.**
- **Buttons inside inputs → `InputGroup` + `InputGroupAddon`.**
- **Option sets (2–7) → `ToggleGroup`.**
- **`FieldSet` + `FieldLegend` for related checkboxes/radios.**
- **Validation: `data-invalid` on `Field`, `aria-invalid` on the control.**

### Component Structure → [rules/composition.md](./rules/composition.md)

- **Items inside their Group** (`SelectItem` → `SelectGroup`, etc.).
- **`asChild` (radix) or `render` (base)** for custom triggers → [rules/base-vs-radix.md](./rules/base-vs-radix.md)
- **Dialog / Sheet / Drawer need a Title** (or `sr-only`).
- **Section cards:** full Card composition; `CardTitle` with `text-base`.
  **KPI cards:** Soft recipe — no `CardTitle` for the metric.
- **Button has no `isPending`.** Compose `Spinner` + `data-icon` + `disabled`.
- **`TabsTrigger` inside `TabsList`.**
- **`Avatar` always needs `AvatarFallback`.**
- Callouts → `Alert`; empty → `Empty`; hr → `Separator`; loading → `Skeleton`; chips → `Badge`.
- Toast: project `base` — `toast` component (Base UI) or `sonner` (Radix/Aria).

### Icons → [rules/icons.md](./rules/icons.md)

- Soft = **lucide-react only**.
- Buttons: `data-icon="inline-start|inline-end"`; no sizing classes on icons inside components.
- Pass icons as components, not string keys.

### Chat & Messaging → [rules/chat.md](./rules/chat.md)

- Use `MessageScroller`, `Message`, `Bubble`, `Attachment`, `Marker` — no hand-rolled bubbles/scroll hooks.

### CLI → [cli.md](./cli.md)

- Never invent CLI flags. Never decode presets by hand — use `preset decode|url|open|resolve`.
- Soft theme overrides random color presets: after init/apply, re-run Soft `apply-theme.js` if CSS was overwritten.

---

## Key Patterns

```tsx
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <Input id="email" />
  </Field>
</FieldGroup>

<Field data-invalid>
  <FieldLabel>Email</FieldLabel>
  <Input aria-invalid />
  <FieldDescription>Invalid email.</FieldDescription>
</Field>

<Button>
  <SearchIcon data-icon="inline-start" />
  Search
</Button>

<div className="flex flex-col gap-4">  {/* correct */}
<div className="space-y-4">           {/* wrong */}

<Avatar className="size-10">          {/* correct */}
<span className="text-emerald-600">   {/* wrong — use Badge / semantic tokens */}
```

---

## Component Selection

| Need | Use |
| --- | --- |
| Button/action | `Button` |
| Form inputs | `Input`, `Select`, `Combobox`, `Switch`, `Checkbox`, `RadioGroup`, `Textarea`, `InputOTP`, `Slider` |
| Toggle 2–5 options | `ToggleGroup` |
| Data display | `Table`, `Card`, `Badge`, `Avatar` |
| Navigation | `Sidebar`, `NavigationMenu`, `Breadcrumb`, `Tabs`, `Pagination` |
| Overlays | `Dialog`, `Sheet`, `Drawer`, `AlertDialog` |
| Feedback | `toast` / `sonner`, `Alert`, `Progress`, `Skeleton`, `Spinner` |
| Command palette | `Command` inside `Dialog` |
| Charts | `Chart` (Recharts) + Soft chart tokens |
| Layout | `Card`, `Separator`, `Resizable`, `ScrollArea`, `Accordion`, `Collapsible` |
| Empty | `Empty` |
| Menus | `DropdownMenu`, `ContextMenu`, `Menubar` |
| Tooltips | `Tooltip`, `HoverCard`, `Popover` |
| Chat | `MessageScroller`, `Message`, `Bubble`, `Attachment`, `Marker` |

---

## Key Fields (`shadcn info`)

- **`aliases`** — import prefix (`@/`, etc.)
- **`isRSC`** — add `"use client"` when needed
- **`tailwindVersion`** — v4 → `@theme inline`; v3 → config file
- **`tailwindCssFile`** — edit this for Soft theme; never invent a parallel globals file
- **`style` / `base`** — visual + primitive library (`radix` vs `base`)
- **`iconLibrary`** — must be `lucide` under Soft
- **`resolvedPaths`**, **`framework`**, **`packageManager`**, **`preset`**

Full field reference: [cli.md — `info`](./cli.md).

---

## Workflow

1. **Evaluate** Soft scripts → pick Mode A/B/C.
2. **Project context** — `npx shadcn@latest info --json` (refresh as needed).
3. **Installed components first** — don't re-add; check `resolvedPaths.ui`.
4. **Find** — `npx shadcn@latest search`.
5. **Docs** — `npx shadcn@latest docs <component>` then fetch URLs.
6. **Install** — `npx shadcn@latest add`. Preview updates with `--dry-run` / `--diff`.
7. **Fix third-party imports** to project aliases; force lucide icons.
8. **Review** added files against Critical Rules before moving on.
9. **Registry must be explicit** — if user says "add a login block" without `@shadcn` / owner/repo, ask which registry.
10. **Presets** — if user applies a shadcn preset that rewrites CSS, re-apply Soft theme afterward unless they opted out of Soft colors.

### Updating Components

1. `npx shadcn@latest add <component> --dry-run`
2. Per file: `--diff <file>`
3. Merge intelligently; **never `--overwrite` without explicit approval.**
4. Never fetch raw GitHub files — always CLI.

---

## Quick Reference

```bash
# New app
npx shadcn@latest init --name my-app --template vite --rtl
node path/to/saudi-soft/scripts/apply-theme.js

# Existing
npx shadcn@latest init --rtl
node path/to/saudi-soft/scripts/apply-theme.js

# Components
npx shadcn@latest add button card dialog chart
npx shadcn@latest docs button
npx shadcn@latest search @shadcn -q "sidebar"
npx shadcn@latest add button --dry-run
npx shadcn@latest add button --diff button.tsx

# Soft helpers
node path/to/saudi-soft/scripts/evaluate-project.js
node path/to/saudi-soft/scripts/apply-theme.js [optional-css-path]
```

---

## Detailed References (all local to this folder)

- [rules/forms.md](./rules/forms.md)
- [rules/composition.md](./rules/composition.md)
- [rules/chat.md](./rules/chat.md)
- [rules/icons.md](./rules/icons.md)
- [rules/styling.md](./rules/styling.md)
- [rules/base-vs-radix.md](./rules/base-vs-radix.md)
- [cli.md](./cli.md)
- [mcp.md](./mcp.md)
- [registry.md](./registry.md)
- [customization.md](./customization.md)
- [references/theme-bridge.css](./references/theme-bridge.css)
- [references/identity.md](./references/identity.md)
- [references/recipes.md](./references/recipes.md)
- [references/rebrand.md](./references/rebrand.md)
