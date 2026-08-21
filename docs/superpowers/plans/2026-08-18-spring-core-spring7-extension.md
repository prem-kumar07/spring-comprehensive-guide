# Spring Core — Spring 7.x Extension Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Spring 7.x content to the existing Spring Core section: CSS badge, nav entry, new spring7-features.html page, and a 3-column version-comparison update.

**Architecture:** Pure static HTML/CSS/JS site. All pages follow a strict template (version banner → tabbed feature cards → cheatsheet section). Content is sourced via web search during implementation. Running `python scripts/build_index.py` after each page and checking the entry count is the primary verification step — the indexer only picks up content inside proper heading elements, so a low count means structural problems.

**Tech Stack:** HTML5, CSS3 (custom properties via `assets/css/style.css`), vanilla JS (`assets/js/nav.js`), Python 3 (`scripts/build_index.py`), Prism.js and Fuse.js already bundled.

**Spec:** `docs/superpowers/specs/2026-08-18-spring-core-spring7-extension.md`

## Global Constraints

- No external CDN dependencies — all JS/CSS already bundled; never add a `<link>` or `<script src>` pointing outside the repo
- All hrefs in nav.js must be root-relative strings like `ROOT + 'spring-core/spring7-features.html'` — never absolute paths with a leading `/`
- All `<h3>` feature headings must have unique `id` attributes in kebab-case (e.g., `id="virtual-threads-enhancements"`)
- Code blocks with Java generics: always escape angle brackets — write `&lt;T&gt;` not `<T>`, `&lt;List&lt;String&gt;&gt;` not `<List<String>>`
- Every HTML table must be wrapped in `<div class="table-wrap">` for mobile scroll
- SVG diagrams: all colors via CSS variables only — `var(--text)`, `var(--accent)`, `var(--border)`, `var(--text-muted)`, `var(--text-inverse)` — never hardcoded hex values
- Cheatsheet section: every feature page ends with `<section class="cheatsheet"><h2>Cheatsheet</h2>...</section>`
- Git commit messages: plain descriptive text only — no `Co-Authored-By` trailers of any kind
- After any HTML change: run `python scripts/build_index.py` from repo root, then `git add assets/search-index.json`
- Serve locally with `python -m http.server 8080` from repo root to verify pages visually

---

### Task 1: CSS Badge and Nav Entry

**Files:**
- Modify: `assets/css/style.css` (add `.badge-v7` after `.badge-v6` block)
- Modify: `assets/js/nav.js` (add Spring 7 Features item)

**Interfaces:**
- Produces: `.badge-v7` CSS class available for use in spring7-features.html (Task 2); "Spring 7 Features" nav item linking to `spring-core/spring7-features.html`

- [ ] **Step 1: Add `.badge-v7` CSS**

Open `assets/css/style.css`. Find the `.badge-v6` rule (around line 257):
```css
.badge-v6 { background: rgba(63,185,80,0.15);  color: #3fb950; border: 1px solid #3fb95044; }
```
Add immediately after it:
```css
.badge-v7 { background: rgba(210,153,34,0.15); color: #d29922; border: 1px solid #d2992244; }
```

- [ ] **Step 2: Add Spring 7 nav item**

Open `assets/js/nav.js`. Find the Spring Core items array:
```javascript
{ label: 'Spring 6 Features',  href: ROOT + 'spring-core/spring6-features.html' },
{ label: 'Version Comparison', href: ROOT + 'spring-core/version-comparison.html' },
```
Insert between those two lines:
```javascript
{ label: 'Spring 7 Features',  href: ROOT + 'spring-core/spring7-features.html' },
```

- [ ] **Step 3: Verify nav renders**

Run `python -m http.server 8080` from repo root. Open `http://localhost:8080/spring-core/index.html`.
Expected: sidebar shows "Spring 7 Features" between "Spring 6 Features" and "Version Comparison". The link leads to a 404 (page doesn't exist yet — that's fine).

Stop the server (Ctrl+C).

- [ ] **Step 4: Commit**

```bash
git add assets/css/style.css assets/js/nav.js
git commit -m "feat: add Spring 7 CSS badge and nav entry"
```

---

### Task 2: spring7-features.html

