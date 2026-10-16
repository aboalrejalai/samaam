# Soft rebrand (explicit request only)

Default Soft identity is SA green. **Do not change brand colors unless the user
explicitly asks** to rebrand, retint, or adopt a client palette.

Soft-native apps (built with this skill from day one) rebrand by editing **one
theme block**. Legacy apps with scattered hex / `bg-green-*` do not — ask first
(see Mode gate in `SKILL.md`).

---

## When the user asks to rebrand

Edit **only** the Soft theme block in the consumer `tailwindCssFile`
(`/* # saudi-soft-theme:start */` … `end`), **or** edit
[`theme-bridge.css`](./theme-bridge.css) then re-run:

```bash
node path/to/saudi-soft/scripts/apply-theme.js
```

### Steps

1. Replace light `--sa-50` … `--sa-900` hex values with the new brand ladder
   (50 = lightest tint, 600 = primary, 700 = hover, 800 = pressed).
2. Replace the `.dark` SA ladder the same way (lifted for contrast on dark
   surfaces).
3. Confirm `--primary`, `--secondary`, `--accent`, `--chart-*`,
   `--primary-hover` / `--primary-active` / `--primary-subtle`, and gradients
   still reference `var(--sa-*)` — do **not** paste new hex into page files.
4. Leave pages alone if they already use `bg-primary`, `from-primary/10`,
   `text-muted-foreground`, Soft utilities (`bg-gradient-1`, `text-gradient`).
5. Logos, brand images, and favicons are separate assets — swap files if needed;
   tokens do not recolor bitmaps.

### Do not

- Rewrite dashboards, forms, or shells just to change hue.
- Scatter client hex into `className` or inline styles.
- Propose a full Soft composition migration of a large legacy codebase unless
  the user explicitly chooses that path.

---

## Soft-native vs theme overlay

| App history | After Soft theme | Later rebrand |
| --- | --- | --- |
| Greenfield Soft (Mode A) | Semantic tokens everywhere | One theme block — **100%** |
| Mode B theme on clean shadcn | New UI Soft; old pages may still use raw palette | Theme block + fix pages that still hardcode colors |
| Large non-Soft app | Ask: theme-only / Soft-native for new UI / full migrate | Theme-only never rewrites hundreds of pages automatically |

---

## Checklist after rebrand

- [ ] Light + dark SA ladders updated
- [ ] Gradients still use `var(--sa-*)` (no leftover brand hex in gradient defs)
- [ ] Spot-check primary button, sidebar active, KPI tint, chart series
- [ ] No new `bg-green-*` / `bg-emerald-*` / raw hex in UI you touched
- [ ] User-requested status colors (`--success` etc.) only if they asked — status
      is not the brand ladder by default
