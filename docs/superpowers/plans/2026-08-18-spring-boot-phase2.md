# Spring Boot Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete Spring Boot section of the Spring Comprehensive Guide — 6 new HTML pages covering Spring Boot 3.x and 4.x, with nav integration and search index.

**Architecture:** Pure static HTML/CSS/JS site. The `spring-boot/` directory mirrors `spring-core/` exactly: same page template (header → tabbed feature cards → cheatsheet), same script tags, same CSS. All content sourced via web search. The Python `build_index.py` script verifies structural correctness by entry count — a page with fewer than 30 entries has missing or mis-structured headings.

**Tech Stack:** HTML5, CSS3 (custom properties via `assets/css/style.css`), vanilla JS (`assets/js/nav.js`), Python 3 (`scripts/build_index.py`), Prism.js and Fuse.js already bundled.

**Spec:** `docs/superpowers/specs/2026-08-18-spring-boot-phase2.md`

**Execute after:** `docs/superpowers/plans/2026-08-18-spring-core-spring7-extension.md` (Spring 7.x plan modifies nav.js; this plan extends it further).

## Global Constraints

- No external CDN dependencies — all JS/CSS already bundled; never add a `<link>` or `<script src>` pointing outside the repo
- All hrefs in nav.js must be root-relative strings like `ROOT + 'spring-boot/index.html'` — never absolute paths with a leading `/`
- All `<h3>` feature headings must have unique `id` attributes in kebab-case (e.g., `id="auto-configuration-report"`)
- Code blocks with Java generics: always escape angle brackets — write `&lt;T&gt;` not `<T>`
- Every HTML table must be wrapped in `<div class="table-wrap">` for mobile scroll
- SVG diagrams: all colors via CSS variables only — `var(--text)`, `var(--accent)`, `var(--border)`, `var(--text-muted)`, `var(--text-inverse)` — never hardcoded hex values
- Cheatsheet section: every feature page ends with `<section class="cheatsheet"><h2>Cheatsheet</h2>...</section>`
- Git commit messages: plain descriptive text only — no `Co-Authored-By` trailers of any kind
- After any HTML change: run `python scripts/build_index.py` from repo root, then include `assets/search-index.json` in the commit
- Serve locally with `python -m http.server 8080` from repo root to verify pages visually
- All Spring Boot 3.x and 4.x content sourced via web search — never assume features from prior knowledge

---

### Task 1: CSS Badges and nav.js Foundation

**Files:**
- Modify: `assets/css/style.css` (add `.badge-boot3`, `.badge-boot4`)
- Modify: `assets/js/nav.js` (unlock Spring Boot group, add 6 nav items, extend ROOT detection)

**Interfaces:**
- Produces: `.badge-boot3` and `.badge-boot4` CSS classes available for all 6 Spring Boot pages; Spring Boot nav group unlocked and populated; ROOT detection handles `/spring-boot/` paths

**Note:** The Spring 7.x plan already added "Spring 7 Features" to nav.js. Read the current nav.js before editing to avoid overwriting that change.

- [ ] **Step 1: Add CSS badge classes**

Open `assets/css/style.css`. Find the `.badge-v7` rule added by the Spring 7 plan:
```css
.badge-v7 { background: rgba(210,153,34,0.15); color: #d29922; border: 1px solid #d2992244; }
```
Add immediately after it:
```css
.badge-boot3 { background: rgba(88,166,255,0.15);  color: #58a6ff; border: 1px solid #58a6ff44; }
.badge-boot4 { background: rgba(63,185,80,0.15);   color: #3fb950; border: 1px solid #3fb95044; }
```

- [ ] **Step 2: Extend ROOT detection in nav.js**

Open `assets/js/nav.js`. Find the `inSubdir` line:
```javascript
const inSubdir = window.location.pathname.includes('/spring-core/');
```
Replace with:
```javascript
const inSubdir = window.location.pathname.includes('/spring-core/')
               || window.location.pathname.includes('/spring-boot/');
```

- [ ] **Step 3: Unlock Spring Boot nav group and add items**

In nav.js find:
```javascript
{ group: 'Spring Boot',  items: [], locked: true },
```
Replace with:
```javascript
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
```

- [ ] **Step 4: Verify nav renders correctly**

```bash
python -m http.server 8080
```