**Files:**
- Create: `spring-core/spring7-features.html`

**Interfaces:**
- Consumes: `.badge-v7` CSS class from Task 1; `../assets/css/style.css`, `../assets/js/nav.js`, `../assets/js/prism.js`, `../assets/js/search.js`
- Produces: ~40–60 search index entries (verified by build_index.py in the step below)

**Research step — run these web searches BEFORE writing any HTML:**

Search for the following (use WebSearch tool or browser):
1. `"Spring Framework 7" site:spring.io` — official release announcement
2. `Spring Framework 7.0 what's new changelog` — feature list
3. `docs.spring.io spring-framework 7` — official reference docs
4. `Spring Framework 7 Java baseline requirements` — to get the exact Java version floor
5. `Spring Framework 7 Jakarta EE version` — to get the EE baseline
6. Note the exact Spring Framework 7.x GA release version and date

Record from research:
- Exact version (e.g., `7.0.0`)
- Release date
- Java baseline (e.g., Java 21+)
- Jakarta EE version
- Feature categories and their key features

- [ ] **Step 1: Create the HTML file with the page skeleton**

Create `spring-core/spring7-features.html` with this exact skeleton:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Spring 7 Features</title>
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

    <h1>Spring 7 Features</h1>
    <div style="margin-bottom:1.25rem">
      <span class="version-badge badge-v7">Spring 7.x — [RELEASE_DATE_FROM_RESEARCH]</span>
    </div>
    <p>[One-paragraph intro: what Spring 7 is, its Java baseline, its Jakarta EE baseline, and the headline theme of the release. Source from official docs.]</p>

    <div class="callout info">
      <strong>Java [VERSION] required</strong>
      Spring 7.x requires Java [VERSION] or higher. [One sentence on what changed from Spring 6.]
    </div>

    <div class="tab-container">
      <div class="tabs">
        <!-- Tab buttons — one per category from research. Example: -->
        <button class="tab-btn active" data-tab="tab-core">Core Container</button>
        <button class="tab-btn" data-tab="tab-web">Web</button>
        <!-- Add more tabs based on research findings -->
      </div>

      <div class="tab-panel active" id="tab-core">
        <!-- Feature cards go here — see Step 2 for the card template -->
      </div>

      <div class="tab-panel" id="tab-web">
        <!-- Feature cards go here -->
      </div>
      <!-- Add more tab-panel divs matching each tab-btn above -->
    </div>

    <section class="cheatsheet">
      <h2>Spring 7 Cheatsheet</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Annotation / API</th><th>Purpose</th><th>Notes</th></tr>
          </thead>
          <tbody>
            <!-- One row per key annotation or API covered in the tabs above -->
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

Replace all `[PLACEHOLDER]` text with actual content from research before moving to Step 2.

- [ ] **Step 2: Write feature cards for each tab**

For each feature discovered in research, add a feature card to the appropriate tab panel. Follow this exact template per card:

```html
<div class="feature-card">
  <h3 id="[kebab-case-feature-name]">[Feature Name]</h3>
  <p>[2–4 sentence explanation sourced from official Spring 7 docs or blog post. Include what problem it solves and how it differs from Spring 6.]</p>

  <h4>Dependency</h4>
  <pre><code class="language-xml">&lt;dependency&gt;
  &lt;groupId&gt;org.springframework&lt;/groupId&gt;
  &lt;artifactId&gt;[spring-artifact-id]&lt;/artifactId&gt;
  &lt;version&gt;[exact-7.x-version]&lt;/version&gt;
&lt;/dependency&gt;</code></pre>

  <h4>Example</h4>
  <pre><code class="language-java">// [Brief comment explaining what this demonstrates]
[working Java code example]</code></pre>

  <!-- Add a callout if there's a gotcha or migration tip: -->
  <div class="callout warn">
    <strong>Migration note</strong>
    [One sentence on what Spring 6 users need to change, if applicable.]
  </div>
</div>
```

Requirements:
- Each `id` on `<h3>` must be unique across the entire page
- Minimum 3 feature cards per tab, sourced from actual Spring 7 release content
- Java generics in code: escape as `&lt;T&gt;`, `&lt;List&lt;String&gt;&gt;`, etc.
- Include the actual Spring 7.x version in dependency snippets (from research)
- Cover basic → intermediate → advanced progression within each tab

