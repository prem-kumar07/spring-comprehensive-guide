# Spring Comprehensive Guide

A complete, searchable reference site for **Spring Core**, **Spring Boot**, **Spring AI**, and **Build Tools** — hosted on GitHub Pages.

**Live site:** https://prem-kumar07.github.io/spring-comprehensive-guide/

---

## What's Inside

### Spring Core
| Page | Topics |
|------|--------|
| Overview | IoC container, DI patterns, ApplicationContext |
| Spring 5 Features | WebFlux, functional beans, Kotlin DSL, JUnit 5 |
| Spring 6 Features | Jakarta EE 9, AOT compilation, HTTP interface clients, Micrometer |
| Spring 7 Features | Project Loom, virtual threads, Jackson 3, RestClient, Records |
| Version Comparison | Spring 5 → 6 → 7 side-by-side expandable diffs |
| Bean Lifecycle | 14-stage lifecycle diagram from instantiation to destroy |
| Proxy Internals | JDK dynamic proxy vs CGLIB — how Spring wraps beans |
| AOP Deep Dive | Advice types, pointcut expressions, ordering, real-world patterns |
| Tooling & Setup | Spring Initializr, DevTools, Actuator, IDE setup |

### Spring Boot
| Page | Topics |
|------|--------|
| Overview | Auto-configuration, starters, embedded server |
| Boot 3 Features | Jakarta EE, Native/AOT, Observability, Security defaults |
| Boot 4 Features | Spring 7.x, virtual threads, revised auto-config, new starters |
| Version Comparison | Boot 3.x vs 4.x — every changed, new, and removed API |
| Auto-Configuration | @Conditional family, custom starters, debugging conditions |
| Production & Tooling | Actuator, Micrometer, Testcontainers, layered JARs, graceful shutdown |

### Build Tools
| Page | Topics |
|------|--------|
| Maven | POM structure, lifecycle, dependency scopes, plugins, wrapper, multi-module, Spring Boot BOM, layered JARs, native image |
| Gradle | Kotlin DSL, task DAG, dependency configs, multi-project, Gradle Wrapper, Spring Boot plugin, bootBuildImage, native image |

### Spring AI
| Page | Topics |
|------|--------|
| Overview | 8 core pillars, provider landscape, Spring AI 1.x vs 2.x |
| ChatClient API | Fluent builder, streaming, memory, multimodal, testing |
| RAG & VectorStore | Document ETL, 15+ VectorStore backends, retrieval advisors |
| Tools & Advisors | @Tool function calling, agentic loops, Advisor chain |
| Structured Output | BeanOutputConverter, self-correcting, provider-native JSON |
| Version Comparison | Spring AI 1.x vs 2.x — API changes, MCP, agentic architecture |
| Providers | OpenAI, Anthropic, Ollama, Bedrock, Gemini and 15+ more |

---

## Tech Stack

