/**
 * Christo Saju — Portfolio interactions
 * Dependencies: none. Works on GitHub Pages and Cloudflare Pages.
 */
(() => {
  'use strict';

  // ----------------------------------------------------------
  // Footer year and responsive navigation
  // ----------------------------------------------------------
  const yearElement = document.getElementById('year');
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const navLinks = document.querySelectorAll('#links a');

  yearElement.textContent = new Date().getFullYear();

  window.addEventListener(
    'scroll',
    () => nav.classList.toggle('scrolled', window.scrollY > 10),
    { passive: true }
  );

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
    });
  });

  // ----------------------------------------------------------
  // Scroll reveals
  // ----------------------------------------------------------
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.rv').forEach((element, index) => {
    element.style.transitionDelay = `${(index % 4) * 70}ms`;
    revealObserver.observe(element);
  });

  // Highlight the navigation link for the current section.
  const sectionIds = ['about', 'skills', 'lifecycle', 'experience', 'education'];
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          link.classList.toggle('on', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );

  sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (section) sectionObserver.observe(section);
  });

  // ----------------------------------------------------------
  // Animated skills ticker
  // ----------------------------------------------------------
  const skills = [
    'Incident management',
    'SQL & PL/SQL',
    'Remote desktop support',
    'SLA compliance',
    'Active Directory',
    'System monitoring',
    'Software support',
    'Email support',
    'Hardware management'
  ];

  const skillMarkup = skills.map((skill) => `<span>${skill.replaceAll('&', '&amp;')}</span>`).join('');
  document.getElementById('strip').innerHTML = skillMarkup.repeat(2);

  // ----------------------------------------------------------
  // Syntax highlighting for illustrative SQL examples
  // ----------------------------------------------------------
  function escapeHtml(value) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function highlightSql(source) {
    return escapeHtml(source)
      .split('\n')
      .map((line) => {
        if (/^\s*--/.test(line)) {
          return `<span class="c">${line}</span>`;
        }

        return line
          .replace(/('[^']*')/g, '<span class="s">$1</span>')
          .replace(/\b(SELECT|FROM|WHERE|JOIN|ON|UPDATE|SET|COMMIT|ROLLBACK|COUNT|AND|GROUP BY|ORDER BY|INNER|LEFT)\b/g,
            '<span class="k">$1</span>')
          .replace(/\b(\d+)\b/g, '<span class="n">$1</span>')
          .replace(/\b(christo_saju)\b/g, '<span class="f">$1</span>');
      })
      .join('\n');
  }

  // ----------------------------------------------------------
  // Hero console: looping typed profile queries
  // ----------------------------------------------------------
  const querySequence = [
    {
      query: 'SELECT role, company\nFROM christo_saju;',
      result: 'IT Support Engineer\nAsirvad Microfinance Limited'
    },
    {
      query: 'SELECT skills\nFROM christo_saju;',
      result: 'SQL & PL/SQL · Active Directory\nRemote Support · SLA & Tickets'
    },
    {
      query: 'SELECT status\nFROM christo_saju;',
      result: 'Open to new opportunities'
    }
  ];

  function renderQuery(query, result = '', showCursor = false) {
    const resultHtml = result
      ? `\n\n<span class="res">→ ${escapeHtml(result).replace(/\n/g, '\n  ')}</span>`
      : '';
    const cursorHtml = showCursor ? '<span class="caret"></span>' : '';

    return highlightSql(query) + resultHtml + cursorHtml;
  }

  const typedConsole = document.getElementById('typed');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    const initial = querySequence[0];
    typedConsole.innerHTML = renderQuery(initial.query, initial.result);
  } else {
    let queryIndex = 0;
    let characterIndex = 0;

    function typeQuery() {
      const current = querySequence[queryIndex];

      if (characterIndex <= current.query.length) {
        typedConsole.innerHTML = renderQuery(
          current.query.slice(0, characterIndex),
          '',
          true
        );

        characterIndex += 1;
        window.setTimeout(typeQuery, 45 + Math.random() * 45);
      } else {
        typedConsole.innerHTML = renderQuery(current.query, current.result);

        window.setTimeout(() => {
          queryIndex = (queryIndex + 1) % querySequence.length;
          characterIndex = 0;
          typeQuery();
        }, 3000);
      }
    }

    typeQuery();
  }

  // ----------------------------------------------------------
  // Incident lifecycle: interactive code examples
  // ----------------------------------------------------------
  const stages = [
    {
      title: '01_triage.log',
      note: 'Gather full context, judge severity and log it so nothing is lost.',
      code: [
        '-- incident intake',
        'channel   : phone + remote session',
        'symptom   : user cannot complete a task',
        'impact    : single user / team / branch',
        'priority  : set against SLA target',
        'next      : reproduce and check logs'
      ].join('\n')
    },
    {
      title: '02_investigate.sql',
      note: 'Check the application, the workstation, then the data behind it.',
      code: [
        '-- find records that do not match',
        'SELECT t.id, t.status, u.user_name',
        'FROM transactions t',
        'JOIN users u ON u.id = t.user_id',
        "WHERE t.status = 'PENDING'",
        'ORDER BY t.created_at;'
      ].join('\n')
    },
    {
      title: '03_resolve.sql',
      note: 'Preview first, change only what is needed, verify, then commit.',
      code: [
        '-- preview the rows affected',
        'SELECT COUNT(*) FROM job_queue',
        "WHERE status = 'STUCK';",
        '',
        '-- targeted update',
        "UPDATE job_queue SET status = 'RETRY'",
        "WHERE status = 'STUCK';",
        '',
        '-- verify, then make it permanent',
        'COMMIT;'
      ].join('\n')
    },
    {
      title: '04_close.txt',
      note: 'Explain the fix in plain words, confirm the user is happy, record it.',
      code: [
        '-- message to the user',
        '"The issue was caused by a record stuck',
        " in the system. I've corrected it and",
        ' checked that everything now works.',
        ' Please try again and tell me if it',
        ' behaves as expected."',
        '',
        '-- ticket',
        'status: resolved within SLA',
        'notes : root cause + fix documented'
      ].join('\n')
    }
  ];

  const stageButtons = document.querySelectorAll('.step');
  const panelTitle = document.getElementById('ptitle');
  const panelCode = document.getElementById('pcode');
  const panelNote = document.getElementById('pnote');

  function showStage(index) {
    const stage = stages[index];
    if (!stage) return;

    stageButtons.forEach((button, buttonIndex) => {
      const active = buttonIndex === index;
      button.classList.toggle('on', active);
      button.setAttribute('aria-selected', String(active));
    });

    panelTitle.textContent = stage.title;
    panelNote.textContent = stage.note;
    panelCode.innerHTML = highlightSql(stage.code);
  }

  stageButtons.forEach((button) => {
    button.addEventListener('click', () => {
      showStage(Number(button.dataset.i));
    });
  });

  showStage(0);
})();
