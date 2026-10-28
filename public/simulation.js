/* Modello dimostrativo v2: dati inventati, deterministici e riproducibili. */
(function () {
  const profiles = { low: { label: 'Domanda debole', factor: .78 }, base: { label: 'Scenario base', factor: 1 }, high: { label: 'Domanda sostenuta', factor: 1.22 } };
  const baseline = new Map(demandData.map(r => [`${r.source}|${r.destination}|${r.week}`, { ...r }]));
  // Completamento esplicito delle settimane 2026 non presenti nel prototipo.
  for (const source of ['FR','IT','ES','BE','DE']) for (const destination of ['MA','TN','DZ']) {
    for (let week = 45; week <= 53; week++) {
      const prior = baseline.get(`${source}|${destination}|2025-${String(Math.min(52, week)).padStart(2,'0')}`);
      const change = -.18 + .04 * Math.sin(week * .57 + source.charCodeAt(0));
      const row = { ...prior, source, destination, week: `2026-${week}`, searchVolume: Math.round(prior.searchVolume * (1 + change)), yoyFerry: change, yoyFlight: -.05, syntheticExtension: true };
      demandData.push(row); baseline.set(`${source}|${destination}|${row.week}`, { ...row });
    }
  }
  const api = { profiles, activeProfile: 'base' };
  function profileVolume(row, profile) {
    const original = baseline.get(`${row.source}|${row.destination}|${row.week}`);
    if (!original) return 0;
    if (!row.week.startsWith('2026-')) return original.searchVolume;
    const week = Number(row.week.slice(5));
    const shift = profile === 'high' ? .09 : profile === 'low' ? -.07 : 0;
    const pulse = 1 + shift * Math.sin((week - 3) / 53 * Math.PI * 2);
    return Math.round(original.searchVolume * (profiles[profile]?.factor || 1) * pulse);
  }
  api.setProfile = profile => {
    api.activeProfile = profiles[profile] ? profile : 'base';
    for (const row of demandData) {
      row.searchVolume = profileVolume(row, api.activeProfile);
      if (row.week.startsWith('2026-')) {
        const prior = baseline.get(`${row.source}|${row.destination}|2025-${row.week.slice(5) === '53' ? '52' : row.week.slice(5)}`);
        row.yoyFerry = row.searchVolume / prior.searchVolume - 1;
        row.yoyFlight = baseline.get(`${row.source}|${row.destination}|${row.week}`).yoyFlight + (api.activeProfile === 'high' ? .04 : api.activeProfile === 'low' ? -.04 : 0);
      }
    }
  };
  const carry = { CTV: .7, YouTube: .55, 'Meta/TikTok': .3, DOOH: .45, 'Premium display/video': .4, 'Audio/Community media': .5 };
  api.evaluate = (scenario, benchmarks, mediaBaseline) => {
    const result = mediaBaseline(scenario, benchmarks);
    const profile = scenario.demandProfile || api.activeProfile;
    const destination = scenario.demandDestination || 'ALL';
    const marketKeys = Object.keys(scenario.marketShares || {});
    const marketSum = marketKeys.reduce((s,k) => s + Math.max(0,scenario.marketShares[k]), 0) || 1;
    const channelSum = benchmarks.reduce((s,b) => s + Math.max(0,scenario.channelShares[b.channel] || 0),0) || 1;
    const maxWeek = isoWeeksInYear(scenario.year);
    const demand = new Map();
    for (const row of demandData) {
      if (!row.week.startsWith(`${scenario.year}-`) || (destination !== 'ALL' && row.destination !== destination)) continue;
      const key = `${row.source}|${Number(row.week.slice(5))}`;
      demand.set(key, (demand.get(key) || 0) + profileVolume(row, profile));
    }
    const spend = new Map(result.byWeek.map(row => [row.week,row]));
    const channelIncrements = Object.fromEntries(benchmarks.map(b => [b.channel,0]));
    const marketIncrements = Object.fromEntries(marketKeys.map(k => [k,0]));
    const weekly = [];
    const stocks = Object.fromEntries(marketKeys.map(k => [k,Object.fromEntries(benchmarks.map(b=>[b.channel,0]))]));
    for (let week=1;week<=maxWeek;week++) {
      let organic = 0, incremental = 0;
      const allocation = spend.get(week);
      for (const market of marketKeys) {
        const volume = demand.get(`${market}|${week}`) || 0;
        organic += volume;
        const factors = {};
        const timing = weekPhase(scenario.year,week) === 'decision' ? 1 : .45;
        for (const b of benchmarks) {
          const budget = (allocation?.budget || 0) * Math.max(0,scenario.marketShares[market])/marketSum * Math.max(0,scenario.channelShares[b.channel] || 0)/channelSum;
          const direct = budget / b.cpm * 1000 / 3 / 1000 * b.searchLiftPerMilleReach * timing;
          // Stock normalizzato: con pressione costante non crea un moltiplicatore infinito.
          stocks[market][b.channel] = stocks[market][b.channel] * carry[b.channel] + direct * (1-carry[b.channel]);
          factors[b.channel] = stocks[market][b.channel];
        }
        const raw = Object.values(factors).reduce((a,b)=>a+b,0);
        // Capacità illustrativa: al massimo il 35% della domanda organica settimanale.
        const capacity = volume * .35;
        const added = capacity > 0 ? capacity * -Math.expm1(-raw/capacity) : 0;
        incremental += added; marketIncrements[market] += added;
        for (const b of benchmarks) channelIncrements[b.channel] += raw > 0 ? added * factors[b.channel]/raw : 0;
      }
      weekly.push({ week, budget: allocation?.budget || 0, organicDemand:organic, incrementalSearches:incremental, totalDemand:organic+incremental, quotes:incremental*scenario.quoteRate });
    }
    const incrementalSearches = weekly.reduce((s,w)=>s+w.incrementalSearches,0);
    const organicDemand = weekly.reduce((s,w)=>s+w.organicDemand,0);
    return { ...result, incrementalSearches, quotes: incrementalSearches*scenario.quoteRate,
      byChannel:result.byChannel.map(r=>({...r,incrementalSearches:channelIncrements[r.channel]})),
      byMarket:result.byMarket.map(r=>({...r,incrementalSearches:marketIncrements[r.source],quotes:marketIncrements[r.source]*scenario.quoteRate})),
      simulation:{ version:2, synthetic:true, profile, destination, year:scenario.year, capacityShare:.35, carry, organicDemand, totalDemand:organicDemand+incrementalSearches, weekly, horizon:`W01–W${maxWeek}`, note:'Domanda inventata; saturazione esponenziale e memoria media illustrative. Nessun forecast validato. Effetti oltre la fine dell’anno esclusi.' }
    };
  };
  window.GNVSimulation = api;
})();
