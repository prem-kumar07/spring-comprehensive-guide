# Spring AI Phase 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete Spring AI section of the Spring Comprehensive Guide — 7 new HTML pages covering Spring AI 1.x and 2.x, with nav integration and search index.

**Architecture:** Pure static HTML/CSS/JS site. The `spring-ai/` directory mirrors `spring-core/` and `spring-boot/` exactly: same page template (header → content → cheatsheet), same script tags, same CSS. All content sourced via web search. Python `build_index.py` verifies structural correctness by entry count — a page with fewer than 30 entries has missing or mis-structured headings.

**Tech Stack:** HTML5, CSS3 (custom properties via `assets/css/style.css`), vanilla JS (`assets/js/nav.js`), Python 3 (`scripts/build_index.py`), Prism.js and Fuse.js already bundled.

**Spec:** `docs/superpowers/specs/2026-08-19-spring-ai-phase3.md`

**Execute after:** `docs/superpowers/plans/2026-08-18-spring-boot-phase2.md` (Boot plan modified nav.js; this plan extends it further).

## Global Constraints

- No external CDN dependencies — all JS/CSS already bundled; never add a `<link>` or `<script src>` pointing outside the repo
- All hrefs in nav.js must use `ROOT + 'spring-ai/page.html'` pattern — never absolute paths with a leading `/`
- All `<h3>` feature headings must have unique `id` attributes in kebab-case; `providers.html` h3 ids must be prefixed with the provider name (e.g., `id="openai-api-key-config"`, `id="anthropic-streaming-thinking"`)
- Code blocks with Java generics: always escape angle brackets — write `&lt;T&gt;` not `<T>`
- Every HTML table must be wrapped in `<div class="table-wrap">` for mobile scroll
- SVG diagrams: all colors via CSS variables only — `var(--text)`, `var(--accent)`, `var(--border)`, `var(--text-muted)`, `var(--text-inverse)` — never hardcoded hex values
- Cheatsheet section: every feature page ends with `<section class="cheatsheet"><h2>Cheatsheet</h2>...</section>`
- Git commit messages: plain descriptive text only — no `Co-Authored-By` trailers of any kind
- After any HTML change: run `python scripts/build_index.py` from repo root, then include `assets/search-index.json` in the commit
- All Spring AI 1.x and 2.x content sourced via web search — never assume features from prior knowledge
- Spring AI 1.x version for pom.xml snippets: **1.0.7**; Spring AI 2.x version: **2.0.0**
- Asset paths in spring-ai/ pages use `../` prefix: `../assets/css/style.css`, `../assets/js/nav.js`, etc.

---

### Task 1: CSS Badges and nav.js Foundation

**Files:**
- Modify: `assets/css/style.css` (add `.badge-ai1`, `.badge-ai2`)
- Modify: `assets/js/nav.js` (unlock Spring AI group, add 7 nav items, extend ROOT detection)

**Interfaces:**
- Produces: `.badge-ai1` and `.badge-ai2` CSS classes available for all 7 Spring AI pages; Spring AI nav group unlocked and populated; ROOT detection handles `/spring-ai/` paths

**Note:** The Spring Boot plan already extended nav.js with `/spring-boot/` detection. Read the current nav.js before editing to avoid overwriting prior changes.

- [ ] **Step 1: Add CSS badge classes**

Open `assets/css/style.css`. Find the `.badge-boot4` rule:
```css
.badge-boot4 { background: rgba(63,185,80,0.15);   color: #3fb950; border: 1px solid #3fb95044; }
```
Add immediately after it:
```css
.badge-ai1 { background: rgba(163,113,247,0.15); color: #a371f7; border: 1px solid #a371f744; }
.badge-ai2 { background: rgba(248,81,73,0.15);   color: #f85149; border: 1px solid #f8514944; }
```

- [ ] **Step 2: Extend ROOT detection in nav.js**

Open `assets/js/nav.js`. Find the `inSubdir` line:
```javascript
const inSubdir = window.location.pathname.includes('/spring-core/')
               || window.location.pathname.includes('/spring-boot/');
```
Replace with:
```javascript
const inSubdir = window.location.pathname.includes('/spring-core/')
               || window.location.pathname.includes('/spring-boot/')
               || window.location.pathname.includes('/spring-ai/');
```

- [ ] **Step 3: Unlock Spring AI nav group and add items**

In nav.js find:
```javascript
{ group: 'Spring AI',    items: [], locked: true },
```
Replace with:
```javascript
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
```

- [ ] **Step 4: Verify nav renders**

```bash
python -m http.server 8080
```
Open `http://localhost:8080/index.html`. Verify:
- Spring AI group visible in sidebar (no lock icon)
- 7 nav items listed
- Spring Boot and Spring Core items still present and correct

Stop the server.

- [ ] **Step 5: Commit**

```bash
git add assets/css/style.css assets/js/nav.js
git commit -m "feat: add Spring AI nav section and CSS badges"
```

---

### Task 2: spring-ai/index.html — Overview Page

**Files:**
- Create: `spring-ai/index.html`

**Interfaces:**
- Consumes: `.badge-ai1`, `.badge-ai2` from Task 1; nav.js ROOT detection handles `/spring-ai/`
- Produces: Overview page with 2 SVG diagrams and 6-card grid linking to sub-pages

**Research step:** Before writing, search for:
1. `Spring AI what is it overview site:spring.io` — for accurate intro prose
2. `Spring AI supported model providers list 2.0` — for the provider landscape SVG
3. `Spring AI architecture diagram ChatClient VectorStore EmbeddingModel`

- [ ] **Step 1: Create spring-ai/ directory and index.html**

```bash
mkdir -p spring-ai
```

