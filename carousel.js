(() => {
  const carousel = document.querySelector('.work-carousel');
  if (!carousel) return;

  const slides = [...carousel.querySelectorAll('.work-slide')];
  const previous = document.querySelector('.carousel-prev');
  const next = document.querySelector('.carousel-next');
  const current = document.querySelector('.carousel-status strong');
  const progress = document.querySelector('.carousel-progress i');

  const nearestSlide = () => {
    const left = carousel.scrollLeft;
    return slides.reduce((best, slide, index) => {
      const distance = Math.abs(slide.offsetLeft - carousel.offsetLeft - left);
      return distance < best.distance ? { index, distance } : best;
    }, { index: 0, distance: Infinity }).index;
  };

  const updateStatus = () => {
    const index = nearestSlide();
    current.textContent = String(index + 1).padStart(2, '0');
    progress.style.transform = `translateX(${index * 100}%)`;
  };

  const move = (direction) => {
    const target = Math.max(0, Math.min(slides.length - 1, nearestSlide() + direction));
    slides[target].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  carousel.addEventListener('scroll', updateStatus, { passive: true });
  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
  });
  window.addEventListener('resize', updateStatus);
  updateStatus();
})();

(() => {
  const menu = document.querySelector('.site-menu');
  const toggle = document.querySelector('.menu-toggle');
  const closeButton = document.querySelector('.menu-close');
  const backdrop = document.querySelector('.menu-backdrop');

  if (!menu || !toggle || !closeButton || !backdrop) return;

  const pageRegions = [
    document.querySelector('main'),
    document.querySelector('.footer'),
    document.querySelector('.mobile-call')
  ].filter(Boolean);

  const focusable = () => [...menu.querySelectorAll('a[href], button:not([disabled])')];

  const openMenu = () => {
    document.body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
    menu.setAttribute('aria-hidden', 'false');
    pageRegions.forEach((region) => { region.inert = true; });
    window.setTimeout(() => closeButton.focus(), 50);
  };

  const closeMenu = ({ restoreFocus = true } = {}) => {
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    menu.setAttribute('aria-hidden', 'true');
    pageRegions.forEach((region) => { region.inert = false; });
    if (restoreFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => {
    if (document.body.classList.contains('menu-open')) closeMenu();
    else openMenu();
  });
  closeButton.addEventListener('click', () => closeMenu());
  backdrop.addEventListener('click', () => closeMenu());
  menu.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => closeMenu({ restoreFocus: false }));
  });

  document.addEventListener('keydown', (event) => {
    if (!document.body.classList.contains('menu-open')) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key !== 'Tab') return;
    const items = focusable();
    const first = items[0];
    const last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