Open `http://localhost:8080/index.html`. Verify:
- Spring Boot group is visible in sidebar (no lock icon)
- 6 nav items listed under Spring Boot
- All 6 links lead to 404 (pages don't exist yet — expected)
- Spring Core items still present and correct

Stop the server.

- [ ] **Step 5: Commit**

```bash
git add assets/css/style.css assets/js/nav.js
git commit -m "feat: add Spring Boot nav section and CSS badges"
```

---

### Task 2: spring-boot/index.html — Overview Page

**Files:**
- Create: `spring-boot/index.html`

**Interfaces:**
- Consumes: `.badge-boot3`, `.badge-boot4` from Task 1; nav.js ROOT detection handles `spring-boot/`
- Produces: Overview page linking to all 5 sub-pages

**Research step:** Before writing, search for:
1. `Spring Boot history timeline versions` — to get accurate release dates for 1.x, 2.x, 3.x, 4.x
2. `Spring Boot 4.0 release date` — for the timeline
3. `what is Spring Boot vs Spring Framework` — for the intro paragraph framing

- [ ] **Step 1: Create spring-boot/index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Spring Boot</title>
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

    <h1>Spring Boot</h1>
    <div style="margin-bottom:1.25rem">
      <span class="version-badge badge-boot3">Spring Boot 3.x</span>
      <span class="version-badge badge-boot4">Spring Boot 4.x</span>
    </div>

    <p>[2–3 sentence intro: what Spring Boot adds over plain Spring Framework — auto-configuration, embedded server (Tomcat/Jetty/Undertow), opinionated starters, production defaults. Note it builds on Spring, not replaces it. Source from official docs.]</p>

    <div class="callout info">
      <strong>Spring Boot vs Spring Framework</strong>
      [One sentence clarifying the relationship: Spring Boot is a layer on top of Spring Framework that removes boilerplate configuration. It does not replace Spring — it uses Spring internally.]
    </div>

    <h2>Version Timeline</h2>
    <p>[One sentence intro to the timeline]</p>

    <div class="diagram-wrap">
      <svg viewBox="0 0 800 130" xmlns="http://www.w3.org/2000/svg" aria-label="Spring Boot version timeline" role="img" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif">
        <!-- Horizontal baseline -->
        <line x1="60" y1="50" x2="740" y2="50" stroke="var(--border)" stroke-width="2"/>

        <!-- Boot 1.0 - Apr 2014 -->
        <circle cx="100" cy="50" r="7" fill="var(--text-muted)"/>
        <text x="100" y="32" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">1.0</text>
        <text x="100" y="75" text-anchor="middle" font-size="10" fill="var(--text-muted)">Apr 2014</text>

        <!-- Boot 2.0 - Mar 2018 -->
        <circle cx="280" cy="50" r="7" fill="#58a6ff"/>
        <text x="280" y="32" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">2.0</text>
        <text x="280" y="75" text-anchor="middle" font-size="10" fill="var(--text-muted)">Mar 2018</text>
        <text x="280" y="90" text-anchor="middle" font-size="10" fill="var(--text-muted)">Spring 5 · Java 8</text>

        <!-- Boot 3.0 - Nov 2022 -->
        <circle cx="520" cy="50" r="9" fill="#3fb950"/>
        <text x="520" y="30" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">3.0</text>
        <text x="520" y="75" text-anchor="middle" font-size="10" fill="var(--text-muted)">Nov 2022</text>
        <text x="520" y="90" text-anchor="middle" font-size="10" fill="var(--text-muted)">Spring 6 · Java 17</text>

        <!-- Boot 4.0 - date from research -->
        <circle cx="700" cy="50" r="9" fill="#d29922"/>
        <text x="700" y="30" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">4.0</text>
        <text x="700" y="75" text-anchor="middle" font-size="10" fill="var(--text-muted)">[DATE FROM RESEARCH]</text>
        <text x="700" y="90" text-anchor="middle" font-size="10" fill="var(--text-muted)">Spring 7 · Java [VERSION]</text>

        <!-- Legend -->
        <circle cx="150" cy="115" r="5" fill="#3fb950"/>
        <text x="162" y="119" font-size="11" fill="var(--text-muted)">Spring Boot 3.x (Spring 6, Java 17+, Jakarta EE 9)</text>
        <circle cx="490" cy="115" r="5" fill="#d29922"/>
        <text x="502" y="119" font-size="11" fill="var(--text-muted)">Spring Boot 4.x (Spring 7, Java [VERSION]+)</text>
      </svg>
    </div>

    <h2>Architecture Overview</h2>
    <p>Spring Boot layers opinionated defaults on top of Spring Framework. The diagram below shows the dependency stack.</p>

    <div class="diagram-wrap">
      <svg viewBox="0 0 500 220" xmlns="http://www.w3.org/2000/svg" aria-label="Spring Boot architecture layers" role="img" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif">
        <!-- Layer 3: Your Application (top) -->
        <rect x="60" y="20" width="380" height="50" rx="8" fill="var(--bg)" stroke="var(--accent)" stroke-width="2.5"/>
        <text x="250" y="42" text-anchor="middle" font-size="14" font-weight="700" fill="var(--accent)">Your Application</text>
        <text x="250" y="60" text-anchor="middle" font-size="12" fill="var(--text-muted)">@SpringBootApplication</text>

        <!-- Layer 2: Spring Boot (middle) -->
        <rect x="60" y="90" width="380" height="55" rx="8" fill="var(--surface)" stroke="var(--border)" stroke-width="1.5"/>
        <text x="250" y="113" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text)">Spring Boot</text>
        <text x="250" y="132" text-anchor="middle" font-size="11" fill="var(--text-muted)">Auto-Configuration · Starters · Embedded Server</text>

        <!-- Layer 1: Spring Framework (bottom) -->
        <rect x="60" y="165" width="380" height="45" rx="8" fill="var(--surface)" stroke="var(--border)" stroke-width="1.5"/>
        <text x="250" y="185" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text)">Spring Framework</text>
        <text x="250" y="202" text-anchor="middle" font-size="11" fill="var(--text-muted)">IoC · DI · AOP · Web · Data</text>

        <!-- Arrows -->
        <line x1="250" y1="70" x2="250" y2="88" stroke="var(--border)" stroke-width="1.5" marker-end="url(#arrowhead)"/>
        <line x1="250" y1="145" x2="250" y2="163" stroke="var(--border)" stroke-width="1.5" marker-end="url(#arrowhead)"/>
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="var(--border)"/>
          </marker>
        </defs>
      </svg>
    </div>

    <h2>Explore the Guide</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin:1.5rem 0">
      <a href="boot3-features.html" class="feature-card" style="text-decoration:none">
        <h3 id="spring-boot-3-features">Spring Boot 3 Features</h3>
        <p style="color:var(--text-muted);font-size:0.875rem">Auto-configuration, native image, observability, security — Spring 6 / Java 17 baseline</p>
      </a>
      <a href="boot4-features.html" class="feature-card" style="text-decoration:none">
        <h3 id="spring-boot-4-features">Spring Boot 4 Features</h3>
        <p style="color:var(--text-muted);font-size:0.875rem">[One-line summary from research — Spring 7 baseline features]</p>
      </a>
      <a href="version-comparison.html" class="feature-card" style="text-decoration:none">
        <h3 id="version-comparison">Version Comparison</h3>
        <p style="color:var(--text-muted);font-size:0.875rem">Side-by-side diff of Spring Boot 3.x vs 4.x — API changes, migration guide</p>
      </a>
      <a href="auto-configuration.html" class="feature-card" style="text-decoration:none">
        <h3 id="auto-configuration">Auto-Configuration</h3>
        <p style="color:var(--text-muted);font-size:0.875rem">How @EnableAutoConfiguration works, @Conditional annotations, building custom starters</p>
      </a>
      <a href="production.html" class="feature-card" style="text-decoration:none">
        <h3 id="production-tooling">Production &amp; Tooling</h3>
        <p style="color:var(--text-muted);font-size:0.875rem">Actuator health groups, Micrometer metrics, containerization, Testcontainers, graceful shutdown</p>
      </a>
    </div>

  </div>
