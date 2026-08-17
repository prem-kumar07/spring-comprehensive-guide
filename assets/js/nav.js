(function () {
  const NAV = [
    { label: 'Home', href: '/index.html' },
    {
      group: 'Spring Core',
      items: [
        { label: 'Overview',           href: '/spring-core/index.html' },
        { label: 'Spring 5 Features',  href: '/spring-core/spring5-features.html' },
        { label: 'Spring 6 Features',  href: '/spring-core/spring6-features.html' },
        { label: 'Version Comparison', href: '/spring-core/version-comparison.html' },
        { label: 'Bean Lifecycle',     href: '/spring-core/lifecycle.html' },
        { label: 'Tooling & Setup',    href: '/spring-core/tooling.html' },
      ],
    },
    { group: 'Spring Boot',  items: [], locked: true },
    { group: 'Spring AI',    items: [], locked: true },
  ];

  function currentPath() {
    // Normalize: strip leading domain, keep path
    return window.location.pathname.replace(/\/$/, '/index.html');
  }

  function render() {
    const sidebar = document.createElement('nav');
    sidebar.id = 'sidebar';

    const logo = document.createElement('a');
    logo.className = 'logo';
    logo.href = '/index.html';
    logo.textContent = '🌱 Spring Guide';
    sidebar.appendChild(logo);

    NAV.forEach(entry => {
      if (entry.href) {
        // Top-level link
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

    // Hamburger
    const ham = document.getElementById('hamburger');
    if (ham) {
      ham.addEventListener('click', () => sidebar.classList.toggle('open'));
    }
  }

  function isActive(href) {
    const path = currentPath();
    // Match exact or index fallback
    return path === href || path === href.replace('/index.html', '/');
  }

  // Theme toggle
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

  // Tab switching
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
  }

  document.addEventListener('DOMContentLoaded', () => {
    render();
    initTheme();
    initTabs();
  });
})();
