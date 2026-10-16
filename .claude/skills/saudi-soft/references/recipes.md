# Soft composition recipes

Preferred Soft compositions on top of upstream shadcn primitives. Install with the
CLI, then compose — do **not** paste full component source here.

Each section starts with **Use when** so you skip recipes that do not apply
(e.g. a settings form does not need an app shell).

---

## App shell

**Use when:** building an app with navigation (dashboard, hub, multi-page product).
Skip for dialogs, settings forms, marketing sections alone.

1. `Sidebar` (or `SidebarProvider` family) — width `--sidebar-width` (280px),
   collapsed `--sidebar-collapsed-width` (72px).
2. Active nav item: `bg-primary-subtle` / `bg-primary/5`, text `text-[--primary-hover]`
   or SA-700, plus a `before` pill at `start`: `h-6 w-[3px] rounded-full bg-primary`.
3. Fixed top bar: `h-[var(--topbar-height)]` (64px), `bg-card`,
   `border-b border-border/30`.
4. Theme capsule (light/dark): `rounded-full bg-muted/50 border border-border/50`,
   segment buttons ~28px; active = `bg-background ring-2 ring-primary`.
5. Language toggle **only if** the app is bilingual: `Button variant="ghost" size="icon"`
   + `Languages` from lucide.
6. Desktop search trigger (optional): `bg-muted/50 rounded-lg px-3 py-2 text-sm`.
7. Main content: `pt-[var(--topbar-height)]` + `p-4 md:p-6`, offset by sidebar width.

---

## Page header

**Use when:** list pages, hubs, dashboards — not modals.

```tsx
<header className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
  <div className="flex items-start gap-3 min-w-0">
    <div className="size-12 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
      {/* lucide icon ~24px */}
    </div>
    <div className="min-w-0">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-1 text-sm md:text-base text-muted-foreground">{description}</p>
    </div>
  </div>
  <div className="flex flex-wrap items-center gap-2">{/* actions */}</div>
</header>
```

---

## KPI card

**Use when:** dashboard / hub stat rows. **Not** for section content cards.

- Do **not** use `CardTitle` for the number.
- Padding `p-4` or `p-6`, `rounded-xl`.
- Surface: `bg-gradient-to-br from-primary/10 to-transparent border border-primary/10`
  (or chart/status token tint).
- Label: `text-sm font-medium text-muted-foreground` (+ optional 20px icon).
- Value: `text-2xl` or `text-3xl font-bold`.
- Delta: outline `Badge` or chip `text-xs` / `text-sm` + muted caption.
- Hover (optional): `shadow-e4 hover:-translate-y-0.5`.
- Grid: `gap-4`, `grid-cols-1 sm:grid-cols-2` (+ `lg:grid-cols-3` or `4` as needed).
  Prefer **3 or 4** KPIs in a row.

```tsx
<div className="rounded-xl border border-primary/10 bg-gradient-to-br from-primary/10 to-transparent p-6 transition-all hover:shadow-e4 hover:-translate-y-0.5">
  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
    {/* icon size-5 */}
    {label}
  </div>
  <p className="mt-1 text-3xl font-bold">{value}</p>
  <div className="mt-2 flex items-center gap-2">
    <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
      {delta}
    </Badge>
    <span className="text-xs text-muted-foreground">{caption}</span>
  </div>
</div>
```

---

## Hub card

**Use when:** quick-action / navigation grids on hubs.

- Container: `p-5 rounded-xl border bg-card`, hover `border-primary/40 bg-primary/5`.
- Icon tile: `size-10 rounded-lg bg-primary/10 text-primary` (40px).
- Title `font-semibold`; description `text-sm text-muted-foreground`.
- Wrap cells in `h-full` so row heights match.
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, `gap-4`.
  Last-row stretch: remainder 1 → full width; remainder 2 → half/half.

---

## Section card

**Use when:** content blocks (lists, details, campus footprint style panels).

Use full shadcn Card composition. Pass **`className="text-base"`** on `CardTitle`
(16px) — do not leave the default 24px for section headings.

```tsx
<Card>
  <CardHeader>
    <CardTitle className="text-base">{title}</CardTitle>
    <CardDescription>{description}</CardDescription>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

---

## Status badge

**Use when:** status chips (active, pending, error).

```tsx
<Badge
  variant="outline"
  className="border-success/30 bg-success/10 text-success"
>
  Active
</Badge>
```

Swap `success` for `warning` / `destructive` / `info` (or `status-*` aliases).
Prefer Soft semantic tokens over palette greens/reds.

---

## Filters

**Use when:** filtering a list or hub — not for page-level tabs that switch routes.

- Pill buttons: `Button size="sm" className="rounded-full"` (`default` vs `outline`).
- Optional `Select` (~160px, `h-9`).
- Do not use `Tabs` as list filters.

---

## Empty / loading / callout

- Empty → `Empty` family
- Loading → `Skeleton`
- Callout → `Alert`
- Toast → `sonner` (Radix) or project toast per `shadcn info` base

---

## Forms

Follow [rules/forms.md](../rules/forms.md): `FieldGroup` + `Field` + `FieldLabel`;
validation via `data-invalid` / `aria-invalid`. Soft only changes token colors —
not form structure. No app shell required for a lone settings form.

---

## Charts

```bash
npx shadcn@latest add chart
```

Use `--chart-1` … `--chart-5` from Soft theme. Do not invent a second chart palette.

---

## Overlay chrome

**Use when:** customizing Dialog / Sheet overlays.

Prefer `bg-foreground/40` + backdrop blur (`--blur-md` ≈ 16px) over `bg-black/80`.
