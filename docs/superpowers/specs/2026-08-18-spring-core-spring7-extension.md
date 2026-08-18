# Spring Core — Spring 7.x Extension Design Spec

**Date:** 2026-08-18
**Goal:** Add Spring 7.x content to the existing Spring Core section: a new features page and an updated 3-column version-comparison table.

---

## 1. Scope

This spec covers only the Spring 7.x addition to the existing `spring-core/` section. It does not touch the Spring Boot section (covered in the Spring Boot Phase 2 spec).

| File | Change |
|------|--------|
| `spring-core/spring7-features.html` | New page |
| `spring-core/version-comparison.html` | Add Spring 7 column → 3-column table |
| `assets/js/nav.js` | Add "Spring 7 Features" nav item |
| `assets/search-index.json` | Rebuild after all changes |

---

## 2. Research Requirement

All Spring 7.x-specific content (features, APIs, Java baseline, release date, changelog) **must be sourced via web search** during implementation. Use:

1. `docs.spring.io` for the Spring 7.x version
2. Spring Framework GitHub release notes / milestones
3. `spring.io/blog` for feature announcements
4. All code examples must be verified runnable against the actual released dependency version

Do not assume Spring 7.x features based on prior versions. Web search is mandatory before writing any content.

---

## 3. spring7-features.html

### Structure

Identical template to `spring-core/spring5-features.html` and `spring-core/spring6-features.html`.

**Head:**
```html
<title>Spring 7 Features</title>
<link rel="stylesheet" href="../assets/css/style.css" />
```

**Scripts (end of body):**
```html
<script src="../assets/js/nav.js"></script>
<script src="../assets/js/prism.js"></script>
<script src="../assets/js/search.js"></script>
```

**Content structure:**

1. **Version banner** — Spring 7.x version number, release date, Java baseline (researched), one-line headline of the release theme
   ```html
   <span class="version-badge badge-v7">Spring 7.x</span>
   ```
   Add CSS for `.badge-v7` in `assets/css/style.css`:
   ```css
   .badge-v7 { background: rgba(210,153,34,0.15); color: #d29922; border: 1px solid #d2992244; }
   ```

2. **Tabbed feature categories** — sourced entirely from web research. Expected categories (verify and adjust based on actual release):
   - Core Container
   - Web (MVC / WebFlux)
   - Data
   - Testing
   - Observability
   - Any Spring 7.x-specific new category (e.g., CRaC checkpoint/restore, Project Loom enhancements, Jakarta EE 11 changes — verify via research)

3. **Feature cards** — same `.feature-card` structure as spring5/6 pages. Each card:
   - Feature name as `<h3 id="...">` with a kebab-case id for anchor linking
   - One-line summary
   - 2–4 sentence explanation sourced from official docs
   - `pom.xml` snippet with the exact dependency and version
   - Code example (basic → intermediate → advanced progression within each category)
   - Callout notes for migration tips from Spring 6 or gotchas

4. **Cheatsheet section** — `<section class="cheatsheet">` at bottom of page. Table: Annotation/Interface | Purpose | Notes. Covers all annotations and key APIs introduced or changed in Spring 7.x.

### Tab container pattern (carry over exactly from spring6-features.html):
```html
<div class="tab-container">
  <div class="tabs">
    <button class="tab-btn active" data-tab="tab-core">Core Container</button>
    <!-- more tabs -->
  </div>
  <div class="tab-panel active" id="tab-core">
    <!-- feature cards -->
  </div>
</div>
```

### ID convention for feature headings:
Use kebab-case derived from the feature name, e.g.:
`id="virtual-threads-scheduler"`, `id="jakarta-ee-11-baseline"`, etc.
These ids are extracted by `build_index.py` and must be unique within the page.

---

## 4. version-comparison.html Update

### Table structure change

Current: 4 columns → `Feature | Spring 5 | Spring 6 | Type`
Updated: 5 columns → `Feature | Spring 5 | Spring 6 | Spring 7 | Type`

The `<th>` row becomes:
```html
<tr>
  <th style="width:22%">Feature</th>
  <th style="width:22%">Spring 5</th>
  <th style="width:22%">Spring 6</th>
  <th style="width:22%">Spring 7</th>
  <th style="width:12%">Type</th>
</tr>
```

### Existing rows

All 12 existing comparison rows get a new Spring 7 `<td>` cell inserted before the Type cell. If Spring 7 has no change for a given feature, use:
```html
<td><span style="color:var(--text-muted)">No change</span></td>
```

Existing row ids (anchors) stay unchanged:
`java-namespace`, `java-baseline`, `http-client`, `error-response-format`, `observability`, `native-image`, `config-class-proxy`, `declarative-http-client`, `virtual-threads`, `constructor-injection`, `resttemplate-deprecation`, `mockmvc-testing`

### New rows for Spring 7

Add new `<tr>` rows for Spring 7-specific changes, sourced via web research. Each new row:
- Has a `<h3 class="comparison-feature" id="...">` in the first `<td>` for search indexability
- Spring 5 and Spring 6 cells filled in with the baseline state for that feature
- Spring 7 cell describes the new behavior
- Type badge: one of `New`, `Changed`, `Removed`, `Deprecated`

### Expandable diff panel

The existing expandable row pattern (click → shows `.diff-grid` side-by-side panel) extends to show a Spring 6 → 7 diff. Each expandable panel gains a second `.diff-grid` block labeled "Spring 6 → 7" below the existing "Spring 5 → 6" diff grid. Always two stacked diff grids — no tabbed variant.

### Filter bar

The filter bar's version badges gain a Spring 7 filter chip:
```html
<button class="filter-btn" data-filter="v7">Spring 7</button>
```
Rows that include Spring 7 changes get `data-versions="v5 v6 v7"` (or just `data-versions="v7"` for new-in-7 rows). Filter logic already uses `data-filter` attributes — extend to handle the new `v7` value.

---

## 5. nav.js Update

Add "Spring 7 Features" to the Spring Core group, between "Spring 6 Features" and "Version Comparison":

```javascript
{ label: 'Spring 7 Features',  href: ROOT + 'spring-core/spring7-features.html' },
```

The `inSubdir` detection and `ROOT` computation are unchanged — Spring 7 content lives in `spring-core/`, same as 5.x and 6.x.

---

## 6. Search Index

After all HTML changes, run:
```bash
python scripts/build_index.py
```

Expected new entries: ~40–60 from `spring7-features.html` (matching the ~50-entry density of spring5 and spring6 pages) plus new entries from the new version-comparison rows.

---

## 7. CSS Addition

Add `.badge-v7` to `assets/css/style.css` in the version badge section (after `.badge-v6`):
```css
.badge-v7 { background: rgba(210,153,34,0.15); color: #d29922; border: 1px solid #d2992244; }
```

---

## 8. Global Constraints

- No external CDN dependencies — all JS/CSS already bundled
- All hrefs in nav.js must be root-relative (no leading `/`)
- All `<h3>` feature headings must have unique `id` attributes for anchor linking and search indexability
- Code examples use escaped generics (`&lt;T&gt;` not `<T>`)
- Every table must be wrapped in `<div class="table-wrap">` for mobile scroll
- Dark/light theme compatibility: SVG elements use `var(--text)`, `var(--accent)`, `var(--border)`, `var(--text-muted)`, `var(--text-inverse)` — never hardcoded colors
- Cheatsheet section at bottom of every feature page
- Git commit messages: plain descriptive text, no Co-Authored-By trailers of any kind
- Run `python scripts/build_index.py` from repo root after any HTML change; commit the updated `assets/search-index.json`
