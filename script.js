const button=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
button?.setAttribute('aria-label','Ouvrir le menu de navigation');
const closeMenu=()=>{
  nav?.classList.remove('open');
  button?.setAttribute('aria-expanded','false');
};
button?.addEventListener('click',()=>{
  const open=button.getAttribute('aria-expanded')==='true';
  button.setAttribute('aria-expanded',String(!open));
  nav.classList.toggle('open',!open);
});
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&nav?.classList.contains('open')){
    closeMenu();
    button?.focus();
  }
});
const filters=document.querySelectorAll('.filter-btn');
const models=document.querySelectorAll('.catalogue-grid .model-card');
filters.forEach((filter,index)=>filter.setAttribute('aria-pressed',String(filter.classList.contains('active')||(!index&&!document.querySelector('.filter-btn.active')))));
filters.forEach(filter=>filter.addEventListener('click',()=>{
  const selected=filter.dataset.filter;
  filters.forEach(item=>{item.classList.toggle('active',item===filter);item.setAttribute('aria-pressed',String(item===filter));});
  models.forEach((model,index)=>{
    const content=model.textContent.toLowerCase();
    const visible=selected==='all'||(selected==='plain-pied'&&content.includes('plain-pied'))||(selected==='etage'&&(content.includes('r+1')||content.includes('deux niveaux')))||(selected==='compact'&&index<2)||(selected==='tuile'&&content.includes('tuile'));
    model.hidden=!visible;
  });
}));

if(nav){
  const page=location.pathname.split('/').pop()||'index.html';
  const activePage={
    'azur-240.html':'maisons.html','collection-m130.html':'maisons.html',
    'systeme-metallique.html':'systeme.html','comparatif.html':'systeme.html'
  }[page]||page;
  const items=[['index.html','Accueil'],['maisons.html','Nos maisons'],['systeme.html','Le concept'],['plans.html','Plans & délais'],['prestations.html','Prestations'],['projet.html','Votre projet']];
  nav.replaceChildren(...items.map(([href,label])=>{
    const link=document.createElement('a');
    link.href=href;
    link.textContent=label;
    if(activePage===href){link.className='active';link.setAttribute('aria-current','page');}
    return link;
  }));
  nav.setAttribute('aria-label','Navigation principale');
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
}
document.querySelectorAll('.header-cta').forEach(link=>{link.href='projet.html';link.textContent='Étudier mon projet';});
const main=document.querySelector('main');
if(main){main.id=main.id||'contenu-principal';const skip=document.createElement('a');skip.className='skip-link';skip.href='#contenu-principal';skip.textContent='Aller au contenu principal';document.body.prepend(skip);}

document.querySelectorAll('footer').forEach(footer=>{
  if(footer.querySelector('.asena-parent')) return;
  const line=footer.querySelector('p');
  if(!line) return;
  line.innerHTML='Une activité spécialisée d’<a class="asena-parent" href="https://asena.fr" target="_blank" rel="noopener">ASENA — asena.fr</a>';
});

document.querySelectorAll('footer').forEach(footer=>{
  if(footer.querySelector('.footer-links')) return;
  const links=document.createElement('nav');links.className='footer-links';links.setAttribute('aria-label','Informations légales');
  links.innerHTML='<a href="projet.html">Votre projet</a><a href="mentions-legales.html">Mentions légales</a><a href="confidentialite.html">Confidentialité</a>';
  footer.appendChild(links);
});

if(main&&!document.querySelector('.project-status-notice')){
  const notice=document.createElement('aside');
  notice.className='project-status-notice';
  notice.setAttribute('aria-label','Statut des plans et visuels');
  notice.innerHTML='<strong>Avant-projets indicatifs</strong><span>Les plans, surfaces, images et délais présentés ne sont pas contractuels. Chaque projet doit être adapté au terrain et validé par un architecte lorsque son intervention est requise, ainsi que par les bureaux d’études et professionnels compétents avant exécution.</span>';
  main.appendChild(notice);
}

