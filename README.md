# Italian Payroll & Tax Calculators

A suite of **client-side web tools** for Italian fiscal and payroll calculations, built using the official 2025 INPS and IRPEF rules. All computations run entirely in the browser — no data is ever sent to a server.

## Tools

### Stipendio Netto 2025 — Net Salary Calculator
**Files:** `VERO_STIPENDIO_NETTO.HTML`, `VERO_STIPENDIO_NETTO.JS`, `VERO_STIPENDIO_NETTO.CSS`

Calculates the monthly net salary from a gross annual (RAL), applying:
- IRPEF 2025 brackets: 23% / 35% / 43%
- INPS employee contributions (9.19% standard, apprenticeship, public sector variants, or custom)
- Regional and municipal add-ons — dropdown for every Italian region and municipality
- Cuneo fiscale 2025 deduction (€1,000 for RAL between €20k–€40k)
- IRPEF bonus €100/month for RAL up to €28,000
- Outputs: IRPEF base, gross IRPEF, net IRPEF, annual net, monthly net

### Codice Fiscale — Italian Tax ID Generator
**Files:** `VERO_CODICEFISCALE.HTML`, `VERO_CODICEFSICALE.JS`

Generates the 16-character Italian fiscal code from:
- First and last name
- Date of birth
- Gender
- Municipality or foreign country of birth (datalist with full Italian comuni)

Follows the official algorithm established by DM 12/03/1974 (Agenzia delle Entrate).

### TFR — Severance Pay Calculator
**File:** `calcolotfr.js`

Calculates *Trattamento di Fine Rapporto* based on:
- Annual gross salary (RAL)
- Years of service
- Optional advances already received
- Inflation coefficient and INPS revaluation
- Outputs: annual accrual, gross TFR, revaluation, net TFR, available TFR

### Pensione — Retirement Estimator
**File:** `vai.html`

Estimates the retirement date and monthly pension amount based on:
- Date of birth and gender
- Contribution years already paid
- Average gross salary
- Worker type (employee, autonomous)
- Italian 2025 INPS rules: old-age pension (67 years) and early retirement

## Architecture

All tools are self-contained HTML + JavaScript components. The HTML files are designed as embeddable fragments for CMS integration (WordPress, etc.) as well as standalone pages.

| File | Tool |
|---|---|
| `VERO_STIPENDIO_NETTO.HTML` | Net salary form (final version) |
| `VERO_STIPENDIO_NETTO.JS` | Net salary calculation engine |
| `VERO_STIPENDIO_NETTO.CSS` | Net salary styles |
| `VERO_CODICEFISCALE.HTML` | Codice fiscale form (final version) |
| `VERO_CODICEFSICALE.JS` | Fiscal code generation algorithm |
| `calcolotfr.js` | TFR calculation engine |
| `vai.html` | Pension estimator |
| `MODIFICA_DEFINITIVA.HTML` | Net salary alternative layout |
| `PENSIONE.HTML` / `PENSIONANUOVA.HTML` | Pension calculator variants |
| `netto.html` / `NETTO.JS` | Earlier net salary iterations |
| `cf.html` / `codice.html` | Earlier codice fiscale iterations |

## Topics

`javascript` `html` `css` `italian` `tax-calculator` `irpef` `inps` `payroll` `codice-fiscale` `tfr` `pension` `2025`