Create `spring-ai/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Spring AI</title>
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

    <h1>Spring AI</h1>
    <div style="margin-bottom:1.25rem">
      <span class="version-badge badge-ai1">Spring AI 1.x</span>
      <span class="version-badge badge-ai2">Spring AI 2.x</span>
    </div>

    <p>[2–3 sentence intro from official docs: what Spring AI is — a framework abstracting AI model providers behind a unified API, works with Spring Boot, not a model itself but the integration layer]</p>

    <div class="callout info">
      <strong>8 Core Pillars</strong>
      ChatClient · EmbeddingModel · VectorStore · RAG · Tool Calling · Advisors · Structured Output · Document ETL
    </div>

    <h2>Architecture</h2>
    <p>[One sentence: how Spring AI sits between your app and the model provider]</p>

    <div class="diagram-wrap">
      <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg" aria-label="Spring AI architecture layers" role="img" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif">
        <!-- Layer 3: Your Spring Boot App (top) -->
        <rect x="60" y="10" width="380" height="48" rx="8" fill="var(--bg)" stroke="var(--accent)" stroke-width="2.5"/>
        <text x="250" y="30" text-anchor="middle" font-size="13" font-weight="700" fill="var(--accent)">Your Spring Boot Application</text>
        <text x="250" y="48" text-anchor="middle" font-size="11" fill="var(--text-muted)">ChatClient · VectorStore · EmbeddingModel</text>
        <!-- Arrow -->
        <line x1="250" y1="58" x2="250" y2="76" stroke="var(--border)" stroke-width="1.5" marker-end="url(#arr-ai)"/>
        <!-- Layer 2: Spring AI (middle) -->
        <rect x="60" y="76" width="380" height="48" rx="8" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/>
        <text x="250" y="96" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text)">Spring AI Abstraction Layer</text>
        <text x="250" y="114" text-anchor="middle" font-size="11" fill="var(--text-muted)">Advisors · Tools · RAG · Structured Output</text>
        <!-- Arrow -->
        <line x1="250" y1="124" x2="250" y2="142" stroke="var(--border)" stroke-width="1.5" marker-end="url(#arr-ai)"/>
        <!-- Layer 1: Model Provider (bottom) -->
        <rect x="60" y="142" width="380" height="48" rx="8" fill="var(--surface)" stroke="var(--border)" stroke-width="1.5"/>
        <text x="250" y="162" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text)">Model Provider</text>
        <text x="250" y="180" text-anchor="middle" font-size="11" fill="var(--text-muted)">OpenAI · Anthropic · Ollama · Gemini · Bedrock · …</text>
        <defs>
          <marker id="arr-ai" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
            <polygon points="0 0,8 3,0 6" fill="var(--border)"/>
          </marker>
        </defs>
      </svg>
    </div>

    <h2>Provider Landscape</h2>
    <p>[One sentence intro to the provider tiers]</p>

    <div class="diagram-wrap">
      <svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg" aria-label="Spring AI supported model providers" role="img" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif">
        <!-- Tier 1: Commercial -->
        <rect x="10" y="10" width="200" height="175" rx="8" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/>
        <text x="110" y="32" text-anchor="middle" font-size="12" font-weight="700" fill="var(--accent)">Tier 1 — Commercial</text>
        <text x="110" y="55" text-anchor="middle" font-size="11" fill="var(--text)">OpenAI (GPT-4o, o-series)</text>
        <text x="110" y="75" text-anchor="middle" font-size="11" fill="var(--text)">Anthropic (Claude 3/3.5/3.7)</text>
        <text x="110" y="95" text-anchor="middle" font-size="11" fill="var(--text)">Google Gemini / Vertex AI</text>
        <text x="110" y="115" text-anchor="middle" font-size="11" fill="var(--text)">Azure OpenAI</text>
        <text x="110" y="135" text-anchor="middle" font-size="11" fill="var(--text)">Amazon Bedrock</text>
        <!-- Tier 2: Cloud -->
        <rect x="250" y="10" width="200" height="175" rx="8" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/>
        <text x="350" y="32" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text)">Tier 2 — Cloud</text>
        <text x="350" y="55" text-anchor="middle" font-size="11" fill="var(--text)">Mistral AI</text>
        <text x="350" y="75" text-anchor="middle" font-size="11" fill="var(--text)">Groq</text>
        <text x="350" y="95" text-anchor="middle" font-size="11" fill="var(--text)">DeepSeek</text>
        <text x="350" y="115" text-anchor="middle" font-size="11" fill="var(--text)">NVIDIA NIM</text>
        <text x="350" y="135" text-anchor="middle" font-size="11" fill="var(--text)">Hugging Face</text>
        <!-- Tier 3: Local -->
        <rect x="490" y="10" width="200" height="175" rx="8" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/>
        <text x="590" y="32" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text)">Tier 3 — Local</text>
        <text x="590" y="55" text-anchor="middle" font-size="11" fill="var(--text)">Ollama (LLaMA, LLaVA…)</text>
        <text x="590" y="75" text-anchor="middle" font-size="11" fill="var(--text)">Transformers.js-compat</text>
      </svg>
    </div>

    <h2>Explore the Guide</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin:1.5rem 0">
      <a href="chat-client.html" class="feature-card" style="text-decoration:none">
        <h3 id="nav-chat-client">ChatClient API</h3>
        <p style="color:var(--text-muted);font-size:0.875rem">Fluent API for chat, streaming, conversation memory, multimodal input</p>
      </a>
      <a href="rag.html" class="feature-card" style="text-decoration:none">
        <h3 id="nav-rag">RAG &amp; VectorStore</h3>
        <p style="color:var(--text-muted);font-size:0.875rem">Document ingestion pipeline, VectorStore implementations, retrieval advisors</p>
      </a>
      <a href="tools-advisors.html" class="feature-card" style="text-decoration:none">
        <h3 id="nav-tools-advisors">Tools &amp; Advisors</h3>
        <p style="color:var(--text-muted);font-size:0.875rem">@Tool function calling, agentic loops, Advisor interceptor chain</p>
      </a>
      <a href="structured-output.html" class="feature-card" style="text-decoration:none">
        <h3 id="nav-structured-output">Structured Output</h3>
        <p style="color:var(--text-muted);font-size:0.875rem">BeanOutputConverter, self-correcting output, provider-native JSON mode</p>
      </a>
      <a href="version-comparison.html" class="feature-card" style="text-decoration:none">
        <h3 id="nav-version-comparison">Version Comparison</h3>
        <p style="color:var(--text-muted);font-size:0.875rem">Spring AI 1.x vs 2.x — API changes, new features, migration guide</p>
      </a>
      <a href="providers.html" class="feature-card" style="text-decoration:none">
        <h3 id="nav-providers">Providers</h3>
        <p style="color:var(--text-muted);font-size:0.875rem">20+ providers: OpenAI, Anthropic, Ollama, Bedrock, Gemini and more</p>
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

Fill in the `[PLACEHOLDER]` intro paragraph and the provider landscape one-liner from research before saving.

- [ ] **Step 2: Rebuild index and verify**

```bash
python scripts/build_index.py
python -c "import json; d=json.load(open('assets/search-index.json')); v=[e for e in d if 'spring-ai/index' in e.get('href','')]; print(f'spring-ai/index entries: {len(v)}')"
```
Expected: ≥ 6 entries.

- [ ] **Step 3: Commit**

```bash
git add spring-ai/index.html assets/search-index.json
git commit -m "feat: add Spring AI overview page"
```

---

### Task 3: spring-ai/chat-client.html

**Files:**
- Create: `spring-ai/chat-client.html`

**Interfaces:**
- Consumes: `.badge-ai1`, `.badge-ai2` from Task 1
- Produces: ~55 search index entries; template that Tasks 4–6 mirror

**Research step — run BEFORE writing HTML:**
1. `Spring AI ChatClient API fluent builder site:docs.spring.io`
2. `Spring AI ChatClient stream Flux reactive`
3. `Spring AI MessageChatMemoryAdvisor conversation memory`
4. `Spring AI PromptTemplate variable substitution`
5. `Spring AI multimodal image Media UserMessage`
6. `Spring AI MockChatModel testing`
7. `spring-ai-openai-spring-boot-starter version 2.0.0`

Record the exact `spring-ai-bom` version for pom.xml snippets: `2.0.0`.

- [ ] **Step 1: Create chat-client.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Spring AI ChatClient API</title>
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

    <h1>Spring AI ChatClient API</h1>
    <div style="margin-bottom:1.25rem">
      <span class="version-badge badge-ai1">Spring AI 1.x</span>
      <span class="version-badge badge-ai2">Spring AI 2.x</span>
    </div>
    <p>[2-sentence intro: ChatClient is the primary developer-facing API for interacting with AI models. Modeled after Spring's RestClient/WebClient fluent builder pattern. Source from official docs.]</p>

    <div class="tab-container">
      <div class="tabs">
        <button class="tab-btn active" data-tab="tab-basic">Basic Usage</button>
        <button class="tab-btn" data-tab="tab-streaming">Streaming</button>
        <button class="tab-btn" data-tab="tab-memory">Conversation Memory</button>
        <button class="tab-btn" data-tab="tab-prompts">Prompt Templates</button>
        <button class="tab-btn" data-tab="tab-multimodal">Multimodal</button>
        <button class="tab-btn" data-tab="tab-testing">Testing</button>
      </div>

      <div class="tab-panel active" id="tab-basic">
        <!-- Feature cards:
          - id="chatclient-builder": ChatClient.builder(chatModel).build(), auto-wiring ChatClient.Builder
          - id="chatclient-call": .prompt().user().call().content() basic usage
          - id="chatclient-response": .call().chatResponse() for full ChatResponse with metadata
          - id="chatclient-options": ChatOptions for temperature, maxTokens, model override -->
      </div>
      <div class="tab-panel" id="tab-streaming">
        <!-- Feature cards:
          - id="chatclient-stream": .stream() terminal, Flux<String> response
          - id="chatclient-stream-sse": SSE in Spring MVC controller with .stream().content()
          - id="chatclient-stream-chatresponse": .stream().chatResponse() for per-chunk metadata -->
      </div>
      <div class="tab-panel" id="tab-memory">
        <!-- Feature cards:
          - id="in-memory-chat-memory": InMemoryChatMemory, MessageChatMemoryAdvisor, conversationId
          - id="vectorstore-chat-memory": VectorStoreChatMemoryAdvisor for persistent memory
          - id="chat-memory-limit": controlling history window size -->
      </div>
      <div class="tab-panel" id="tab-prompts">
        <!-- Feature cards:
          - id="prompt-template": PromptTemplate with {variable} substitution
          - id="system-user-messages": .system() vs .user() and when to use each
          - id="chat-options-per-call": per-call ChatOptions override (temperature, model) -->
      </div>
      <div class="tab-panel" id="tab-multimodal">
        <!-- Feature cards:
          - id="image-url-input": UserMessage.media() with image URL
          - id="image-resource-input": image as classpath Resource or base64
          - id="audio-input": audio attachment (provider support note)
          - id="multimodal-provider-support": which providers support images/audio -->
      </div>
      <div class="tab-panel" id="tab-testing">
        <!-- Feature cards:
          - id="mock-chat-model": MockChatModel setup, fixed response
          - id="chatclient-test-assertion": asserting prompt content with ArgumentCaptor
          - id="chatclient-test-builder": test-scoped ChatClient.Builder bean -->
      </div>
    </div>

    <section class="cheatsheet">
      <h2>ChatClient Cheatsheet</h2>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Method / Class</th><th>Purpose</th><th>Notes</th></tr></thead>
          <tbody><!-- One row per key method from each tab --></tbody>
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

Minimum 3 cards per tab. Each card follows this pattern:

```html
<div class="feature-card">
  <h3 id="[kebab-id]">[Feature Name]</h3>
  <p>[2–4 sentence explanation from official Spring AI docs]</p>

  <h4>Dependency (pom.xml)</h4>
  <pre><code class="language-xml">&lt;dependencyManagement&gt;
  &lt;dependencies&gt;
    &lt;dependency&gt;
      &lt;groupId&gt;org.springframework.ai&lt;/groupId&gt;
      &lt;artifactId&gt;spring-ai-bom&lt;/artifactId&gt;
      &lt;version&gt;2.0.0&lt;/version&gt;
      &lt;type&gt;pom&lt;/type&gt;
      &lt;scope&gt;import&lt;/scope&gt;
    &lt;/dependency&gt;
  &lt;/dependencies&gt;
