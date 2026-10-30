# cliente Ferry — Nord Africa → Europa

Prototipo con accesso riservato per esplorare domanda e piani di comunicazione dai mercati **Marocco, Tunisia e Algeria** verso **Francia, Italia e Spagna**. Le destinazioni sono paesi di arrivo simulati, non un elenco di collegamenti navali operati.

## Strategia corrente

Il nuovo orientamento del 29 ottobre 2026 sostituisce il precedente Europa → Maghreb. Il ragionamento, le ipotesi e i materiali necessari sono documentati in [Contesto strategico](GNV_Return_Corridor_Contesto_Strategico.md). Paese di partenza e residenza sono distinti; la priorità del pubblico resta da qualificare.

## Funzionamento

Il frontend è in `demo-content/`, fuori dagli asset pubblici. La funzione Node `api/demo.mjs` verifica le credenziali HTTP Basic prima di servire HTML, script e stili. La directory `public/` contiene solo `.gitkeep`. Tutte le risposte sono `private, no-store`. Il repository collegato è `SDActivation/gnvcorridor`; il progetto Vercel è `corridor-navigator` (stesso ID del progetto preesistente) nel team `sd-activation`. Il nome tecnico preesistente non identifica il marchio visibile, che resta «cliente Ferry», senza logo e link al sito ufficiale.

La navigazione comprende L’idea, Esplora la domanda, Crea il tuo piano e Dati necessari. Non c’è caricamento dei file né salvataggio permanente dei piani. Le librerie Leaflet, Chart.js e i font sono forniti da CDN.

## Dati e modello

945 righe sintetiche, 36 città nordafricane e benchmark dimostrativi. Le serie sono create per la nuova direttrice, non invertite da quelle europee. Il default del Planner è l’intero 2026 con distribuzione del budget nei tre paesi di partenza. Non è previsto un vantaggio automatico gennaio–maggio: tutte le settimane hanno fattore temporale 1.

Il suggerimento segue la domanda sintetica, non un’ottimizzazione validata. La W53 2026 usa W52 2025 come proxy dichiarato. Tutte le stime sono illustrative; indici non equivalgono a persone e preventivi non equivalgono a prenotazioni. Gli export v3 dichiarano direzione e ipotesi.

## Verifica

```sh
npm test
```

I test usano Node.js senza dipendenze aggiuntive. Controlla dataset, filtri, direzione, scenari, neutralità del calendario, suggerimenti ed esportazioni. La resa visiva deve essere verificata nel browser; i dati commerciali reali richiedono un ambiente riservato.

## Accesso alla demo

Utente HTTP Basic: `demo`. Configurare `DEMO_PASSWORD` come Secret su Vercel per Production e Preview; minimo 20 caratteri. La password non è nel codice o in questo documento. `.env.example` contiene solo la chiave vuota. Se manca una password valida, il server restituisce 503 e non serve il contenuto.

La configurazione Vercel riscrive ogni percorso verso la funzione autenticata, che usa una whitelist dei file. Le cartelle `demo-content/` e `api/` non sono asset statici pubblici. La protezione Standard di Vercel Authentication copre gli indirizzi dei deploy precedenti e delle preview; sul dominio di produzione vale l’accesso con password della demo.

La protezione riguarda l’accesso al sito ospitato su Vercel. Il repository GitHub mantiene la propria visibilità: se pubblico, il codice e i dati sintetici sono consultabili lì e nella cronologia. Nessun dato commerciale reale va caricato nel repository pubblico.