</div>
<script src="../assets/js/nav.js"></script>
<script src="../assets/js/prism.js"></script>
<script src="../assets/js/search.js"></script>
</body>
</html>
```

Fill in all `[PLACEHOLDER]` text from research before saving.

- [ ] **Step 2: Rebuild index and verify**

```bash
python scripts/build_index.py
python -c "import json; d=json.load(open('assets/search-index.json')); v=[e for e in d if 'spring-boot/index' in e.get('href','')]; print(f'spring-boot/index entries: {len(v)}')"
```

Expected: ≥ 5 entries for spring-boot/index.html.

- [ ] **Step 3: Visual check**

```bash
python -m http.server 8080
```

Open `http://localhost:8080/spring-boot/index.html`. Verify:
- "Spring Boot" active in sidebar
- Version timeline SVG renders with colored dots
- Architecture diagram shows 3 layers
- 5 card links displayed in grid

Stop the server.

- [ ] **Step 4: Commit**

```bash
git add spring-boot/index.html assets/search-index.json
git commit -m "feat: add Spring Boot overview page"
```

---

### Task 3: spring-boot/boot3-features.html

**Files:**
- Create: `spring-boot/boot3-features.html`

**Interfaces:**
- Consumes: `.badge-boot3` from Task 1
- Produces: ~50 search index entries; template that Task 4 mirrors

**Research step — run these web searches BEFORE writing HTML:**
1. `Spring Boot 3.0 what's new release notes` — official announcement
2. `docs.spring.io/spring-boot 3.x reference` — features reference
3. `Spring Boot 3 auto-configuration changes` — what changed from 2.x
4. `Spring Boot 3 native image GraalVM support`
5. `Spring Boot 3 observability Micrometer tracing`
6. `Spring Boot 3 security changes`
7. `Spring Boot 3.x latest version number` — exact GA version for pom.xml snippets

Record: exact Spring Boot 3.x GA version, parent pom version, key features per category.

- [ ] **Step 1: Create boot3-features.html with skeleton**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Spring Boot 3 Features</title>
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

    <h1>Spring Boot 3 Features</h1>
    <div style="margin-bottom:1.25rem">
      <span class="version-badge badge-boot3">Spring Boot 3.x — [LATEST_VERSION]</span>
    </div>
    <p>[Intro: Spring Boot 3.x requires Java 17+, built on Spring Framework 6.x, Jakarta EE 9+ namespace. Headline theme of the release. Source from official docs.]</p>

    <div class="callout info">
      <strong>Jakarta EE 9 namespace</strong>
      All <code>javax.*</code> imports became <code>jakarta.*</code> in Spring Boot 3. This is a breaking change from Spring Boot 2.x.
    </div>

    <div class="tab-container">
      <div class="tabs">
        <button class="tab-btn active" data-tab="tab-autoconfig">Auto-Configuration</button>
        <button class="tab-btn" data-tab="tab-web">Web</button>
        <button class="tab-btn" data-tab="tab-data">Data</button>
        <button class="tab-btn" data-tab="tab-security">Security</button>
        <button class="tab-btn" data-tab="tab-observability">Observability</button>
        <button class="tab-btn" data-tab="tab-native">Native / AOT</button>
      </div>

      <div class="tab-panel active" id="tab-autoconfig">
        <!-- Feature cards for auto-configuration changes in Boot 3 -->
      </div>
      <div class="tab-panel" id="tab-web">
        <!-- Feature cards for web (MVC, WebFlux, REST) -->
      </div>
      <div class="tab-panel" id="tab-data">
        <!-- Feature cards for data (JPA, R2DBC, MongoDB) -->
      </div>
      <div class="tab-panel" id="tab-security">
        <!-- Feature cards for security -->
      </div>
      <div class="tab-panel" id="tab-observability">
        <!-- Feature cards for Micrometer, tracing, metrics -->
      </div>
      <div class="tab-panel" id="tab-native">
        <!-- Feature cards for GraalVM native image, AOT -->
      </div>
    </div>

    <section class="cheatsheet">
      <h2>Spring Boot 3 Cheatsheet</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Annotation / Starter / Property</th><th>Purpose</th><th>Notes</th></tr>
          </thead>
          <tbody>
            <!-- One row per key annotation, starter, or property from each tab -->
          </tbody>
        </table>
      </div>
    </section>

  </div>
</div>
<script src="../assets/js/nav.js"></script>
<script src="../assets/js/prism.js"></script>
<script src="../assets/js/search.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write feature cards for each tab**

For each tab, add a minimum of 3 feature cards. Follow the exact template:

```html
<div class="feature-card">
  <h3 id="[kebab-case-id]">[Feature Name]</h3>
  <p>[2–4 sentence explanation from official Spring Boot 3 docs or blog. Explain what it does and why it matters.]</p>

  <h4>Dependency (pom.xml)</h4>
  <pre><code class="language-xml">&lt;parent&gt;
  &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
  &lt;artifactId&gt;spring-boot-starter-parent&lt;/artifactId&gt;
  &lt;version&gt;[EXACT_3.X_VERSION]&lt;/version&gt;
&lt;/parent&gt;</code></pre>

  <h4>Example</h4>
  <pre><code class="language-java">// [What this demonstrates]
[Working Java code example. Escape all generics: &lt;T&gt; not <T>]</code></pre>
</div>
```

- Auto-Configuration tab: cover `AutoConfiguration.imports` (replaces `spring.factories`), `@EnableAutoConfiguration`, conditions report
- Web tab: cover `@HttpExchange` declarative clients, `ProblemDetail` RFC 7807 responses, any new REST features
- Data tab: cover JPA updates, R2DBC improvements, Testcontainers `@ServiceConnection`
- Security tab: cover Spring Security 6 changes (method security, `SecurityFilterChain` configuration-only approach)
- Observability tab: cover Micrometer 1.x auto-configuration, distributed tracing with Micrometer Tracing, Zipkin/OpenTelemetry integration
- Native tab: cover `spring-boot:build-image` with Paketo buildpacks, `spring-aot-maven-plugin`, `@ImportRuntimeHints`, native testing

- [ ] **Step 3: Write cheatsheet**

At least one row per key annotation/starter from each tab.

- [ ] **Step 4: Run build_index.py and verify**

```bash
python scripts/build_index.py
python -c "import json; d=json.load(open('assets/search-index.json')); v=[e for e in d if 'boot3-features' in e.get('href','')]; print(f'boot3-features entries: {len(v)}')"
```

Expected: ≥ 50 entries for boot3-features.html.

- [ ] **Step 5: Visual check**

```bash
python -m http.server 8080
```

Open `http://localhost:8080/spring-boot/boot3-features.html`. Verify tabs work, code is highlighted, page is mobile-friendly.

- [ ] **Step 6: Commit**

```bash
git add spring-boot/boot3-features.html assets/search-index.json
git commit -m "feat: add Spring Boot 3 features page"
```

---

### Task 4: spring-boot/boot4-features.html

**Files:**
- Create: `spring-boot/boot4-features.html`

**Interfaces:**
- Consumes: `.badge-boot4` from Task 1; boot3-features.html structure from Task 3 as template
- Produces: ~50 search index entries

**Research step — run these web searches BEFORE writing HTML:**
1. `Spring Boot 4.0 what's new release notes`
2. `Spring Boot 4.0 GA release date version number`
3. `Spring Boot 4 breaking changes from 3`
4. `Spring Boot 4 new features`
5. `Spring Boot 4 Java baseline version`
6. `docs.spring.io/spring-boot 4.x`

Record: exact Spring Boot 4.x GA version, Java baseline, key features per category.

- [ ] **Step 1: Create boot4-features.html**

Structure is identical to boot3-features.html. Replace:
- `<title>Spring Boot 3 Features</title>` → `<title>Spring Boot 4 Features</title>`
- `<h1>Spring Boot 3 Features</h1>` → `<h1>Spring Boot 4 Features</h1>`
- `badge-boot3` → `badge-boot4`
- `Spring Boot 3.x — [VERSION]` → `Spring Boot 4.x — [VERSION]`
- Jakarta EE callout: update to reflect Boot 4's Jakarta EE version (from research)
- Tab ids: prefix with `b4-` to ensure uniqueness on the page (e.g., `id="b4-tab-autoconfig"`, `data-tab="b4-tab-autoconfig"`)
- Cheatsheet title: `Spring Boot 4 Cheatsheet`

Tabs (adjust based on research — add/remove tabs to match actual Boot 4 content areas):
- Auto-Configuration
- Web
- Data
- Security
- Observability
- Native / AOT
- [Any new Spring Boot 4.x-specific category from research]

- [ ] **Step 2: Write feature cards**

Same template as Task 3 Step 2. Minimum 3 cards per tab. Use exact Spring Boot 4.x version in dependency snippets.

Add a migration callout where Boot 4 breaks compatibility with Boot 3:
```html
<div class="callout warn">
  <strong>Migration from Boot 3</strong>
  [One sentence on what Boot 3 users need to change for this feature.]
</div>
```

- [ ] **Step 3: Write cheatsheet**

Same structure as Task 3. Spring Boot 4-specific annotations and properties.

- [ ] **Step 4: Run build_index.py and verify**

```bash
python scripts/build_index.py
python -c "import json; d=json.load(open('assets/search-index.json')); v=[e for e in d if 'boot4-features' in e.get('href','')]; print(f'boot4-features entries: {len(v)}')"
```

Expected: ≥ 50 entries.

- [ ] **Step 5: Visual check and commit**

```bash
python -m http.server 8080
```

Verify boot4-features.html renders, tabs work, badge color is green.

```bash
git add spring-boot/boot4-features.html assets/search-index.json
git commit -m "feat: add Spring Boot 4 features page"
```

---

### Task 5: spring-boot/version-comparison.html

**Files:**
- Create: `spring-boot/version-comparison.html`

**Interfaces:**
- Consumes: Boot 3 and Boot 4 feature knowledge from Tasks 3 and 4 research
- Produces: ~30 search index entries (comparison rows with `<h3 class="comparison-feature">` anchors)

**Template:** Mirror `spring-core/version-comparison.html` exactly — same filter bar, same row structure with expandable diff panels, same `<h3 class="comparison-feature" id="...">` pattern for searchability.

**Research step:** Using knowledge from Tasks 3 and 4 research, compile a list of at minimum 10 differences between Boot 3.x and 4.x. Categorize each as: New / Changed / Removed / Deprecated.