&lt;/dependencyManagement&gt;</code></pre>

  <h4>Example</h4>
  <pre><code class="language-java">// [What this demonstrates]
[Working Java code. Escape all generics: &lt;T&gt; not <T>]</code></pre>
</div>
```

**Basic Usage tab:** Cover `ChatClient.builder(chatModel).build()`, autowiring `ChatClient.Builder` via `@Autowired`, calling `.prompt().user("Hello").call().content()`, `ChatResponse` with usage metadata, and `ChatOptions` (temperature, maxTokens).

**Streaming tab:** Cover `.stream()` terminal returning `Flux<String>`, a Spring MVC `@GetMapping` returning `Flux<String>` with `text/event-stream`, and `.stream().chatResponse()` for per-chunk deltas.

**Conversation Memory tab:** Cover `InMemoryChatMemory`, `.advisors(new MessageChatMemoryAdvisor(memory, conversationId))`, and `VectorStoreChatMemoryAdvisor` for persistence. Show how `conversationId` is passed.

**Prompt Templates tab:** Cover `PromptTemplate`, `new PromptTemplate("Tell me about {topic}").create(Map.of("topic","Java"))`, `.system()` vs `.user()` roles, and overriding model per-call via `ChatOptions`.

**Multimodal tab:** Cover `UserMessage` with `.media(MimeTypeUtils.IMAGE_PNG, imageResource)`, image as URL string vs `Resource`, a vision example asking GPT-4o to describe an image, and a provider support note.

**Testing tab:** Cover `MockChatModel` with `new MockChatModel(new MockChatModelBuilder().withDefaultResponse("Hello").build())`, `ChatClient.Builder` test bean, and `ArgumentCaptor<Prompt>` for asserting the prompt content.

- [ ] **Step 3: Write cheatsheet rows**

At minimum one row per key method/class from each tab.

- [ ] **Step 4: Rebuild index and verify**

```bash
python scripts/build_index.py
python -c "import json; d=json.load(open('assets/search-index.json')); v=[e for e in d if 'chat-client' in e.get('href','')]; print(f'chat-client entries: {len(v)}')"
```
Expected: ≥ 50 entries.

- [ ] **Step 5: Commit**

```bash
git add spring-ai/chat-client.html assets/search-index.json
git commit -m "feat: add Spring AI ChatClient API page"
```

---

### Task 4: spring-ai/rag.html

**Files:**
- Create: `spring-ai/rag.html`

**Interfaces:**
- Consumes: `.badge-ai1`, `.badge-ai2` from Task 1
- Produces: ~55 search index entries; ingestion pipeline SVG diagram

**Research step — run BEFORE writing HTML:**
1. `Spring AI RAG retrieval augmented generation pipeline site:docs.spring.io`
2. `Spring AI DocumentReader PdfDocumentReader TokenTextSplitter`
3. `Spring AI VectorStore PGVector setup application.properties`
4. `Spring AI RetrievalAugmentationAdvisor QuestionAnswerAdvisor`
5. `Spring AI SimpleVectorStore in-memory`
6. `Spring AI SearchRequest topK similarity threshold`
7. `Spring AI query rewriting re-ranking RAG advanced`

- [ ] **Step 1: Create rag.html**

Page structure identical to chat-client.html. Tabs:

```html
<div class="tabs">
  <button class="tab-btn active" data-tab="tab-rag-overview">How RAG Works</button>
  <button class="tab-btn" data-tab="tab-rag-etl">Document ETL</button>
  <button class="tab-btn" data-tab="tab-rag-vectorstore">VectorStore</button>
  <button class="tab-btn" data-tab="tab-rag-retrieval">Retrieval</button>
  <button class="tab-btn" data-tab="tab-rag-advanced">Advanced</button>
