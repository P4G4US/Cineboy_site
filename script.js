// Burger / drawer
const burger = document.querySelector('.burger');
const drawer = document.getElementById('mobile-drawer');
if (burger && drawer){
  const toggle = () => {
    const open = drawer.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
    drawer.setAttribute('aria-hidden', String(!open));
  };
  burger.addEventListener('click', toggle);
  drawer.querySelectorAll('.drawer-link').forEach(a => a.addEventListener('click', () => drawer.classList.remove('open')));
}

// Smooth scroll for same‑page links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target){
      e.preventDefault();
      window.scrollTo({top: target.getBoundingClientRect().top + window.pageYOffset - 72, behavior: 'smooth'});
    }
  });
});

// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Lightbox
const lightbox = document.getElementById('lightbox');
const lbImg = lightbox.querySelector('.lb-img');
const lbPrev = lightbox.querySelector('.lb-prev');
const lbNext = lightbox.querySelector('.lb-next');
const lbClose = lightbox.querySelector('.lb-close');
const galleryImgs = Array.from(document.querySelectorAll('[data-lightbox]'));
let currentIndex = -1;

function openLightbox(index){
  currentIndex = index;
  lbImg.src = galleryImgs[currentIndex].dataset.lightbox;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
}
function closeLightbox(){
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
}
function showPrev(){ if (currentIndex > 0) openLightbox(currentIndex-1); }
function showNext(){ if (currentIndex < galleryImgs.length-1) openLightbox(currentIndex+1); }

galleryImgs.forEach((imgEl, idx) => {
  imgEl.addEventListener('click', () => openLightbox(idx));
});

lbPrev.addEventListener('click', showPrev);
lbNext.addEventListener('click', showNext);
lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'ArrowRight') showNext();
});

// Contact form (front-end demo)
const form = document.getElementById('contactForm');
if (form){
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = form.querySelector('.form-status');
    status.textContent = 'Sending...';
    setTimeout(() => {
      status.textContent = 'Thanks! We will get back to you within 24 hours.';
      form.reset();
    }, 700);
  });
}
window.addEventListener('load', () => {
  document.querySelector('.about-image')?.classList.add('loaded');
});