- [ ] **Step 1: Create version-comparison.html skeleton**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Spring Boot Version Comparison</title>
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

    <h1>Spring Boot: 3.x vs 4.x</h1>
    <p>[One sentence intro: what the biggest differences are between Boot 3 and Boot 4.]</p>

    <!-- Filter bar -->
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin:1.5rem 0 1rem">
      <button class="filter-btn active" data-filter="all" style="padding:0.3rem 0.75rem;border-radius:20px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);cursor:pointer;font-size:0.8rem">All</button>
      <button class="filter-btn" data-filter="new" style="padding:0.3rem 0.75rem;border-radius:20px;border:1px solid var(--border);background:var(--surface);color:var(--text-muted);cursor:pointer;font-size:0.8rem">New</button>
      <button class="filter-btn" data-filter="changed" style="padding:0.3rem 0.75rem;border-radius:20px;border:1px solid var(--border);background:var(--surface);color:var(--text-muted);cursor:pointer;font-size:0.8rem">Changed</button>
      <button class="filter-btn" data-filter="removed" style="padding:0.3rem 0.75rem;border-radius:20px;border:1px solid var(--border);background:var(--surface);color:var(--text-muted);cursor:pointer;font-size:0.8rem">Removed</button>
      <button class="filter-btn" data-filter="deprecated" style="padding:0.3rem 0.75rem;border-radius:20px;border:1px solid var(--border);background:var(--surface);color:var(--text-muted);cursor:pointer;font-size:0.8rem">Deprecated</button>
    </div>

    <div class="table-wrap">
      <table id="comparison-table">
        <thead>
          <tr>
            <th style="width:25%">Feature</th>
            <th style="width:30%">Spring Boot 3.x</th>
            <th style="width:30%">Spring Boot 4.x</th>
            <th style="width:15%">Type</th>
          </tr>
        </thead>
        <tbody>
          <!-- Rows inserted in Step 2 -->
        </tbody>
      </table>
    </div>

    <section class="cheatsheet">
      <h2>Migration Cheatsheet</h2>
      <div class="table-wrap">
        <table>
          <thead><tr><th>What to change</th><th>Boot 3.x</th><th>Boot 4.x</th></tr></thead>
          <tbody>
            <!-- One row per breaking change -->
          </tbody>
        </table>
      </div>
    </section>

  </div>
</div>
<script>
  // Filter logic
  document.addEventListener('DOMContentLoaded', () => {
    const btns = document.querySelectorAll('.filter-btn');
    const rows = document.querySelectorAll('.comparison-row');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        btns.forEach(b => { b.style.background = 'var(--surface)'; b.style.color = 'var(--text-muted)'; b.classList.remove('active'); });
        btn.style.background = 'var(--surface-2)'; btn.style.color = 'var(--text)'; btn.classList.add('active');
        rows.forEach(row => {
          const show = filter === 'all' || row.dataset.type === filter;
          row.style.display = show ? '' : 'none';
          const diffRow = row.nextElementSibling;
          if (diffRow && diffRow.classList.contains('diff-row')) diffRow.style.display = 'none';
        });
      });
    });
    // Expandable rows
    document.querySelectorAll('.comparison-row').forEach(row => {
      row.style.cursor = 'pointer';
      row.addEventListener('click', () => {
        const diffRow = row.nextElementSibling;
        if (diffRow && diffRow.classList.contains('diff-row')) {
          diffRow.style.display = diffRow.style.display === 'none' ? '' : 'none';
        }
      });
    });
  });
</script>
<script src="../assets/js/nav.js"></script>
<script src="../assets/js/prism.js"></script>
<script src="../assets/js/search.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write comparison rows**

For each of the ≥10 differences identified in research, add a `<tr class="comparison-row">` + `<tr class="diff-row">` pair to `<tbody>`:

```html
<tr class="comparison-row" data-type="[new|changed|removed|deprecated]">
  <td>
    <h3 class="comparison-feature" id="[kebab-case-id]">[Feature Name]</h3>
  </td>
  <td>[Spring Boot 3.x behavior — one sentence]</td>
  <td>[Spring Boot 4.x behavior — one sentence]</td>
  <td><span class="version-badge [badge-class]">[Type]</span></td>
</tr>
<tr class="diff-row" style="display:none">
  <td colspan="4" style="padding:0.75rem 1rem;background:var(--surface)">
    <div class="diff-grid">
      <div class="diff-before">
        <div class="diff-label">Boot 3.x</div>
        <pre><code class="language-[java|yaml|xml]">[Spring Boot 3 code example for this feature]</code></pre>
      </div>
      <div class="diff-after">
        <div class="diff-label">Boot 4.x</div>
        <pre><code class="language-[java|yaml|xml]">[Spring Boot 4 code example showing the change]</code></pre>
      </div>
    </div>
  </td>
</tr>
```

Badge classes: use `badge-v5` for Changed/Removed rows (amber tone), `badge-boot4` for New rows, `badge-v7` for Deprecated rows. Exact mapping:
- New → `badge-boot4` (green)
- Changed → `badge-v7` (amber)
- Removed → danger inline style: `style="background:rgba(248,81,73,0.15);color:#f85149;border:1px solid #f8514944;padding:0.25rem 0.75rem;border-radius:20px;font-size:0.78rem;font-weight:600"`
- Deprecated → `badge-v7` (amber)

- [ ] **Step 3: Write migration cheatsheet rows**

For each breaking change in the table, add a `<tr>` to the cheatsheet:
```html
<tr>
  <td>[What to change]</td>
  <td><code>[Boot 3 class/annotation/property]</code></td>
  <td><code>[Boot 4 replacement]</code></td>
</tr>
```

- [ ] **Step 4: Run build_index.py and verify**