</div>
```

- [ ] **Step 2: Write SVG ingestion pipeline diagram**

Place in the "How RAG Works" tab, before the feature cards. Nodes in sequence (left to right):

```
DocumentReader → TextSplitter → EmbeddingModel → VectorStore
```

Use `viewBox="0 0 720 100"`, boxes with `var(--surface-2)`, arrows with `var(--border)`, node labels with `var(--text)`, subtitle labels (e.g., "read") with `var(--text-muted)`. No hardcoded hex.

- [ ] **Step 3: Write feature cards per tab**

Minimum 3 cards per tab with the standard `<h3 id="...">`, explanation, pom.xml, and code example pattern.

**How RAG Works tab:**
- `id="rag-overview"`: What RAG is — why LLMs benefit from external context. The two-phase pattern (ingestion vs retrieval). Source from official docs.
- `id="rag-ingestion-phase"`: The 4-step ingestion flow with a code snippet wiring `DocumentReader` → `TokenTextSplitter` → `EmbeddingModel` → `VectorStore.add()`
- `id="rag-retrieval-phase"`: How retrieval works at query time — embed query, cosine similarity search, context injection

**Document ETL tab:**
- `id="text-reader"`: `TextReader` for plain text files; `Resource`-based constructor; `read()` returns `List<Document>`
- `id="pdf-document-reader"`: `PdfDocumentReader` with `spring-ai-pdf-document-reader` dependency; per-page splitting
- `id="tika-document-reader"`: `TikaDocumentReader` for Word, HTML, CSV — `spring-ai-tika-document-reader` dependency
- `id="token-text-splitter"`: `TokenTextSplitter` — `defaultChunkSize` (800 tokens), `minChunkSizeChars` (350), overlap
- `id="keyword-metadata-enricher"`: `KeywordMetadataEnricher` — adding keywords to `Document.metadata` for filtering

**VectorStore tab:**
- `id="simple-vector-store"`: `SimpleVectorStore` for in-memory/dev use; `.add(docs)`, `.similaritySearch(SearchRequest)`
- `id="pgvector-setup"`: `spring-ai-pgvector-store-spring-boot-starter` pom.xml + `application.properties` (`spring.ai.vectorstore.pgvector.index-type`, `dimensions`) + Docker Compose for local PG
- `id="vector-search-request"`: `SearchRequest.query("...").withTopK(4).withSimilarityThreshold(0.75)` — all parameters explained
- `id="vectorstore-implementations"`: Reference table of 15 VectorStore implementations: PGVector, Chroma, Pinecone, Weaviate, MongoDB Atlas, Redis, Milvus, Neo4j, Qdrant, Oracle, MariaDB, Azure AI Search, Apache Cassandra, OpenSearch, Elasticsearch

**Retrieval tab:**
- `id="question-answer-advisor"`: `QuestionAnswerAdvisor` (1.x primary) — constructor with `VectorStore`, default top-K, usage with `ChatClient.builder().defaultAdvisors()`
- `id="retrieval-augmentation-advisor"`: `RetrievalAugmentationAdvisor` (modular, 1.x+) — pluggable components, builder pattern
- `id="retrieval-query-rewriting"`: Query expansion/rewriting before similarity search — `RewriteQueryTransformer`
- `id="retrieval-re-ranking"`: Post-retrieval re-ranking with `CohereReranker` or custom `DocumentRanker`

**Advanced tab:**
- `id="hybrid-search"`: Keyword + vector combined search — `HybridSearchRequest`, relevance scoring
- `id="metadata-filtering"`: `FilterExpressionBuilder` for filtering by document metadata at search time
- `id="document-transformer-chain"`: Chaining multiple `DocumentTransformer` implementations in ingestion

- [ ] **Step 4: Rebuild index and verify**

```bash
python scripts/build_index.py
python -c "import json; d=json.load(open('assets/search-index.json')); v=[e for e in d if '/rag' in e.get('href','')]; print(f'rag entries: {len(v)}')"
```
Expected: ≥ 50 entries.

- [ ] **Step 5: Commit**

```bash
git add spring-ai/rag.html assets/search-index.json
git commit -m "feat: add Spring AI RAG and VectorStore page"
```

---

### Task 5: spring-ai/tools-advisors.html

**Files:**
- Create: `spring-ai/tools-advisors.html`

**Interfaces:**
- Consumes: `.badge-ai1`, `.badge-ai2` from Task 1
- Produces: ~50 search index entries

**Research step:**
1. `Spring AI @Tool annotation function calling site:docs.spring.io`
2. `Spring AI @ToolParam description optional`
3. `Spring AI ToolContext runtime state 2.0`
4. `Spring AI Advisor API CallAdvisor StreamAdvisor getOrder`
5. `Spring AI RecursiveAdvisor self-refining agentic loop 1.1`
6. `Spring AI SafeGuardAdvisor SimpleLoggerAdvisor`
7. `Spring AI ToolCallbackProvider bean`

- [ ] **Step 1: Create tools-advisors.html**

Tabs:
```html
<div class="tabs">
  <button class="tab-btn active" data-tab="tab-tool-basics">Tool Basics</button>
  <button class="tab-btn" data-tab="tab-tool-context">Tool Context &amp; Loops</button>
  <button class="tab-btn" data-tab="tab-tool-patterns">Agentic Patterns</button>
  <button class="tab-btn" data-tab="tab-advisors">Advisors</button>
