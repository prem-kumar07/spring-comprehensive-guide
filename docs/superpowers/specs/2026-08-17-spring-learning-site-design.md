# Spring Comprehensive Guide — Site Design Spec

**Date:** 2026-08-17  
**Goal:** A GitHub Pages static reference site (HTML/JS only) covering Spring Core, Spring Boot, and Spring AI — from basics to advanced — that serves as a personal expert reference with working code examples, version comparisons, and interactive search.

---

## 1. Scope & Phases

| Phase | Content | Status |
|-------|---------|--------|
| 1 | Spring Core (Spring 5.x vs 6.x) | This spec |
| 2 | Spring Boot (last 2 versions) | Future |
| 3 | Spring AI (latest) | Future |

Phase 1 is fully specced here. Phases 2 and 3 follow the same structural patterns and get their own specs when started.

---

## 2. Technology Stack

- **HTML5 + CSS3** — no framework, no build step
- **Vanilla JS** for nav injection, search, tab switching, diagram interactivity
- **Fuse.js** (bundled inline in `assets/js/search.js`) — client-side fuzzy search
- **Prism.js** (bundled inline in `assets/js/prism.js`) — Java/XML/YAML syntax highlighting
- **Inline SVG** — all diagrams (lifecycle flows, architecture, timelines)
- **Python 3** script (`scripts/build_index.py`) — scans HTML, extracts headings + text, writes `assets/search-index.json`; run manually after any content change
- **GitHub Pages** — served from `main` branch root

---

## 3. File Structure

```
spring-comprehensive-guide/
├── index.html                        ← Home / master index with all sections listed
├── assets/
│   ├── css/style.css                 ← Shared styles, CSS variables for dark/light theme
│   ├── js/
│   │   ├── nav.js                    ← Injects sidebar nav on every page
│   │   ├── search.js                 ← Fuse.js bundled + search UI logic
│   │   └── prism.js                  ← Syntax highlighting bundled
│   └── search-index.json             ← Auto-generated; committed to repo
│
├── spring-core/
│   ├── index.html                    ← Spring Core overview + version timeline diagram
│   ├── spring5-features.html         ← Spring 5.x major features with code examples
│   ├── spring6-features.html         ← Spring 6.x major features with code examples
│   ├── version-comparison.html       ← Filterable table + side-by-side code diffs
│   ├── lifecycle.html                ← Full bean lifecycle deep-dive with SVG flow
│   └── tooling.html                  ← Local setup, IDE, Maven/Gradle, testing, DevTools
│
├── spring-boot/                      ← Phase 2 (same structure)
├── spring-ai/                        ← Phase 3 (same structure)
│
└── scripts/
    └── build_index.py
```

---

## 4. Navigation

`nav.js` renders a shared left sidebar on every page. It is the single source of truth for navigation structure. The sidebar contains:

- Home
- Spring Core
  - Overview
  - Spring 5 Features
  - Spring 6 Features
  - Version Comparison
  - Bean Lifecycle
  - Tooling & Setup
- Spring Boot *(locked, Phase 2)*
- Spring AI *(locked, Phase 3)*

Active page is highlighted. Sidebar collapses to a hamburger on mobile.

---

## 5. Page Templates

### 5a. Feature Pages (spring5-features.html, spring6-features.html)

Structure per page:
1. **Version banner** — version number, release date, Java baseline, key headline
2. **Feature categories** — tabbed or accordion: Core Container, Web, Data, Testing, Observability, Tooling
3. **Each feature card:**
   - Feature name + one-line summary
   - Explanation (2–4 sentences, sourced from spring.io)
   - `pom.xml` / `build.gradle` dependency snippet (minimum required)
   - Coverage progresses basic → intermediate → advanced within each category
   - Runnable code example per level (self-contained, copy-paste ready)
   - Callout notes: gotchas, migration tips
4. **Cheatsheet section** (bottom of page) — quick-reference table of all annotations, interfaces, and key APIs covered on that page with a one-liner description each

### 5b. Version Comparison Page

