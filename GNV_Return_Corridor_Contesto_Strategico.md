# cliente Ferry — Nord Africa → Europa

Versione 3.0 — 29 ottobre 2026.

Questo documento sostituisce il precedente impianto Europa → Maghreb. La nuova indicazione dell’utente è sviluppare strategia e tool sui viaggi dai paesi nordafricani verso l’Europa, perché la direttrice inversa è già coperta strategicamente. L’identità visibile resta «cliente Ferry», senza logo o link al sito ufficiale.

## Obiettivo strategico

Costruire la scelta del viaggio in traghetto nei mercati di partenza nordafricani e collegare comunicazione, informazioni, assistenza e prenotazione. Il ragionamento parte da chi viaggia, dai bisogni e dalle possibilità commerciali effettive.

Non si assume che il traghetto sia in calo, che perda più dell’aereo o che gennaio–maggio sia la finestra corretta. Queste erano tesi del precedente brief e non sono evidenze trasferibili alla nuova direttrice.

## Pubblico

Il paese di partenza è Marocco, Tunisia o Algeria. Non equivale al paese di residenza. Residenti in Nord Africa diretti in Europa e residenti in Europa che rientrano dopo un soggiorno possono avere comportamenti differenti. La priorità fra questi pubblici resta da confermare con l’utente; il tool non attribuisce dimensioni o risultati a segmenti separati.

Vanno acquisiti, ove disponibili in forma aggregata, residenza, motivo del viaggio, mercati di acquisto, lingue, persone al seguito e presenza di veicolo. Non inferire nazionalità o residenza dalle coordinate di una città.

## Tre scelte

1. Dove: partire dai bacini nordafricani, distinguere luogo della ricerca, residenza, paese di partenza e porto d’imbarco.
2. Quando: ricostruire i tempi tra ricerca, preventivo, prenotazione e partenza, senza trasporre il calendario del flusso inverso.
3. Come: verificare lingue, accessibilità delle informazioni, canali media acquistabili, assistenza e canali di vendita. Automobile, bagagli e viaggio insieme sono possibili temi da verificare, non bisogni universali già dimostrati.

Il confronto nave/aereo serve a esplorare la scelta di modalità, non a sostenere un vantaggio competitivo già osservato. Le informazioni pratiche dovranno essere aggiornate e validate dal cliente; la demo non fornisce indicazioni su requisiti di ingresso o documenti.

## Perimetro della demo

- Origini: MA, TN, DZ.
- Paesi di arrivo simulati: FR, IT, ES. Non si modellano ancora porti, disponibilità delle tratte o destinazioni finali oltre il paese di arrivo.
- Nove coppie paese/paese di pianificazione: non nove tratte navali dichiarate come operate.
- 945 righe di domanda: 9 coppie × 105 settimane, 2025 W01–W52 e 2026 W01–W53.
- Nuove serie deterministiche inventate, non dati europei trasposti. Andamenti sia positivi sia negativi, senza incorporare il vecchio calo del brief.
- W53 2026 confrontata con W52 2025 come proxy esplicito; non una settimana omologa osservata.
- 36 città nordafricane, 12 per paese, con `opportunityIndex` e `searchIntensity` sintetici. Gli indici non sono popolazioni, residenza o intenzioni di viaggio misurate.
- Tre profili di domanda: basso, base, alto. Le variazioni si applicano alla nuova baseline con una modulazione stagionale dimostrativa.

## Planner

Il budget è distribuito nei tre mercati di partenza. Default dimostrativo: 500.000 euro, anno 2026 intero, quote MA 34%, TN 33%, DZ 33%. Non è un’allocazione raccomandata o approvata.

Il mix iniziale è 10% CTV, 25% YouTube, 35% Meta/TikTok, 10% DOOH, 10% display/video selezionati e 10% audio/media di comunità. Anche la disponibilità effettiva di questi canali va verificata nei singoli mercati.

Tutte le settimane hanno fattore temporale 1. I gruppi gennaio–maggio, giugno–settembre e ottobre–dicembre sono etichette di calendario, non finestre decisionali o di efficacia validate. La domanda sintetica varia e può cambiare il risultato attraverso la saturazione, non attraverso una penalità stagionale prefissata.

Il suggerimento segue i volumi sintetici della destinazione e del periodo scelti, normalizzando le quote per paese e per settimana. Mantiene budget, canali e date. Non è un’ottimizzazione predittiva e può produrre un risultato peggiore dello scenario manuale.

Impression = budget / CPM × 1.000; copertura lorda = impression / 3. I coefficienti media sono illustrativi. Il contributo alle ricerche usa memoria per canale e risposta esponenziale con capacità settimanale pari al 35% della domanda organica sintetica. Preventivi = ricerche aggiuntive × tasso scelto. Non sono prenotazioni, ricavi o risultati incrementali misurati. Gli effetti oltre dicembre sono esclusi. Il lift è un indice ipotetico ponderato, non una curva calibrata al budget.

## Dati da raccogliere

1. Domanda settimanale rilevata nei mercati MA/TN/DZ verso destinazioni europee: paese della ricerca e della partenza separati, lingua, modalità, volumi e perimetro delle query.
2. Preventivi, prenotazioni e partenze della stessa direttrice, con porti, disponibilità commerciale, residenza e motivo del viaggio ove disponibili in forma aggregata.
3. Costi, copertura, frequenza, lingue, disponibilità e soglie di acquisto dei media nei mercati nordafricani, senza riusare automaticamente benchmark europei.
4. Bacini geografici locali e layer documentati con copertura verificata; un precedente layer europeo non dimostra copertura nel Nord Africa.
5. Campagne storiche della stessa direttrice e misurazioni dedicate per calibrare il modello.

Ricerche, preventivi e prenotazioni sono eventi distinti. Dati mancanti non diventano zero. Non servono nomi o email dei clienti. La pagina pubblica «Dati necessari» è una checklist, non un caricamento o un archivio di dati commerciali.

## Verifica e limiti

`node tests/northbound.cjs` controlla perimetro, dati, default, neutralità del calendario, conservazione del budget, somme per mercato e canale, saturazione, profili, suggerimento, filtri, export v3 e snapshot. La verifica del codice e dei dati non sostituisce la prova visuale e delle interazioni in un browser reale.

## Fonti e stato delle evidenze

Fonte strategica: correzione dell’utente del 29 ottobre 2026. Le affermazioni di mercato non verificate sono state rimosse; i dati del tool sono sintetici. La priorità del pubblico, le rotte effettive, i canali e il calendario operativo richiedono conferma e dati dedicati. Nessuna fonte del precedente contesto Europa → Maghreb viene promossa a evidenza della direttrice Nord Africa → Europa.