</div>
```

- [ ] **Step 2: Write feature cards**

Minimum 3 cards per tab.

**Tool Basics tab:**
- `id="tool-annotation"`: `@Tool` on a Java method — JSON schema auto-generated from method signature. Show a `WeatherService` with `@Tool String getCurrentWeather(String city)`. Registering via `.tools(weatherService)` on `ChatClient`.
- `id="tool-param"`: `@ToolParam(description="...", required=false)` for documenting parameters
- `id="tool-response"`: How Spring AI loops transparently — model calls tool, result returned, model generates final answer. No user code needed in the loop.
- `id="tool-callback-provider"`: `ToolCallbackProvider` bean for globally registering tools without passing them per-call

**Tool Context & Loops tab:**
- `id="tool-context"`: `ToolContext` — injecting runtime state (auth token, tenant ID) into tool methods without polluting the model prompt. Available in 2.0 composable architecture.
- `id="tool-agentic-loop"`: How the tool invocation loop works internally — model response with `tool_calls` → Spring AI dispatches → result injected → re-submitted. Diagram as ASCII in a code block.
- `id="tool-2x-composable"`: Spring AI 2.0 composable tool-calling architecture — `ToolCallingManager`, explicit control over the loop, `ToolContext` for passing state. Add `<div class="callout info"><strong>Spring AI 2.x</strong> ...</div>`.

**Agentic Patterns tab:**
- `id="multi-tool-agent"`: Multi-tool orchestration — a planner agent with search tool + calculator tool. Full working example.
- `id="tool-error-handling"`: Returning error results from tools — `ToolResult.error("message")`, how the model handles tool errors
- `id="tool-result-formatting"`: JSON vs plain-string tool results and which to prefer

**Advisors tab:**
- `id="advisor-interface"`: `CallAdvisor` / `StreamAdvisor` interfaces, `advise(ChatClientRequest, Map)` signature, `getOrder()` for chain ordering
- `id="builtin-question-answer-advisor"`: `QuestionAnswerAdvisor` — wiring to a VectorStore, default top-K
- `id="builtin-memory-advisors"`: `MessageChatMemoryAdvisor` vs `VectorStoreChatMemoryAdvisor` — when to use each
- `id="builtin-safe-guard-advisor"`: `SafeGuardAdvisor` — content filtering, blocked phrases list
- `id="builtin-logger-advisor"`: `SimpleLoggerAdvisor` — logs request/response at DEBUG level; useful for debugging
- `id="recursive-advisor"`: `RecursiveAdvisor` (Spring AI 1.1+) — enables self-refining agentic loops by re-invoking the chat pipeline; use with `MAX_RECURSION_DEPTH`
- `id="custom-advisor"`: Writing a custom `CallAdvisor` — implement `advise()`, call `chain.nextAroundCall(request, context)`, modify request/response

- [ ] **Step 3: Write cheatsheet**

One row per annotation/class with Purpose and Notes columns.

- [ ] **Step 4: Rebuild index and verify**

```bash
python scripts/build_index.py
python -c "import json; d=json.load(open('assets/search-index.json')); v=[e for e in d if 'tools-advisors' in e.get('href','')]; print(f'tools-advisors entries: {len(v)}')"
```
Expected: ≥ 50 entries.

- [ ] **Step 5: Commit**

```bash
git add spring-ai/tools-advisors.html assets/search-index.json
git commit -m "feat: add Spring AI tools and advisors page"
```

---

### Task 6: spring-ai/structured-output.html

**Files:**
- Create: `spring-ai/structured-output.html`

**Interfaces:**
- Consumes: `.badge-ai1`, `.badge-ai2` from Task 1
- Produces: ~45 search index entries

**Research step:**
1. `Spring AI BeanOutputConverter entity structured output site:docs.spring.io`
2. `Spring AI structured output validateSchema self-correcting 2.0`
3. `Spring AI useProviderStructuredOutput OpenAI response_format`
4. `Spring AI multimodal image to Java record structured output`
5. `Spring AI StructuredOutputConverter implementations`

- [ ] **Step 1: Create structured-output.html**

Tabs:
```html
<div class="tabs">
  <button class="tab-btn active" data-tab="tab-bean-converter">BeanOutputConverter</button>
  <button class="tab-btn" data-tab="tab-self-correcting">Self-Correcting</button>
  <button class="tab-btn" data-tab="tab-provider-native">Provider-Native</button>
  <button class="tab-btn" data-tab="tab-multimodal-output">Multimodal</button>
