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
