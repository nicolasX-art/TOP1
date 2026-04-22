document.documentElement.classList.add('js-anim');
const WHATSAPP_NUMBER = '5599999999999';
const CONTACT_EMAIL = 'contato@seudominio.com';
const qs = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));
const byId = id => document.getElementById(id);
const toQuery = o => Object.entries(o).map(([k,v])=>`${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
const formatMsg = (nome,email,msg)=>`Olá! Meu nome é ${nome}. E-mail: ${email}. Quero um site profissional. Detalhes: ${msg}`;
const setYear = ()=>{const y=byId('year');if(y)y.textContent=String(new Date().getFullYear())};
const buildWaLink = (nome,email,mensagem) => {
  const text = formatMsg(nome,email,mensagem||'');
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};
const revealOnScroll = () => {
  const targets = qsa('[data-animate]');
  if(!('IntersectionObserver' in window)){
    targets.forEach(el=>el.classList.add('in-view'));
    return;
  }
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target);} });
  },{threshold:0.12});
  targets.forEach(el=>io.observe(el));
};
const smoothNav = () => {
  qsa('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const id = a.getAttribute('href');
      if(id.length>1){ e.preventDefault(); document.querySelector(id)?.scrollIntoView({behavior:'smooth',block:'start'}); qs('.nav')?.classList.remove('open'); }
    });
  });
};
const mobileMenu = () => {
  const btn = qs('.menu-toggle');
  const nav = qs('.nav');
  if(!btn||!nav) return;
  btn.addEventListener('click',()=> nav.classList.toggle('open'));
  document.addEventListener('click',e=>{
    if(!nav.contains(e.target) && e.target!==btn) nav.classList.remove('open');
  });
};
const wireWhatsApp = () => {
  qsa('[data-whatsapp-btn]').forEach(btn=>{
    btn.addEventListener('click',e=>{
      e.preventDefault();
      const nome = byId('nome')?.value?.trim() || '';
      const email = byId('email')?.value?.trim() || '';
      const mensagem = byId('mensagem')?.value?.trim() || 'Quero solicitar um orçamento';
      const url = buildWaLink(nome,email,mensagem);
      if(WHATSAPP_NUMBER.includes('9999')) window.location.hash = '#contato';
      else window.open(url,'_blank','noopener');
    });
  });
};
const wireForm = () => {
  const form = byId('contact-form');
  const fb = byId('form-feedback');
  if(!form||!fb) return;
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const nome = byId('nome').value.trim();
    const email = byId('email').value.trim();
    const mensagem = byId('mensagem').value.trim();
    if(!nome||!email||!mensagem){ fb.textContent='Preencha nome, e-mail e mensagem.'; return; }
    if(!/^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,}$/i.test(email)){ fb.textContent='Informe um e-mail válido.'; return; }
    fb.textContent='Enviando…';
    const subject = 'Solicitação de orçamento — Site';
    const body = `Nome: ${nome}%0D%0AE-mail: ${email}%0D%0AMensagem: ${encodeURIComponent(mensagem)}`;
    if(CONTACT_EMAIL.includes('seudominio')) {
      const url = buildWaLink(nome,email,mensagem);
      window.open(url,'_blank','noopener');
      fb.textContent='Abrindo conversa no WhatsApp…';
    } else {
      window.location.href = `mailto:${CONTACT_EMAIL}?${toQuery({subject,body})}`;
      fb.textContent='Abrindo seu cliente de e-mail…';
    }
    form.reset();
  });
};
const headerScroll = () => {
  const tb = document.querySelector('.topbar');
  if(!tb) return;
  const apply = () => tb.classList.toggle('scrolled', window.scrollY>8);
  apply();
  window.addEventListener('scroll',apply,{passive:true});
};
const navActive = () => {
  const links = Array.from(document.querySelectorAll('.nav a[href^=\"#\"]'));
  const map = new Map(links.map(a=>[a.getAttribute('href'),a]));
  const sections = ['#home','#sobre','#servicos','#vantagens','#portfolio','#depoimentos','#contato'].map(id=>document.querySelector(id)).filter(Boolean);
  if(!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        links.forEach(l=>l.classList.remove('active'));
        const id = '#'+e.target.id;
        const a = map.get(id);
        if(a) a.classList.add('active');
      }
    });
  },{threshold:.4});
  sections.forEach(s=>io.observe(s));
};
document.addEventListener('DOMContentLoaded',()=>{
  setYear();
  revealOnScroll();
  smoothNav();
  mobileMenu();
  wireWhatsApp();
  wireForm();
  headerScroll();
  navActive();
});