</div>
```

- [ ] **Step 2: Write feature cards**

Minimum 3 cards per tab.

**BeanOutputConverter tab:**
- `id="bean-output-converter-basics"`: `BeanOutputConverter<T>` — derives JSON Schema DRAFT_2020_12 from a Java record, injects schema instructions into prompt. Using `.call().entity(MyRecord.class)` shorthand.
- `id="bean-output-java-record"`: Defining a Java record as the target type — nested records, `@JsonPropertyDescription` for field hints. Example: `record MovieReview(String title, int rating, String summary) {}`
- `id="bean-output-list"`: Extracting a list — `ParameterizedTypeReference<List<MovieReview>>`, `.call().entity(new ParameterizedTypeReference&lt;List&lt;MovieReview&gt;&gt;(){})` — note escaped generics in the code block
- `id="structured-output-converters"`: Other `StructuredOutputConverter` implementations: `ListOutputConverter`, `MapOutputConverter`

**Self-Correcting tab:**
- `id="validate-schema"`: `validateSchema()` on `BeanOutputConverter` (Spring AI 2.x) — automatic re-prompt when response doesn't pass schema validation. Add `<div class="callout info"><strong>Spring AI 2.x</strong></div>`.
- `id="self-correct-max-retries"`: Configuring max retry attempts for self-correction, what happens on final failure
- `id="self-correct-complex-schema"`: Example with a nested record that commonly trips up LLMs — showing self-correction catching and fixing a missing required field

**Provider-Native tab:**
- `id="provider-native-structured-output"`: `useProviderStructuredOutput()` (Spring AI 2.x) — delegates to OpenAI `response_format: json_schema` or Anthropic tool-use JSON mode instead of prompt engineering
- `id="openai-json-mode"`: OpenAI `response_format` JSON schema — what the API sends, reliability vs `BeanOutputConverter`
- `id="provider-native-trade-offs"`: When to use provider-native vs BeanOutputConverter — provider lock-in vs reliability; supported providers

**Multimodal tab:**
- `id="image-to-record"`: Extracting structured data from an image — pass an image via `UserMessage.media()` and `.call().entity(ReceiptRecord.class)` to parse a receipt photo
- `id="multimodal-combined-prompt"`: Combining text + image in one prompt for structured extraction
- `id="multimodal-output-providers"`: Which providers support multimodal structured output (OpenAI GPT-4o, Anthropic Claude 3+)

- [ ] **Step 3: Write cheatsheet**

Columns: Method/Class | Purpose | Version (1.x / 2.x)

- [ ] **Step 4: Rebuild index and verify**

```bash
python scripts/build_index.py
python -c "import json; d=json.load(open('assets/search-index.json')); v=[e for e in d if 'structured-output' in e.get('href','')]; print(f'structured-output entries: {len(v)}')"
```
Expected: ≥ 40 entries.

- [ ] **Step 5: Commit**

```bash
git add spring-ai/structured-output.html assets/search-index.json
git commit -m "feat: add Spring AI structured output page"
```

---

### Task 7: spring-ai/version-comparison.html

**Files:**
- Create: `spring-ai/version-comparison.html`

**Interfaces:**
- Consumes: Knowledge from Tasks 3–6 research; badge classes from Task 1
- Produces: ~30 search index entries

**Template:** Mirror `spring-boot/version-comparison.html` exactly for structure — same 4-column table, same filter bar, same `.comparison-row` + `.diff-row` expandable pattern, same filter JS (copy verbatim, no modification needed).

**Research step:**
1. `Spring AI 2.0 what changed from 1.x breaking changes migration`
2. `Spring AI 1.1 new features RecursiveAdvisor MCP reasoning models`
3. `Spring AI 1.0 GA what's new vs 0.x milestones`
4. `Spring AI 2.0 composable tool calling agentic architecture changes`

