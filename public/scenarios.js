document.addEventListener('DOMContentLoaded', () => {
  const $s = id => document.getElementById(id);
  const fmt = new Intl.NumberFormat('it-IT',{maximumFractionDigits:0});
  const decimal = new Intl.NumberFormat('it-IT',{maximumFractionDigits:1});
  let saved = [], chart;
  const presets = {
    balanced:{label:'Equilibrato',shares:[10,25,35,10,10,10]},
    awareness:{label:'Notorietà',shares:[25,30,20,10,10,5]},
    digital:{label:'Video e social',shares:[0,35,45,5,10,5]},
    community:{label:'Territorio e community',shares:[0,15,30,25,10,20]}
  };
  function capture() { return {...clone(state.scenario),demandProfile:GNVSimulation.activeProfile,demandDestination:$s('simulation-destination').value}; }
  function render(result) {
    if (!$s('simulation-summary')) return;
    const sim = result.simulation;
    $s('simulation-destination').value = sim.destination;
    $s('demand-profile').value = sim.profile;
    if ($s('planner-demand-profile')) $s('planner-demand-profile').value = sim.profile;
    $s('simulation-summary').textContent = `${GNVSimulation.profiles[sim.profile].label} · ${sim.year}: ${fmt.format(sim.organicDemand)} ricerche senza campagna e ${fmt.format(result.incrementalSearches)} ricerche aggiuntive nella simulazione.`;
    const body = $s('simulation-weeks');body.replaceChildren();
    sim.weekly.forEach(w=>{ const tr=document.createElement('tr'); [ `Sett. ${String(w.week).padStart(2,'0')}`,`${fmt.format(w.budget)} €`,fmt.format(w.organicDemand),fmt.format(w.incrementalSearches),fmt.format(w.totalDemand),fmt.format(w.quotes)].forEach(v=>{const td=document.createElement('td');td.textContent=v;tr.append(td)});body.append(tr); });
    if (window.Chart && !chart) chart = new Chart($s('simulation-chart'),{type:'line',data:{labels:[],datasets:[{label:'Senza campagna',data:[],borderColor:'#839caf',borderDash:[5,4],pointRadius:0,tension:.25},{label:'Con la campagna (simulazione)',data:[],borderColor:'#003b71',backgroundColor:'#003b7115',fill:'-1',pointRadius:0,tension:.25}]},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{display:true,position:'bottom'},tooltip:{callbacks:{label:item=>`${item.dataset.label}: ${fmt.format(item.raw)}`}}},scales:{y:{beginAtZero:true,title:{display:true,text:'Ricerche / settimana'}},x:{ticks:{maxTicksLimit:13}}}}});
    if(chart){chart.data.labels=sim.weekly.map(w=>`W${w.week}`);chart.data.datasets[0].data=sim.weekly.map(w=>w.organicDemand);chart.data.datasets[1].data=sim.weekly.map(w=>w.totalDemand);chart.update('none');}
    const selected=Object.entries(presets).find(([,v])=>costBenchmarks.every((b,i)=>state.scenario.channelShares[b.channel]===v.shares[i]));
    document.querySelectorAll('[data-mix]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mix===selected?.[0])));
  }
  function refresh() { invalidateExport();updatePlanner();updateComparison(); }
  function updateComparison() {
    const body=$s('scenario-comparison');body.replaceChildren();
    const current=capture(), rows=[...saved,{name:'Il tuo piano attuale',scenario:current}];
    const base=evaluateScenario(rows[0].scenario,costBenchmarks);
    for(const [i,row] of rows.entries()){
      const r=evaluateScenario(row.scenario,costBenchmarks), sc=row.scenario;
      const tr=document.createElement('tr');
      const delta=base.incrementalSearches>0?`${decimal.format((r.incrementalSearches/base.incrementalSearches-1)*100)}%`:'n.d.';
      [row.name,`${fmt.format(sc.budget)} €`,GNVSimulation.profiles[sc.demandProfile].label,({ALL:'Europa',FR:'Francia',IT:'Italia',ES:'Spagna'}[sc.demandDestination]),`Sett. ${sc.startWeek}–${sc.endWeek}`,`${fmt.format(r.impressions/1000)} mila`,fmt.format(r.incrementalSearches),fmt.format(r.quotes),i===0?'Riferimento':delta].forEach(v=>{const td=document.createElement('td');td.textContent=v;tr.append(td)});
      const td=document.createElement('td');
      if(i<saved.length){const b=document.createElement('button');b.className='btn btn-outline';b.textContent='Usa questo piano';b.addEventListener('click',()=>{state.scenario=clone(sc);state.manualBaseline=null;state.suggested=false;$s('simulation-destination').value=sc.demandDestination;$s('demand-profile').value=sc.demandProfile;GNVSimulation.setProfile(sc.demandProfile);updateFilters();refresh();});td.append(b);}
      tr.append(td);body.append(tr);
    }
    $s('scenario-save').disabled=saved.length>=4;
    $s('scenario-compare-note').textContent=saved.length?'La variazione è rispetto al primo piano salvato. Per un confronto più chiaro, mantieni uguali domanda e destinazione. I piani si cancellano quando ricarichi la pagina.':'Salva il primo piano, poi cambia una scelta alla volta. Qui vedrai fino a quattro piani salvati e quello che stai modificando.';
  }
  window.GNVScenarios={render:r=>{render(r);updateComparison();}};
  $s('tab-planner').addEventListener('click',()=>requestAnimationFrame(()=>chart?.resize()));
  for(const id of ['demand-profile','planner-demand-profile']) $s(id)?.addEventListener('change',e=>{GNVSimulation.setProfile(e.target.value);state.scenario.demandProfile=e.target.value;state.manualBaseline=null;state.suggested=false;updateFilters();refresh();});
  $s('simulation-destination').addEventListener('change',e=>{state.scenario.demandDestination=e.target.value;refresh();});
  document.querySelectorAll('[data-mix]').forEach(b=>b.addEventListener('click',()=>{markManual();state.scenario.channelShares=Object.fromEntries(costBenchmarks.map((c,i)=>[c.channel,presets[b.dataset.mix].shares[i]]));refresh();}));
  $s('scenario-save').addEventListener('click',()=>{if(saved.length>=4)return; const name=$s('scenario-name').value.trim()||`Piano ${saved.length+1}`;saved.push({name,scenario:capture()});$s('scenario-name').value='';updateComparison();});
  $s('scenario-clear').addEventListener('click',()=>{saved=[];updateComparison();});
  $s('scenario-download').addEventListener('click',()=>{
    const items=[...saved,{name:'Il tuo piano attuale',scenario:capture()}];
    const payload={schemaVersion:'3.0',direction:'Nord Africa → Europa',audience:'Da distinguere per residenza e motivo del viaggio',calendarAssumption:'Fattore 1 per tutte le settimane',synthetic:true,assumptions:'Nuove serie sintetiche Nord Africa → Europa, nove coppie paese/paese non equivalenti a tratte operate; calendario neutro, memoria canale e capacità 35% illustrative. Effetti oltre fine anno esclusi.',scenarios:items.map(r=>({...r,results:evaluateScenario(r.scenario,costBenchmarks)}))};
    const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='cliente_Ferry_confronto_scenari_sintetici.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);
  });
  state.scenario.demandProfile='base';state.scenario.demandDestination='ALL';refresh();
});
