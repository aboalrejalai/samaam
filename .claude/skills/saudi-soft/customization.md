# Customization & Theming (Saudi Soft)

Components reference semantic CSS variable tokens. Soft supplies those tokens via
[`references/theme-bridge.css`](./references/theme-bridge.css) (Saudi green SA-600
`#1B8354`, 10/12px radius ladder, light + `.dark` rollover, IBM Plex Sans Arabic).

## Contents

- Soft theme is mandatory
- How it works
- Dark mode
- Applying / updating the Soft bridge
- Soft utilities (gradients, mesh, elevation)
- Adding custom colors (status extras)
- Border radius
- Customizing components
- Checking for updates

---

## Soft Theme Is Mandatory

1. After `npx shadcn@latest init`, always inject Soft theme:

   ```bash
   node path/to/saudi-soft/scripts/apply-theme.js
   ```

   Or paste the marked block from [`references/theme-bridge.css`](./references/theme-bridge.css)
   into the project's global CSS (`tailwindCssFile` from `npx shadcn@latest info`).

2. Do **not** replace Soft primary with arbitrary shadcn color presets (`blue`,
   `zinc`, random `--preset` themes) unless the user explicitly asks to leave Soft
   or rebrand.
3. Do **not** change `--primary` / the SA ladder away from Soft green without an
   **explicit user request** to rebrand. When they do ask, follow
   [`references/rebrand.md`](./references/rebrand.md) — edit the theme block only.
4. Keep `iconLibrary: lucide` in `components.json`.

Identity tables: [`references/identity.md`](./references/identity.md).

---

## How It Works

1. CSS variables in `:root` (light) and `.dark` (dark mode).
2. Tailwind maps them to utilities: `bg-primary`, `text-muted-foreground`, etc.
3. Components use these utilities — changing a Soft variable changes every component.

Prefer semantic utilities (`bg-primary`, `text-foreground`) — never `bg-green-600`
or raw hex in `className`.

---

## Color Variables

| Variable | Soft meaning |
| --- | --- |
| `--background` / `--foreground` | Canvas `#FCFCFD` / text `#0D121C` |
| `--primary` / `--primary-foreground` | SA-600 `#1B8354` / white |
| `--secondary` | SA-700 `#166A45` |
| `--muted` / `--muted-foreground` | Gray-100 / gray-600 |
| `--label` | Gray-700 `#384250` — form labels |
| `--destructive` | `#D92D20` |
| `--border` / `--input` / `--ring` | Gray-200 / SA ring |
| `--chart-1` … `--chart-5` | SA-derived chart palette |
| `--sidebar-*` | Soft sidebar color tokens |
| `--sidebar-width` / `--sidebar-collapsed-width` | 280px / 72px |
| `--topbar-height` | 64px |
| `--success` / `--warning` / `--info` | Status extras |
| `--status-success` / `--status-warning` / `--status-info` | Aliases of the above |

---

## Dark Mode

Class-based toggle via `.dark` on the root. Soft bridge includes a full `.dark`
block (SA lift + gray invert). Wire a toggle:

```tsx
import { ThemeProvider } from "next-themes"

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

Vite/SPA apps may toggle `document.documentElement.classList` the same way.
**Do not** invent per-utility `dark:bg-*` brand colors — tokens roll over.

---

## Applying / Updating the Soft Bridge

```bash
# From the consumer project root — pass the path where this skill folder lives:
node path/to/saudi-soft/scripts/apply-theme.js
node path/to/saudi-soft/scripts/apply-theme.js src/styles/globals.css
```

The script replaces the marked block between:

```css
/* # saudi-soft-theme:start */
/* # saudi-soft-theme:end */
```

Also load **IBM Plex Sans Arabic** (400–700) once (Google Fonts or `@fontsource`).

---

## Soft Utilities (gradients, mesh, elevation)

Injected with the bridge. Prefer these over hand-written brand gradients:

| Utility | Use |
| --- | --- |
| `bg-gradient-1` | Horizontal SA-600 → SA-500 (`var(--sa-*)`) |
| `bg-gradient-2` / `bg-gradient-brand` | Diagonal SA-700 → SA-600 (primary brand fill) |
| `text-gradient` | Brand gradient clipped to text |
| `bg-mesh` | Soft radial wash from the SA ladder |
| `shadow-e1` … `shadow-e6` | Soft elevation ladder |
| `from-primary/10 to-transparent` | KPI / tint card surfaces |

Overlays: `bg-foreground/40` + blur via `--blur-md` (16px) for dialogs/sheets.

Composition patterns: [`references/recipes.md`](./references/recipes.md).

---

## Rebrand (explicit request only)

Default Soft stays SA green. When the user **explicitly** asks to change brand
colors (e.g. client palette):

1. Edit only the Soft theme markers in `tailwindCssFile` (or update the bridge
   source and re-run `apply-theme.js`).
2. Replace `--sa-50…900` (and `.dark` ladder). Gradients already use `var(--sa-*)`.
3. Do not rewrite pages that already use semantic Soft classes.

Full steps and Soft-native vs legacy: [`references/rebrand.md`](./references/rebrand.md).

---

## Adding Custom Colors

Add extras only in the global CSS file from `tailwindCssFile` — never a new
orphan CSS file for a single color. Soft already defines `--success`,
`--warning`, `--info`. Example for a one-off:

```css
:root {
  --data-purple: #7c3aed;
}
.dark {
  --data-purple: #a78bfa;
}
@theme inline {
  --color-data-purple: var(--data-purple);
}
```

---

## Border Radius

Soft ladder (see bridge `@theme inline`):

| Token | Size | Use |
| --- | --- | --- |
| `rounded-sm` | 8px | Small chips |
| `rounded-md` | 10px | Buttons, inputs |
| `rounded-lg` / `xl` | 12px | Cards, dialogs |

`--radius` in Soft is **12px (lg)**. Do not flatten Soft to sharp government
chrome unless the user asks.

---

## Customizing Components

See [rules/styling.md](./rules/styling.md). Prefer in order:

1. Built-in variants (`variant="outline"`, `size="sm"`)
2. Soft-allowed `className` (layout + Soft identity tints/gradients — see styling rules)
3. New `cva` variant in the component source
4. Wrapper components composing primitives

---

## Checking for Updates

```bash
npx shadcn@latest add button --dry-run
npx shadcn@latest add button --diff button.tsx
```

See [Updating Components in SKILL.md](./SKILL.md#updating-components).