const projectForm=document.querySelector('#project-form');
if(projectForm){
  projectForm.action='https://formsubmit.co/contact.france.asena@gmail.com';
  projectForm.method='post';
  if(!projectForm.querySelector('[name="_honey"]')){
    const honey=document.createElement('input');
    honey.type='text';honey.name='_honey';honey.tabIndex=-1;honey.autocomplete='off';honey.setAttribute('aria-hidden','true');honey.className='form-honeypot';
    projectForm.prepend(honey);
  }
}
const requestedModel=new URLSearchParams(location.search).get('modele');
if(projectForm&&requestedModel){
  const message=projectForm.querySelector('#message');
  if(message&&!message.value) message.value=`Je souhaite étudier le modèle ${requestedModel}.`;
}
const projectSubmit=document.querySelector('#project-submit');
const projectStatus=document.querySelector('#project-form-status');
let projectSubmitting=false;

const setProjectStatus=(message,type='')=>{
  if(!projectStatus) return;
  projectStatus.className=`form-status${type?` ${type}`:''}`;
  projectStatus.textContent=message;
  projectStatus.hidden=!message;
  if(message) projectStatus.focus({preventScroll:true});
};

projectForm?.addEventListener('submit',async event=>{
  event.preventDefault();
  if(projectSubmitting) return;
  setProjectStatus('');
  if(!projectForm.checkValidity()){
    projectForm.reportValidity();
    setProjectStatus('Merci de compléter les champs obligatoires avant l’envoi.','error');
    return;
  }

  projectSubmitting=true;
  const data=new FormData(projectForm);
  const payload={
    _subject:'Nouvelle demande de projet ASENAMODUL',
    _template:'table',
    _url:location.href,
    _honey:'',
    nom:data.get('nom')||'',
    email:data.get('email')||'',
    telephone:data.get('telephone')||'Non précisé',
    commune:data.get('commune')||'',
    terrain:data.get('terrain')||'Non précisé',
    surface:data.get('surface')||'Non précisé',
    chambres:data.get('chambres')||'Non précisé',
    budget:data.get('budget')||'Non précisé',
    delai:data.get('delai')||'Non précisé',
    systeme:data.get('systeme')||'Non précisé',
    toiture:data.get('toiture')||'Non précisé',
    finition:data.get('finition')||'Non précisé',
    message:data.get('message')||'Aucun message complémentaire',
    consentement:data.get('consentement')||'Non'
  };

  try{
    if(projectSubmit){projectSubmit.disabled=true;projectSubmit.textContent='Envoi en cours…';}
    projectForm.setAttribute('aria-busy','true');
    setProjectStatus('Envoi de votre demande…','sending');
    const controller=new AbortController();
    const timeout=window.setTimeout(()=>controller.abort(),15000);
    const response=await fetch('https://formsubmit.co/ajax/contact.france.asena@gmail.com',{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify(payload),signal:controller.signal
    });
    window.clearTimeout(timeout);
    const result=await response.json().catch(()=>({}));
    if(!response.ok||result.success===false||result.success==='false') throw new Error(result.message||'Envoi impossible');
    projectForm.reset();
    setProjectStatus('Merci. Votre demande a bien été envoyée à ASENAMODUL. Nous vous recontacterons après étude de votre projet.','success');
  }catch(error){
    console.error('ASENAMODUL — erreur formulaire :',error);
    const timedOut=error?.name==='AbortError';
    setProjectStatus(timedOut?'Le service met trop de temps à répondre. Merci de réessayer dans quelques instants.':'L’envoi n’a pas abouti. Merci de réessayer dans quelques instants ou de nous contacter directement à contact.france.asena@gmail.com.','error');
  }finally{
    projectSubmitting=false;
    projectForm.removeAttribute('aria-busy');
    if(projectSubmit){projectSubmit.disabled=false;projectSubmit.textContent='Envoyer ma demande';}
  }
});

const enhancementStyles=document.createElement('link');enhancementStyles.rel='stylesheet';enhancementStyles.href='enhancements.css?v=21';document.head.appendChild(enhancementStyles);
const headerStyles=document.createElement('link');headerStyles.rel='stylesheet';headerStyles.href='header-fix.css?v=21';document.head.appendChild(headerStyles);
const v22Styles=document.createElement('link');v22Styles.rel='stylesheet';v22Styles.href='v22.css?v=22';document.head.appendChild(v22Styles);
const seoScript=document.createElement('script');seoScript.src='seo.js?v=22';document.head.appendChild(seoScript);

document.querySelectorAll('.asena-parent').forEach(link=>{
  link.style.color='#d7a945';
  link.style.fontWeight='700';
  link.style.borderBottom='1px solid rgba(215,169,69,.55)';
});
