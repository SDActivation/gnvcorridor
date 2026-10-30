/* Guida progressiva: modifica solo la navigazione, mai lo scenario dell'utente. */
document.addEventListener('DOMContentLoaded', () => {
  const guide = document.getElementById('usage-guide');
  const trigger = document.getElementById('open-guide');
  const steps = [
    { label: 'Dove', title: '1. Scegli dove guardare', text: 'In “Esplora la domanda” scegli il paese di partenza nel Nord Africa e il paese di arrivo europeo. La mappa mostra i territori e il grafico mostra le ricerche nel tempo.', tip: 'Per iniziare, prova Marocco come partenza e Francia come arrivo. I numeri sono inventati per questa demo.', tab: 'radar', target: '.filters', action: 'Scegli i paesi' },
    { label: 'Quando', title: '2. Guarda come cambia l’anno', text: 'Sposta il cursore delle settimane oppure premi il pulsante di riproduzione. I punti diventano più o meno visibili in base alle ricerche della settimana.', tip: 'I punti sono città nordafricane e l’indice è inventato. Nessun mese ha un vantaggio automatico: i tempi di decisione andranno verificati.', tab: 'radar', target: '.time-control', action: 'Prova il calendario' },
    { label: 'Budget', title: '3. Prova un piano', text: 'In “Crea il tuo piano” scegli l’arrivo europeo, una combinazione di canali e il budget nei mercati MA/TN/DZ. Poi indica quando vuoi comunicare. I risultati si aggiornano mentre fai le tue scelte.', tip: 'Vuoi modificare ogni percentuale? Apri “Vuoi personalizzare il piano?”. I filtri della mappa non cambiano i paesi del piano.', tab: 'planner', target: '.planner-toolbar', action: 'Imposta il budget' },
    { label: 'Confronta', title: '4. Confronta due idee', text: 'Salva il tuo primo piano. Poi cambia budget, canali o periodo e confronta la nuova versione con quella salvata. Puoi anche provare il suggerimento e tornare al tuo piano.', tip: 'I piani salvati restano disponibili finché non ricarichi la pagina. Scarica il confronto se vuoi conservarli.', tab: 'planner', target: '#scenario-save', action: 'Salva un piano' },
    { label: 'Scarica', title: '5. Conserva il risultato', text: 'Premi “Scarica il piano” per ottenere i file con le tue scelte e le stime. Oppure scarica il confronto tra i piani che hai salvato.', tip: 'I preventivi non sono prenotazioni. Condividi questi risultati come esempi di simulazione, insieme alle ipotesi usate.', tab: 'planner', target: '#export-scenario', action: 'Scarica il piano' }
  ];
  let current = 0;
  let highlighted = null;
  const $ = id => document.getElementById(id);
  function clearHighlight() { highlighted?.classList.remove('guide-focus'); highlighted = null; }
  function showStep(index, navigate = true) {
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
    if (navigate) document.getElementById(`tab-${step.tab}`).click();
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
  guide.hidden = true;
  trigger.setAttribute('aria-expanded', String(!guide.hidden));
  showStep(0, false);
}, { once: true });
