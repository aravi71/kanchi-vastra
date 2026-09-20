# Sri Kanchi Silks — logo files

## The mark

A **gopuram monogram**: a stepped temple silhouette whose interior horizontal courses read as
zari lines running across a weave, capped by a kalasam finial. Temple architecture and textile
in one form — the same borrowing the sarees themselves are built on.

It is original to this project and drawn entirely as vector paths.

## Files

| File | Use |
| --- | --- |
| `logo-primary.svg` | Stacked lockup. Packaging, shopping bags, business cards, saree tags |
| `logo-primary-dark-bg.svg` | Stacked, for dark backgrounds |
| `logo-primary-light-bg.svg` | Copy of the primary, named explicitly for asset handoff |
| `logo-horizontal.svg` | Horizontal lockup. Letterhead, email signatures, wide formats |
| `logo-horizontal-dark-bg.svg` | Horizontal, for dark backgrounds |
| `logo-horizontal-light-bg.svg` | Copy of the horizontal, named for handoff |
| `monogram.svg` | Icon only, antique gold. Watermarks, social avatars, labels |
| `monogram-wine.svg` | Icon only, burgundy. For ivory and light stock |
| `monogram-dark-bg.svg` | Icon only, lighter gold for dark backgrounds |
| `icon-app.svg` | App/avatar tile — wine ground, simplified mark |
| `../favicon.svg` | Favicon, simplified so it survives 16 px |

## Colours

| Role | Hex |
| --- | --- |
| Antique gold | `#C0994F` |
| Antique gold, light backgrounds | `#D4B375` |
| Deep burgundy | `#6E2038` |
| Wine, near-black | `#4A1524` |
| Warm ivory | `#FAF6EE` |

## Using it

- **Clear space:** keep at least the height of the monogram's base line free on all sides.
- **Minimum size:** 24 px for the monogram, 120 px wide for the horizontal lockup. Below
  24 px use `favicon.svg`, which drops the interior courses so it stays legible.
- **Do not** recolour outside the palette above, stretch, rotate, add effects, or place the
  gold version on a light ground — use `monogram-wine.svg` there.

## Before sending to print

These SVGs reference **Cormorant Garamond** and **Inter** by name. Open the file in a vector
editor and convert the text to outlines first, or the printer will substitute a different
typeface. Both fonts are under the SIL Open Font License and can be embedded.

For anything that needs a raster file — embroidery, woven labels, some print workflows —
export at 300 dpi or higher from these vectors rather than scaling a screenshot.

## On the website

The site does **not** load these files. It renders the mark as inline SVG plus live text in
`components/ui/Logo.tsx`, so it inherits colour from its container, stays sharp at any zoom,
and remains selectable and searchable. Change that component to change the site; these files
are the print and packaging handoff.