1. **Filter bar** — filter by category and/or change type (New / Changed / Removed / Deprecated)
2. **Comparison table** — columns: Feature | Spring 5 | Spring 6 | Type
3. **Expandable rows** — click row → inline side-by-side diff panel (Spring 5 left, Spring 6 right)
4. **Key topics covered:**
   - Jakarta EE namespace (`javax.*` → `jakarta.*`)
   - Java 17 baseline (records, sealed classes, text blocks in examples)
   - Native image support (GraalVM / Spring AOT)
   - HTTP interface clients (`@HttpExchange`)
   - Observability (Micrometer integration)
   - Declarative HTTP clients replacing RestTemplate patterns
   - `ProblemDetail` (RFC 7807) error responses
   - Security updates (Spring Security 6 co-evolution notes)

### 5c. Bean Lifecycle Page

1. **Visual flow diagram (SVG)** — full lifecycle from `new BeanDefinition` to `destroy()`:
   - Instantiation → Constructor injection → Populate properties → `BeanNameAware.setBeanName()` → `BeanFactoryAware.setBeanFactory()` → `ApplicationContextAware.setApplicationContext()` → `BeanPostProcessor.postProcessBeforeInitialization()` → `@PostConstruct` / `InitializingBean.afterPropertiesSet()` → custom `init-method` → `BeanPostProcessor.postProcessAfterInitialization()` → Bean ready → `@PreDestroy` / `DisposableBean.destroy()` → custom `destroy-method`
2. **Each stage section** — interface/annotation used, when it fires, working code example
3. **Scope comparison** — singleton vs prototype lifecycle differences (diagram)
4. **ApplicationContext vs BeanFactory** — lifecycle handling differences
5. **Practical patterns** — resource cleanup, lazy init, `@DependsOn`
6. **Cheatsheet section** (bottom of page) — lifecycle stage order, key interfaces/annotations, scope behavior summary

### 5d. Tooling Page

1. **Spring Initializr** — how to use start.spring.io, what to select, annotated screenshot (or SVG mockup)
2. **IDE Setup:**
   - IntelliJ IDEA Ultimate (Spring plugin built-in)
   - VS Code (Spring Boot Extension Pack)
   - Comparison table: features side-by-side
3. **Build tools** — Maven vs Gradle project structure, key differences
4. **Running locally** — step-by-step from clone to `./mvnw spring:run`, with expected terminal output
5. **Hot reload** — Spring Boot DevTools setup and how it works
6. **Testing setup** — JUnit 5 + Mockito, `@SpringBootTest` vs `@WebMvcTest` vs `@DataJpaTest` — when to use each with examples
7. **Actuator** — enabling `spring-boot-actuator` locally, useful endpoints (`/beans`, `/conditions`, `/health`, `/env`)
8. **Common errors** — port conflicts, `NoSuchBeanDefinitionException`, context load failures, classpath issues
9. **Cheatsheet section** (bottom of page) — Maven/Gradle commands, Actuator endpoints, key annotations for testing, IDE shortcuts

---

## 6. Search

- **Index:** `build_index.py` walks all `.html` files, extracts `<title>`, `<h1>`–`<h3>`, `<p>`, and `<code>` text, writes `assets/search-index.json` (array of `{page, section, anchor, text}` objects)
- **Client:** Fuse.js fuzzy search on `text` field, results displayed as a dropdown from the header search bar showing page title + section + anchor link
- **Trigger:** Run `python scripts/build_index.py` from repo root after adding/editing any page

---

## 7. Styling

- CSS custom properties for theming (`--bg`, `--text`, `--accent`, `--code-bg`, etc.)
- Dark mode default, light mode toggle saved to `localStorage`
- Monospace font for code blocks (system stack: `ui-monospace, 'Cascadia Code', 'Fira Code', monospace`)
- Responsive: sidebar collapses on screens < 768px
- No external CDN dependencies — everything bundled

---

## 8. Research Process (per page)

Before writing any content:
1. Read the relevant section of `docs.spring.io` for the version
2. Check the official Spring Framework GitHub release notes / changelog
3. Cross-reference the Spring Blog (`spring.io/blog`) for feature announcements
4. All code examples must be verified runnable with listed dependency versions
5. Diagrams reflect actual Spring source behavior, not approximations
6. Coverage must be complete — basic → intermediate → advanced — no concept left at a surface level; every topic is taken to its practical limit with real examples

---

## 9. Out of Scope (Phase 1)

- Server-side rendering or backend of any kind
- Automated CI/CD for index rebuild (manual script only for now)
- Spring Boot or Spring AI content (Phases 2 & 3)
- Interactive runnable code (sandboxes) — static examples only