```bash
python scripts/build_index.py
python -c "import json; d=json.load(open('assets/search-index.json')); v=[e for e in d if 'spring-boot/version' in e.get('href','')]; print(f'version-comparison entries: {len(v)}')"
```

Expected: ≥ 25 entries (each comparison row's `<h3 class="comparison-feature">` contributes one entry).

- [ ] **Step 5: Visual check and commit**

Verify filter buttons work, expandable rows expand on click, diff grid shows side by side.

```bash
git add spring-boot/version-comparison.html assets/search-index.json
git commit -m "feat: add Spring Boot version comparison page"
```

---

### Task 6: spring-boot/auto-configuration.html

**Files:**
- Create: `spring-boot/auto-configuration.html`

**Interfaces:**
- Produces: ~40 search index entries; SVG diagram of auto-config loading sequence

**Research step:**
1. `Spring Boot AutoConfiguration.imports vs spring.factories` — the Boot 2→3 change
2. `@ConditionalOnClass @ConditionalOnMissingBean @ConditionalOnProperty examples`
3. `Spring Boot create custom starter tutorial`
4. `Spring Boot conditions evaluation report --debug`
5. `SpringFactoriesLoader AutoConfigurationImportSelector`

- [ ] **Step 1: Create auto-configuration.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Spring Boot Auto-Configuration</title>
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

    <h1>Spring Boot Auto-Configuration</h1>
    <p>[2-sentence intro: what auto-configuration is, how it removes manual bean wiring. Source from official docs.]</p>

    <h2>How Auto-Configuration Works</h2>
    <p>[Explanation of the loading sequence: @SpringBootApplication → @EnableAutoConfiguration → META-INF lookup → @Conditional evaluation → bean registration.]</p>

    <div class="diagram-wrap">
      <svg viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg" aria-label="Auto-configuration loading sequence" role="img" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif">
        <!-- Node 1: @SpringBootApplication -->
        <rect x="190" y="10" width="300" height="44" rx="8" fill="var(--accent)" stroke="none"/>
        <text x="340" y="37" text-anchor="middle" font-size="13" font-weight="700" fill="var(--text-inverse)">@SpringBootApplication</text>
        <!-- Arrow 1→2 -->
        <line x1="340" y1="54" x2="340" y2="74" stroke="var(--accent)" stroke-width="2" marker-end="url(#arr)"/>
        <!-- Node 2: @EnableAutoConfiguration -->
        <rect x="190" y="74" width="300" height="44" rx="8" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/>
        <text x="340" y="101" text-anchor="middle" font-size="13" fill="var(--text)">@EnableAutoConfiguration</text>
        <!-- Arrow 2→3 -->
        <line x1="340" y1="118" x2="340" y2="138" stroke="var(--border)" stroke-width="2" marker-end="url(#arr)"/>
        <!-- Node 3: AutoConfiguration.imports lookup -->
        <rect x="150" y="138" width="380" height="44" rx="8" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/>
        <text x="340" y="159" text-anchor="middle" font-size="12" fill="var(--text)">META-INF/spring/</text>
        <text x="340" y="175" text-anchor="middle" font-size="11" fill="var(--text-muted)">AutoConfiguration.imports lookup</text>
        <!-- Arrow 3→4 -->
        <line x1="340" y1="182" x2="340" y2="202" stroke="var(--border)" stroke-width="2" marker-end="url(#arr)"/>
        <!-- Node 4: Diamond — @Conditional checks -->
        <polygon points="340,202 460,242 340,282 220,242" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/>
        <text x="340" y="238" text-anchor="middle" font-size="12" fill="var(--text)">@Conditional</text>
        <text x="340" y="255" text-anchor="middle" font-size="11" fill="var(--text-muted)">checks pass?</text>
        <!-- Yes arrow → Register beans -->
        <line x1="340" y1="282" x2="340" y2="302" stroke="var(--accent)" stroke-width="2" marker-end="url(#arr-accent)"/>
        <text x="350" y="296" font-size="11" fill="var(--accent)">Yes</text>
        <rect x="215" y="302" width="250" height="32" rx="8" fill="var(--accent)" stroke="none"/>
        <text x="340" y="323" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text-inverse)">Register Beans</text>
        <!-- No arrow → Skip (right side) -->
        <line x1="460" y1="242" x2="580" y2="242" stroke="var(--text-muted)" stroke-width="1.5" marker-end="url(#arr-muted)"/>
        <text x="515" y="233" font-size="11" fill="var(--text-muted)">No</text>
        <rect x="580" y="220" width="80" height="44" rx="8" fill="var(--surface)" stroke="var(--border)" stroke-width="1.5"/>
        <text x="620" y="247" text-anchor="middle" font-size="12" fill="var(--text-muted)">Skip</text>
        <!-- Arrow markers -->
        <defs>
          <marker id="arr" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
            <polygon points="0 0,8 3,0 6" fill="var(--border)"/>
          </marker>
          <marker id="arr-accent" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
            <polygon points="0 0,8 3,0 6" fill="var(--accent)"/>
          </marker>
          <marker id="arr-muted" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
            <polygon points="0 0,8 3,0 6" fill="var(--text-muted)"/>
          </marker>
        </defs>
      </svg>
    </div>

    <h2>@Conditional Annotations</h2>
    <!-- One feature card per @Conditional annotation. IDs: conditional-on-class, conditional-on-missing-bean, etc. -->

    <h2>AutoConfiguration.imports vs spring.factories</h2>
    <!-- One feature card explaining the Boot 2→3 change -->

    <h2>Debugging Auto-Configuration</h2>
    <!-- Feature cards: --debug flag, /actuator/conditions endpoint, reading the conditions report -->

    <h2>Building a Custom Starter</h2>
    <!-- Step-by-step feature cards: autoconfigure module, starter module, AutoConfiguration.imports registration, consuming the starter -->
    <!-- This is the most code-heavy section — include full pom.xml for both modules and the AutoConfiguration class -->

    <section class="cheatsheet">
      <h2>Auto-Configuration Cheatsheet</h2>
      <div class="table-wrap">
        <table>
          <thead><tr><th>@Conditional Annotation</th><th>Fires when</th><th>Example use case</th></tr></thead>
          <tbody><!-- One row per @Conditional type --></tbody>
        </table>
      </div>
    </section>

  </div>
