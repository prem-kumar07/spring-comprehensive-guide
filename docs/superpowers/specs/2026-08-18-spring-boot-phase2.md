# Spring Boot Phase 2 — Site Design Spec

**Date:** 2026-08-18
**Goal:** Add a complete Spring Boot section to the Spring Comprehensive Guide covering Spring Boot 3.x and 4.x — features, version comparison, auto-configuration deep-dive, and production tooling.

---

## 1. Scope & Phases

This spec covers Phase 2 of the Spring Comprehensive Guide. Phase 1 (Spring Core) is complete. Phase 3 (Spring AI) is future.

| File | Description |
|------|-------------|
| `spring-boot/index.html` | Boot overview + timeline SVG |
| `spring-boot/boot3-features.html` | Spring Boot 3.x features |
| `spring-boot/boot4-features.html` | Spring Boot 4.x features |
| `spring-boot/version-comparison.html` | Boot 3.x vs 4.x side-by-side |
| `spring-boot/auto-configuration.html` | Auto-configuration deep-dive |
| `spring-boot/production.html` | Production & tooling deep-dive |
| `assets/js/nav.js` | Unlock Spring Boot group, add nav items, extend ROOT detection |
| `assets/search-index.json` | Rebuild after all pages complete |

---

## 2. Technology Stack

Identical to Phase 1 — no new dependencies:
- HTML5 + CSS3, no framework, no build step
- Vanilla JS (nav.js, search.js, prism.js — already bundled)
- Fuse.js bundled in search.js
- Prism.js bundled (Java, XML, YAML, Bash highlighting)
- Inline SVG for all diagrams
- Python 3 `scripts/build_index.py` for search index rebuild

---

## 3. Research Requirement

All Spring Boot 3.x and 4.x content **must be sourced via web search** during implementation. Use:

1. `docs.spring.io/spring-boot/` for both versions
2. Spring Boot GitHub release notes and milestones
3. `spring.io/blog` for feature announcements
4. All code examples verified runnable against the actual released dependency versions

Web search is mandatory before writing content for any page. Do not assume features based on Spring Core knowledge alone.

---

## 4. File Structure

```
spring-boot/
├── index.html
├── boot3-features.html
├── boot4-features.html
├── version-comparison.html
├── auto-configuration.html
└── production.html
```

All pages use `../assets/css/style.css`, `../assets/js/nav.js`, `../assets/js/prism.js`, `../assets/js/search.js` (one level up — same as `spring-core/`).

---

## 5. Page Specifications

### 5a. spring-boot/index.html — Boot Overview

**Title:** `Spring Boot`

**Content:**

1. **Intro paragraph** — What Spring Boot adds over Spring Core: auto-configuration, embedded server (Tomcat/Jetty/Undertow), opinionated starters, production-ready defaults. Explain that Spring Boot is not a replacement for Spring Framework — it builds on top of it.

2. **SVG version timeline** — horizontal line with milestones:
   - Spring Boot 1.0 (Apr 2014)
   - Spring Boot 2.0 (Mar 2018) — Spring 5.x, Java 8+
   - Spring Boot 3.0 (Nov 2022) — Spring 6.x, Java 17+, Jakarta EE 9
   - Spring Boot 4.0 (release date from web research) — Spring 7.x, Java baseline from research
   - Color coding: 2.x = blue (`#58a6ff`), 3.x = green (`#3fb950`), 4.x = yellow/amber (`#d29922`)
   - Legend at bottom

3. **SVG architecture diagram** — shows how Boot layers on top of Spring Core:
   - Bottom: Spring Core (IoC, DI, AOP)
   - Middle: Spring Boot Auto-Configuration + Starters
   - Top: Your Application (annotated with `@SpringBootApplication`)
   - Arrows showing dependency direction

4. **"How Boot differs from plain Spring" callout** — `.callout.info` summarizing the 3 key opinionated defaults users need to understand

5. **Card grid** — links to all 5 sub-pages:
   - Spring Boot 3 Features
   - Spring Boot 4 Features
   - Version Comparison
   - Auto-Configuration
   - Production & Tooling

---

