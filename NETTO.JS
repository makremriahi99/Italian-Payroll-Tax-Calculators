/* Calcolatore Stipendio Netto 2025 - logica JS (compat WP: init post-DOM) */
(function() {
    const byId = (id) => document.getElementById(id) || null;
    const fmt = (n) => isFinite(n) ? n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }) : '—';
    const fmtDec = (n) => isFinite(n) ? n.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—';
  
  // ============================================
  // DATI REGIONI, COMUNI E ALIQUOTE 2025
  // ============================================
  
  const Regione = {
    ABRUZZO: "Abruzzo",
    BASILICATA: "Basilicata",
    CALABRIA: "Calabria",
    CAMPANIA: "Campania",
    EMILIA_ROMAGNA: "Emilia-Romagna",
    FRIULI_VENEZIA_GIULIA: "Friuli Venezia Giulia",
    LAZIO: "Lazio",
    LIGURIA: "Liguria",
    LOMBARDIA: "Lombardia",
    MARCHE: "Marche",
    MOLISE: "Molise",
    PIEMONTE: "Piemonte",
    PUGLIA: "Puglia",
    SARDEGNA: "Sardegna",
    SICILIA: "Sicilia",
    TOSCANA: "Toscana",
    TRENTINO_ALTO_ADIGE: "Trentino-Alto Adige",
    UMBRIA: "Umbria",
    VALLE_D_AOSTA: "Valle d'Aosta",
    VENETO: "Veneto",
  };
  
  const findRegionByName = (regionString) => Object.keys(Regione).find(key => Regione[key] === regionString);
  const nomiRegioni = Object.keys(Regione).map(key => Regione[key]);
  
  const regioniToComuni = {
    ABRUZZO: ["L'Aquila", 'Chieti', 'Pescara', 'Teramo'],
    BASILICATA: ['Potenza', 'Matera'],
    CALABRIA: ['Catanzaro', 'Cosenza', 'Crotone', 'Reggio Calabria', 'Vibo Valentia'],
    CAMPANIA: ['Napoli', 'Avellino', 'Benevento', 'Caserta', 'Salerno'],
    EMILIA_ROMAGNA: ['Bologna', 'Cesena', 'Ferrara', 'Forlì', 'Modena', 'Parma', 'Piacenza', 'Ravenna', 'Reggio Emilia', 'Rimini'],
    FRIULI_VENEZIA_GIULIA: ['Trieste', 'Gorizia', 'Pordenone', 'Udine'],
    LAZIO: ['Roma', 'Frosinone', 'Latina', 'Rieti', 'Viterbo'],
    LIGURIA: ['Genova', 'Imperia', 'La Spezia', 'Savona'],
    LOMBARDIA: ['Milano', 'Bergamo', 'Brescia', 'Como', 'Cremona', 'Lecco', 'Lodi', 'Mantova', 'Monza e Brianza', 'Pavia', 'Sondrio', 'Varese'],
    MARCHE: ['Ancona', 'Ascoli Piceno', 'Fermo', 'Macerata', 'Pesaro e Urbino'],
    MOLISE: ['Campobasso', 'Isernia'],
    PIEMONTE: ['Torino', 'Alessandria', 'Asti', 'Biella', 'Cuneo', 'Novara', 'Verbano-Cusio-Ossola', 'Vercelli'],
    PUGLIA: ['Bari', 'Andria', 'Barletta', 'Brindisi', 'Lecce', 'Foggia', 'Taranto', 'Trani'],
    SARDEGNA: ['Cagliari', 'Nuoro', 'Oristano', 'Sassari', 'Sud Sardegna'],
    SICILIA: ['Palermo', 'Agrigento', 'Caltanissetta', 'Catania', 'Enna', 'Messina', 'Ragusa', 'Siracusa', 'Trapani'],
    TOSCANA: ['Firenze', 'Arezzo', 'Carrara', 'Grosseto', 'Livorno', 'Lucca', 'Massa', 'Pisa', 'Pistoia', 'Prato', 'Siena'],
    TRENTINO_ALTO_ADIGE: ['Trento', 'Bolzano'],
    UMBRIA: ['Perugia', 'Terni'],
    VALLE_D_AOSTA: ["Aosta"],
    VENETO: ['Venezia', 'Belluno', 'Padova', 'Rovigo', 'Treviso', 'Verona', 'Vicenza'],
  };
  
  const regioniToScaglioniIrpef = {
    ABRUZZO: { 1000000000: 0.0173 },
    BASILICATA: { 55000: 0.0123, 75000: 0.0173, 1000000000: 0.0233 },
    BOLZANO: { 35000: 0, 75000: 0.0123, 1000000000: 0.0173 },
    CALABRIA: { 1000000000: 0.0203 },
    CAMPANIA: { 1000000000: 0.0203 },
    EMILIA_ROMAGNA: { 15000: 0.0133, 28000: 0.0193, 55000: 0.0203, 75000: 0.0223, 1000000000: 0.0233 },
    FRIULI_VENEZIA_GIULIA: { 15000: 0.007, 1000000000: 0.0123 },
    LAZIO: { 15000: 0.0173, 28000: 0.0273, 55000: 0.0293, 75000: 0.0323, 1000000000: 0.0333 },
    LIGURIA: { 15000: 0.0123, 28000: 0.0181, 55000: 0.0231, 75000: 0.0232, 1000000000: 0.0233 },
    LOMBARDIA: { 15000: 0.0123, 28000: 0.0158, 55000: 0.0172, 75000: 0.0173, 1000000000: 0.0174 },
    MARCHE: { 15000: 0.0123, 28000: 0.0153, 55000: 0.0170, 75000: 0.0172, 1000000000: 0.0173 },
    MOLISE: { 15000: 0.0203, 28000: 0.0223, 55000: 0.0243, 75000: 0.0253, 1000000000: 0.0263 },
    PIEMONTE: { 15000: 0.0162, 28000: 0.0213, 55000: 0.0275, 75000: 0.0332, 1000000000: 0.0333 },
    PUGLIA: { 15000: 0.0133, 28000: 0.0143, 55000: 0.0171, 75000: 0.0172, 1000000000: 0.0173 },
    SARDEGNA: { 1000000000: 0.0123 },
    SICILIA: { 1000000000: 0.0123 },
    TOSCANA: { 15000: 0.0142, 28000: 0.0143, 55000: 0.0168, 75000: 0.0172, 1000000000: 0.0173 },
    TRENTO: { 15000: 0.0123, 28000: 0.0123, 55000: 0.0123, 75000: 0.0173, 1000000000: 0.0173 },
    UMBRIA: { 15000: 0.0123, 28000: 0.0163, 55000: 0.0168, 75000: 0.0173, 1000000000: 0.0183 },
    VALLE_D_AOSTA: { 1000000000: 0.0123 },
    VENETO: { 1000000000: 0.0123 }
  };
  
  const comuniToScaglioniIrpef = {
    'Chieti': { 15000: 0, 1000000000: 0.008 },
    "L'Aquila": { 15000: 0, 1000000000: 0.006 },
    'Pescara': { 10000: 0, 1000000000: 0.008 },
    'Teramo': { 10000: 0, 1000000000: 0.008 },
    'Matera': { 10000: 0, 1000000000: 0.008 },
    'Potenza': { 1000000000: 0.008 },
    'Catanzaro': { 1000000000: 0.008 },
    'Cosenza': { 1000000000: 0.008 },
    'Crotone': { 1000000000: 0.008 },
    'Reggio Calabria': { 1000000000: 0.008 },
    'Vibo Valentia': { 7000: 0, 1000000000: 0.008 },
    'Caserta': { 1000000000: 0.008 },
    'Avellino': { 15000: 0, 1000000000: 0.008 },
    'Benevento': { 1000000000: 0.008 },
    'Napoli': { 8000: 0, 1000000000: 0.008 },
    'Salerno': { 10000: 0, 1000000000: 0.008 },
    'Bologna': { 15000: 0, 1000000000: 0.008 },
    'Ferrara': { 15000: 0.006, 28000: 0.007, 50000: 0.0075, 1000000000: 0.008 },
    'Forlì': { 15000: 0, 28000: 0.0055, 50000: 0.0078, 1000000000: 0.0079 },
    'Cesena': { 10000: 0, 15000: 0.0039, 28000: 0.004, 55000: 0.0055, 78000: 0.0078, 1000000000: 0.008 },
    'Modena': { 15000: 0.005, 28000: 0.0064, 50000: 0.0075, 1000000000: 0.008 },
    'Parma': { 12000: 0, 1000000000: 0.008 },
    'Piacenza': { 11000: 0, 15000: 0.0042, 28000: 0.0052, 50000: 0.0068, 1000000000: 0.008 },
    'Ravenna': { 15000: 0.0055, 28000: 0.0057, 50000: 0.0059, 1000000000: 0.008 },
    'Reggio Emilia': { 15000: 0.0069, 28000: 0.0071, 50000: 0.0078, 1000000000: 0.008 },
    'Rimini': { 15000: 0.0055, 28000: 0.0066, 50000: 0.0078, 1000000000: 0.008 },
    'Gorizia': { 1000000000: 0 },
    'Pordenone': { 15000: 0, 1000000000: 0.006 },
    'Trieste': { 12500: 0, 1000000000: 0.006 },
    'Udine': { 1000000000: 0.002 },
    'Roma': { 12000: 0, 1000000000: 0.009 },
    'Rieti': { 1000000000: 0.008 },
    'Viterbo': { 1000000000: 0.0076 },
    'Frosinone': { 1000000000: 0.008 },
    'Latina': { 7999: 0, 1000000000: 0.008 },
    'Genova': { 10000: 0, 1000000000: 0.008 },
    'Imperia': { 1000000000: 0.008 },
    'La Spezia': { 15000: 0, 1000000000: 0.006 },
    'Savona': { 1000000000: 0.008 },
    'Bergamo': { 1000000000: 0.008 },
    'Brescia': { 13000: 0, 1000000000: 0.008 },
    'Como': { 15000: 0, 1000000000: 0.008 },
    'Cremona': { 12000: 0, 1000000000: 0.008 },
    'Lecco': { 15000: 0.0025, 28000: 0.004, 50000: 0.006, 1000000000: 0.008 },
    'Lodi': { 15000: 0.006, 28000: 0.007, 50000: 0.0075, 1000000000: 0.0075 },
    'Mantova': { 15000: 0.0038, 28000: 0.0039, 50000: 0.0062, 1000000000: 0.008 },
    'Milano': { 23000: 0, 1000000000: 0.008 },
    'Monza e Brianza': { 12000: 0, 1000000000: 0.008 },
    'Pavia': { 15000: 0.007, 28000: 0.0077, 55000: 0.0078, 75000: 0.0079, 1000000000: 0.008 },
    'Sondrio': { 99999: 0, 1000000000: 0.008 },
    'Varese': { 8000: 0, 1000000000: 0.008 },
    'Ancona': { 1000000000: 0.008 },
    'Ascoli Piceno': { 8500: 0, 1000000000: 0.008 },
    'Fermo': { 9000: 0, 1000000000: 0.008 },
    'Macerata': { 8499: 0, 1000000000: 0.008 },
    'Pesaro e Urbino': { 9000: 0, 15000: 0.006, 28000: 0.0061, 50000: 0.0078, 1000000000: 0.008 },
    'Campobasso': { 1000000000: 0.008 },
    'Isernia': { 1000000000: 0.008 },
    'Alessandria': { 1000000000: 0.008 },
    'Asti': { 7500: 0, 15000: 0.0054, 28000: 0.0066, 50000: 0.0078, 1000000000: 0.0079 },
    'Biella': { 1000000000: 0.008 },
    'Cuneo': { 15000: 0.007, 28000: 0.0073, 55000: 0.0076, 75000: 0.0079, 1000000000: 0.0079 },
    'Novara': { 12500: 0, 1000000000: 0.008 },
    'Torino': { 11790: 0, 15000: 0.008, 28000: 0.008, 50000: 0.011, 1000000000: 0.012 },
    'Verbano-Cusio-Ossola': undefined,
    'Vercelli': { 16000: 0, 15000: 0.007, 28000: 0.008, 50000: 0.008, 1000000000: 0.008 },
    'Bari': { 15000: 0, 1000000000: 0.008 },
    'Barletta': { 9000: 0, 15000: 0.005, 28000: 0.006, 55000: 0.007, 75000: 0.0079, 1000000000: 0.008 },
    'Andria': { 7500: 0, 1000000000: 0.008 },
    'Trani': { 7999: 0, 15000: 0.007, 28000: 0.0075, 50000: 0.008, 1000000000: 0.008 },
    'Brindisi': { 10000: 0, 1000000000: 0.008 },
    'Lecce': { 1000000000: 0.008 },
    'Foggia': { 1000000000: 0.008 },
    'Taranto': { 15000: 0, 1000000000: 0.008 },
    'Cagliari': { 10000: 0, 15000: 0.0066, 28000: 0.0072, 55000: 0.0078, 75000: 0.0079, 1000000000: 0.008 },
    'Nuoro': { 7999: 0, 15000: 0.0045, 28000: 0.0055, 50000: 0.0065, 1000000000: 0.008 },
    'Oristano': { 10000: 0, 15000: 0.0069, 28000: 0.0072, 50000: 0.0076, 1000000000: 0.008 },
    'Sassari': { 15000: 0, 1000000000: 0.008 },
    'Sud Sardegna': undefined,
    'Catania': { 7500: 0, 1000000000: 0.008 },
    'Palermo': { 1000000000: 0.008 },
    'Agrigento': { 7499: 0, 1000000000: 0.008 },
    'Caltanissetta': { 1000000000: 0.008 },
    'Enna': { 22999: 0, 1000000000: 0.008 },
    'Messina': { 1000000000: 0.008 },
    'Ragusa': { 10000: 0, 15000: 0.006, 28000: 0.007, 50000: 0.0075, 1000000000: 0.008 },
    'Siracusa': { 1000000000: 0.008 },
    'Trapani': { 10000: 0, 1000000000: 0.008 },
    'Arezzo': { 13500: 0, 15000: 0.0048, 28000: 0.0049, 50000: 0.0078, 1000000000: 0.0079 },
    'Firenze': { 25000: 0, 1000000000: 0.002 },
    'Grosseto': { 1000000000: 0.008 },
    'Livorno': { 1000000000: 0.008 },
    'Lucca': { 14500: 0, 15000: 0.0058, 28000: 0.006, 55000: 0.0074, 75000: 0.0079, 1000000000: 0.008 },
    'Massa': { 12000: 0, 15000: 0.0063, 28000: 0.0068, 50000: 0.0071, 1000000000: 0.008 },
    'Carrara': { 10000: 0, 1000000000: 0.002 },
    'Pisa': { 12000: 0, 15000: 0.005, 28000: 0.006, 50000: 0.007, 1000000000: 0.008 },
    'Pistoia': { 15000: 0, 1000000000: 0.008 },
    'Prato': { 1000000000: 0.005 },
    'Siena': undefined,
    'Bolzano': { 1000000000: 0 },
    'Trento': { 1000000000: 0 },
    'Perugia': { 1000000000: 0.008 },
    'Terni': { 12500: 0, 1000000000: 0.008 },
    'Aosta': { 9999: 0, 1000000000: 0.008 },
    'Belluno': { 10000: 0, 15000: 0.0072, 28000: 0.0073, 50000: 0.0078, 1000000000: 0.008 },
    'Padova': { 15000: 0, 1000000000: 0.007 },
    'Rovigo': { 10000: 0, 1000000000: 0.008 },
    'Treviso': { 15000: 0.006, 28000: 0.0065, 55000: 0.007, 75000: 0.0075, 1000000000: 0.008 },
    'Venezia': { 10000: 0, 1000000000: 0.008 },
    'Verona': { 10000: 0, 1000000000: 0.008 },
    'Vicenza': { 15000: 0.006, 28000: 0.0065, 50000: 0.007, 1000000000: 0.0075 }
  };
  
  let el = null;
  let initialized = false;
    function captureElements() {
      el = {
        ral: byId('ral'),
        mensilita: byId('mensilita'),
        inps: byId('inps'),
        inpsCustom: byId('inpsCustom'),
        regione: byId('regione'),
        comune: byId('comune'),
        aliquotaRegionale: byId('aliquotaRegionale'),
        aliquotaComunale: byId('aliquotaComunale'),
        customComune: byId('customComune'),
        warningComune: byId('warningComune'),
        detrazioneLavoro: byId('detrazioneLavoro'),
        applicaCuneo: byId('applicaCuneo'),
        applicaBonus: byId('applicaBonus'),
        calcola: byId('calcola') || byId('but'), // ← MODIFICA: gestisce sia #calcola che #but
        but: byId('but'),
        esempio: byId('esempio'),
        imponibile: byId('imponibile'),
        irpefLorda: byId('irpefLorda'),
        irpefDovuta: byId('irpefDovuta'),
        nettoAnnuo: byId('nettoAnnuo'),
        nettoMensile: byId('nettoMensile'),
        dettaglio: byId('dettaglio'),
        display: byId('display'), // ← AGGIUNTO: per mostrare/nascondere risultati
        errorMessage: byId('errorMessage') // ← AGGIUNTO: per messaggi di errore
      };
    }
  
    function normalizeNumberInput(value) {
      if (value == null) return NaN;
      let s = String(value).trim();
      if (!s) return NaN;
      // Rimuovi spazi
      s = s.replace(/\s+/g, '');
      // Se contiene sia punto che virgola: usa la virgola come decimale e rimuovi i punti (migliaia)
      if (s.includes('.') && s.includes(',')) {
        s = s.replace(/\./g, '').replace(',', '.');
      } else if (s.includes(',')) {
        // Solo virgola → decimale
        s = s.replace(',', '.');
      } else {
        // Solo punto → già decimale (mantieni)
      }
      // Rimuovi caratteri non numerici (eccetto . e -)
      s = s.replace(/[^0-9\.\-]/g, '');
      const n = parseFloat(s);
      return isFinite(n) ? n : NaN;
    }
  
    function getInpsRate() {
      const sel = el.inps.value;
      if (sel === 'custom') {
        const v = normalizeNumberInput(el.inpsCustom.value);
        return isFinite(v) ? v / 100 : 0.0919;
      }
      const pct = parseFloat(String(sel || '').replace(',', '.'));
      return isFinite(pct) ? pct / 100 : 0.0919;
    }
  
    function computeInps(ral, inpsRate) {
      return ral * inpsRate;
    }
  
    // IRPEF 2025: 23% fino 28k, 35% tra 28k-50k, 43% oltre
    function computeIrpefLorda(imponibile) {
      let tax = 0;
      let restante = imponibile;
  
      const scaglioni = [
        { limite: 28000, aliquota: 0.23 },
        { limite: 50000, aliquota: 0.35 },
        { limite: Infinity, aliquota: 0.43 }
      ];
  
      let basePrecedente = 0;
      for (const s of scaglioni) {
        const base = Math.min(restante, s.limite - basePrecedente);
        if (base > 0) {
          tax += base * s.aliquota;
          restante -= base;
          basePrecedente = s.limite;
        }
        if (restante <= 0) break;
      }
      return tax;
    }
  
    // Calcola addizionale regionale usando scaglioni reali 2025
    function calcolaTassaPerScaglioni(imponibile, soglieToPercentuale) {
      if (!soglieToPercentuale || !isFinite(imponibile) || imponibile <= 0) return 0;
      let tasseTotale = 0;
      let resto = imponibile;
      let sogliaPrecedente = 0;
      
      // Ordina le soglie in modo crescente (converti chiavi stringhe in numeri per ordinamento)
      const soglieStr = Object.keys(soglieToPercentuale);
      const soglie = soglieStr.map(s => parseInt(s, 10)).sort((a, b) => a - b);
      
      for (const soglia of soglie) {
        // Usa la chiave stringa originale per accedere alla percentuale
        const sogliaKey = soglia.toString();
        const percentuale = soglieToPercentuale[sogliaKey];
        if (percentuale === undefined) continue;
        
        const deltaSoglia = soglia - sogliaPrecedente;
        const used = Math.min(deltaSoglia, resto);
        if (used > 0) {
          tasseTotale += used * percentuale;
          resto -= used;
        }
        sogliaPrecedente = soglia;
        if (resto <= 0) break;
      }
      return tasseTotale;
    }
    
    // Addizionale regionale: usa scaglioni reali 2025 o flat personalizzata
    function computeAddizionaleRegionale(imponibile, regioneNome, flatPct) {
      if (!isFinite(imponibile) || imponibile <= 0) return 0;
      if (!regioneNome || regioneNome === 'none') return 0;
      if (regioneNome === 'flat') {
        const pct = (isFinite(flatPct) ? flatPct : 0) / 100;
        return imponibile * pct;
      }
      
      // Cerca la regione
      const regioneKey = findRegionByName(regioneNome);
      if (!regioneKey) return 0;
      
      // Gestione speciale per Trentino-Alto Adige
      let scaglioniRegione = regioniToScaglioniIrpef[regioneKey];
      if (regioneKey === 'TRENTINO_ALTO_ADIGE') {
        // Per Trentino-Alto Adige, controlla il comune per determinare se Trento o Bolzano
        const comuneNome = el.comune ? el.comune.value : '';
        if (comuneNome === 'Bolzano') {
          scaglioniRegione = regioniToScaglioniIrpef['BOLZANO'];
        } else if (comuneNome === 'Trento') {
          scaglioniRegione = regioniToScaglioniIrpef['TRENTO'];
        } else {
          // Default a Trento se non specificato
          scaglioniRegione = regioniToScaglioniIrpef['TRENTO'];
        }
      }
      
      if (!scaglioniRegione) return 0;
      return calcolaTassaPerScaglioni(imponibile, scaglioniRegione);
    }
  
    // Addizionale comunale: usa scaglioni reali 2025 o flat personalizzata
    function computeAddizionaleComunale(imponibile, comuneNome, customPct) {
      if (!isFinite(imponibile) || imponibile <= 0) return 0;
      if (!comuneNome) {
        // Se non c'è comune, usa aliquota personalizzata se presente
        const rate = (isFinite(customPct) ? customPct : 0) / 100;
        return Math.max(0, imponibile) * rate;
      }
      
      // Cerca gli scaglioni del comune
      const scaglioniComune = comuniToScaglioniIrpef[comuneNome];
      
      // Se il comune non ha scaglioni definiti, usa aliquota personalizzata o default 0.8%
      if (scaglioniComune === undefined) {
        const rate = (isFinite(customPct) ? customPct : 0.8) / 100;
        return Math.max(0, imponibile) * rate;
      }
      
      // Calcola usando gli scaglioni reali
      return calcolaTassaPerScaglioni(imponibile, scaglioniComune);
    }
  
    // Cuneo fiscale 2025 (traccia): 1.000€ tra 20.000€ e 40.000€
    function computeDetrazioneCuneo(imponibile, enabled) {
      if (!enabled) return 0;
      if (imponibile >= 20000 && imponibile <= 40000) return 1000;
      return 0;
    }
  
    // Bonus IRPEF 100€/mese (semplificato): 1.200€ se reddito <= 28.000€
    function computeBonusIrpef(imponibile, enabled) {
      if (!enabled) return 0;
      return imponibile <= 28000 ? 1200 : 0;
    }
  
    function calc() {
      if (!el || !el.ral) return; // DOM non pronto/markup assente
      const ral = normalizeNumberInput(String(el.ral.value || ''));
      const mensilita = parseInt(el.mensilita.value, 10);
      const inpsRate = getInpsRate();
      const regioneNome = el.regione ? el.regione.value : '';
      const comuneNome = el.comune ? el.comune.value : '';
      const regFlat = normalizeNumberInput(String(el.aliquotaRegionale ? el.aliquotaRegionale.value || '' : ''));
      const comAliq = normalizeNumberInput(String(el.aliquotaComunale ? el.aliquotaComunale.value || '' : ''));
      const customComunePct = normalizeNumberInput(String(el.customComune ? el.customComune.value || '' : ''));
      const detLav = normalizeNumberInput(String(el.detrazioneLavoro.value || ''));
      const useCuneo = el.applicaCuneo.checked;
      const useBonus = el.applicaBonus.checked;

      if (!isFinite(ral) || ral <= 0) {
        // Se RAL non valida, mostra errore
        renderEmpty();
        showError('Inserisci una RAL valida per calcolare lo stipendio netto.');
        return;
      }

      // Nascondi errore se presente
      hideError();

      // 1) Contributi INPS
      const inps = computeInps(ral, inpsRate);
      // 2) Imponibile IRPEF
      const imponibile = Math.max(0, ral - inps);
      // 3) IRPEF lorda
      const irpefLorda = computeIrpefLorda(imponibile);
      // 4) Detrazioni
      const detCuneo = computeDetrazioneCuneo(imponibile, useCuneo);
      const bonusIrpef = computeBonusIrpef(imponibile, useBonus);
      const detrazioneLavoro = Math.max(0, isFinite(detLav) ? detLav : 0);
      const irpefDopoDetrazioni = Math.max(0, irpefLorda - detrazioneLavoro - detCuneo - bonusIrpef);
      // 5) Addizionali su imponibile
      // Se regioneNome è 'flat', usa aliquota personalizzata, altrimenti usa scaglioni reali
      const addReg = computeAddizionaleRegionale(imponibile, regioneNome, regFlat);
      // Se comuneNome esiste e non è vuoto, usa scaglioni reali (o customComunePct se comune non trovato)
      // Se comuneNome non esiste, usa aliquotaComunale personalizzata
      let addCom = 0;
      if (comuneNome && comuneNome.trim() !== '') {
        // Comune selezionato: usa scaglioni reali o customComunePct se comune non trovato
        addCom = computeAddizionaleComunale(imponibile, comuneNome, customComunePct);
      } else {
        // Nessun comune selezionato: usa aliquotaComunale personalizzata
        const rate = (isFinite(comAliq) ? comAliq : 0) / 100;
        addCom = Math.max(0, imponibile) * rate;
      }
      const totaleIrpefDovuta = irpefDopoDetrazioni + addReg + addCom;
      // 6) Netto annuo
      const nettoAnnuo = Math.max(0, ral - inps - totaleIrpefDovuta);
      const nettoMensile = mensilita > 0 ? nettoAnnuo / mensilita : 0;

      // Render
      el.imponibile.textContent = fmt(Math.round(imponibile));
      el.irpefLorda.textContent = fmt(Math.round(irpefLorda));
      el.irpefDovuta.textContent = fmt(Math.round(totaleIrpefDovuta));
      el.nettoAnnuo.textContent = fmt(Math.round(nettoAnnuo));
      el.nettoMensile.textContent = fmt(Math.round(nettoMensile));

      renderDettaglio({
        ral, inps, imponibile, irpefLorda, detrazioneLavoro, detCuneo, bonusIrpef, addReg, addCom, totaleIrpefDovuta, nettoAnnuo, nettoMensile, mensilita
      });

      // ← AGGIUNTO: Mostra il div #display con i risultati
      showResults();
    }
  
    function renderEmpty() {
      if (!el) return;
      el.imponibile.textContent = '—';
      el.irpefLorda.textContent = '—';
      el.irpefDovuta.textContent = '—';
      el.nettoAnnuo.textContent = '—';
      el.nettoMensile.textContent = '—';
      el.dettaglio.innerHTML = '';
      // ← AGGIUNTO: Nascondi risultati
      hideResults();
    }
  
    function renderDettaglio(m) {
      const rows = [
        ['RAL', fmt(m.ral)],
        ['Contributi INPS', '-' + fmt(Math.round(m.inps))],
        ['Imponibile IRPEF', fmt(Math.round(m.imponibile))],
        ['IRPEF lorda', '-' + fmt(Math.round(m.irpefLorda))],
        ['Detrazione lavoro dipendente', '+' + fmt(Math.round(m.detrazioneLavoro))],
        ['Detrazione cuneo fiscale 2025', '+' + fmt(Math.round(m.detCuneo))],
        ['Bonus IRPEF (tratt. integrativo)', '+' + fmt(Math.round(m.bonusIrpef))],
        ['Addizionale regionale', '-' + fmt(Math.round(m.addReg))],
        ['Addizionale comunale', '-' + fmt(Math.round(m.addCom))],
        ['Totale IRPEF dovuta', '-' + fmt(Math.round(m.totaleIrpefDovuta))],
        ['Retribuzione annua netta', fmt(Math.round(m.nettoAnnuo))],
        [`Stipendio mensile netto (${m.mensilita} mensilità)`, fmt(Math.round(m.nettoMensile))]
      ];
      el.dettaglio.innerHTML = rows.map(r => {
        return `<tr><td>${r[0]}</td><td style="text-align: right; font-weight: 600;">${r[1]}</td></tr>`;
      }).join('');
    }
  
    // ← AGGIUNTO: Funzioni per mostrare/nascondere risultati ed errori
    function showResults() {
      if (el.display) {
        el.display.classList.add('show');
        el.display.style.display = 'block';
      }
    }
  
    function hideResults() {
      if (el.display) {
        el.display.classList.remove('show');
        el.display.style.display = 'none';
      }
    }
  
    function showError(message) {
      if (el.errorMessage) {
        el.errorMessage.textContent = message;
        el.errorMessage.classList.add('show');
      }
    }
  
    function hideError() {
      if (el.errorMessage) {
        el.errorMessage.classList.remove('show');
      }
    }
  
    // Popola dropdown regioni
    function popolaRegioni() {
      if (!el.regione) return;
      el.regione.innerHTML = '<option value="">Seleziona regione...</option>';
      nomiRegioni.forEach(regione => {
        const option = document.createElement('option');
        option.value = regione;
        option.textContent = regione;
        el.regione.appendChild(option);
      });
      // Aggiungi opzioni legacy per retrocompatibilità
      const optionFlat = document.createElement('option');
      optionFlat.value = 'flat';
      optionFlat.textContent = 'Personalizzata (aliquota unica)';
      el.regione.appendChild(optionFlat);
      const optionNone = document.createElement('option');
      optionNone.value = 'none';
      optionNone.textContent = 'Nessuna';
      el.regione.appendChild(optionNone);
    }
    
    // Popola dropdown comuni in base alla regione selezionata
    function popolaComuni(regioneNome) {
      if (!el.comune) return;
      el.comune.innerHTML = '<option value="">Seleziona comune...</option>';
      
      if (!regioneNome || regioneNome === 'flat' || regioneNome === 'none') {
        // Se regione non valida, nascondi campo comune personalizzato
        if (el.warningComune) el.warningComune.style.display = 'none';
        return;
      }
      
      const regioneKey = findRegionByName(regioneNome);
      if (!regioneKey || !regioniToComuni[regioneKey]) {
        if (el.warningComune) el.warningComune.style.display = 'none';
        return;
      }
      
      const comuni = regioniToComuni[regioneKey];
      comuni.forEach(comune => {
        const option = document.createElement('option');
        option.value = comune;
        option.textContent = comune;
        el.comune.appendChild(option);
      });
    }
    
    // Campi sempre attivi per evitare blocchi UI
    function ensureInputsAlwaysEnabled() {
      if (!el) return;
      if (el.inpsCustom) el.inpsCustom.disabled = false;
      if (el.aliquotaRegionale) {
        // Abilita solo se regione è 'flat'
        el.aliquotaRegionale.disabled = !(el.regione && el.regione.value === 'flat');
      }
      // Mostra/nascondi campo comune personalizzato in base al comune selezionato
      if (el.comune && el.warningComune) {
        const comuneNome = el.comune.value;
        if (comuneNome && comuniToScaglioniIrpef[comuneNome] === undefined) {
          el.warningComune.style.display = 'block';
        } else {
          el.warningComune.style.display = 'none';
        }
      }
    }
  
    // Interazioni UI
    function bindEvents() {
      if (!el) return;
      const handleCalcClick = (e) => { try { e && e.preventDefault && e.preventDefault(); } catch(_) {} calc(); };
      if (el.inps) {
        el.inps.addEventListener('change', ensureInputsAlwaysEnabled);
        el.inps.addEventListener('input', ensureInputsAlwaysEnabled);
      }
      if (el.regione) {
        el.regione.addEventListener('change', function() {
          const regioneNome = this.value;
          popolaComuni(regioneNome);
          ensureInputsAlwaysEnabled();
          calc();
        });
      }
      if (el.comune) {
        el.comune.addEventListener('change', function() {
          ensureInputsAlwaysEnabled();
          calc();
        });
      }
      if (el.calcola) {
        el.calcola.addEventListener('click', handleCalcClick);
      }
      if (el.but) {
        el.but.addEventListener('click', handleCalcClick);
      }
      // Calcolo live su modifica campi
      const liveIds = ['ral','mensilita','inps','inpsCustom','regione','comune','aliquotaRegionale','aliquotaComunale','customComune','detrazioneLavoro','applicaCuneo','applicaBonus'];
      liveIds.forEach((key) => {
        const node = el[key];
        if (!node) return;
        const evt = (node.tagName === 'SELECT' || node.type === 'checkbox') ? 'change' : 'input';
        node.addEventListener(evt, calc);
      });
      if (el.esempio) {
        el.esempio.addEventListener('click', () => {
          if (!el) return;
          el.ral && (el.ral.value = 30000);
          el.mensilita && (el.mensilita.value = '14');
          el.inps && (el.inps.value = '9.19');
          el.inpsCustom && (el.inpsCustom.value = '');
          el.regione && (el.regione.value = 'Toscana');
          if (el.comune) {
            popolaComuni('Toscana');
            el.comune.value = 'Firenze';
          }
          el.aliquotaRegionale && (el.aliquotaRegionale.value = '');
          el.aliquotaComunale && (el.aliquotaComunale.value = '');
          el.customComune && (el.customComune.value = '');
          el.detrazioneLavoro && (el.detrazioneLavoro.value = '1979');
          el.applicaCuneo && (el.applicaCuneo.checked = true);
          el.applicaBonus && (el.applicaBonus.checked = false);
          ensureInputsAlwaysEnabled();
          calc();
        });
      }
    }
  
    function doInitIfReady() {
      if (initialized) return;
      captureElements();
      if (!el || !el.ral) return;
      hideResults();
      hideError();
      // Popola dropdown regioni
      if (el.regione) {
        popolaRegioni();
        // Se c'è già un valore selezionato, popola i comuni
        if (el.regione.value) {
          popolaComuni(el.regione.value);
        }
      }
      ensureInputsAlwaysEnabled();
      bindEvents();
      initialized = true;
    }

    function init() {
      // Primo tentativo su DOM pronto
      doInitIfReady();
      // Se markup montato in ritardo (Elementor/shortcode), osserva il DOM finché non trova i nodi
      if (!initialized) {
        const observer = new MutationObserver(() => {
          if (initialized) { observer.disconnect(); return; }
          doInitIfReady();
          if (initialized) observer.disconnect();
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
        // Fallback: ritenta tra 300 ms
        setTimeout(doInitIfReady, 300);
      }
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  })();