</div>
<script src="../assets/js/nav.js"></script>
<script src="../assets/js/prism.js"></script>
<script src="../assets/js/search.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write SVG loading-sequence diagram**

Model after `spring-core/lifecycle.html`'s SVG. Nodes:
1. `@SpringBootApplication` (entry point, accent-colored box)
2. `@EnableAutoConfiguration`
3. `AutoConfiguration.imports` lookup
4. `@Conditional` evaluation (diamond shape)
5. "Conditions met?" → Yes: Register beans | No: Skip

Use `var(--accent)` for the happy-path arrows, `var(--text-muted)` for skip path, `var(--text-inverse)` for text inside filled boxes.

- [ ] **Step 3: Write @Conditional feature cards**

One card per annotation, id in kebab-case:
- `id="conditional-on-class"` → `@ConditionalOnClass`
- `id="conditional-on-missing-bean"` → `@ConditionalOnMissingBean`
- `id="conditional-on-property"` → `@ConditionalOnProperty`
- `id="conditional-on-web-application"` → `@ConditionalOnWebApplication`
- `id="conditional-on-expression"` → `@ConditionalOnExpression`
- Add more from research

Each card: explanation + working code example showing the annotation in a `@Configuration` class.

- [ ] **Step 4: Write custom starter section**

This section has 4 sequential feature cards:

Card 1 — `id="custom-starter-autoconfigure-module"`: The autoconfigure module structure with this exact `pom.xml`:
```xml
&lt;artifactId&gt;my-feature-spring-boot-autoconfigure&lt;/artifactId&gt;
&lt;dependencies&gt;
  &lt;dependency&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-autoconfigure&lt;/artifactId&gt;
  &lt;/dependency&gt;
&lt;/dependencies&gt;
```
And the `@AutoConfiguration` class:
```java
@AutoConfiguration
@ConditionalOnClass(MyFeatureService.class)
public class MyFeatureAutoConfiguration {
    @Bean
    @ConditionalOnMissingBean
    public MyFeatureService myFeatureService() {
        return new MyFeatureService();
    }
}
```

Card 2 — `id="custom-starter-module"`: The starter module with `pom.xml` that depends on the autoconfigure module.

Card 3 — `id="custom-starter-registration"`: The `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` file containing the fully-qualified class name.

Card 4 — `id="custom-starter-consuming"`: How to use the starter in another project — just add the starter dependency, no `@Import` needed.

- [ ] **Step 5: Run build_index.py and verify**

```bash
python scripts/build_index.py
python -c "import json; d=json.load(open('assets/search-index.json')); v=[e for e in d if 'auto-configuration' in e.get('href','')]; print(f'auto-configuration entries: {len(v)}')"
```

Expected: ≥ 40 entries.

- [ ] **Step 6: Visual check and commit**

```bash
git add spring-boot/auto-configuration.html assets/search-index.json
git commit -m "feat: add Spring Boot auto-configuration deep-dive page"
```

---

### Task 7: spring-boot/production.html

**Files:**
- Create: `spring-boot/production.html`

**Interfaces:**
- Produces: ~40 search index entries

**Note:** This page does NOT re-cover Initializr, DevTools, or basic Actuator setup — those are in the Phase 1 `spring-core/tooling.html`. This page covers production-grade configuration topics only.

**Research step:**
1. `Spring Boot Actuator health groups Kubernetes probes`
2. `Spring Boot Micrometer custom metrics Counter Timer Gauge`
3. `Spring Boot structured logging JSON application.properties`
4. `spring-boot-maven-plugin layered JAR dockerfile`
5. `Spring Boot Testcontainers @ServiceConnection example`
6. `Spring Boot graceful shutdown configuration`
7. `spring-boot-maven-plugin build-image Cloud Native Buildpacks`