- [ ] **Step 1: Create version-comparison.html**

4-column table header:
```html
<tr>
  <th style="width:25%">Feature</th>
  <th style="width:30%">Spring AI 1.x</th>
  <th style="width:30%">Spring AI 2.x</th>
  <th style="width:15%">Type</th>
</tr>
```

Badge class mapping (same as spring-boot/version-comparison.html):
- New → `badge-ai2` (red/coral)
- Changed → `badge-v7` (amber)
- Removed → danger inline style: `style="background:rgba(248,81,73,0.15);color:#f85149;border:1px solid #f8514944;padding:0.25rem 0.75rem;border-radius:20px;font-size:0.78rem;font-weight:600"`
- Deprecated → `badge-v7` (amber)

Filter JS: copy verbatim from `spring-boot/version-comparison.html` — same `data-type` filtering and expandable row logic.

- [ ] **Step 2: Write ≥10 comparison rows**

Each row is a `.comparison-row` + `.diff-row` pair. Expected rows (verify each via research):

1. `id="ai-vc-tool-calling-api"` (Changed): `@FunctionCallback` / `@Bean`-registered functions in 1.0 → `@Tool` annotation in 1.0+ / composable `ToolCallingManager` in 2.0
2. `id="ai-vc-structured-output"` (Changed): `BeanOutputConverter` in 1.x → `validateSchema()` and `useProviderStructuredOutput()` added in 2.0
3. `id="ai-vc-mcp-support"` (New in 1.1/2.x): Model Context Protocol client + server integration
4. `id="ai-vc-recursive-advisor"` (New in 1.1): `RecursiveAdvisor` for self-refining agentic loops
5. `id="ai-vc-agentic-architecture"` (Changed in 2.x): Composable tool-calling architecture, `ToolContext`, `ToolCallingManager`
6. `id="ai-vc-reasoning-models"` (New in 1.1): Streaming thinking events for reasoning models (Anthropic, Ollama, OpenAI o-series)
7. `id="ai-vc-provider-additions"` (New): DeepSeek, Groq, NVIDIA NIM, ZhipuAI added across 1.x/2.x releases
8. `id="ai-vc-retrieval-augmentation-advisor"` (New in 1.x): Modular `RetrievalAugmentationAdvisor` replacing fixed `QuestionAnswerAdvisor`
9. `id="ai-vc-dependency-structure"` (Changed): Monolithic artifact in 0.x → modular starters in 1.0 (`spring-ai-openai-spring-boot-starter` etc.)
10. `id="ai-vc-self-correcting-output"` (New in 2.x): `validateSchema()` self-correcting loop
11. `id="ai-vc-observe-api"` (New in 1.x): Micrometer observability auto-configured for AI calls (latency, token usage)
12. `id="ai-vc-0x-to-1x"` (Changed): Summary of 0.x → 1.0 breaking changes — package renames, `ChatClient` refactor, API stability guarantee introduced

- [ ] **Step 3: Write migration cheatsheet**

```html
<section class="cheatsheet">
  <h2>Migration Cheatsheet</h2>
  <div class="table-wrap">
    <table>
      <thead><tr><th>What to change</th><th>Spring AI 1.x</th><th>Spring AI 2.x</th></tr></thead>
      <tbody><!-- One row per breaking change --></tbody>
    </table>
  </div>
</section>
```

- [ ] **Step 4: Rebuild index and verify**

```bash
python scripts/build_index.py
python -c "import json; d=json.load(open('assets/search-index.json')); v=[e for e in d if 'spring-ai/version' in e.get('href','')]; print(f'version-comparison entries: {len(v)}')"
```
Expected: ≥ 25 entries.

- [ ] **Step 5: Commit**

```bash
git add spring-ai/version-comparison.html assets/search-index.json
git commit -m "feat: add Spring AI version comparison page"
```

---

### Task 8: spring-ai/providers.html

**Files:**
- Create: `spring-ai/providers.html`

**Interfaces:**
- Produces: ~55 search index entries; all `<h3>` ids prefixed with provider name

**Research step:**
1. `spring-ai-openai-spring-boot-starter 2.0.0 application.properties`
2. `spring-ai-anthropic-spring-boot-starter claude model ids 2025`
3. `spring-ai-ollama-spring-boot-starter local model setup`
4. `Spring AI Amazon Bedrock spring-ai-bedrock-converse-spring-boot-starter`
5. `Spring AI Google Gemini Vertex AI starter configuration`
6. `Spring AI Mistral Groq DeepSeek NVIDIA NIM starter config`

- [ ] **Step 1: Create providers.html**

Tabs:
```html
<div class="tabs">
  <button class="tab-btn active" data-tab="tab-openai">OpenAI</button>
  <button class="tab-btn" data-tab="tab-anthropic">Anthropic</button>
  <button class="tab-btn" data-tab="tab-local">Local (Ollama)</button>
  <button class="tab-btn" data-tab="tab-cloud">Cloud Providers</button>
  <button class="tab-btn" data-tab="tab-others">Other Providers</button>
</div>
```

- [ ] **Step 2: Write feature cards**

**All `<h3>` ids on this page MUST be prefixed with the provider name** to avoid cross-page id collisions (e.g., `id="openai-setup"`, `id="anthropic-streaming-thinking"`, `id="ollama-local-setup"`).

Minimum 3 cards per tab.

