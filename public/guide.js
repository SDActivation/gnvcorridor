/* Guida progressiva: modifica solo la navigazione, mai lo scenario dell'utente. */
document.addEventListener('DOMContentLoaded', () => {
  const guide = document.getElementById('usage-guide');
  const trigger = document.getElementById('open-guide');
  const steps = [
    { label: 'Corridoio', title: '1. Scegli il corridoio da esplorare', text: 'Parti da Demand Radar. Seleziona la destinazione e il mercato sorgente: grafico e confronto Ferry vs Flight si aggiornano sul corridoio scelto. Il cluster territoriale filtra soltanto i punti della mappa.', tip: 'Da provare: Marocco come destinazione e Francia come mercato. Tutti i numeri della demo sono sintetici.', tab: 'radar', target: '.filters', action: 'Vai ai filtri' },
    { label: 'Quando', title: '2. Osserva quando nasce la domanda', text: 'Sposta il cursore delle settimane oppure premi Play. L’opacità dei punti segue l’intensità stagionale; il raggio indica un indice illustrativo, non un numero di persone. Confronta poi la domanda 2025 e 2026 sotto la mappa.', tip: 'Gennaio–maggio è la finestra di decisione assunta dal modello; giugno–settembre è la finestra di viaggio. Le settimane mancanti non valgono zero.', tab: 'radar', target: '.time-control', action: 'Esplora il calendario' },
    { label: 'Budget', title: '3. Costruisci il tuo scenario', text: 'Apri Corridor Planner, imposta il budget e distribuiscilo fra mercati e canali. Scegli il periodo di attivazione e osserva i risultati stimati. Le ripartizioni mantengono sempre il totale al 100%.', tip: 'Il profilo di domanda scelto nel Radar aggiorna la simulazione. Nel Planner scegli la destinazione, prova un mix e salva gli scenari per confrontarli. I mercati del piano restano indipendenti dai filtri del Radar.', tab: 'planner', target: '.planner-toolbar', action: 'Imposta il budget' },
    { label: 'Confronto', title: '4. Confronta la tua allocazione', text: 'Premi “Suggerisci allocazione” per applicare i pesi territoriali e temporali dichiarati. Il tuo scenario manuale viene conservato e puoi ripristinarlo. Il suggerimento mantiene budget, mix canali e intervallo di date.', tip: 'La risposta cambia con domanda settimanale, memoria dei canali e saturazione locale. Il suggerimento è una regola euristica, non garantisce un miglioramento. Consulta “Come lo calcoliamo” per le formule.', tab: 'planner', target: '#suggest-allocation', action: 'Vai al confronto' },
    { label: 'Esporta', title: '5. Porta lo scenario nella discussione', text: 'Usa “Esporta scenario” per scaricare JSON e CSV con allocazioni, ipotesi e risultati. I link restano disponibili sotto i comandi. Condividi sempre le assunzioni insieme alle stime.', tip: 'Le quote sono richieste di preventivo, non vendite. Prima di usare i numeri per decisioni operative, sostituisci i dati sintetici e valida i benchmark.', tab: 'planner', target: '#export-scenario', action: 'Vai all’esportazione' }
  ];
  let current = 0;
  let highlighted = null;
  const $ = id => document.getElementById(id);
  function clearHighlight() { highlighted?.classList.remove('guide-focus'); highlighted = null; }
  function showStep(index) {
    current = index;
    clearHighlight();
    const step = steps[current];
    $('guide-title').textContent = step.title;
    $('guide-copy').textContent = step.text;
    $('guide-tip').textContent = step.tip;
    $('guide-target').textContent = step.action;
    $('guide-count').textContent = `${current + 1} di ${steps.length}`;
    $('guide-prev').disabled = current === 0;
    $('guide-next').textContent = current === steps.length - 1 ? 'Termina guida' : 'Continua →';
    document.querySelectorAll('.guide-step').forEach((button, i) => {
      if (i === current) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    document.getElementById(`tab-${step.tab}`).click();
  }
  function closeGuide() {
    guide.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    clearHighlight();
    try { localStorage.setItem('gnv-guide-v1-dismissed', '1'); } catch { /* Storage facoltativo. */ }
    trigger.focus({ preventScroll: true });
  }
  steps.forEach((step, index) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'guide-step';
    button.dataset.number = index + 1;
    button.textContent = `${index + 1}. ${step.label}`;
    button.setAttribute('aria-label', `Passaggio ${index + 1}: ${step.label}`);
    button.addEventListener('click', () => showStep(index));
    item.append(button); $('guide-steps').append(item);
  });
  trigger.addEventListener('click', () => {
    guide.hidden = false; trigger.setAttribute('aria-expanded', 'true');
    showStep(current);
    guide.scrollIntoView({ block: 'start', behavior: 'auto' });
    $('guide-title').focus({ preventScroll: true });
  });
  $('guide-close').addEventListener('click', closeGuide);
  $('guide-prev').addEventListener('click', () => showStep(Math.max(0, current - 1)));
  $('guide-next').addEventListener('click', () => current === steps.length - 1 ? closeGuide() : showStep(current + 1));
  $('guide-target').addEventListener('click', () => {
    document.getElementById(`tab-${steps[current].tab}`).click();
    clearHighlight();
    highlighted = document.querySelector(steps[current].target);
    if (!highlighted) return;
    highlighted.classList.add('guide-focus');
    highlighted.scrollIntoView({ block: 'center', behavior: 'auto' });
    const focusable = highlighted.matches('button,input,select') ? highlighted : highlighted.querySelector('button,input,select');
    focusable?.focus({ preventScroll: true });
  });
  try { guide.hidden = localStorage.getItem('gnv-guide-v1-dismissed') === '1'; } catch { guide.hidden = false; }
  trigger.setAttribute('aria-expanded', String(!guide.hidden));
  showStep(0);
}, { once: true });