### 5b. spring-boot/boot3-features.html — Spring Boot 3.x Features

**Title:** `Spring Boot 3 Features`

**Template:** Identical to `spring-core/spring5-features.html` structure.

**Version banner:**
```html
<span class="version-badge badge-boot3">Spring Boot 3.x</span>
```
Add `.badge-boot3` to `assets/css/style.css`:
```css
.badge-boot3 { background: rgba(88,166,255,0.15); color: #58a6ff; border: 1px solid #58a6ff44; }
```

**Tabs** (research actual content via web, adjust tabs accordingly):
- Auto-Configuration
- Web (MVC + WebFlux)
- Data (JPA, R2DBC, MongoDB)
- Security
- Observability (Micrometer, Tracing)
- Native / AOT

**Each tab:** Feature cards with `<h3 id="...">`, explanation, `pom.xml` snippet with exact version, code examples (basic → advanced). Escaped generics in code blocks.

**Cheatsheet section** at bottom — table: Annotation/Starter/Property | Purpose | Notes

---

### 5c. spring-boot/boot4-features.html — Spring Boot 4.x Features

**Title:** `Spring Boot 4 Features`

**Template:** Identical to boot3-features.html structure.

**Version banner:**
```html
<span class="version-badge badge-boot4">Spring Boot 4.x</span>
```
Add `.badge-boot4` to `assets/css/style.css`:
```css
.badge-boot4 { background: rgba(63,185,80,0.15); color: #3fb950; border: 1px solid #3fb95044; }
```

**Tabs** — sourced entirely from web research. Boot 4.x is built on Spring 7.x (research the exact Java baseline and Jakarta EE version).

**Cheatsheet section** at bottom.

---

### 5d. spring-boot/version-comparison.html — Boot 3.x vs 4.x

**Title:** `Spring Boot Version Comparison`

**Template:** Mirrors `spring-core/version-comparison.html` exactly.

**Table structure:** 4 columns:
```html
<tr>
  <th style="width:25%">Feature</th>
  <th style="width:30%">Spring Boot 3.x</th>
  <th style="width:30%">Spring Boot 4.x</th>
  <th style="width:15%">Type</th>
</tr>
```

**Filter bar:** New / Changed / Removed / Deprecated (same pattern as spring-core version-comparison)

**Rows:** Sourced via web research. Expected topics (verify each):
- Java baseline change
- Jakarta EE version change
- Auto-configuration mechanism changes
- Starter dependency updates
- Actuator endpoint changes
- Security defaults changes
- Native/AOT changes
- Removed/deprecated APIs

Each row:
- First `<td>` contains `<h3 class="comparison-feature" id="...">Feature Name</h3>` for search indexability
- Expandable diff panel below row (click to expand): `.diff-grid` with Boot 3.x left, Boot 4.x right
- Type badge: `New`, `Changed`, `Removed`, or `Deprecated`

**Cheatsheet section** at bottom — migration quick-reference table.

---

### 5e. spring-boot/auto-configuration.html — Auto-Configuration Deep-Dive

**Title:** `Spring Boot Auto-Configuration`

This is the "bean lifecycle" equivalent for Spring Boot — the one page that explains the core mechanism in depth, with an SVG diagram.

**Content sections:**

1. **What auto-configuration is** — contrast with explicit Spring Core `@Bean` wiring. The `@SpringBootApplication` / `@EnableAutoConfiguration` entry point.

2. **SVG loading sequence diagram** — flow from `@SpringBootApplication` → `@EnableAutoConfiguration` → `spring.factories` / `AutoConfiguration.imports` lookup → `@Conditional` evaluation → Bean registration. Show which conditions short-circuit the chain. Use the same inline SVG pattern as `lifecycle.html`.

3. **`@Conditional` family** — each annotation as a feature card with `<h3 id="...">`:
   - `@ConditionalOnClass`
   - `@ConditionalOnMissingBean`
   - `@ConditionalOnProperty`
   - `@ConditionalOnWebApplication`
   - `@ConditionalOnExpression`
   - Others sourced from web research

4. **`spring.factories` vs `AutoConfiguration.imports`** — the Boot 2.x → 3.x mechanism change, what it means for custom starters.

