document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- Showcase auto-scroll (for recording only) ----------
   Trigger by visiting the site with ?autoscroll in the URL, e.g.
   https://gorillagymalmelo.nl/?autoscroll
   Not linked from anywhere in the UI — regular visitors never see it. */
if (new URLSearchParams(window.location.search).has('autoscroll')) {
  const HEADER_OFFSET = 100;

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function scrollToY(targetY, duration) {
    return new Promise((resolve) => {
      const startY = window.scrollY;
      const distance = targetY - startY;
      const startTime = performance.now();

      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, startY + distance * easeInOutCubic(progress));
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          resolve();
        }
      }

      requestAnimationFrame(step);
    });
  }

  async function runShowcase() {
    document.documentElement.style.scrollBehavior = 'auto';

    const stops = [
      { y: 0, pause: 3000 },
      { selector: '#aanbod', pause: 2800 },
      { selector: '#rooster', pause: 2600 },
      { selector: '#trainer', pause: 2800 },
      { selector: '#testimonial', pause: 2400 },
      { selector: '#champions', pause: 2800 },
      { selector: '#locatie', pause: 2400 },
      { selector: '#contact', pause: 2600 },
      { selector: '#showcase-end', pause: 3000 },
    ];

    await wait(800);

    for (const stop of stops) {
      let targetY = 0;
      if (stop.selector) {
        const el = document.querySelector(stop.selector);
        if (!el) continue;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        targetY = Math.min(
          el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET,
          maxScroll
        );
      }
      await scrollToY(Math.max(targetY, 0), 1500);
      await wait(stop.pause);
    }
  }

  window.addEventListener('load', () => {
    runShowcase();
  });
}