- [ ] **Step 3: Write the cheatsheet table**

In the `<section class="cheatsheet">` at the bottom, add one `<tr>` per annotation, interface, or key API covered in any tab. Format:
```html
<tr>
  <td><code>@AnnotationName</code></td>
  <td>What it does in one sentence</td>
  <td>Since Spring 7 / Changed in 7 / etc.</td>
</tr>
```

- [ ] **Step 4: Run build_index.py and verify entry count**

```bash
python scripts/build_index.py
```

Expected: total entries in `assets/search-index.json` increases by at least 40 compared to the previous run.
If the increase is less than 40, the page is missing `<h3 id="...">` headings — check that each feature card has a properly structured `<h3>`.

To count entries:
```bash
python -c "import json; d=json.load(open('assets/search-index.json')); print(len([e for e in d if 'spring7' in e.get('href','')])); print('total:', len(d))"
```

Expected: ≥ 40 entries with `spring7` in href.

- [ ] **Step 5: Visual check**

```bash
python -m http.server 8080
```

Open `http://localhost:8080/spring-core/spring7-features.html`. Verify:
- Version badge displays with amber/yellow color
- Tabs switch correctly
- Code blocks have syntax highlighting
- Page renders on a narrow window (≤600px) without horizontal scrollbar
- Cheatsheet is visible at the bottom

Stop the server.

- [ ] **Step 6: Commit**

```bash
git add spring-core/spring7-features.html assets/search-index.json
git commit -m "feat: add Spring 7 features page"
```

---

### Task 3: version-comparison.html — 3-Column Update

**Files:**
- Modify: `spring-core/version-comparison.html`

**Interfaces:**
- Consumes: Spring 7 feature knowledge from Task 2 research
- Produces: Updated comparison page with Spring 5 | Spring 6 | Spring 7 columns; ~15–25 new search index entries for new Spring 7 rows

**Research step:** Before modifying the HTML, run web searches for:
1. `Spring Framework 6 to 7 migration guide` — what changed between 6 and 7
2. `Spring Framework 7 breaking changes` — removed or incompatible APIs
3. `Spring Framework 7 deprecated APIs` — what's being phased out

Record the list of changes (feature name, Spring 6 behavior, Spring 7 behavior, type: New/Changed/Removed/Deprecated).

- [ ] **Step 1: Update the table header to 5 columns**

Open `spring-core/version-comparison.html`. Find the `<thead>` row:
```html
<tr>
  <th ...>Feature</th>
  <th ...>Spring 5</th>
  <th ...>Spring 6</th>
  <th ...>Type</th>
</tr>
```

Replace with:
```html
<tr>
  <th style="width:22%">Feature</th>
  <th style="width:22%">Spring 5</th>
  <th style="width:22%">Spring 6</th>
  <th style="width:22%">Spring 7</th>
  <th style="width:12%">Type</th>
</tr>
```

- [ ] **Step 2: Add Spring 7 cell to all 12 existing rows**

For each of the 12 existing `<tr>` rows (ids: `java-namespace`, `java-baseline`, `http-client`, `error-response-format`, `observability`, `native-image`, `config-class-proxy`, `declarative-http-client`, `virtual-threads`, `constructor-injection`, `resttemplate-deprecation`, `mockmvc-testing`):

Insert a new `<td>` before the existing Type `<td>`. If Spring 7 has no change for a feature:
```html
<td><span style="color:var(--text-muted)">No change from Spring 6</span></td>
```

If Spring 7 changes the feature, describe the change (sourced from research):
```html
<td>[Description of Spring 7 behavior for this feature]</td>
```

- [ ] **Step 3: Update expandable diff panels for changed rows**

For every row where Spring 7 introduces a change, find the expandable panel (the `<tr>` immediately following, containing the `.diff-grid`). Add a second diff grid labeled "Spring 6 → 7" below the existing "Spring 5 → 6" diff grid:

