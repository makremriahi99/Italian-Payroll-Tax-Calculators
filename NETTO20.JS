/* ========================================
   CALCOLATORE RIENTRO DEI CERVELLI
   Adattato per WordPress e CSS custom
   ======================================== */

   (function() {
    'use strict';
  
    // ============================================
    // DATI E COSTANTI (dal file originale)
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
  
    const soglieIrpefToPercentualeMarginale = {
      15000: 0.23,
      28000: 0.25,
      50000: 0.35,
      1000000000: 0.43,
    };
  
    const soglieInpsToPercentualeMarginale = {
      47379: 0.0919,
      103055: 0.1019,
      1000000000: 0,
    };
  
    const RegolaImponibile = {
      STANDARD: 1,
      NORD: 0.3,
      MEZZOGIORNO: 0.1,
    };
  
    const regioneToRegola = {
      ABRUZZO: RegolaImponibile.MEZZOGIORNO,
      BASILICATA: RegolaImponibile.MEZZOGIORNO,
      CALABRIA: RegolaImponibile.MEZZOGIORNO,
      CAMPANIA: RegolaImponibile.MEZZOGIORNO,
      EMILIA_ROMAGNA: RegolaImponibile.NORD,
      FRIULI_VENEZIA_GIULIA: RegolaImponibile.NORD,
      LAZIO: RegolaImponibile.NORD,
      LIGURIA: RegolaImponibile.NORD,
      LOMBARDIA: RegolaImponibile.NORD,
      MARCHE: RegolaImponibile.NORD,
      MOLISE: RegolaImponibile.MEZZOGIORNO,
      PIEMONTE: RegolaImponibile.NORD,
      PUGLIA: RegolaImponibile.MEZZOGIORNO,
      SARDEGNA: RegolaImponibile.MEZZOGIORNO,
      SICILIA: RegolaImponibile.MEZZOGIORNO,
      TOSCANA: RegolaImponibile.NORD,
      TRENTINO_ALTO_ADIGE: RegolaImponibile.NORD,
      UMBRIA: RegolaImponibile.NORD,
      VALLE_D_AOSTA: RegolaImponibile.NORD,
      VENETO: RegolaImponibile.NORD,
    };
  
    // ============================================
    // FUNZIONI DI CALCOLO (dal file originale)
    // ============================================
  
    function calcolaNetto(ral, regione, comune, hasAgevolazione, comuneDef) {
      const inps = calcolaInps(ral);
      const baseImponibileEffettiva = baseImponibile(ral, regione, hasAgevolazione);
      const irpefTotale = calcolaIrpefTotale(baseImponibileEffettiva, regione, comune, comuneDef);
      const detrazioni = calcolaDetrazioni(baseImponibileEffettiva);
      const irpefNetto = calcolaIrpefNetto(irpefTotale, detrazioni);
      return ral - inps - irpefNetto;
    }
  
    function baseImponibile(lordo, regione, hasAgevolazione) {
      const inps = calcolaInps(lordo);
      const imponibileStandard = lordo - inps;
      const regola = (hasAgevolazione) ? regioneToRegola[regione] : RegolaImponibile.STANDARD;
      return _calcolaBaseImponibile(imponibileStandard, regola);
    }
  
    function _calcolaBaseImponibile(imponibileStandard, regolaImponibile) {
      return imponibileStandard * regolaImponibile;
    }
  
    function calcolaInps(imponibile) {
      return calcolaTassa(imponibile, soglieInpsToPercentualeMarginale);
    }
  
    function calcolaIrpef(imponibile) {
      return calcolaTassa(imponibile, soglieIrpefToPercentualeMarginale);
    }
  
    function calcolaIrpefRegione(imponibile, regione) {
      return calcolaTassa(imponibile, regioniToScaglioniIrpef[regione]);
    }
  
    function calcolaIrpefComune(imponibile, comune, comuneDef) {
      return calcolaTassa(imponibile, comuniToScaglioniIrpef[comune] ? comuniToScaglioniIrpef[comune] : comuneDef);
    }
  
    function calcolaIrpefTotale(imponibile, regione, comune, comuneDef) {
      return calcolaIrpef(imponibile) +
        calcolaIrpefRegione(imponibile, regione) +
        calcolaIrpefComune(imponibile, comune, comuneDef);
    }
  
    function calcolaDetrazioni(imponibile) {
      if (imponibile <= 15000) {
        return 1880;
      } else if (imponibile <= 28000) {
        return 1910 + 1190 * (28000 - imponibile) / 13000;
      } else if (imponibile <= 50000) {
        return 1910 * (50000 - imponibile) / (50000 - 28000);
      } else {
        return 0;
      }
    }
  
    function calcolaIrpefNetto(irpefTotale, detrazioni) {
      return Math.max(0, irpefTotale - detrazioni);
    }
  
    function calcolaTassa(lordo, soglieToPercentualeMarginale) {
      let tasseTotale = 0;
      let resto = lordo;
      let sogliaPrecedente = 0;
  
      for (const soglia in soglieToPercentualeMarginale) {
        const percentuale = soglieToPercentualeMarginale[soglia];
        const deltaSoglia = soglia - sogliaPrecedente;
        const used = Math.min(deltaSoglia, resto);
        sogliaPrecedente = soglia;
        resto -= used;
        tasseTotale += used * percentuale;
      }
      return tasseTotale;
    }
  
    // ============================================
    // GESTIONE DOM E UI
    // ============================================
  
    let el = {};
    let mensilita = 1; // Default: annuale
  
  function captureElements() {
      el = {
        ral: document.getElementById('ral'),
      form: document.getElementById('submit-salary'),
        region: document.getElementById('region'),
        comune: document.getElementById('comune'),
        customComune: document.getElementById('customComune'),
        warningComune: document.getElementById('warningComune'),
        display: document.getElementById('display'),
        
        // Risultati mensili
        standard12: document.querySelectorAll('.standard12'),
        standard13: document.querySelectorAll('.standard13'),
        standard14: document.querySelectorAll('.standard14'),
        rientro12: document.querySelectorAll('.rientro12'),
        rientro13: document.querySelectorAll('.rientro13'),
        rientro14: document.querySelectorAll('.rientro14'),
        dif12: document.querySelectorAll('.dif12'),
        dif13: document.querySelectorAll('.dif13'),
        dif14: document.querySelectorAll('.dif14'),
        
        // Tabella dettaglio
        taxRalS: document.getElementById('taxRalS'),
        taxRalC: document.getElementById('taxRalC'),
        taxInpsS: document.getElementById('taxInpsS'),
        taxInpsC: document.getElementById('taxInpsC'),
        imponibileIrpefS: document.getElementById('imponibileIrpefS'),
        imponibileIrpefC: document.getElementById('imponibileIrpefC'),
        irpefTotS: document.getElementById('irpefTotS'),
        irpefTotC: document.getElementById('irpefTotC'),
        taxIrpefS: document.getElementById('taxIrpefS'),
        taxIrpefC: document.getElementById('taxIrpefC'),
        taxRegioneS: document.getElementById('taxRegioneS'),
        taxRegioneC: document.getElementById('taxRegioneC'),
        taxComuneS: document.getElementById('taxComuneS'),
        taxComuneC: document.getElementById('taxComuneC'),
        detrazioniTotS: document.getElementById('detrazioniTotS'),
        detrazioniTotC: document.getElementById('detrazioniTotC'),
        irpefNettoS: document.getElementById('irpefNettoS'),
        irpefNettoC: document.getElementById('irpefNettoC'),
        nettoAnnualeS: document.getElementById('nettoAnnualeS'),
        nettoAnnualeC: document.getElementById('nettoAnnualeC'),
        tasseTotS: document.getElementById('tasseTotS'),
        tasseTotC: document.getElementById('tasseTotC'),
        
        // Scaglioni IRPEF
        irpefS0: document.getElementById('irpefS0'),
        irpefS1: document.getElementById('irpefS1'),
        irpefS2: document.getElementById('irpefS2'),
        irpefS3: document.getElementById('irpefS3'),
        irpefC0: document.getElementById('irpefC0'),
        irpefC1: document.getElementById('irpefC1'),
        irpefC2: document.getElementById('irpefC2'),
        irpefC3: document.getElementById('irpefC3'),
        TotIrpefS: document.getElementById('TotIrpefS'),
        TotIrpefC: document.getElementById('TotIrpefC'),
        
        percentualeImponibile: document.getElementById('percentualeImponibile'),
        isMezzogiorno: document.getElementById('isMezzogiorno'),
        btnIrpefInfo: document.getElementById('btnIrpefInfo')
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
  
    const fmt = (n) => isFinite(n) ? n.toLocaleString('it-IT', { maximumFractionDigits: 0 }) : '-';
    const fmtPerc = (n) => isFinite(n) ? n.toFixed(2) : '-';
  
    function popolaRegioni() {
      if (!el.region) return;
      el.region.innerHTML = '<option value="">Seleziona regione...</option>';
      nomiRegioni.forEach(regione => {
        const option = document.createElement('option');
        option.value = regione;
        option.textContent = regione;
        el.region.appendChild(option);
      });
    }
  
    function popolaComuni(regioneNome) {
      if (!el.comune) return;
      el.comune.innerHTML = '<option value="">Seleziona comune...</option>';
      
      const regioneKey = findRegionByName(regioneNome);
      if (!regioneKey || !regioniToComuni[regioneKey]) return;
      
      const comuni = regioniToComuni[regioneKey];
      comuni.forEach(comune => {
        const option = document.createElement('option');
        option.value = comune;
        option.textContent = comune;
        el.comune.appendChild(option);
      });
    }
  
    function calcolaEMostra() {
      const ral = normalizeNumberInput(el.ral.value);
      const regioneNome = el.region.value;
      const comuneNome = el.comune.value;
      
      if (!isFinite(ral) || ral <= 0 || !regioneNome || !comuneNome) {
        hideResults();
        return;
      }
      
      const regioneKey = findRegionByName(regioneNome);
      if (!regioneKey) return;
      
      // Controllo comune personalizzato
      const comuneDefault = comuniToScaglioniIrpef[comuneNome] === undefined ? 
        { 1_000_000_000: normalizeNumberInput(el.customComune.value) / 100 } : 
        undefined;
      
      if (comuniToScaglioniIrpef[comuneNome] === undefined) {
        el.warningComune.style.display = 'block';
      } else {
        el.warningComune.style.display = 'none';
      }
      
      // Calcola netto standard e agevolato
      const nettoStandard = calcolaNetto(ral, regioneKey, comuneNome, false, comuneDefault);
      const nettoAgevolato = calcolaNetto(ral, regioneKey, comuneNome, true, comuneDefault);
      
      // Calcola dettagli
      const inps = calcolaInps(ral);
      const imponibileStandard = ral - inps;
      const imponibileAgevolato = baseImponibile(ral, regioneKey, true);
      
      const irpefStandard = calcolaIrpef(imponibileStandard);
      const irpefAgevolato = calcolaIrpef(imponibileAgevolato);
      
      const irpefRegioneStandard = calcolaIrpefRegione(imponibileStandard, regioneKey);
      const irpefRegioneAgevolato = calcolaIrpefRegione(imponibileAgevolato, regioneKey);
      
      const irpefComuneStandard = calcolaIrpefComune(imponibileStandard, comuneNome, comuneDefault);
      const irpefComuneAgevolato = calcolaIrpefComune(imponibileAgevolato, comuneNome, comuneDefault);
      
      const irpefTotStandard = irpefStandard + irpefRegioneStandard + irpefComuneStandard;
      const irpefTotAgevolato = irpefAgevolato + irpefRegioneAgevolato + irpefComuneAgevolato;
      
      const detrazioniStandard = calcolaDetrazioni(imponibileStandard);
      const detrazioniAgevolato = calcolaDetrazioni(imponibileAgevolato);
      
      const irpefNettoStandard = calcolaIrpefNetto(irpefTotStandard, detrazioniStandard);
      const irpefNettoAgevolato = calcolaIrpefNetto(irpefTotAgevolato, detrazioniAgevolato);
      
      const tasseTotStandard = ((inps + irpefNettoStandard) / ral * 100);
      const tasseTotAgevolato = ((inps + irpefNettoAgevolato) / ral * 100);
      
      // Aggiorna risultati mensili
      updateNettoMesi(nettoStandard, nettoAgevolato);
      
      // Aggiorna tabella dettaglio
      updateTabellaDettaglio({
        ral,
        inps,
        imponibileStandard,
        imponibileAgevolato,
        irpefTotStandard,
        irpefTotAgevolato,
        irpefStandard,
        irpefAgevolato,
        irpefRegioneStandard,
        irpefRegioneAgevolato,
        irpefComuneStandard,
        irpefComuneAgevolato,
        detrazioniStandard,
        detrazioniAgevolato,
        irpefNettoStandard,
        irpefNettoAgevolato,
        nettoStandard,
        nettoAgevolato,
        tasseTotStandard,
        tasseTotAgevolato
      });
      
      // Aggiorna scaglioni
      updateScaglioni(imponibileStandard, imponibileAgevolato);
      
      // Aggiorna percentuale imponibile
      const regola = regioneToRegola[regioneKey];
      if (regola === RegolaImponibile.MEZZOGIORNO) {
        el.percentualeImponibile.textContent = '90%';
        el.isMezzogiorno.style.display = 'block';
      } else {
        el.percentualeImponibile.textContent = '70%';
        el.isMezzogiorno.style.display = 'block';
      }
      
      showResults();
    }
  
    function updateNettoMesi(nettoStandard, nettoAgevolato) {
      const differenza = nettoAgevolato - nettoStandard;
      
      // 12 mensilità
      el.standard12.forEach(elem => elem.textContent = fmt(Math.round(nettoStandard / 12)));
      el.rientro12.forEach(elem => elem.textContent = fmt(Math.round(nettoAgevolato / 12)));
      el.dif12.forEach(elem => elem.textContent = fmt(Math.round(differenza / 12)));
      
      // 13 mensilità
      el.standard13.forEach(elem => elem.textContent = fmt(Math.round(nettoStandard / 13)));
      el.rientro13.forEach(elem => elem.textContent = fmt(Math.round(nettoAgevolato / 13)));
      el.dif13.forEach(elem => elem.textContent = fmt(Math.round(differenza / 13)));
      
      // 14 mensilità
      el.standard14.forEach(elem => elem.textContent = fmt(Math.round(nettoStandard / 14)));
      el.rientro14.forEach(elem => elem.textContent = fmt(Math.round(nettoAgevolato / 14)));
      el.dif14.forEach(elem => elem.textContent = fmt(Math.round(differenza / 14)));
    }
  
    function updateTabellaDettaglio(data) {
      const divisore = mensilita || 1;
      
      el.taxRalS.textContent = fmt(Math.round(data.ral / divisore));
      el.taxRalC.textContent = fmt(Math.round(data.ral / divisore));
      el.taxInpsS.textContent = fmt(Math.round(data.inps / divisore));
      el.taxInpsC.textContent = fmt(Math.round(data.inps / divisore));
      el.imponibileIrpefS.textContent = fmt(Math.round(data.imponibileStandard / divisore));
      el.imponibileIrpefC.textContent = fmt(Math.round(data.imponibileAgevolato / divisore));
      el.irpefTotS.textContent = fmt(Math.round(data.irpefTotStandard / divisore));
      el.irpefTotC.textContent = fmt(Math.round(data.irpefTotAgevolato / divisore));
      el.taxIrpefS.textContent = fmt(Math.round(data.irpefStandard / divisore));
      el.taxIrpefC.textContent = fmt(Math.round(data.irpefAgevolato / divisore));
      el.taxRegioneS.textContent = fmt(Math.round(data.irpefRegioneStandard / divisore));
      el.taxRegioneC.textContent = fmt(Math.round(data.irpefRegioneAgevolato / divisore));
      el.taxComuneS.textContent = fmt(Math.round(data.irpefComuneStandard / divisore));
      el.taxComuneC.textContent = fmt(Math.round(data.irpefComuneAgevolato / divisore));
      el.detrazioniTotS.textContent = fmt(Math.round(data.detrazioniStandard / divisore));
      el.detrazioniTotC.textContent = fmt(Math.round(data.detrazioniAgevolato / divisore));
      el.irpefNettoS.textContent = fmt(Math.round(data.irpefNettoStandard / divisore));
      el.irpefNettoC.textContent = fmt(Math.round(data.irpefNettoAgevolato / divisore));
      el.nettoAnnualeS.textContent = fmt(Math.round(data.nettoStandard / divisore));
      el.nettoAnnualeC.textContent = fmt(Math.round(data.nettoAgevolato / divisore));
      el.tasseTotS.textContent = fmtPerc(data.tasseTotStandard);
      el.tasseTotC.textContent = fmtPerc(data.tasseTotAgevolato);
    }
  
    function updateScaglioni(imponibileStandard, imponibileAgevolato) {
      // Calcola IRPEF per scaglioni
      const scaglioniStandard = calcolaIrpefPerScaglioni(imponibileStandard);
      const scaglioniAgevolato = calcolaIrpefPerScaglioni(imponibileAgevolato);
      
      el.irpefS0.textContent = fmt(Math.round(scaglioniStandard[0]));
      el.irpefS1.textContent = fmt(Math.round(scaglioniStandard[1]));
      el.irpefS2.textContent = fmt(Math.round(scaglioniStandard[2]));
      el.irpefS3.textContent = fmt(Math.round(scaglioniStandard[3]));
      el.irpefC0.textContent = fmt(Math.round(scaglioniAgevolato[0]));
      el.irpefC1.textContent = fmt(Math.round(scaglioniAgevolato[1]));
      el.irpefC2.textContent = fmt(Math.round(scaglioniAgevolato[2]));
      el.irpefC3.textContent = fmt(Math.round(scaglioniAgevolato[3]));
      
      const totS = scaglioniStandard.reduce((a, b) => a + b, 0);
      const totC = scaglioniAgevolato.reduce((a, b) => a + b, 0);
      el.TotIrpefS.textContent = fmt(Math.round(totS));
      el.TotIrpefC.textContent = fmt(Math.round(totC));
    }
  
    function calcolaIrpefPerScaglioni(imponibile) {
      const scaglioni = [0, 0, 0, 0];
      let resto = imponibile;
      
      // Scaglione 0: 0-15.000 (23%)
      const s0 = Math.min(resto, 15000);
      scaglioni[0] = s0 * 0.23;
      resto -= s0;
      
      // Scaglione 1: 15.000-28.000 (25%)
      if (resto > 0) {
        const s1 = Math.min(resto, 13000);
        scaglioni[1] = s1 * 0.25;
        resto -= s1;
      }
      
      // Scaglione 2: 28.000-50.000 (35%)
      if (resto > 0) {
        const s2 = Math.min(resto, 22000);
        scaglioni[2] = s2 * 0.35;
        resto -= s2;
      }
      
      // Scaglione 3: >50.000 (43%)
      if (resto > 0) {
        scaglioni[3] = resto * 0.43;
      }
      
      return scaglioni;
    }
  
    function showResults() {
      if (el.display) {
        el.display.style.display = 'block';
        el.display.classList.add('show');
      }
    }
  
    function hideResults() {
      if (el.display) {
        el.display.style.display = 'none';
        el.display.classList.remove('show');
      }
    }
  
    // Gestione mensilità
    window.getMensilita = function() {
      const selected = document.querySelector('input[name="mensilita"]:checked');
      mensilita = selected ? parseInt(selected.value) : 1;
      calcolaEMostra();
    };
  
    // Gestione collapse IRPEF
    function toggleIrpefDetails() {
      const details = document.querySelectorAll('.collapsemeIrpef');
      details.forEach(row => {
        row.style.display = row.style.display === 'none' ? '' : 'none';
      });
    }
  
    function bindEvents() {
      if (el.region) {
        el.region.addEventListener('change', function() {
          popolaComuni(this.value);
          calcolaEMostra();
        });
      }
    if (el.form) {
      el.form.addEventListener('submit', function(e) {
        try { e.preventDefault(); } catch(_) {}
        calcolaEMostra();
      });
    }
      
      if (el.comune) {
        el.comune.addEventListener('change', calcolaEMostra);
      }
      
      if (el.ral) {
        el.ral.addEventListener('input', calcolaEMostra);
        el.ral.addEventListener('change', calcolaEMostra);
      }
      
      if (el.customComune) {
        el.customComune.addEventListener('input', calcolaEMostra);
        el.customComune.addEventListener('change', calcolaEMostra);
      }
      
      if (el.btnIrpefInfo) {
        el.btnIrpefInfo.addEventListener('click', toggleIrpefDetails);
      }
      
      // Radio buttons mensilità
      const radioButtons = document.querySelectorAll('input[name="mensilita"]');
      radioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
          window.getMensilita();
        });
      });
    }
  
  let initialized = false;
  function doInitIfReady() {
    if (initialized) return;
    captureElements();
    if (!el || !el.ral || !el.region) return;
    popolaRegioni();
    hideResults();
    bindEvents();
    // Calcolo iniziale se popolato
    if (el.ral.value && el.region.value) {
      popolaComuni(el.region.value);
      if (el.comune.value) calcolaEMostra();
    }
    initialized = true;
  }

  function init() {
    // Primo tentativo
    doInitIfReady();
    // Se il builder monta in ritardo, osserva il DOM
    if (!initialized) {
      const observer = new MutationObserver(() => {
        if (initialized) { observer.disconnect(); return; }
        doInitIfReady();
        if (initialized) observer.disconnect();
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
      // Fallback ritentativo
      setTimeout(doInitIfReady, 300);
    }
  }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  })();