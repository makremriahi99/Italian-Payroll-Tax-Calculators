<script>
    (function() {
      'use strict';
      
      const byId = (id) => document.getElementById(id) || null;
      const fmt = (n) => isFinite(n) ? n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }) : '—';
      const fmtDate = (d) => d instanceof Date && !isNaN(d) ? d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
      
      // ============================================
      // CONFIGURAZIONE NORMATIVA 2025
      // ============================================
      
      const CONFIG = {
        etaPensioneVecchiaia: 67,
        anniContributiMinimi: 20,
        pensioneAnticipata: { uomo: 42.833, donna: 41.833 },
        coefficienteTrasformazione: 0.05723,
        aliquoteContributive: { dipendente: 0.33, pubblico: 0.3285, autonomo: 0.24 },
        tassoSostituzione: 0.70,
        tassazioneMedia: 0.23
      };
      
      let el = null;
      let initialized = false;
      
      function captureElements() {
        el = {
          birthDate: byId('birthDate'),
          gender: byId('gender'),
          yearsContributed: byId('yearsContributed'),
          avgSalary: byId('avgSalary'),
          workerType: byId('workerType'),
          considerAnticipata: byId('considerAnticipata'),
          calcola: byId('but'),
          etaAttuale: byId('etaAttuale'),
          etaPensionabile: byId('etaPensionabile'),
          anniMancanti: byId('anniMancanti'),
          dataPensionamento: byId('dataPensionamento'),
          pensioneMensile: byId('pensioneMensile'),
          pensioneAnnua: byId('pensioneAnnua'),
          dettaglioAnticipata: byId('dettaglioAnticipata'),
          infoAnticipata: byId('infoAnticipata'),
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
      
      function calcolaEta(birthDate) {
        const oggi = new Date();
        const nascita = new Date(birthDate);
        let eta = oggi.getFullYear() - nascita.getFullYear();
        const mese = oggi.getMonth() - nascita.getMonth();
        if (mese < 0 || (mese === 0 && oggi.getDate() < nascita.getDate())) eta--;
        return eta;
      }
      
      function calcolaEtaPrecisa(birthDate) {
        const oggi = new Date();
        const nascita = new Date(birthDate);
        let anni = oggi.getFullYear() - nascita.getFullYear();
        let mesi = oggi.getMonth() - nascita.getMonth();
        if (mesi < 0) { anni--; mesi += 12; }
        if (oggi.getDate() < nascita.getDate()) {
          mesi--;
          if (mesi < 0) { anni--; mesi += 12; }
        }
        return { anni, mesi };
      }
      
      function calcolaDataPensionamento(birthDate, anniAlPensionamento) {
        const nascita = new Date(birthDate);
        const dataPensionamento = new Date(nascita);
        const anniInteri = Math.floor(anniAlPensionamento);
        const mesiAggiuntivi = Math.round((anniAlPensionamento - anniInteri) * 12);
        dataPensionamento.setFullYear(nascita.getFullYear() + anniInteri);
        dataPensionamento.setMonth(nascita.getMonth() + mesiAggiuntivi);
        return dataPensionamento;
      }
      
      function determinaSistemaCalcolo(birthDate, yearsContributed) {
        const nascita = new Date(birthDate);
        const dataInizioLavoro = new Date(nascita);
        dataInizioLavoro.setFullYear(nascita.getFullYear() + 18);
        const contributivoPuro = new Date('1996-01-01');
        if (dataInizioLavoro >= contributivoPuro) return 'contributivo';
        const anniAl1995 = 1995 - nascita.getFullYear() - 18;
        if (anniAl1995 >= 18) return 'misto-prevalente-retributivo';
        return 'misto';
      }
      
      function calcolaPensioneContributiva(avgSalary, yearsContributed, workerType) {
        const aliquota = CONFIG.aliquoteContributive[workerType] || CONFIG.aliquoteContributive.dipendente;
        const montanteContributivo = avgSalary * aliquota * yearsContributed;
        return montanteContributivo * CONFIG.coefficienteTrasformazione;
      }
      
      function calcolaPensioneRetributiva(avgSalary, yearsContributed) {
        const percentuale = Math.min(yearsContributed * 0.02, 0.80);
        return avgSalary * percentuale;
      }
      
      function calcolaPensioneMista(avgSalary, yearsContributed, workerType, birthDate) {
        const contributiva = calcolaPensioneContributiva(avgSalary, yearsContributed, workerType);
        const retributiva = calcolaPensioneRetributiva(avgSalary, yearsContributed);
        const anniDopo1995 = Math.max(0, new Date().getFullYear() - 1996);
        const pesoContributivo = Math.min(anniDopo1995 / yearsContributed, 1);
        return (contributiva * pesoContributivo) + (retributiva * (1 - pesoContributivo));
      }
      
      function calcolaPensione(avgSalary, yearsContributed, workerType, birthDate) {
        const sistema = determinaSistemaCalcolo(birthDate, yearsContributed);
        let pensioneAnnuaLorda;
        
        switch(sistema) {
          case 'contributivo':
            pensioneAnnuaLorda = calcolaPensioneContributiva(avgSalary, yearsContributed, workerType);
            break;
          case 'misto-prevalente-retributivo':
            pensioneAnnuaLorda = calcolaPensioneRetributiva(avgSalary, yearsContributed);
            break;
          case 'misto':
          default:
            pensioneAnnuaLorda = calcolaPensioneMista(avgSalary, yearsContributed, workerType, birthDate);
            break;
        }
        
        const pensioneAnnuaNetta = pensioneAnnuaLorda * (1 - CONFIG.tassazioneMedia);
        return {
          annuaLorda: pensioneAnnuaLorda,
          annuaNetta: pensioneAnnuaNetta,
          mensileLorda: pensioneAnnuaLorda / 12,
          mensileNetta: pensioneAnnuaNetta / 12,
          sistema: sistema
        };
      }
      
      function validaInput() {
        if (!el) return false;
        
        const birthDate = el.birthDate.value;
        const gender = el.gender.value;
        const yearsContributed = normalizeNumberInput(el.yearsContributed.value);
        const avgSalary = normalizeNumberInput(el.avgSalary.value);
        
        if (!birthDate) {
          mostraErrore('Inserisci la data di nascita.');
          return false;
        }
        
        if (!gender) {
          mostraErrore('Seleziona il sesso.');
          return false;
        }
        
        const eta = calcolaEta(birthDate);
        if (eta < 18) {
          mostraErrore('Devi avere almeno 18 anni.');
          return false;
        }
        
        if (eta >= CONFIG.etaPensioneVecchiaia) {
          mostraErrore('Hai già raggiunto l\'età pensionabile (67 anni).');
          return false;
        }
        
        if (!isFinite(yearsContributed) || yearsContributed < 0 || yearsContributed > 50) {
          mostraErrore('Gli anni di contributi devono essere tra 0 e 50.');
          return false;
        }
        
        if (!isFinite(avgSalary) || avgSalary <= 0) {
          mostraErrore('Inserisci una retribuzione media valida.');
          return false;
        }
        
        if (avgSalary < 5000) {
          mostraErrore('La retribuzione sembra troppo bassa. Inserisci l\'importo annuo lordo.');
          return false;
        }
        
        return true;
      }
      
      function calc() {
        if (!el || !el.birthDate) return;
        
        if (!validaInput()) return;
        
        nascondiErrore();
        
        const birthDate = el.birthDate.value;
        const gender = el.gender.value;
        const yearsContributed = normalizeNumberInput(el.yearsContributed.value);
        const avgSalary = normalizeNumberInput(el.avgSalary.value);
        const workerType = el.workerType.value;
        const considerAnticipata = el.considerAnticipata.checked;
        
        const etaPrecisa = calcolaEtaPrecisa(birthDate);
        const etaAttuale = etaPrecisa.anni;
        const etaPensionabileVecchiaia = CONFIG.etaPensioneVecchiaia;
        const anniMancanti = etaPensionabileVecchiaia - etaAttuale;
        const contributiMancanti = Math.max(0, CONFIG.anniContributiMinimi - yearsContributed);
        const dataPensionamentoVecchiaia = calcolaDataPensionamento(birthDate, etaPensionabileVecchiaia);
        
        let pensioneAnticipataInfo = null;
        if (considerAnticipata) {
          const contributiNecessari = gender === 'M' ? CONFIG.pensioneAnticipata.uomo : CONFIG.pensioneAnticipata.donna;
          const contributiMancantiAnticipata = Math.max(0, contributiNecessari - yearsContributed);
          const anniDiLavoroRimanenti = contributiMancantiAnticipata;
          
          if (contributiMancantiAnticipata < anniMancanti) {
            const etaAlPensionamentoAnticipato = etaAttuale + anniDiLavoroRimanenti;
            const dataPensionamentoAnticipato = calcolaDataPensionamento(birthDate, etaAlPensionamentoAnticipato);
            
            pensioneAnticipataInfo = {
              possibile: true,
              contributiNecessari: contributiNecessari,
              contributiMancanti: contributiMancantiAnticipata,
              anniMancanti: anniDiLavoroRimanenti,
              eta: etaAlPensionamentoAnticipato,
              data: dataPensionamentoAnticipato
            };
          } else {
            pensioneAnticipataInfo = {
              possibile: false,
              contributiNecessari: contributiNecessari,
              contributiMancanti: contributiMancantiAnticipata
            };
          }
        }
        
        const contributiTotaliAlPensionamento = yearsContributed + anniMancanti;
        const pensione = calcolaPensione(avgSalary, contributiTotaliAlPensionamento, workerType, birthDate);
        
        mostraRisultati(etaPrecisa, etaPensionabileVecchiaia, anniMancanti, dataPensionamentoVecchiaia, pensione, contributiMancanti, pensioneAnticipataInfo, yearsContributed, avgSalary);
      }
      
      function mostraRisultati(etaPrecisa, etaPensionabile, anniMancanti, dataPensionamento, pensione, contributiMancanti, pensioneAnticipataInfo, yearsContributed, avgSalary) {
        if (!el) return;
        
        el.etaAttuale.textContent = `${etaPrecisa.anni} anni e ${etaPrecisa.mesi} mesi`;
        el.etaPensionabile.textContent = `${etaPensionabile} anni`;
        
        if (anniMancanti > 0) {
          const mesiMancanti = Math.round((anniMancanti - Math.floor(anniMancanti)) * 12);
          const anniInteri = Math.floor(anniMancanti);
          el.anniMancanti.textContent = mesiMancanti > 0 ? `${anniInteri} anni e ${mesiMancanti} mesi` : `${anniInteri} anni`;
        } else {
          el.anniMancanti.textContent = 'Già raggiunta';
        }
        
        el.dataPensionamento.textContent = fmtDate(dataPensionamento);
        el.pensioneMensile.textContent = fmt(pensione.mensileNetta);
        el.pensioneAnnua.textContent = `${fmt(pensione.annuaNetta)} annui`;
        
        if (pensioneAnticipataInfo && pensioneAnticipataInfo.possibile) {
          el.dettaglioAnticipata.style.display = 'block';
          el.infoAnticipata.innerHTML = `
            <p style="margin: 5px 0; color: #78350f;"><strong>Puoi accedere alla pensione anticipata!</strong></p>
            <p style="margin: 5px 0; color: #78350f;">• Età al pensionamento: <strong>${Math.floor(pensioneAnticipataInfo.eta)} anni</strong></p>
            <p style="margin: 5px 0; color: #78350f;">• Data pensionamento: <strong>${fmtDate(pensioneAnticipataInfo.data)}</strong></p>
            <p style="margin: 5px 0; color: #78350f;">• Anni mancanti: <strong>${pensioneAnticipataInfo.anniMancanti.toFixed(1)} anni</strong></p>
            <p style="margin: 5px 0; color: #78350f; font-size: 0.9rem;">Potrai andare in pensione circa ${Math.floor(anniMancanti - pensioneAnticipataInfo.anniMancanti)} anni prima della pensione di vecchiaia.</p>
          `;
        } else {
          el.dettaglioAnticipata.style.display = 'none';
        }
        
        renderDettaglio(pensione, yearsContributed, anniMancanti, avgSalary, contributiMancanti);
        mostraDisplay();
        
        if (el.display) {
          el.display.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
      
      function renderDettaglio(pensione, yearsContributed, anniMancanti, avgSalary, contributiMancanti) {
        if (!el || !el.dettaglio) return;
        
        const tassoSostituzione = ((pensione.mensileNetta * 12) / avgSalary) * 100;
        const sistemaNome = {
          'contributivo': 'Contributivo',
          'misto': 'Misto',
          'misto-prevalente-retributivo': 'Misto (prevalente retributivo)'
        }[pensione.sistema] || 'Non determinato';
        
        let rows = [
          ['Sistema di calcolo', sistemaNome],
          ['Anni di contributi attuali', yearsContributed.toFixed(1) + ' anni'],
          ['Contributi al pensionamento', (yearsContributed + anniMancanti).toFixed(1) + ' anni']
        ];
        
        if (contributiMancanti > 0) {
          rows.push(['Contributi minimi mancanti', contributiMancanti.toFixed(1) + ' anni', true]);
        }
        
        rows.push(
          ['Retribuzione media annua', fmt(avgSalary)],
          ['Pensione lorda annua', fmt(pensione.annuaLorda)],
          ['Pensione lorda mensile', fmt(pensione.mensileLorda)],
          ['Pensione netta annua (stimata)', fmt(pensione.annuaNetta), 'green'],
          ['Tasso di sostituzione', tassoSostituzione.toFixed(1) + '%', 'green']
        );
        
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
        el.etaAttuale.textContent = '—';
        el.etaPensionabile.textContent = '—';
        el.anniMancanti.textContent = '—';
        el.dataPensionamento.textContent = '—';
        el.pensioneMensile.textContent = '—';
        el.pensioneAnnua.textContent = '—';
        el.dettaglio.innerHTML = '';
        el.dettaglioAnticipata.style.display = 'none';
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
      
      function impostaDataMassima() {
        if (!el || !el.birthDate) return;
        const oggi = new Date();
        const maxDate = new Date(oggi.getFullYear() - 18, oggi.getMonth(), oggi.getDate());
        el.birthDate.max = maxDate.toISOString().split('T')[0];
      }
      
      function formattaInputSalario() {
        if (!el || !el.avgSalary) return;
        const value = normalizeNumberInput(el.avgSalary.value);
        if (value > 0) {
          el.avgSalary.value = fmt(value).replace('€', '€ ');
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
        
      }
      
      function doInitIfReady() {
        if (initialized) return;
        captureElements();
        if (!el || !el.birthDate) return;
        nascondiDisplay();
        nascondiErrore();
        impostaDataMassima();
        bindEvents();
        initialized = true;
        console.log('Calcolatore Pensione 2025 inizializzato');
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

</script>