**OpenAI tab** (prefix: `openai-`):
- `id="openai-setup"`: `spring-ai-openai-spring-boot-starter` in pom.xml + `spring.ai.openai.api-key` in application.properties + basic ChatClient call with GPT-4o
- `id="openai-model-ids"`: Available model IDs: `gpt-4o`, `gpt-4o-mini`, `o1`, `o1-mini`, `o3-mini` — how to set via `spring.ai.openai.chat.options.model`
- `id="openai-vision"`: GPT-4o vision example — `UserMessage.media()` with image URL, describe-the-image prompt
- `id="openai-reasoning"`: o1/o3 reasoning models — `reasoningEffort` option, streaming thinking events (2.0+)

**Anthropic tab** (prefix: `anthropic-`):
- `id="anthropic-setup"`: `spring-ai-anthropic-spring-boot-starter` + `spring.ai.anthropic.api-key` + basic Claude 3.5 Sonnet call
- `id="anthropic-model-ids"`: `claude-3-5-sonnet-20241022`, `claude-3-7-sonnet-20250219`, `claude-3-haiku-20240307` — set via `spring.ai.anthropic.chat.options.model`
- `id="anthropic-streaming-thinking"`: Extended thinking / streaming thinking events (1.1+) — enable via `thinkingEnabled(true)`, `Flux<ChatResponse>` with thinking deltas
- `id="anthropic-image-input"`: Claude 3+ image input example

**Local (Ollama) tab** (prefix: `ollama-`):
- `id="ollama-setup"`: Install Ollama CLI, `ollama pull llama3.2`, `spring-ai-ollama-spring-boot-starter`, `spring.ai.ollama.base-url=http://localhost:11434`
- `id="ollama-model-pull"`: Common model commands: `ollama pull llama3.2`, `ollama pull nomic-embed-text` (for embeddings), `ollama pull llava` (multimodal)
- `id="ollama-embedding"`: Using Ollama for `EmbeddingModel` in a local RAG pipeline — `spring.ai.ollama.embedding.options.model=nomic-embed-text`
- `id="ollama-multimodal"`: LLaVA vision model with `UserMessage.media()` for local image analysis

**Cloud Providers tab** (prefix: `bedrock-`, `gemini-`, `azure-`):
- `id="bedrock-setup"`: `spring-ai-bedrock-converse-spring-boot-starter` + AWS credentials + `spring.ai.bedrock.converse.chat.options.model`
- `id="gemini-setup"`: `spring-ai-vertex-ai-gemini-spring-boot-starter` + GCP project config + `spring.ai.vertex.ai.gemini.chat.options.model=gemini-2.0-flash`
- `id="azure-openai-setup"`: `spring-ai-azure-openai-spring-boot-starter` + `spring.ai.azure.openai.endpoint` + `spring.ai.azure.openai.api-key`

**Other Providers tab** (prefix: `mistral-`, `groq-`, `deepseek-`, `other-`):
- `id="mistral-setup"`: `spring-ai-mistral-ai-spring-boot-starter` + API key + `mistral-large-latest` model
- `id="groq-setup"`: `spring-ai-groq-spring-boot-starter` + Groq API key + fast inference note
- `id="deepseek-setup"`: `spring-ai-deepseek-spring-boot-starter` + DeepSeek API key + `deepseek-chat` model
- `id="other-provider-switching"`: Provider-switching pattern — all providers share `spring.ai.<provider>.*` config namespace; swap starter + update API key + change model name. No application code changes needed. Example showing same `ChatClient` code working with 3 different provider starters.

- [ ] **Step 3: Write cheatsheet**

Columns: Provider | Starter Artifact | Key Config Property | Key Model ID(s)

```html
<section class="cheatsheet">
  <h2>Providers Cheatsheet</h2>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Provider</th><th>Starter Artifact</th><th>Key Config Property</th><th>Key Model IDs</th></tr></thead>
      <tbody><!-- One row per provider --></tbody>
    </table>
  </div>
</section>
```

- [ ] **Step 4: Rebuild index and verify**

```bash
python scripts/build_index.py
python -c "import json; d=json.load(open('assets/search-index.json')); v=[e for e in d if 'providers' in e.get('href','')]; print(f'providers entries: {len(v)}')"
```
Expected: ≥ 50 entries.

- [ ] **Step 5: Commit**

```bash
git add spring-ai/providers.html assets/search-index.json
git commit -m "feat: add Spring AI providers reference page"
```

---

### Task 9: Final Index Rebuild and Push

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

- [ ] **Step 3: Verify total entry count by section**

```bash
python -c "
import json
d = json.load(open('assets/search-index.json'))
print('Total entries:', len(d))
sections = ['spring-ai/index', 'chat-client', '/rag', 'tools-advisors', 'structured-output', 'spring-ai/version', 'providers']
for k in sections:
    count = len([e for e in d if k in e.get('href', '')])
    print(f'  {k}: {count}')
"
```

Expected minimums:
- `spring-ai/index`: ≥ 6
- `chat-client`: ≥ 50
- `/rag`: ≥ 50
- `tools-advisors`: ≥ 50
- `structured-output`: ≥ 40
- `spring-ai/version`: ≥ 25
- `providers`: ≥ 50

- [ ] **Step 4: Full cross-site navigation check**

```bash
python -m http.server 8080
```

Verify:
- `http://localhost:8080/index.html` → Spring AI group visible with 7 items
- All 7 Spring AI pages accessible and active nav item highlighted
- Search for "ChatClient" → results from chat-client.html
- Search for "@Tool" → results from tools-advisors.html
- Search for "VectorStore" → results from rag.html
- Mobile: ≤600px viewport → hamburger works, no horizontal scroll

Stop the server.

- [ ] **Step 5: Commit if index changed, then push**

```bash
git add assets/search-index.json
git commit -m "build: rebuild search index after Spring AI Phase 3 completion"
git push origin features
```

If `assets/search-index.json` has no changes (already up to date from Task 8), skip the commit and go straight to push.