5. **Debugging auto-configuration** — `--debug` flag, conditions report in `/actuator/conditions`, reading the output.

6. **Building a custom starter** — step-by-step with full working code:
   - The auto-configure module (`*-autoconfigure`)
   - The starter module (`*-spring-boot-starter`)
   - `AutoConfiguration.imports` registration
   - Publishing and consuming the starter
   - Exact `pom.xml` for both modules

7. **Cheatsheet section** — table: Conditional Annotation | Fires when | Example

---

### 5f. spring-boot/production.html — Production & Tooling

**Title:** `Spring Boot Production`

**Note:** This page deliberately does NOT re-cover basics already in Phase 1's tooling page (Initializr, DevTools, Actuator basics, IDE setup). Focus is on production-grade configuration topics.

**Content sections (each as `<h2>` with sub-sections as `<h3 id="...">`):**

1. **Actuator — Production Configuration**
   - Health groups (liveness / readiness for Kubernetes)
   - Kubernetes probe endpoints (`/actuator/health/liveness`, `/actuator/health/readiness`)
   - Securing Actuator endpoints in production
   - Custom `HealthIndicator` implementation

2. **Micrometer Metrics**
   - Auto-configured meters (JVM, HTTP, DataSource)
   - Registering custom `Counter`, `Timer`, `Gauge`
   - Prometheus export (`micrometer-registry-prometheus`)
   - `pom.xml` snippets with exact versions

3. **Structured Logging**
   - JSON structured logging configuration (Spring Boot 3.4+ / 4.x — research exact version)
   - `StructuredLoggingJsonMembersCustomizer`
   - `application.properties` / `application.yaml` config
   - Example log output (formatted as a code block)

4. **Containerization**
   - Layered JARs with `spring-boot-maven-plugin`
   - Cloud Native Buildpacks (`./mvnw spring-boot:build-image`)
   - Dockerfile alternative with layered extraction
   - `pom.xml` plugin configuration

5. **Testcontainers Integration**
   - `@ServiceConnection` annotation (Spring Boot 3.1+)
   - `@SpringBootTest` with Testcontainers
   - `pom.xml` dependency (exact version from research)
   - Full working test example

6. **Graceful Shutdown**
   - `server.shutdown=graceful` configuration
   - `spring.lifecycle.timeout-per-shutdown-phase`
   - What happens to in-flight requests

7. **Cheatsheet section** — table: Property/Annotation | Purpose | Default

---

## 6. nav.js Update

**Unlock Spring Boot group and add nav items:**

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

Remove `locked: true` from the Spring Boot group entry.

**Extend ROOT detection** to handle `/spring-boot/` path:
```javascript
const inSubdir = window.location.pathname.includes('/spring-core/')
               || window.location.pathname.includes('/spring-boot/');
const ROOT = inSubdir ? '../' : './';
```

---

## 7. Search Index

After all 6 Spring Boot pages are complete, run:
```bash
python scripts/build_index.py
```

Expected new entries: ~200–300 (6 pages × ~35–50 entries each, based on Spring Core density).

---

## 8. Global Constraints

- No external CDN dependencies — all JS/CSS already bundled
- All hrefs in nav.js must be root-relative (no leading `/`)
- All `<h3>` feature headings must have unique `id` attributes for anchor linking and search indexability
- Code examples use escaped generics (`&lt;T&gt;` not `<T>`)
- Every table must be wrapped in `<div class="table-wrap">` for mobile scroll
- Dark/light theme compatibility: SVG elements use `var(--text)`, `var(--accent)`, `var(--border)`, `var(--text-muted)`, `var(--text-inverse)` — never hardcoded colors
- Cheatsheet section at bottom of every feature page
- Mobile: all pages must be fully usable on ≤900px viewport (sticky/overlay sidebar pattern already handled by existing CSS + nav.js)
- Git commit messages: plain descriptive text, no Co-Authored-By trailers of any kind
- Run `python scripts/build_index.py` from repo root after completing all pages; commit the updated `assets/search-index.json`
- All Spring Boot 3.x and 4.x content sourced via web search — never assumed from prior knowledge
