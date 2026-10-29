# cliente Ferry — Nord Africa → Europa

Prototipo statico per esplorare domanda e piani di comunicazione dai mercati **Marocco, Tunisia e Algeria** verso **Francia, Italia e Spagna**. Le destinazioni sono paesi di arrivo simulati, non un elenco di collegamenti navali operati.

## Strategia corrente

Il nuovo orientamento del 29 ottobre 2026 sostituisce il precedente Europa → Maghreb. Il ragionamento, le ipotesi e i materiali necessari sono documentati in [Contesto strategico](GNV_Return_Corridor_Contesto_Strategico.md). Paese di partenza e residenza sono distinti; la priorità del pubblico resta da qualificare.

## Funzionamento

Vercel pubblica la cartella `public`, senza build o backend. Il repository collegato è `SDActivation/gnvcorridor`; il progetto Vercel è `gnv-return-corridor-navigator` nel team `sd-activation`. Il nome tecnico preesistente non identifica il marchio visibile, che resta «cliente Ferry», senza logo e link al sito ufficiale.

La navigazione comprende L’idea, Esplora la domanda, Crea il tuo piano e Dati necessari. Non c’è caricamento dei file né salvataggio permanente dei piani. Le librerie Leaflet, Chart.js e i font sono forniti da CDN.

## Dati e modello

945 righe sintetiche, 36 città nordafricane e benchmark dimostrativi. Le serie sono create per la nuova direttrice, non invertite da quelle europee. Il default del Planner è l’intero 2026 con distribuzione del budget nei tre paesi di partenza. Non è previsto un vantaggio automatico gennaio–maggio: tutte le settimane hanno fattore temporale 1.

Il suggerimento segue la domanda sintetica, non un’ottimizzazione validata. La W53 2026 usa W52 2025 come proxy dichiarato. Tutte le stime sono illustrative; indici non equivalgono a persone e preventivi non equivalgono a prenotazioni. Gli export v3 dichiarano direzione e ipotesi.

## Verifica

```sh
node tests/northbound.cjs
```

Il test usa Node.js senza dipendenze aggiuntive. Controlla dataset, filtri, direzione, scenari, neutralità del calendario, suggerimenti ed esportazioni. La resa visiva deve essere verificata nel browser; i dati commerciali reali richiedono un ambiente riservato.
