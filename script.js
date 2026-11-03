(() => {
  'use strict';
  const sections = [...document.querySelectorAll('[data-panel]')];
  const sectionButtons = [...document.querySelectorAll('[data-open]')];
  const region = document.getElementById('detail-region');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const greeter = document.getElementById('greeter');
  const bubble = document.getElementById('greeter-bubble');
  const robotToggle = document.getElementById('robot-toggle');
  const themeToggle = document.getElementById('theme-toggle');
  const knownPanels = new Set(sections.map(s => s.dataset.panel));

  function quietRobot() {
    greeter.classList.add('is-quiet');
    robotToggle.setAttribute('aria-expanded', 'false');
    bubble.setAttribute('aria-hidden', 'true');
  }

  function setPanel(name, shouldScroll = true) {
    const valid = knownPanels.has(name);
    sections.forEach(s => { s.hidden = !valid || s.dataset.panel !== name; });
    sectionButtons.forEach(button => {
      const active = valid && button.dataset.open === name;
      if (button.classList.contains('section-card')) button.setAttribute('aria-expanded', String(active));
      if (button.closest('.top-links')) button.classList.toggle('selected', active);
      if (button.classList.contains('section-card')) button.classList.toggle('active', active);
    });
    if (valid) {
      history.replaceState(null, '', '#' + name);
      quietRobot();
      if (shouldScroll) {
        region.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
        // Focus the panel heading after activating; avoids moving screen-reader focus to hidden content.
        const heading = document.querySelector('#panel-' + name + ' h2');
        heading.setAttribute('tabindex', '-1');
        heading.focus({preventScroll: true});
      }
    } else if (location.hash && knownPanels.has(location.hash.slice(1))) {
      history.replaceState(null, '', '#portfolio');
    }
  }

  sectionButtons.forEach(b => b.addEventListener('click', () => setPanel(b.dataset.open)));
  document.querySelectorAll('.panel-close').forEach(b => b.addEventListener('click', () => {
    setPanel(null, false);
    document.getElementById('portfolio-heading').focus?.();
    document.getElementById('portfolio').scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth'});
  }));
  document.querySelectorAll('.topic').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.topic').forEach(x => { x.classList.remove('active'); x.setAttribute('aria-pressed', 'false'); });
    b.classList.add('active'); b.setAttribute('aria-pressed', 'true');
    document.querySelectorAll('.research-card').forEach(x => { const shown = b.dataset.filter === 'all' || x.dataset.topic === b.dataset.filter; x.hidden = !shown; if (!shown) x.open = false; });
  }));
  // Keep project descriptions selective: collapse any other open card.
  document.querySelectorAll('.research-card').forEach(card => card.addEventListener('toggle', () => { if(card.open) document.querySelectorAll('.research-card').forEach(other => { if(other!==card)other.open=false; }); }));

  function setTheme(value) {
    const theme = value === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    const light = theme === 'light';
    themeToggle.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
    themeToggle.querySelector('.theme-label').textContent = light ? 'Dark mode' : 'Light mode';
    themeToggle.querySelector('.theme-icon').textContent = light ? '☾' : '☀';
    document.querySelector('meta[name="theme-color"]').setAttribute('content', light ? '#f6f8f5' : '#101721');
    try {localStorage.setItem('ps-theme', theme);} catch(e) {}
  }
  setTheme(document.documentElement.dataset.theme);
  themeToggle.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
  document.getElementById('greet-close').addEventListener('click', quietRobot);
  robotToggle.addEventListener('click', () => {
    greeter.classList.toggle('is-quiet');
    const expanded = !greeter.classList.contains('is-quiet');
    robotToggle.setAttribute('aria-expanded', String(expanded));
    bubble.setAttribute('aria-hidden', String(!expanded));
  });
  document.getElementById('back-top').addEventListener('click', () => window.scrollTo({top:0,behavior:reducedMotion.matches?'instant':'smooth'}));
  document.getElementById('year').textContent = String(new Date().getFullYear());
  const hash = location.hash.slice(1);
  if (knownPanels.has(hash)) setPanel(hash, false);
  window.addEventListener('hashchange', () => {const h = location.hash.slice(1); if(knownPanels.has(h)) setPanel(h, true);});
})();
