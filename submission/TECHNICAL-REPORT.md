# صِمَام · SAMAAM
### An AI-Hardware Policy Gateway for Oncology Radiology
**ITU AI Readiness Hackathon — Kingdom of Saudi Arabia · Health & Radiology Track**

> ⚠️ بيانات محاكاة لأغراض الهاكاثون فقط — *Synthetic data, hackathon use only*

---

## Executive Summary

**The problem.** A radiology technologist on a night shift enters acquisition
parameters for a contrast-enhanced CT. The patient is an oncology case whose
kidney function is impaired by chemotherapy. The settings are routine, and for
this patient they are dangerous. Published evidence puts clinically important
CT interpretation errors at **3.0% at night against 2.0% by day, rising to 3.7%
in the last part of the shift**. Nothing between that console and the scanner
reads the patient's chart.

**The solution.** Samaam is a policy gateway that sits between the technologist's
console and the device. Every worklist passes through it. It reads the patient's
renal function, compares the requested settings against Saudi regulation, and
either releases the acquisition or returns **HTTP 403 — Policy Violation** with
the provision it is enforcing, its issuing authority, and a working link to the
source document.

**What makes it defensible.** The block is deterministic code, not a model. A
language model drafts the explanation *after* the decision is taken; it is never
in the path. The verdict lands in **29 milliseconds** and the prose follows.
Pull the model out entirely and the gateway still blocks correctly.

**Two authorities, never conflated.** A dose above the national reference level
breaches a binding instrument — Royal Decree 60057. Missing prophylaxis departs
from a MoH protocol. Samaam never calls the second a legal violation.

**Team**

- **Mohammed Nadher Aboalrejal** — AI systems and automation — independent
- **Badour Jarad Al-Sahli** — Human Resources, Year 4 — Majmaah University
- **Noura Abdullah Al-Sahli** — Radiological Sciences, Year 4 — King Saud University
- **Haneen Saleh Al-Harbi** — Radiological Sciences, Year 4 — King Saud University

**Clinical review.** Scenario and decision thresholds reviewed by a consultant
radiologist, whose correction on absolute versus relative contraindication
changed the enforcement model.

**Submission**

- **Repository** — https://github.com/aboalrejal-ai/samaam
- **Knowledge base** — https://github.com/aboalrejal-ai/samaam/tree/main/kb
- **Live system** — https://samaam.aboalrejal.cloud
- **Demo video** — ⟨paste link⟩
- **Contact** — aboalrejal.ai@gmail.com

---

## Problem, and Why Existing Tools Do Not Solve It

### The clinical case

Contrast-associated acute kidney injury rises sharply with declining renal
function. The Saudi MoH protocol states the risk directly: **approximately 5% at
eGFR ≥ 60, 10% at 45–59, 15% at 30–44, and 30% below 30 mL/min/1.73 m²**. Below
30, prophylaxis is indicated and metformin must be held. An oncology patient on
platinum chemotherapy sits in the highest band while receiving repeat imaging.

### What the market already has, and what it misses

Every commercial dose-management platform — Radimetrics, DoseWatch, teamplay,
DoseTrack, DoseWise — is **retrospective**. It discovers the overexposure after
the patient has received it, and reports it to the regulator later by email.

The one prospective control that exists, **NEMA XR 25 CT Dose Check**, has
required scanners since 2010 to warn before scanning when settings would exceed
preset dose values, and to make the operator confirm or correct. It is a real,
shipped, industry-wide interlock — which is why the mechanism Samaam uses is not
speculative.

But Dose Check compares the machine against a fixed number. It cannot see the
patient.

> **CT Dose Check compares the machine to itself. Samaam compares it to the patient.**

Samaam extends the same pre-execution interlock to renal function, active
chemotherapy, metformin, and the Saudi provisions that govern them.

### Why Samaam holds rather than prohibits

Reviewed by a consultant radiologist, whose central correction shaped the
design: **no eGFR value forbids iodinated contrast outright.** The MoH protocol
makes stage 4–5 disease a *relative* contraindication and forbids withholding
contrast from a life-threatening indication on renal grounds. CAR 2022 requires
an individual decision below 30, not automatic refusal. A screen reading
`PROHIBITED` at a lab number substitutes itself for the clinician — and that,
she said, is the thing doctors reject hardest.