| Concern | Solution |
|---------|----------|
| Hosting | GitHub Pages (static, no build step) |
| Markup | Pure HTML5 |
| Styling | CSS custom properties — dark/light theme |
| Syntax highlighting | [Prism.js](https://prismjs.com/) 1.29.0 (bundled) |
| Fuzzy search | [Fuse.js](https://fusejs.io/) 7.0.0 (bundled) |
| Search index | Python 3 script → `assets/search-index.json` (1 081 entries) |
| Navigation / UI | Vanilla JS in `assets/js/nav.js` |

No npm, no framework, no build pipeline. Every dependency is committed as a file.

---

## Project Structure

```
spring-comprehensive-guide/
├── index.html                    # Homepage with hero + section cards
│
├── spring-core/
│   ├── index.html
│   ├── spring5-features.html
│   ├── spring6-features.html
│   ├── spring7-features.html
│   ├── version-comparison.html
│   ├── lifecycle.html
│   ├── proxies.html
│   ├── aop.html
│   └── tooling.html
│
├── spring-boot/
│   ├── index.html
│   ├── boot3-features.html
│   ├── boot4-features.html
│   ├── version-comparison.html
│   ├── auto-configuration.html
│   └── production.html
│
├── build-tools/
│   ├── maven.html
│   └── gradle.html
│
├── spring-ai/
│   ├── index.html
│   ├── chat-client.html
│   ├── rag.html
│   ├── tools-advisors.html
│   ├── structured-output.html
│   ├── version-comparison.html
│   └── providers.html
│
├── assets/
│   ├── css/style.css             # All styles + CSS custom properties
│   ├── favicon.svg               # Spring leaf SVG favicon
│   └── js/
│       ├── nav.js                # Sidebar, theme, tabs, prev/next, copy buttons, back-to-top
│       ├── prism.js              # Syntax highlighting (bundled)
│       ├── search.js             # Client-side search wiring
│       └── search-index.json     # Pre-built search index (auto-generated)
│
└── scripts/
    ├── build_index.py            # Regenerates search-index.json from all HTML
    └── test_build_index.py       # Tests for the index builder
```

---

## Running Locally

No server required for most pages. Just open any `.html` file in your browser. For search to work (it uses `fetch` to load `search-index.json`), you need a local HTTP server:

```bash
# Python 3
python3 -m http.server 8080

# Then open:
# http://localhost:8080
```

---

## Adding a New Page

1. **Create the HTML file** in the appropriate directory (e.g. `spring-core/my-topic.html`). Copy any existing page as a template — the structure is:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Title</title>
  <link rel="stylesheet" href="../assets/css/style.css" />
</head>
<body>
<div id="main">
  <header id="header">
    <button id="hamburger" aria-label="Toggle nav">☰</button>
    <input id="search-input" type="search" placeholder="Search Spring Guide…" autocomplete="off" />
    <div id="search-results"></div>
    <button id="theme-toggle">☀️ Light</button>
  </header>
  <div id="content">
    <!-- your content here -->
  </div>
</div>
<script src="../assets/js/nav.js"></script>
<script src="../assets/js/prism.js"></script>
<script src="../assets/js/search.js"></script>
</body>
</html>
```

   > For root-level pages (like `index.html`) use `assets/` not `../assets/`.

2. **Add the nav entry** in `assets/js/nav.js` — find the right group in the `NAV` array and add an item. The prev/next buttons and active highlighting update automatically.

3. **Add a section card** on `index.html` if it's a new top-level topic.

4. **Rebuild the search index:**

```bash
python3 scripts/build_index.py
```

5. **Commit everything** including the updated `assets/search-index.json`.

---

## Search Index

The search index is a pre-built JSON file generated by `scripts/build_index.py`. It parses every HTML file, extracts headings and paragraph text, and writes one entry per content block.

```bash
# Regenerate after adding or editing pages
python3 scripts/build_index.py
# Output: Wrote 1081 entries to assets/search-index.json
```

The client-side search uses **Fuse.js** for fuzzy matching — no server, no API call.

---

## Features

- **Dark / Light theme** — persisted in `localStorage`, toggled via the header button
- **Fuzzy search** — searches across all 1 081 indexed entries in the browser
- **Tabbed content** — multi-tab layouts on deep-dive pages; deep-linked via URL hash
- **Syntax highlighting** — Prism.js with support for Java, XML, Kotlin, Bash, Properties, Dockerfile
- **Copy button** — appears on hover over any code block; copies raw text to clipboard
- **Prev / Next navigation** — bottom of every page, follows the sidebar page order
- **Back to top** — floating button, appears after scrolling 300 px
- **Responsive** — sidebar collapses to a hamburger drawer on screens ≤ 900 px

---

## Versions Covered

| Framework | Versions |
|-----------|----------|
| Spring Core | 5.x · 6.x · 7.x |
| Spring Boot | 3.x · 4.x |
| Spring AI | 1.0.x · 2.0.x |
| Maven | 3.x |
| Gradle | 8.x |
| Java | 17 · 21 · 25 |

---

## Badge Reference

Version badges used throughout the site:

| Class | Color | Used for |
|-------|-------|----------|
| `.badge-v7` | Amber | Spring Framework versions |
| `.badge-boot3` | Blue | Spring Boot 3.x |
| `.badge-boot4` | Green | Spring Boot 4.x |
| `.badge-ai1` | Purple | Spring AI 1.x |
| `.badge-ai2` | Coral/Red | Spring AI 2.x |
| `.badge-maven` | Terracotta | Maven |
| `.badge-gradle` | Teal | Gradle |

Usage: `<span class="version-badge badge-boot3">Spring Boot 3.x</span>`

---

## License

Content is for educational / reference use. Code examples are MIT-licensed — use freely in your own projects.
