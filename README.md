# Calcolatori Fiscali e Previdenziali Italiani

Suite di **strumenti web client-side** per calcoli fiscali e previdenziali italiani, basati sulle normative INPS e IRPEF 2025. Tutti i calcoli avvengono nel browser — nessun dato viene inviato a server esterni.

## Strumenti

### Calcolatore Stipendio Netto 2025
**File:** `VERO_STIPENDIO_NETTO.HTML`, `VERO_STIPENDIO_NETTO.JS`, `VERO_STIPENDIO_NETTO.CSS`

Calcola lo stipendio netto mensile a partire dalla RAL (retribuzione annua lorda), applicando:
- Aliquote IRPEF 2025: 23% / 35% / 43%
- Contributi INPS lavoratore (9,19% standard, apprendistato, dipendenti pubblici, personalizzata)
- Addizionali regionali e comunali — dropdown con tutte le regioni e i comuni italiani
- Detrazione cuneo fiscale 2025 (€1.000 per RAL tra €20k–€40k)
- Bonus IRPEF €100/mese per RAL fino a €28.000
- Output: imponibile IRPEF, IRPEF lorda, IRPEF dovuta, netto annuo, netto mensile

### Generatore Codice Fiscale
**File:** `VERO_CODICEFISCALE.HTML`, `VERO_CODICEFSICALE.JS`

Genera il codice fiscale a 16 caratteri a partire da:
- Nome e cognome
- Data di nascita
- Sesso
- Comune o Stato estero di nascita (datalist con tutti i comuni italiani)

Segue l'algoritmo ufficiale stabilito dal DM 12/03/1974 (Agenzia delle Entrate).

### Calcolatore TFR — Trattamento di Fine Rapporto
**File:** `calcolotfr.js`

Calcola il TFR in base a:
- RAL annua
- Anni di servizio
- Eventuali anticipazioni già ricevute
- Coefficiente di rivalutazione e inflazione INPS
- Output: accantonamento annuale, TFR lordo, rivalutazione, TFR netto, TFR disponibile

### Calcolatore Pensione
**File:** `vai.html`

Stima la data di pensionamento e l'assegno mensile in base a:
- Data di nascita e sesso
- Anni di contributi già versati
- Retribuzione media lorda annua
- Tipologia lavoratore (dipendente, autonomo)
- Regole INPS 2025: pensione di vecchiaia (67 anni) e pensione anticipata

## Struttura file

| File | Strumento |
|---|---|
| `VERO_STIPENDIO_NETTO.HTML` | Form stipendio netto (versione finale) |
| `VERO_STIPENDIO_NETTO.JS` | Motore di calcolo stipendio |
| `VERO_STIPENDIO_NETTO.CSS` | Stili calcolatore stipendio |
| `VERO_CODICEFISCALE.HTML` | Form codice fiscale (versione finale) |
| `VERO_CODICEFSICALE.JS` | Algoritmo generazione codice fiscale |
| `calcolotfr.js` | Motore di calcolo TFR |
| `vai.html` | Calcolatore pensione |
| `MODIFICA_DEFINITIVA.HTML` | Layout alternativo stipendio netto |
| `PENSIONE.HTML` / `PENSIONANUOVA.HTML` | Varianti calcolatore pensione |
| `netto.html` / `NETTO.JS` | Versioni precedenti stipendio netto |
| `cf.html` / `codice.html` | Versioni precedenti codice fiscale |

## Tag

`javascript` `html` `css` `italiano` `irpef` `inps` `stipendio-netto` `codice-fiscale` `tfr` `pensione` `2025`