The literature agrees on the mechanics: hard stops draw override rates of
**49–96%** and breed unsafe workarounds.

So Samaam separates the **verdict** from the **action**. The verdict is a
regulatory classification; the action is what the console does.

🟢 `PROCEED` — nothing stands in the way · 🟡 `CONFIRM` — the operator
acknowledges the risk factor · 🔴 `AUTHORISE` — a **named** radiologist reviews
and approves · ⛔ `PROHIBITED` — no clinical override path exists.

A severe renal case is `AUTHORISE`, not prohibited. The screen says *held for
review*, and the release carries the reviewer's name into the audit trail. The
system does not replace the radiologist; it prevents a dangerous protocol from
executing **unreviewed**. That is the operational answer to the liability gap
below.

---

## Architecture — ITU-T Y.3172

```
   SRC ──→ C ──→ PP ──→ M ──→ P ──→ D ──→ SINK
                               ▲
                    Knowledge Base (ChromaDB)
                    45 records · 1,338 source chunks
```

| Node | Role in the standard | Implementation in Samaam |
| :--- | :--- | :--- |
| **SRC** | Raw sources | Saudi regulation PDFs, synthetic patient record, technologist-entered settings |
| **C** | Collection | A DICOM Modality Worklist C-FIND server the scanner queries, and a read-only HL7 FHIR R4 client |
| **PP** | Preprocessing | Direct identifiers dropped per PDPL Art. 23; **eGFR computed with CKD-EPI exactly as the MoH protocol prints it**; local multilingual embeddings |
| **M** | Model / RAG | Retrieval over the verified corpus; drafts the explanation |
| **P** | **Policy Node** | **Deterministic rule engine. No model. Four rules, each citing its record by explicit id** |
| **D** | Distribution | Attaches citations with authority, section and URL; writes the audit entry |
| **SINK** | Application | Operator console, and the mock CT + injector that returns 403. A withheld study is never served to the worklist, so it never reaches the console |

### The Policy Node

`P` returns exactly one of six verdicts: `COMPLIANT`, `VIOLATION`, `AMBIGUITY`,
`CONFLICT`, `POTENTIAL_GAP`, `INSUFFICIENT_EVIDENCE`.

Three design commitments make it auditable:

1. **No model in the decision path.** The block is `if` logic over cited
   thresholds. It returns the same verdict every time and can be read by a
   regulator who does not trust machine learning.
2. **Citation by identifier, not by search.** Each rule names its record
   (`MOH-CM-PROPHYLAXIS`), so the legal basis for a block cannot drift with the
   wording of a question.
3. **Refusal to guess.** Every record carries a verification status, and
   retrieval excludes unverified records by default. A missing eGFR yields
   `INSUFFICIENT_EVIDENCE` and a referral, never an assumption.

### Sandbox and data protection

The whole system is a sandbox: a simulated scanner, 100% synthetic patients, and
the notice *بيانات محاكاة لأغراض الهاكاثون فقط* on every screen. Embeddings are
computed locally, so retrieval and the block work with the network unplugged —
only the optional explanation needs the internet.

---

## Policy Gaps and ITU AI Readiness 2.0

### Regulatory gaps found — by absence, verified

Three independent deep-research passes plus direct retrieval of the primary
documents. Each gap below is a text that was searched for and not found.

| # | Gap | Recommendation to the regulator |
| :--- | :--- | :--- |
| **1** | The MoH contrast protocol sets eGFR thresholds but no instrument makes compliance enforceable, unlike the dose reference levels | Bind the radiology protocols by decision, as Royal Decree 60057 bound the DRLs |
| **2** | **No provision allocates liability when a fatigued technologist accepts an AI recommendation and harm follows.** SFDA requires study of interface influence and human oversight; none of it says who pays | Allocate liability across manufacturer, facility, technologist and consultant; require a signed override |
| **3** | DRL compliance is enforced retrospectively, by periodic email to SFDA | Require the check *before* acquisition — which is what Samaam does |
| **4** | No cumulative dose ceiling for repeatedly imaged oncology patients | Track cumulative dose across facilities in the national record |
| **5** | SFDA Rule 10 classifies scanner-influencing software clearly as Class C, but no rule governs mandatory confirmation, autonomous bounds, or override logging | Issue operational governance for AI-driven acquisition |
| **6** | The PDPL governs transparency of automated decisions, not medical negligence | Integrate the data law with the health professions law |

