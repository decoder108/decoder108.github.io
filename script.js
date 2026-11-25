/**
 * Priyanka Singh | Interactive Research Portfolio
 * File: script.js
 * Author / Portfolio owner: Priyanka Singh
 *
 * Purpose: Accessible portfolio section switching, theme preferences,
 * a visitor-activated FAQ assistant, and the headline typing effect.
 *
 * This is a static website. No personal visitor messages are stored or sent.
 * The robot is a guided FAQ, not a generative AI chatbot.
 */

(() => {
  'use strict';

  // ---------------------------------------------------------------------------
  // 01. Shared DOM references and accessibility preferences
  // ---------------------------------------------------------------------------
  const sections = [...document.querySelectorAll('[data-panel]')];
  const sectionButtons = [...document.querySelectorAll('[data-open]')];
  const knownPanels = new Set(sections.map((section) => section.dataset.panel));
  const detailRegion = document.getElementById('detail-region');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const themeToggle = document.getElementById('theme-toggle');
  const greeter = document.getElementById('greeter');
  const robotToggle = document.getElementById('robot-toggle');
  const chatWindow = document.getElementById('chat-window');
  const messages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');

  // ---------------------------------------------------------------------------
  // 02. Portfolio navigation: one expandable section at a time
  // ---------------------------------------------------------------------------
  /** Hide the robot chat when visitors navigate to a portfolio section. */
  function closeChat() {
    greeter.classList.add('is-quiet');
    chatWindow.hidden = true;
    robotToggle.setAttribute('aria-expanded', 'false');
    robotToggle.setAttribute('aria-label', 'Open portfolio chat');
  }

  /**
   * Show a named panel; close all others. Unknown names collapse every panel.
   * @param {string|null} name - A value from a section's data-panel attribute.
   * @param {boolean} shouldScroll - Whether to scroll and focus the new panel.
   */
  function setPanel(name, shouldScroll = true) {
    const valid = knownPanels.has(name);

    sections.forEach((section) => {
      section.hidden = !valid || section.dataset.panel !== name;
    });

    sectionButtons.forEach((button) => {
      const isActive = valid && button.dataset.open === name;
      if (button.classList.contains('section-card')) {
        button.setAttribute('aria-expanded', String(isActive));
        button.classList.toggle('active', isActive);
      }
      if (button.closest('.top-links')) {
        button.classList.toggle('selected', isActive);
      }
    });

    if (valid) {
      history.replaceState(null, '', `#${name}`);
      closeChat();
      if (shouldScroll) {
        detailRegion.scrollIntoView({
          behavior: reducedMotion.matches ? 'auto' : 'smooth',
          block: 'start'
        });
        // Move keyboard focus to the newly visible heading for accessibility.
        const heading = document.querySelector(`#panel-${name} h2`);
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }
    } else if (knownPanels.has(location.hash.slice(1))) {
      history.replaceState(null, '', '#portfolio');
    }
  }

  sectionButtons.forEach((button) => {
    button.addEventListener('click', () => setPanel(button.dataset.open));
  });

  document.querySelectorAll('.panel-close').forEach((button) => {
    button.addEventListener('click', () => {
      setPanel(null, false);
      document.getElementById('portfolio').scrollIntoView({
        behavior: reducedMotion.matches ? 'auto' : 'smooth'
      });
    });
  });

  // ---------------------------------------------------------------------------
  // 03. Research topic filters and expandable research cards
  // ---------------------------------------------------------------------------
  document.querySelectorAll('.topic').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.topic').forEach((topic) => {
        const isActive = topic === button;
        topic.classList.toggle('active', isActive);
        topic.setAttribute('aria-pressed', String(isActive));
      });

      // Hide non-matching topics without changing the underlying research data.
      document.querySelectorAll('.research-card').forEach((card) => {
        const visible = button.dataset.filter === 'all' ||
          card.dataset.topic === button.dataset.filter;
        card.hidden = !visible;
        if (!visible) card.open = false;
      });
    });
  });

  // Native <details> widgets support keyboard controls without extra libraries.
  document.querySelectorAll('.research-card').forEach((card) => {
    card.addEventListener('toggle', () => {
      if (!card.open) return;
      document.querySelectorAll('.research-card').forEach((other) => {
        if (other !== card) other.open = false;
      });
    });
  });

  // ---------------------------------------------------------------------------
  // 04. Light/dark theme: update labels and remember the visitor's preference
  // ---------------------------------------------------------------------------
  function setTheme(value) {
    const theme = value === 'light' ? 'light' : 'dark';
    const isLight = theme === 'light';
    document.documentElement.dataset.theme = theme;

    themeToggle.setAttribute(
      'aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode'
    );
    themeToggle.querySelector('.theme-label').textContent =
      isLight ? 'Dark mode' : 'Light mode';
    themeToggle.querySelector('.theme-icon').textContent = isLight ? '☾' : '☀';
    document.querySelector('meta[name="theme-color"]').setAttribute(
      'content', isLight ? '#f6f8f5' : '#101721'
    );

    // Storage may be unavailable in private browsing; theme still works.
    try {
      localStorage.setItem('ps-theme', theme);
    } catch (_error) {
      // No action required: persistency is optional.
    }
  }

  setTheme(document.documentElement.dataset.theme);
  themeToggle.addEventListener('click', () => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  // ---------------------------------------------------------------------------
  // 05. Robot assistant: prewritten answers and safe visitor interaction
  // ---------------------------------------------------------------------------
  // Edit these rules to update FAQ content. Order matters: first match wins.
  // Responses stay public-facing and deliberately avoid unpublished details.
  const answerRules = [
    {
      match: /^(hi|hey|hello|good morning|good evening)[!. ]*$/i,
      answer: 'Hello! 👋 Welcome to my portfolio. Ask about my research, background, scientific works, or how to connect.'
    },
    {
      match: /about|who (are|is)|background|education|degree|journey/i,
      answer: 'Priyanka is a PhD candidate in Informatics at the University of Iowa, working at the intersection of machine learning, bioinformatics, and biomedical research.',
      panel: 'about'
    },
    {
      match: /research|amr|antimicrobial|genom|microbiome|clinical|AI|machine.learning|project/i,
      answer: 'Her research explores antimicrobial resistance, microbiome informatics, and clinical data through computational and machine-learning approaches. Ongoing projects are described at a high level.',
      panel: 'research'
    },
    {
      match: /publication|paper|scientific|work|talk|presentation|scholar/i,
      answer: 'You can browse selected publications, preprints, and talks in Scientific works.',
      panel: 'works'
    },
    {
      match: /award|fellowship|achievement|recognition/i,
      answer: 'Selected awards and recognitions are listed in Recognition.',
      panel: 'recognition'
    },
    {
      match: /skill|python|code|tool|programming|R language/i,
      answer: 'Her toolkit includes Python, R, machine learning, bioinformatics analysis, Linux, and reproducible research workflows.',
      panel: 'toolkit'
    },
    {
      match: /hobb|bird|dance|music|outside|fun/i,
      answer: 'Outside research, Priyanka enjoys birdwatching, dancing, and listening to music.',
      panel: 'hobbies'
    },
    {
      match: /contact|connect|collaborat|email|hire|opportunit|reach/i,
      answer: 'For research collaborations or professional opportunities, you can email Priyanka at priyanka-singh@uiowa.edu.',
      panel: 'contact',
      email: true
    }
  ];

  /**
   * Add a safe chat message. User text uses textContent, never innerHTML,
   * so visitors cannot inject markup or scripts into the page.
   */
  function appendMessage(content, sender, panel, email) {
    const bubble = document.createElement('div');
    bubble.className = `chat-message ${sender}`;

    const text = document.createElement('span');
    text.textContent = content;
    bubble.appendChild(text);

    if (sender === 'bot' && (panel || email)) {
      const actions = document.createElement('div');
      actions.style.marginTop = '9px';

      if (panel) {
        const navigate = document.createElement('button');
        navigate.type = 'button';
        navigate.className = 'greet-cta';
        navigate.textContent = `Explore ${panel === 'works' ? 'Scientific works' : panel} ↗`;
        navigate.addEventListener('click', () => setPanel(panel));
        actions.appendChild(navigate);
      }

      if (email) {
        const link = document.createElement('a');
        link.href = 'mailto:priyanka-singh@uiowa.edu';
        link.textContent = ' Email Priyanka ↗';
        link.style.marginLeft = '7px';
        actions.appendChild(link);
      }
      bubble.appendChild(actions);
    }

    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  }

  /** Find the first matching FAQ answer, or provide a transparent fallback. */
  function respond(question) {
    const query = question.trim();
    if (!query) return;

    appendMessage(query, 'user');
    const rule = answerRules.find(({ match }) => match.test(query));
    if (rule) {
      appendMessage(rule.answer, 'bot', rule.panel, rule.email);
      return;
    }

    appendMessage(
      'I can help you explore the public sections of this portfolio, but I cannot answer open-ended questions like a live AI. Try asking about research, publications, experience, or contact. For other questions, email Priyanka.',
      'bot', 'contact', true
    );
  }

  /** Show the first greeting only when the robot is clicked. */
  function openChat() {
    greeter.classList.remove('is-quiet');
    chatWindow.hidden = false;
    robotToggle.setAttribute('aria-expanded', 'true');
    robotToggle.setAttribute('aria-label', 'Close portfolio chat');

    if (!messages.children.length) {
      appendMessage(
        'Hi! 👋 Thank you for visiting my website. Want to know more about me? Click About me, or ask a question below.',
        'bot', 'about'
      );
    }
    chatInput.focus();
  }

  document.getElementById('chat-close').addEventListener('click', () => {
    closeChat();
    robotToggle.focus();
  });
  robotToggle.addEventListener('click', () => {
    if (chatWindow.hidden) openChat();
    else closeChat();
  });
  document.querySelectorAll('[data-question]').forEach((button) => {
    button.addEventListener('click', () => respond(button.dataset.question));
  });
  document.getElementById('chat-form').addEventListener('submit', (event) => {
    event.preventDefault();
    respond(chatInput.value);
    chatInput.value = '';
    chatInput.focus();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !chatWindow.hidden) {
      closeChat();
      robotToggle.focus();
    }
  });

  // ---------------------------------------------------------------------------
  // 06. Accessible typewriter headline (letter by letter, without HTML injection)
  // ---------------------------------------------------------------------------
  const typedIntro = document.getElementById('typed-intro');
  const typedEmphasis = document.getElementById('typed-emphasis');
  const heroTitle = document.getElementById('hero-title');
  const phraseIntro = 'Making biology ';
  const phraseEmphasis = 'computable!';

  if (reducedMotion.matches) {
    // Display the complete text immediately when animations are disabled.
    typedIntro.textContent = phraseIntro;
    typedEmphasis.textContent = phraseEmphasis;
    heroTitle.classList.add('typing-done');
  } else {
    const fullPhrase = phraseIntro + phraseEmphasis;
    let typedCharacters = 0;
    const intervalId = window.setInterval(() => {
      typedCharacters += 1;
      typedIntro.textContent = fullPhrase.slice(
        0, Math.min(typedCharacters, phraseIntro.length)
      );
      typedEmphasis.textContent = fullPhrase.slice(
        phraseIntro.length, typedCharacters
      );

      if (typedCharacters >= fullPhrase.length) {
        window.clearInterval(intervalId);
        heroTitle.classList.add('typing-done');
      }
    }, 85);
  }

  // ---------------------------------------------------------------------------
  // 07. Footer, deep linking, and initial state
  // ---------------------------------------------------------------------------
  document.getElementById('back-top').addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion.matches ? 'auto' : 'smooth'
    });
  });
  document.getElementById('year').textContent = String(new Date().getFullYear());

  // Support shared links like https://decoder108.github.io/#research.
  const initialPanel = location.hash.slice(1);
  if (knownPanels.has(initialPanel)) setPanel(initialPanel, false);
  window.addEventListener('hashchange', () => {
    const requestedPanel = location.hash.slice(1);
    if (knownPanels.has(requestedPanel)) setPanel(requestedPanel, true);
  });
})();
