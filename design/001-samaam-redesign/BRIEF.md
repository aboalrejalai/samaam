---
design: Samaam redesign
date_created: 2026-11-06
status: draft
chosen_direction: white mode, The Valve, Patient Stage, Sealed Records
plan: none yet
---

# Design brief: Samaam redesign

## Subject
Samaam is a policy gateway between a radiology console and a CT scanner and contrast injector. This
design redraws three screens of `web/` so judges and clinicians at the 7th Health Innovation
Hackathon understand it fast and feel the clinical situation. Canvas:
https://claude.ai/artifact/MrVLa5SAFDPjgygGdMQnNz

## Audience and job
- **Who**: hackathon judges and clinicians first, radiology technologists as the depicted user.
- **Main job**: see, in seconds, what was about to happen to the patient's kidneys and that it stopped before the scan.

## Kind of request
Redesign of three pages of a built product. Brand stays: Saudi Soft with Samaam's medical blue.

## Screens
| ID | Screen | Route | Mode | States | Platforms |
|---|---|---|---|---|---|
| L-A, L-B | Landing | `/` | Persuade | default | desktop web |
| C-A, C-B | Console | `/app` | Operate | SC-02 held (403) | desktop web |
| D-A, D-B | Data request | `/app/data` | Operate | SC-03 refused (403) | desktop web |

## Languages and direction
English LTR only, by the owner's decision. Arabic follows later as a translation of these screens.

## Design system source
Saudi Soft (`web/src/index.css`, artifact PxbB5dfYZHsLNGN218XNgv), with Samaam's `--sa-50…900` blue
ladder from `index.css` and the `*-strong` status extension. IBM Plex Sans Arabic for Latin and
Arabic, Inconsolata mono, lucide stroke icons, radii 8/10/12/16, sidebar 280px, top bar 64px.

## Assumptions
- Two directions per page, six boards, no phone boards in this round (owner: "on the web").
- The console and data screens are shown in their decided state, the moment that matters.
- Medical models are AI renders from `openai/gpt-image-2.6-sunburst` through OpenRouter, chosen by the owner. They are illustrations and need a clinician's eye before public use.
- Landing copy reuses `home.*` strings and `home-data.ts` facts. 29 ms is labelled as the recorded demo's figure, never a guarantee.
- Contrast volume is shown as an entered value only: no rule reads it.
- A clinician or the team should confirm the model of the liver's role: the app has no liver rule; the liver appears only as part of the abdomen and pelvis scan region.

## Rut
- **The category's usual page**: white cards on a grey grid, a blue sidebar, a row of KPI tiles, stock photos of doctors, a shield icon.
- **Its plain opposite**: a sci-fi neon HUD with a glowing hologram body, which reads as a toy in a hospital.

## Candidates
| Name | Thesis | Axis |
|---|---|---|
| The Valve | One object, the valve, stops the contrast on the page | Light, object-led, editorial |
| Reading Room | The screen is a dark radiology viewer with corner annotations | Dark, viewer layout |
| Patient Stage | The patient's anatomy is the centre of the console | Light, anatomy-led |
| Scan Suite | The room itself: console, valve, injector, gantry in one line | Dark, device-led |
| Sealed Records | The record is an object that stays locked | Light, object-led |
| Border Line | The data path drawn up to the edge of the Kingdom | Dark, route-led |

## Directions shown
| Letter | Name | Thesis | Palette | Type |
|---|---|---|---|---|
| L-A | The Valve | One object stops the contrast | Light, blue ladder, amber contrast | IBM Plex, Inconsolata |
| L-B | Reading Room | The night shift in a radiology viewer | Dark, blue ladder lifted | IBM Plex, Inconsolata |
| C-A | Patient Stage | The patient's kidneys sit at the centre | Light | IBM Plex, Inconsolata |
| C-B | Scan Suite | The devices in the room, with the valve between them | Dark | IBM Plex, Inconsolata |
| D-A | Sealed Records | Records stay locked, the override is refused | Light | IBM Plex, Inconsolata |
| D-B | Border Line | A route that ends at the Kingdom's edge | Dark | IBM Plex, Inconsolata |

## Decisions
- 2026-11-06: Owner chose Claude Design, Saudi Soft, English only, three pages with two looks each.
- 2026-11-06: Owner ruled out Codex and code-drawn organs, and chose OpenRouter with GPT Image 2.6.
- 2026-11-07: Owner approved the white screens, banned dark mode entirely, and asked for the certificate and team on the landing page.
- 2026-11-07: Remaining screens built white: Connectors, Knowledge base, Gap matrix, Audit trail, Readiness, Slides, Team & award. Dark boards moved to boards/archive-dark.