### Readiness dimensions — three claimed, with evidence

| Dimension | Why | Evidence in the system |
| :--- | :--- | :--- |
| **D10 · AI & Policies** | Samaam *is* a policy sandbox: it evaluates domain rules against live technical requests | Six verdicts, four deterministic rules, the gap matrix |
| **D11 · Data Governance & Privacy** | Health data is Sensitive Data under PDPL Art. 1(11) | Identifiers dropped at PP; export blocked with no override path |
| **D13 · Human Collaboration & Oversight** | High-risk decisions must not be automated away | Conditional block; named consultant override; full audit trail |

We claim three of thirteen. The framework asks for evidence, and padding the
list with dimensions we cannot demonstrate would weaken the three we can.

---

## Evaluation and References

### Scenario results — reproducible with `python run_demo.py`

| # | Scenario | Verdict | Device |
| :--- | :--- | :--- | :--- |
| **1** | Chest CT, eGFR 81.4, dose within national levels | `COMPLIANT` | **200** — released |
| **2** | Abdomen/pelvis, **eGFR 19.1**, DLP 900, metformin not held | `VIOLATION` | **403** — withheld |
| **3** | Bulk export of oncology records abroad for marketing | `VIOLATION` | **403** — session terminated |

**Scenario 2 in detail**, written by the reviewing radiologist. Female, 62,
70 kg, metastatic colorectal cancer, CT chest/abdomen/pelvis for staging.
Creatinine 2.6 mg/dL → eGFR **19.1**, computed by Samaam with the equation the
MoH protocol prints. A fatigued technologist selects the standard adult
protocol: 150 mL of contrast at 5 mL/s, 120 kVp, 400 mAs.

| Finding | Action |
| :--- | :--- |
| `national_drl` — CTDIvol 18.0 > 14.0; DLP 900 > 706. The national levels are *investigation* levels; exceeding one requires justification before exposure | 🔴 `AUTHORISE` |
| `renal_prophylaxis` — **HIGH RISK.** eGFR 19.1, prophylaxis indicated and not ordered. *Not a prohibition — contrast may still be indicated* | 🔴 `AUTHORISE` |
| `metformin` — Category II, not held. Metformin alone is not a reason to withhold contrast | 🟡 `CONFIRM` |
| `nephrotoxic_meds` — oxaliplatin, a platinum compound the protocol names by class | 🟡 `CONFIRM` |

Overall: 🔴 **held for authorisation.** A named radiologist releases it, logged.
On scenario 3 the same name is **refused** — a clinician may accept clinical
risk for their own patient, but none holds authority to permit processing the
PDPL forbids.

### Knowledge base

**45 records, 43 of them verified · 6 documented gaps · 1,338 chunks from 7 primary
documents.** Bilingual retrieval — an Arabic question returns the governing
Saudi record first. Two records were added by clinical review and are labelled
as such, including the one that establishes there is no absolute threshold.

### Primary sources

| Document | Authority | Link |
| :--- | :--- | :--- |
| Protocols on the Safe Use of Contrast Media in Radiology Departments (2021) | MoH | https://moh.gov.sa/en/Ministry/MediaCenter/Publications/Documents/Protocols-of-CM.pdf |
| National Diagnostic Reference Levels, MDS-G008 v2.0 | SFDA | https://sfda.gov.sa/sites/default/files/2023-02/NDRL-En.pdf |
| AI/ML Based Medical Devices, MDS-G010 | SFDA | https://sfda.gov.sa/sites/default/files/2023-01/MDS-G010ML.pdf |
| Personal Data Protection Law (Arabic, official) | Bureau of Experts | https://laws.boe.gov.sa/BoeLaws/Laws/LawDetails/b7cfae89-828e-4994-b167-adaa00e37188/1 |
| Ethics and governance of AI for health | WHO | https://who.int/publications/i/item/9789240029200 |
| Guidance on Contrast-Associated AKI (2022) | Canadian Assoc. of Radiologists | https://car.ca/patient-care/practice-guidelines/ |
| Y.3172 — ML architecture for future networks | ITU-T | https://itu.int/rec/T-REC-Y.3172/en |

**Licence** Source-available, all rights reserved; no API keys in source. The knowledge base ships as
`kb/records/health-regulatory.json` — all 45 records with their citations — and
`kb/sources/` holds the primary documents themselves.
