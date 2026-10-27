(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const siteHeader = $('#siteHeader');
  const menuToggle = $('#menuToggle');
  const primaryNav = $('#primaryNav');
  const backToTop = $('#backToTop');
  const form = $('#contactForm');
  const formStatus = $('#formStatus');

  const closeMenu = () => {
    primaryNav?.classList.remove('open');
    menuToggle?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  $$('.primary-nav a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', (event) => {
    if (!primaryNav?.classList.contains('open')) return;
    if (!primaryNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });

  const setHeaderState = () => {
    siteHeader?.classList.toggle('scrolled', window.scrollY > 18);
    backToTop?.classList.toggle('visible', window.scrollY > 500);
  };
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = Number(entry.target.dataset.delay || 0);
      window.setTimeout(() => entry.target.classList.add('in-view'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => observer.observe(el));

  const sections = $$('main section[id]');
  const navLinks = $$('.nav-link');
  const activeObserver = new IntersectionObserver((entries) => {
    const current = entries.filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!current) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current.target.id}`));
  }, { rootMargin: '-20% 0px -60% 0px', threshold: [0.15, 0.45] });
  sections.forEach(section => activeObserver.observe(section));

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  $$('.package-select').forEach(button => {
    button.addEventListener('click', () => {
      const selected = button.dataset.package || '';
      const type = $('#projectType');
      const message = $('#message');
      if (type) type.value = 'Business website';
      if (message) {
        message.value = `Hi Masana WebWorks, I am interested in the ${selected}. Please advise on the most suitable scope for my project.`;
        message.focus();
      }
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = $('.form-submit', form);
    const original = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
    formStatus.className = 'form-note';
    formStatus.textContent = 'Sending your enquiry...';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Request failed');
      form.reset();
      formStatus.className = 'form-note success';
      formStatus.textContent = 'Thank you. Your enquiry has been sent successfully.';
    } catch (error) {
      formStatus.className = 'form-note error';
      formStatus.textContent = 'Quick send could not be completed. The standard form submission will open next.';
      window.setTimeout(() => form.submit(), 650);
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = original;
    }
  });

  $('#currentYear').textContent = new Date().getFullYear();
})();