```html
<!-- existing Spring 5 → 6 diff grid stays unchanged above this -->
<p style="margin-top:1.25rem;font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-muted)">Spring 6 → 7</p>
<div class="diff-grid">
  <div class="diff-before">
    <div class="diff-label">Spring 6</div>
    <pre><code class="language-java">[Spring 6 code for this feature]</code></pre>
  </div>
  <div class="diff-after">
    <div class="diff-label">Spring 7</div>
    <pre><code class="language-java">[Spring 7 code for this feature]</code></pre>
  </div>
</div>
```

- [ ] **Step 4: Add new rows for Spring 7-only changes**

For each Spring 7 change that doesn't correspond to an existing row, add a new `<tr>` + expandable `<tr>` pair at the end of `<tbody>`. New row template:

```html
<tr class="comparison-row" data-type="[new|changed|removed|deprecated]" data-versions="v7">
  <td>
    <h3 class="comparison-feature" id="[kebab-case-id]">[Feature Name]</h3>
  </td>
  <td><span style="color:var(--text-muted)">N/A</span></td>
  <td>[Spring 6 baseline]</td>
  <td>[Spring 7 change]</td>
  <td><span class="version-badge badge-[new|changed|removed|deprecated-appropriate-style]">[Type]</span></td>
</tr>
<tr class="diff-row" style="display:none">
  <td colspan="5">
    <div class="diff-grid">
      <div class="diff-before">
        <div class="diff-label">Spring 6</div>
        <pre><code class="language-java">[Spring 6 code]</code></pre>
      </div>
      <div class="diff-after">
        <div class="diff-label">Spring 7</div>
        <pre><code class="language-java">[Spring 7 code]</code></pre>
      </div>
    </div>
  </td>
</tr>
```

Each new row's `<h3 class="comparison-feature" id="...">` makes it searchable — these ids must be unique.

- [ ] **Step 5: Update filter bar**

Find the filter bar buttons in the HTML. Add a Spring 7 version filter if one doesn't exist:
```html
<button class="filter-btn active" data-filter="all">All</button>
<button class="filter-btn" data-filter="v7">Spring 7</button>
```

The existing filter JS logic uses `data-filter` and `data-versions` attributes. Existing rows with no Spring 7 change should have `data-versions="v5 v6"` on their `<tr>` (check what the current markup uses and follow that pattern). New Spring 7 rows have `data-versions="v7"`.

- [ ] **Step 6: Run build_index.py and verify**

```bash
python scripts/build_index.py
python -c "import json; d=json.load(open('assets/search-index.json')); v=[e for e in d if 'version-comparison' in e.get('href','')]; print(f'version-comparison entries: {len(v)}')"
```

Expected: version-comparison entries increase from 28 to at least 40 (new Spring 7 rows add entries).

- [ ] **Step 7: Visual check**

```bash
python -m http.server 8080
```

Open `http://localhost:8080/spring-core/version-comparison.html`. Verify:
- Table shows 5 columns (Feature, Spring 5, Spring 6, Spring 7, Type)
- Clicking a row toggles the expandable diff panel
- Spring 7 diff appears below Spring 5→6 diff for changed rows
- Filter buttons filter rows correctly
- Page doesn't overflow horizontally on narrow screen

Stop the server.

- [ ] **Step 8: Commit**

```bash
git add spring-core/version-comparison.html assets/search-index.json
git commit -m "feat: update version comparison to 3-column Spring 5/6/7 table"
```

---

### Task 4: Final Index Rebuild and Push

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
python -c "import json; d=json.load(open('assets/search-index.json')); print('Total entries:', len(d))"
```

Expected: total entries ≥ 300 (was 261 before this plan; +40 from spring7-features + ~15 from new comparison rows = ~316+).

- [ ] **Step 4: Final visual check — cross-page navigation**

```bash
python -m http.server 8080
```

Verify:
- From `http://localhost:8080/index.html`, nav shows Spring 7 Features link
- From `http://localhost:8080/spring-core/spring7-features.html`, active nav item is highlighted
- Search for a Spring 7 feature term — results include entries from spring7-features.html
- Version comparison page shows 5-column table

Stop the server.

- [ ] **Step 5: Commit and push**

```bash
git add assets/search-index.json
git commit -m "build: rebuild search index after Spring 7 content addition"
git push origin features
```
