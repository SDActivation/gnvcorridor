/* Navigazione con URL condivisibili e cronologia del browser. */
document.addEventListener('DOMContentLoaded', () => {
  const hashes={home:'#inizia',radar:'#domanda',planner:'#piano',data:'#dati'};
  const titles={data:['Dati necessari','Cosa raccogliere per passare dalla demo a uno strumento di lavoro.'],radar:['Esplora la domanda','Scegli una destinazione e scopri come cambiano le ricerche durante l’anno.'],planner:['Crea il tuo piano','Scegli quanto investire, prova una combinazione di canali e confronta i risultati.']};
  function sync(view) {
    document.body.dataset.view=view;
    const dataPanel = document.getElementById('panel-data');
    if (dataPanel) dataPanel.hidden = view !== 'data';
    document.querySelectorAll('[data-site-view]').forEach(link=>{
      if(link.dataset.siteView===view)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
    });
    if(titles[view]){document.getElementById('view-title').textContent=titles[view][0];document.getElementById('view-description').textContent=titles[view][1];}
    document.getElementById('view-heading').hidden=view==='home';
    const heading=view==='home'?'cliente Ferry · Il viaggio comincia dalla scelta':`cliente Ferry · ${titles[view][0]}`;
    document.title=heading;
    if(location.hash!==hashes[view])history.pushState({view},'',hashes[view]);
  }
  function navigate(view,scroll=true) {
    if(!Object.hasOwn(hashes,view))view='home';
    if(view==='home' || view==='data') {stopPlayback();sync(view);} else switchTab(view);
    if(scroll){window.scrollTo({top:0,behavior:'auto'});const heading=document.getElementById(view==='home'?'page-title':'view-title');heading.focus({preventScroll:true});}
  }
  window.GNVSite={sync,navigate};
  document.querySelectorAll('[data-site-view]').forEach(link=>link.addEventListener('click',event=>{
    if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();navigate(link.dataset.siteView);
  }));
  window.addEventListener('hashchange',()=>navigate(Object.keys(hashes).find(k=>hashes[k]===location.hash)||'home',false));
  navigate(Object.keys(hashes).find(k=>hashes[k]===location.hash)||'home',false);
});
