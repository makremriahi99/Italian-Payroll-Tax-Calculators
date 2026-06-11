(function() {
'use strict';
const byId = (id) => document.getElementById(id) || null;
const fmt = (n) => isFinite(n) ? n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }) : '—';
const CONFIG = {
coefficienteAccantonamento: 13.5,
tassaFissaRivalutazione: 0.015,
coefficienteInflazione: 0.75,
aliquotaTassazioneTFR: 0.23
};
let el = null;
let initialized = false;
function captureElements() {
el = {
ral: byId('ral'),
yearsWorked: byId('yearsWorked'),
hireDate: byId('hireDate'),
anticipazioni: byId('anticipazioni'),
inflazione: byId('inflazione'),
applicaRivalutazione: byId('applicaRivalutazione'),
calcola: byId('but'),
accantonamentoAnnuale: byId('accantonamentoAnnuale'),
tfrLordo: byId('tfrLordo'),
rivalutazioneTotale: byId('rivalutazioneTotale'),
tfrNetto: byId('tfrNetto'),
tfrDisponibile: byId('tfrDisponibile'),
infoAnticipazioni: byId('infoAnticipazioni'),
dettaglio: byId('dettaglio'),
display: byId('display'),
errorMessage: byId('errorMessage')
};
}
function normalizeNumberInput(value) {
if (value == null) return NaN;
let s = String(value).trim();
if (!s) return NaN;
s = s.replace(/\s+/g, '');
if (s.includes('.') && s.includes(',')) {
s = s.replace(/\./g, '').replace(',', '.');
} else if (s.includes(',')) {
s = s.replace(',', '.');
}
s = s.replace(/[^0-9\.\-]/g, '');
const n = parseFloat(s);
return isFinite(n) ? n : NaN;
}
function calcolaAnniDaData(hireDate) {
if (!hireDate) return null;
const oggi = new Date();
const assunzione = new Date(hireDate);
const diffMs = oggi - assunzione;
const anni = diffMs / (1000 * 60 * 60 * 24 * 365.25);
return anni > 0 ? anni : 0;
}
function calcolaAccantonamentoAnnuale(ral) {
return ral / CONFIG.coefficienteAccantonamento;
}
function calcolaTFRLordo(ral, yearsWorked) {
const accantonamentoAnnuale = calcolaAccantonamentoAnnuale(ral);
return accantonamentoAnnuale * yearsWorked;
}
function calcolaRivalutazione(tfrLordo, yearsWorked, tassoInflazione, applica) {
if (!applica || yearsWorked <= 0) return 0;
const tassoRivalutazioneAnnuo = CONFIG.tassaFissaRivalutazione + (tassoInflazione / 100 * CONFIG.coefficienteInflazione);
const rivalutazione = tfrLordo * tassoRivalutazioneAnnuo * yearsWorked;
return rivalutazione;
}
function calcolaTassazioneTFR(tfrLordo) {
return tfrLordo * CONFIG.aliquotaTassazioneTFR;
}
function validaInput() {
if (!el) return false;
const ral = normalizeNumberInput(el.ral.value);
const yearsWorked = normalizeNumberInput(el.yearsWorked.value);
const hireDate = el.hireDate.value;
if (!isFinite(ral) || ral <= 0) {
mostraErrore('Inserisci una RAL valida.');
return false;
}
if (ral < 10000) {
mostraErrore('La RAL sembra troppo bassa. Inserisci l\'importo annuo lordo.');
return false;
}
if (!hireDate && (!isFinite(yearsWorked) || yearsWorked <= 0)) {
mostraErrore('Inserisci gli anni di servizio o la data di assunzione.');
return false;
}
if (isFinite(yearsWorked) && yearsWorked > 50) {
mostraErrore('Gli anni di servizio non possono superare 50.');
return false;
}
return true;
}
function calc() {
if (!el || !el.ral) return;
if (!validaInput()) return;
nascondiErrore();
const ral = normalizeNumberInput(el.ral.value);
let yearsWorked = normalizeNumberInput(el.yearsWorked.value);
const hireDate = el.hireDate.value;
const anticipazioni = normalizeNumberInput(el.anticipazioni.value) || 0;
const tassoInflazione = normalizeNumberInput(el.inflazione.value) || 2.5;
const applicaRivalutazione = el.applicaRivalutazione.checked;
if (hireDate) {
const anniCalcolati = calcolaAnniDaData(hireDate);
if (anniCalcolati !== null) {
yearsWorked = anniCalcolati;
}
}
const accantonamentoAnnuale = calcolaAccantonamentoAnnuale(ral);
const tfrLordoBase = calcolaTFRLordo(ral, yearsWorked);
const rivalutazione = calcolaRivalutazione(tfrLordoBase, yearsWorked, tassoInflazione, applicaRivalutazione);
const tfrLordoTotale = tfrLordoBase + rivalutazione;
const tassazione = calcolaTassazioneTFR(tfrLordoTotale);
const tfrNetto = tfrLordoTotale - tassazione;
const tfrDisponibile = Math.max(0, tfrNetto - anticipazioni);
mostraRisultati(accantonamentoAnnuale, tfrLordoTotale, rivalutazione, tfrNetto, tfrDisponibile, anticipazioni, yearsWorked, ral, tassoInflazione, applicaRivalutazione, tassazione);
}
function mostraRisultati(accantonamentoAnnuale, tfrLordo, rivalutazione, tfrNetto, tfrDisponibile, anticipazioni, yearsWorked, ral, tassoInflazione, applicaRivalutazione, tassazione) {
if (!el) return;
el.accantonamentoAnnuale.textContent = fmt(accantonamentoAnnuale);
el.tfrLordo.textContent = fmt(tfrLordo);
el.rivalutazioneTotale.textContent = applicaRivalutazione ? fmt(rivalutazione) : '€ 0';
el.tfrNetto.textContent = fmt(tfrNetto);
el.tfrDisponibile.textContent = fmt(tfrDisponibile);
if (anticipazioni > 0) {
el.infoAnticipazioni.textContent = `Anticipazioni già ricevute: ${fmt(anticipazioni)}`;
} else {
el.infoAnticipazioni.textContent = 'Nessuna anticipazione ricevuta';
}
renderDettaglio(accantonamentoAnnuale, tfrLordo, rivalutazione, tfrNetto, tfrDisponibile, anticipazioni, yearsWorked, ral, tassoInflazione, applicaRivalutazione, tassazione);
mostraDisplay();
if (el.display) {
el.display.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
}
function renderDettaglio(accantonamentoAnnuale, tfrLordo, rivalutazione, tfrNetto, tfrDisponibile, anticipazioni, yearsWorked, ral, tassoInflazione, applicaRivalutazione, tassazione) {
if (!el || !el.dettaglio) return;
const tfrLordoBase = tfrLordo - rivalutazione;
let rows = [
['RAL', fmt(ral)],
['Anni di servizio', yearsWorked.toFixed(1) + ' anni'],
['Accantonamento annuale (RAL/13,5)', fmt(accantonamentoAnnuale)],
['TFR lordo base', fmt(tfrLordoBase)]
];
if (applicaRivalutazione) {
const tassoRivalutazione = ((1.5 + (tassoInflazione * 0.75))).toFixed(2);
rows.push(['Tasso rivalutazione applicato', tassoRivalutazione + '%']);
rows.push(['Rivalutazione totale', '+' + fmt(rivalutazione)]);
rows.push(['TFR lordo rivalutato', fmt(tfrLordo)]);
} else {
rows.push(['Rivalutazione', 'Non applicata']);
rows.push(['TFR lordo totale', fmt(tfrLordo)]);
}
rows.push(['Tassazione separata (23%)', '-' + fmt(tassazione)]);
rows.push(['TFR netto', fmt(tfrNetto), 'green']);
if (anticipazioni > 0) {
rows.push(['Anticipazioni già ricevute', '-' + fmt(anticipazioni), true]);
rows.push(['TFR disponibile', fmt(tfrDisponibile), 'green']);
}
el.dettaglio.innerHTML = rows.map(r => {
const isWarning = r[2] === true;
const isGreen = r[2] === 'green';
const rowStyle = isWarning ? ' style="background: #fef3c7;"' : (isGreen ? ' style="background: #f0fdf4;"' : '');
const labelStyle = isWarning ? ' style="color: #92400e; font-weight: 700;"' : (isGreen ? ' style="color: #166534; font-weight: 600;"' : ' style="color: #4b5563; font-weight: 600;"');
const valueStyle = isWarning ? ' style="color: #92400e; font-weight: 700;"' : (isGreen ? ' style="color: #15803d; font-weight: 700;"' : ' style="color: #1f2937;"');
return `<tr style="border-bottom: 1px solid #e2e8f0;"${rowStyle}><td style="padding: 12px;"${labelStyle}>${r[0]}</td><td style="padding: 12px; text-align: right;"${valueStyle}>${r[1]}</td></tr>`;
}).join('');
}
function renderEmpty() {
if (!el) return;
el.accantonamentoAnnuale.textContent = '—';
el.tfrLordo.textContent = '—';
el.rivalutazioneTotale.textContent = '—';
el.tfrNetto.textContent = '—';
el.tfrDisponibile.textContent = '—';
el.infoAnticipazioni.textContent = '—';
el.dettaglio.innerHTML = '';
nascondiDisplay();
}
function mostraDisplay() {
if (el && el.display) {
el.display.classList.add('show');
el.display.style.display = 'block';
}
}
function nascondiDisplay() {
if (el && el.display) {
el.display.classList.remove('show');
el.display.style.display = 'none';
}
}
function mostraErrore(messaggio) {
if (el && el.errorMessage) {
el.errorMessage.textContent = messaggio;
el.errorMessage.classList.add('show');
}
nascondiDisplay();
}
function nascondiErrore() {
if (el && el.errorMessage) {
el.errorMessage.classList.remove('show');
}
}
function aggiornaAnniDaData() {
if (!el || !el.hireDate || !el.yearsWorked) return;
const hireDate = el.hireDate.value;
if (hireDate) {
const anni = calcolaAnniDaData(hireDate);
if (anni !== null) {
el.yearsWorked.value = anni.toFixed(1);
el.yearsWorked.disabled = true;
}
} else {
el.yearsWorked.disabled = false;
}
}
function bindEvents() {
if (!el) return;
const handleCalcClick = (e) => {
try { e && e.preventDefault && e.preventDefault(); } catch(_) {}
calc();
};
if (el.calcola) {
el.calcola.addEventListener('click', handleCalcClick);
}
if (el.hireDate) {
el.hireDate.addEventListener('change', aggiornaAnniDaData);
}
}
function doInitIfReady() {
if (initialized) return;
captureElements();
if (!el || !el.ral) return;
nascondiDisplay();
nascondiErrore();
bindEvents();
initialized = true;
console.log('Calcolatore TFR 2025 inizializzato');
}
function init() {
doInitIfReady();
if (!initialized) {
const observer = new MutationObserver(() => {
if (initialized) { observer.disconnect(); return; }
doInitIfReady();
if (initialized) observer.disconnect();
});
observer.observe(document.documentElement, { childList: true, subtree: true });
setTimeout(doInitIfReady, 300);
}
}
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', init);
} else {
init();
}
})();
