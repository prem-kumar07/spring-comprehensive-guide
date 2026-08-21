(function () {
  // Detect how many path segments deep we are to build a root-relative prefix.
  // Pages are either at root (index.html) or one directory deep (spring-core/*.html).
  const segs = window.location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  // On GitHub Pages project page the pathname starts with /spring-comprehensive-guide/...
  // On localhost it starts directly with / or /spring-core/...
  // Either way, if the last segment is a file, count dirs only.
  const depth = segs.filter(s => !s.includes('.')).length;
  // If we're one dir deep (e.g. /spring-comprehensive-guide/spring-core/lifecycle.html → depth=2
  // on GH Pages, depth=1 on localhost), we need '../' to get back.
  // Simple heuristic: if the pathname contains '/spring-core/', go up one level.
  const inSubdir = window.location.pathname.includes('/spring-core/')
               || window.location.pathname.includes('/spring-boot/')
               || window.location.pathname.includes('/spring-ai/')
               || window.location.pathname.includes('/build-tools/');
  const ROOT = inSubdir ? '../' : './';

  const NAV = [
    { label: 'Home', href: ROOT + 'index.html' },
    {
      group: 'Spring Core',
      items: [
        { label: 'Overview',           href: ROOT + 'spring-core/index.html' },
        { label: 'Spring 5 Features',  href: ROOT + 'spring-core/spring5-features.html' },
        { label: 'Spring 6 Features',  href: ROOT + 'spring-core/spring6-features.html' },
        { label: 'Spring 7 Features',  href: ROOT + 'spring-core/spring7-features.html' },
        { label: 'Version Comparison', href: ROOT + 'spring-core/version-comparison.html' },
        { label: 'Bean Lifecycle',     href: ROOT + 'spring-core/lifecycle.html' },
        { label: 'Proxy Internals',    href: ROOT + 'spring-core/proxies.html' },
        { label: 'AOP Deep Dive',      href: ROOT + 'spring-core/aop.html' },
        { label: 'Tooling & Setup',    href: ROOT + 'spring-core/tooling.html' },
      ],
    },
    {
      group: 'Spring Boot',
      items: [
        { label: 'Overview',             href: ROOT + 'spring-boot/index.html' },
        { label: 'Boot 3 Features',      href: ROOT + 'spring-boot/boot3-features.html' },
        { label: 'Boot 4 Features',      href: ROOT + 'spring-boot/boot4-features.html' },
        { label: 'Version Comparison',   href: ROOT + 'spring-boot/version-comparison.html' },
        { label: 'Auto-Configuration',   href: ROOT + 'spring-boot/auto-configuration.html' },
        { label: 'Production & Tooling', href: ROOT + 'spring-boot/production.html' },
      ],
    },
    {
      group: 'Build Tools',
      items: [
        { label: 'Maven', href: ROOT + 'build-tools/maven.html' },
        { label: 'Gradle', href: ROOT + 'build-tools/gradle.html' },
      ],
    },
    {
      group: 'Spring AI',
      items: [
        { label: 'Overview',           href: ROOT + 'spring-ai/index.html' },
        { label: 'ChatClient API',     href: ROOT + 'spring-ai/chat-client.html' },
        { label: 'RAG & VectorStore',  href: ROOT + 'spring-ai/rag.html' },
        { label: 'Tools & Advisors',   href: ROOT + 'spring-ai/tools-advisors.html' },
        { label: 'Structured Output',  href: ROOT + 'spring-ai/structured-output.html' },
        { label: 'Version Comparison', href: ROOT + 'spring-ai/version-comparison.html' },
        { label: 'Providers',          href: ROOT + 'spring-ai/providers.html' },
      ],
    },
  ];

  // Flat ordered list of all pages for prev/next navigation
  function flatPages() {
    const pages = [];
    NAV.forEach(entry => {
      if (entry.href) {
        pages.push({ label: entry.label, href: entry.href });
      }
      (entry.items || []).forEach(item => {
        pages.push({ label: item.label, href: item.href, group: entry.group });
      });
    });
    return pages;
  }

  function currentPath() {
    return window.location.pathname.replace(/\/$/, '/index.html');
  }

  function isActive(href) {
    const path = currentPath();
    const hrefEnd = href.replace(/^(\.\.\/|\.\/)+/, '');
    return path.endsWith('/' + hrefEnd) || path.endsWith(hrefEnd);
  }

  function render() {
    // Inject favicon once
    if (!document.querySelector('link[rel="icon"]')) {
      const fav = document.createElement('link');
      fav.rel = 'icon'; fav.type = 'image/svg+xml';
      fav.href = ROOT + 'assets/favicon.svg';
      document.head.appendChild(fav);
    }

    const sidebar = document.createElement('nav');
    sidebar.id = 'sidebar';

    const logo = document.createElement('a');
    logo.className = 'logo';
    logo.href = ROOT + 'index.html';
    logo.innerHTML = `<svg class="logo-leaf" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M16 2C10 4 5 10 6 19c2-5 6-8 11-9-4 4-7 9-8 15 4 3 9 1 12-5 4-7 3-17-5-18z" fill="#3fb950"/><path d="M13 26C11 21 11 15 14 10" stroke="#1a5c30" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg><span class="logo-text">Spring Guide</span>`;
    sidebar.appendChild(logo);

    NAV.forEach(entry => {
      if (entry.href) {
        const a = document.createElement('a');
        a.className = 'nav-item' + (isActive(entry.href) ? ' active' : '');
        a.href = entry.href;
        a.textContent = entry.label;
        sidebar.appendChild(a);
        return;
      }
      const group = document.createElement('div');
      group.className = 'nav-group';
      const label = document.createElement('div');
      label.className = 'nav-group-label';
      label.textContent = entry.group + (entry.locked ? '  🔒' : '');
      group.appendChild(label);

      (entry.items || []).forEach(item => {
        const a = document.createElement('a');
        a.className = 'nav-item' + (isActive(item.href) ? ' active' : '') + (entry.locked ? ' locked' : '');
        a.href = entry.locked ? '#' : item.href;
        a.textContent = item.label;
        group.appendChild(a);
      });
      sidebar.appendChild(group);
    });

    document.body.prepend(sidebar);

    // Overlay for mobile sidebar backdrop
    const overlay = document.createElement('div');
    overlay.id = 'sidebar-overlay';
    document.body.appendChild(overlay);

    function openSidebar()  { sidebar.classList.add('open');    overlay.classList.add('visible'); }
    function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('visible'); }

    const ham = document.getElementById('hamburger');
    if (ham) {
      ham.addEventListener('click', () => sidebar.classList.contains('open') ? closeSidebar() : openSidebar());
    }

    // Close sidebar when tapping the overlay or following a nav link
    overlay.addEventListener('click', closeSidebar);
    sidebar.addEventListener('click', (e) => { if (e.target.tagName === 'A' && e.target.href !== '#') closeSidebar(); });
  }

  function initTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = saved === 'dark' ? '☀️ Light' : '🌙 Dark';
      btn.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        btn.textContent = next === 'dark' ? '☀️ Light' : '🌙 Dark';
      });
    }
  }

  function initTabs() {
    document.querySelectorAll('.tabs').forEach(tabBar => {
      tabBar.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.tab;
          const container = btn.closest('.tab-container');
          container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          container.querySelector('#' + target).classList.add('active');
        });
      });
    });

    // If URL has a hash anchor, activate the tab that contains the target element
    const hash = window.location.hash;
    if (hash) {
      try {
        const target = document.querySelector(hash);
        if (target) {
          const panel = target.closest('.tab-panel');
          if (panel) {
            const container = panel.closest('.tab-container');
            if (container) {
              container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
              container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
              panel.classList.add('active');
              const btn = container.querySelector('[data-tab="' + panel.id + '"]');
              if (btn) btn.classList.add('active');
              setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
            }
          }
        }
      } catch (e) {}
    }
  }

  function initPrevNext() {
    const pages = flatPages();
    const idx = pages.findIndex(p => isActive(p.href));
    if (idx === -1) return;

    const prev = idx > 0 ? pages[idx - 1] : null;
    const next = idx < pages.length - 1 ? pages[idx + 1] : null;
    if (!prev && !next) return;

    const nav = document.createElement('nav');
    nav.className = 'page-nav';
    nav.setAttribute('aria-label', 'Page navigation');

    if (prev) {
      const a = document.createElement('a');
      a.className = 'page-nav-btn page-nav-prev';
      a.href = prev.href;
      a.innerHTML =
        '<span class="page-nav-arrow">&#8592;</span>' +
        '<span class="page-nav-label">' +
          '<span class="page-nav-hint">Previous</span>' +
          '<span class="page-nav-title">' + prev.label + '</span>' +
        '</span>';
      nav.appendChild(a);
    } else {
      const spacer = document.createElement('span');
      nav.appendChild(spacer);
    }

    if (next) {
      const a = document.createElement('a');
      a.className = 'page-nav-btn page-nav-next';
      a.href = next.href;
      a.innerHTML =
        '<span class="page-nav-label">' +
          '<span class="page-nav-hint">Next</span>' +
          '<span class="page-nav-title">' + next.label + '</span>' +
        '</span>' +
        '<span class="page-nav-arrow">&#8594;</span>';
      nav.appendChild(a);
    }

    const content = document.getElementById('content');
    if (content) content.appendChild(nav);
  }

  function initBackToTop() {
    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '&#8679;';   // ⇧ upward arrow
    document.body.appendChild(btn);

    window.addEventListener('scroll', function () {
      btn.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initCopyButtons() {
    document.querySelectorAll('pre').forEach(pre => {
      const code = pre.querySelector('code');
      if (!code) return;

      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.setAttribute('aria-label', 'Copy code');
      btn.textContent = 'Copy';
      pre.appendChild(btn);

      btn.addEventListener('click', function () {
        const text = code.innerText || code.textContent;
        const succeed = function () {
          btn.textContent = '✓ Copied!';
          btn.classList.add('copied');
          setTimeout(function () {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 2000);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(succeed).catch(function () {
            fallbackCopy(text, succeed);
          });
        } else {
          fallbackCopy(text, succeed);
        }
      });
    });
  }

  function fallbackCopy(text, cb) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); cb(); } catch (e) {}
    document.body.removeChild(ta);
  }

  document.addEventListener('DOMContentLoaded', () => {
    render();
    initTheme();
    initTabs();
    initPrevNext();
    initBackToTop();
    initCopyButtons();
  });
})();
