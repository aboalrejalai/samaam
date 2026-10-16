# Soft identity

Saudi Soft visual identity — SA green, IBM Plex Sans Arabic, lucide, RTL, light/dark.

## Colors

| Role | Light | Notes |
|:---|:---|:---|
| Primary | `#1B8354` | SA-600 |
| Primary hover | `#166A45` | SA-700 |
| Primary active | `#14573A` | SA-800 |
| Primary subtle | `#F3FCF6` | SA-50 — nav active fill |
| Canvas / background | `#FCFCFD` | |
| Surface / card | `#FFFFFF` | |
| Border | `#E5E7EB` | Dividers often at 30% opacity |
| Text | `#0D121C` | |
| Label | `#384250` | gray-700 — form labels (`--label`) |
| Muted text | `#4D5761` | |
| Destructive | `#D92D20` | |
| Success | `#079455` | also `--status-success` |
| Warning | `#DC6803` | also `--status-warning` |
| Info | `#1570EF` | also `--status-info` |
| Info soft bg | `#EFF8FF` | `--status-info-bg` |
| Charts 1–5 | `#1B8354` `#54C08A` `#14573A` `#88D8AD` `#25935F` | All SA-derived |

Prefer bridged utilities: `bg-primary`, `text-foreground`, `border-border`, `bg-success/10`, `bg-status-success/10`. Never `bg-green-600` or raw hex in className.

The SA ladder (`--sa-50…900`) is Soft’s default brand scale. On an **explicit rebrand request**, replace those hex values (light + `.dark`); `--primary`, charts, and Soft gradients are derived from the ladder — see [`rebrand.md`](rebrand.md). Do not scatter client colors into page files.

Dark mode: apply class `.dark` on the root. Soft bridge lifts SA greens and inverts gray ladder (see [`theme-bridge.css`](theme-bridge.css)).

## Radius

| Token | Size | Use |
|:---|:---|:---|
| sm | 8px | Small chips |
| md | 10px | Buttons, inputs, selects |
| lg / xl | 12px | Cards, dialogs, nav items |
| 2xl | 16px | Large tiles |
| full | 9999px | Pills, badges |

shadcn `--radius` in the bridge is **12px (lg)**; `@theme` maps `rounded-md` → 10px and `rounded-sm` → 8px.

## Layout metrics

| Token | Value | Use |
|:---|:---|:---|
| `--sidebar-width` | 280px | Expanded app sidebar |
| `--sidebar-collapsed-width` | 72px | Icon-only sidebar |
| `--topbar-height` | 64px | Fixed top bar |

Use when building an **app shell** (sidebar + topbar). Forms and dialogs alone do not need these.

## Typography

- **Sans (required):** IBM Plex Sans Arabic 400 / 500 / 600 / 700
- Optional: Work Sans (Latin fallback), Inconsolata (mono)

### Applied hierarchy

| Level | Spec |
|:---|:---|
| Page title | `text-2xl md:text-3xl font-bold tracking-tight` (24→30px) |
| Section card title | `text-base font-semibold` (16px) — not the default 24px `CardTitle` |
| KPI value | `text-2xl` or `text-3xl font-bold` |
| Body / controls | `text-sm` (14px) |
| Muted / description | `text-sm text-muted-foreground` |
| Micro | `text-xs` (12px); sidebar group labels `text-[10px] uppercase tracking-wide` |

Load fonts once (Google Fonts or `@fontsource`), set `--font-sans-soft` / body `font-sans`.

## Card roles

| Role | When | Spec summary |
|:---|:---|:---|
| KPI card | Stat row on dashboards | Gradient `from-primary/10`, value bold, no `CardTitle` |
| Hub card | Navigation / quick actions | `p-5 rounded-xl`, 40px icon tile, hover border primary |
| Section card | Content blocks | Full Card composition; `CardTitle` with `text-base` |

Full recipes: [`recipes.md`](recipes.md).

## Icons

- Library: **`lucide-react`** only under Soft
- `components.json` → `"iconLibrary": "lucide"`
- Import icons as components; follow [`../rules/icons.md`](../rules/icons.md) (`data-icon`, no sizing classes inside Button/etc.)

## RTL

- Arabic: `lang="ar"` `dir="rtl"`
- Spacing: `ms`/`me`/`ps`/`pe`/`start`/`end` — never physical `ml`/`mr`/`left`/`right`
- Directional chevrons/arrows: `rtl:rotate-180` when they encode direction

## Gradients & elevation

Bridge utilities (after `apply-theme.js`):

- `bg-gradient-1` / `bg-gradient-2` / `bg-gradient-brand` / `text-gradient` — **derived from `var(--sa-*)`**
- `bg-mesh` — soft radial wash from the same ladder
- `shadow-e1` … `shadow-e6` — Soft elevation ladder

Replacing the SA hex ladder recolors gradients automatically. Details: [`rebrand.md`](rebrand.md).

## Dark mode wiring

```tsx
import { ThemeProvider } from "next-themes"

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

Vite/SPA apps may use the same class toggle without Next. Soft does not use per-utility `dark:bg-*` for brand colors — tokens roll over.