- [ ] **Step 1: Create production.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Spring Boot Production</title>
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

    <h1>Spring Boot Production &amp; Tooling</h1>
    <p>Production-grade topics that go beyond getting an app running locally: Kubernetes health probes, custom metrics, structured logging, containerization, integration testing with Testcontainers, and graceful shutdown.</p>

    <div class="callout info">
      <strong>Phase 1 tooling page</strong>
      Basic setup (Initializr, DevTools, Actuator overview, IDE configuration) is covered in <a href="../spring-core/tooling.html">Spring Core — Tooling &amp; Setup</a>.
    </div>

    <h2>Actuator Health Groups</h2>

    <div class="feature-card">
      <h3 id="health-groups-kubernetes">Health Groups for Kubernetes</h3>
      [explanation and code]
    </div>

    <div class="feature-card">
      <h3 id="custom-health-indicator">Custom HealthIndicator</h3>
      [explanation and code]
    </div>

    <div class="feature-card">
      <h3 id="securing-actuator-endpoints">Securing Actuator Endpoints</h3>
      [explanation and code]
    </div>

    <h2>Micrometer Metrics</h2>

    <div class="feature-card">
      <h3 id="auto-configured-meters">Auto-Configured Meters</h3>
      [explanation: JVM metrics, HTTP server metrics, DataSource metrics — all auto-registered]
    </div>

    <div class="feature-card">
      <h3 id="custom-counter-timer-gauge">Custom Counter, Timer, Gauge</h3>
      [explanation + Java code registering custom meters with MeterRegistry]
    </div>

    <div class="feature-card">
      <h3 id="prometheus-export">Prometheus Export</h3>
      [pom.xml dependency + application.properties config + what the /actuator/prometheus endpoint returns]
    </div>

    <h2>Structured Logging</h2>

    <div class="feature-card">
      <h3 id="json-structured-logging">JSON Structured Logging</h3>
      [explanation + application.properties config + example JSON log output as a code block]
    </div>

    <h2>Containerization</h2>

    <div class="feature-card">
      <h3 id="layered-jars">Layered JARs</h3>
      [explanation of the 4 layers: dependencies, spring-boot-loader, snapshot-dependencies, application]
      [pom.xml plugin config + commands: ./mvnw spring-boot:build-image]
    </div>

    <div class="feature-card">
      <h3 id="cloud-native-buildpacks">Cloud Native Buildpacks</h3>
      [explanation + ./mvnw spring-boot:build-image command + what it produces]
    </div>

    <div class="feature-card">
      <h3 id="dockerfile-layered-extraction">Dockerfile with Layer Extraction</h3>
      [exact Dockerfile using COPY --from= for each layer]
    </div>

    <h2>Testcontainers</h2>

    <div class="feature-card">
      <h3 id="testcontainers-service-connection">@ServiceConnection</h3>
      [explanation + Java test code with @SpringBootTest + @ServiceConnection + exact pom.xml dependency]
    </div>

    <h2>Graceful Shutdown</h2>

    <div class="feature-card">
      <h3 id="graceful-shutdown-config">Graceful Shutdown Configuration</h3>
      [application.properties config: server.shutdown=graceful, spring.lifecycle.timeout-per-shutdown-phase]
      [explanation of what happens to in-flight requests during shutdown]
    </div>

    <section class="cheatsheet">
      <h2>Production Cheatsheet</h2>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Property / Annotation</th><th>Purpose</th><th>Default</th></tr></thead>
          <tbody>
            <!-- One row per key config property or annotation from above -->
          </tbody>
        </table>
      </div>
    </section>

  </div>
</div>
<script src="../assets/js/nav.js"></script>
<script src="../assets/js/prism.js"></script>
<script src="../assets/js/search.js"></script>
</body>
</html>
```

- [ ] **Step 2: Fill in all feature cards**

Replace every `[explanation and code]` placeholder with:
- A 2–4 sentence explanation from official Spring Boot docs
- A working code example or configuration snippet
- The exact dependency version in pom.xml where relevant

The Kubernetes health groups card must include:
```yaml
# application.yml
management:
  endpoint:
    health:
      probes:
        enabled: true
  health:
    livenessState:
      enabled: true
    readinessState:
      enabled: true
```
And the Kubernetes Deployment YAML with `livenessProbe` and `readinessProbe` pointing to `/actuator/health/liveness` and `/actuator/health/readiness`.

The layered JARs Dockerfile must use the actual multi-stage extraction pattern:
```dockerfile
FROM eclipse-temurin:21-jre as builder
WORKDIR /application
COPY target/*.jar application.jar
RUN java -Djarmode=layertools -jar application.jar extract

FROM eclipse-temurin:21-jre
WORKDIR /application
COPY --from=builder /application/dependencies/ ./
COPY --from=builder /application/spring-boot-loader/ ./
COPY --from=builder /application/snapshot-dependencies/ ./
COPY --from=builder /application/application/ ./
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
```
(Update Java version to match the Spring Boot 4 baseline from research.)

- [ ] **Step 3: Write cheatsheet rows**

At minimum, one row per `application.properties` key and one row per annotation from the page content.

- [ ] **Step 4: Run build_index.py and verify**

```bash
python scripts/build_index.py
python -c "import json; d=json.load(open('assets/search-index.json')); v=[e for e in d if 'production' in e.get('href','')]; print(f'production entries: {len(v)}')"
```

Expected: ≥ 40 entries.

- [ ] **Step 5: Visual check and commit**

```bash
git add spring-boot/production.html assets/search-index.json
git commit -m "feat: add Spring Boot production and tooling page"
```

---

### Task 8: Final Index Rebuild and Push

**Files:**
- Modify: `assets/search-index.json` (final rebuild)

- [ ] **Step 1: Run final index rebuild**

```bash
python scripts/build_index.py
```

- [ ] **Step 2: Run the existing test suite**

```bash
python scripts/test_build_index.py
```

Expected: all tests pass.

- [ ] **Step 3: Verify total entry count**

```bash
python -c "import json; d=json.load(open('assets/search-index.json')); print('Total entries:', len(d)); [print(f'  {k}: {len([e for e in d if k in e.get(\"href\",\"\")])}') for k in ['spring-boot/index','boot3','boot4','version-comparison','auto-configuration','production']]"
```

Expected totals:
- `spring-boot/index`: ≥ 5
- `boot3-features`: ≥ 50
- `boot4-features`: ≥ 50
- `spring-boot/version-comparison` (version-comparison): ≥ 25
- `auto-configuration`: ≥ 40
- `production`: ≥ 40

- [ ] **Step 4: Full cross-site navigation check**

```bash
python -m http.server 8080
```

Verify:
- From `http://localhost:8080/index.html` → Spring Boot group visible, all 6 items clickable
- From each Spring Boot page → active nav item highlighted, Home link works, Spring Core links work
- Search for "Spring Boot" → results from multiple Spring Boot pages
- Search for "@ConditionalOnClass" → result from auto-configuration.html
- Mobile: open at ≤600px width → hamburger shows, sidebar overlays correctly, no horizontal scroll

Stop the server.

- [ ] **Step 5: Commit and push**

```bash
git add assets/search-index.json
git commit -m "build: rebuild search index after Spring Boot Phase 2 completion"
git push origin features
```
