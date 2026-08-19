# Spring AI Phase 3 — Site Design Spec

**Date:** 2026-08-19
**Goal:** Add a complete Spring AI section to the Spring Comprehensive Guide covering Spring AI 1.x and 2.x — ChatClient API, RAG pipelines, tool calling, advisors, structured output, version comparison, and provider reference.

---

## 1. Scope & Pages

| File | Description |
|------|-------------|
| `spring-ai/index.html` | Overview + provider landscape SVG + architecture diagram |
| `spring-ai/chat-client.html` | ChatClient API deep-dive (6 tabs) |
| `spring-ai/rag.html` | RAG pipeline, VectorStore, Document ETL (5 tabs) |
| `spring-ai/tools-advisors.html` | Tool calling + Advisor chain (4 tabs) |
| `spring-ai/structured-output.html` | Structured output + multimodal (4 tabs) |
| `spring-ai/version-comparison.html` | Spring AI 1.x vs 2.x comparison |
| `spring-ai/providers.html` | 20+ model providers reference (5 tabs) |
| `assets/js/nav.js` | Unlock Spring AI group, add 7 nav items, extend ROOT detection |
| `assets/css/style.css` | Add `.badge-ai1`, `.badge-ai2` |
| `assets/search-index.json` | Rebuild after all pages complete |

---

## 2. Technology Stack

Identical to Phase 1 and Phase 2 — no new dependencies:
- HTML5 + CSS3, no framework, no build step
- Vanilla JS (nav.js, search.js, prism.js — already bundled)
- Fuse.js bundled in search.js
- Prism.js bundled (Java, XML, YAML, Bash highlighting)
- Inline SVG for all diagrams
- Python 3 `scripts/build_index.py` for search index rebuild

---

## 3. Research Requirement

All Spring AI 1.x and 2.x content **must be sourced via web search** during implementation. Use:

1. `docs.spring.io/spring-ai/reference/` for API reference
2. `spring.io/blog` for feature announcements and release notes
3. Spring AI GitHub for changelog and migration notes
4. Exact GA versions verified before writing any pom.xml snippet

**Version reference (verified by research):**
- Spring AI 1.x latest: **1.0.7** (GA)
- Spring AI 2.x latest: **2.0.0** (GA, released June 12, 2026)
- Spring AI 2.x requires Spring Boot 3.x+ and Java 17+

Web search is mandatory before writing content for any page.

---

## 4. File Structure

```
spring-ai/
├── index.html
├── chat-client.html
├── rag.html
├── tools-advisors.html
├── structured-output.html
├── version-comparison.html
└── providers.html
```

All pages use `../assets/css/style.css`, `../assets/js/nav.js`, `../assets/js/prism.js`, `../assets/js/search.js`.

---

## 5. CSS Additions

Add after `.badge-boot4` in `assets/css/style.css`:

```css
.badge-ai1 { background: rgba(163,113,247,0.15); color: #a371f7; border: 1px solid #a371f744; }
.badge-ai2 { background: rgba(248,81,73,0.15);   color: #f85149; border: 1px solid #f8514944; }
```

- `.badge-ai1` — purple, for Spring AI 1.x cards and badges
- `.badge-ai2` — red/coral, for Spring AI 2.x cards and badges

---

## 6. nav.js Update

**Unlock Spring AI group and add 7 nav items:**

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

Remove `locked: true` from the Spring AI group entry.

**Extend ROOT detection** to handle `/spring-ai/` path:

```javascript
const inSubdir = window.location.pathname.includes('/spring-core/')
               || window.location.pathname.includes('/spring-boot/')
               || window.location.pathname.includes('/spring-ai/');
const ROOT = inSubdir ? '../' : './';
```

---

## 7. Page Specifications

### 7a. spring-ai/index.html — Overview

**Title:** `Spring AI`

**Content:**

1. **Intro paragraph** — What Spring AI is: a framework abstracting AI model providers behind a unified API. Works with Spring Boot. Not a model itself — it's the integration layer. Source from official docs.

2. **SVG provider landscape diagram** — Visual map of supported providers grouped by tier:
   - Tier 1 (commercial, most-used): OpenAI, Anthropic, Google Gemini, Azure OpenAI, Amazon Bedrock
   - Tier 2 (cloud): Mistral AI, Groq, DeepSeek, NVIDIA NIM, Hugging Face
   - Tier 3 (local): Ollama, Transformers.js-compatible
   - Use CSS variables only; group boxes with `var(--surface-2)`, provider labels with `var(--text)`

3. **SVG architecture diagram** — 3 layers:
   - Top: Your Spring Boot Application (`ChatClient`, `VectorStore`, `EmbeddingModel`)
   - Middle: Spring AI Abstraction Layer (Advisors, Tools, RAG, Structured Output)
   - Bottom: Model Provider (OpenAI / Anthropic / Ollama / …)

4. **"Key concepts at a glance" callout** — `.callout.info` listing the 8 pillars: ChatClient, EmbeddingModel, VectorStore, RAG, Tool Calling, Advisors, Structured Output, Document ETL

5. **Card grid** — links to all 6 sub-pages with one-line descriptions

---

### 7b. spring-ai/chat-client.html — ChatClient API

**Title:** `Spring AI ChatClient API`

**Version banner:**
```html
<span class="version-badge badge-ai1">Spring AI 1.x</span>
<span class="version-badge badge-ai2">Spring AI 2.x</span>
```

**Tabs:**

1. **Basic Usage** — `ChatClient.builder(chatModel).build()`, autowiring `ChatClient.Builder`, `.prompt().user().call().content()`, calling with `String` response, calling with `ChatResponse`
2. **Streaming** — `.stream()` terminal, `Flux<String>` response, SSE in a Spring MVC controller, backpressure handling
3. **Conversation Memory** — `MessageChatMemoryAdvisor`, `InMemoryChatMemory`, `VectorStoreChatMemoryAdvisor`, conversation ID management
4. **Prompt Templates** — `PromptTemplate`, variable substitution, system vs user messages, `ChatOptions` (temperature, maxTokens)
5. **Multimodal** — `UserMessage.media()`, image as URL vs base64 vs `Resource`, audio input, provider support matrix
6. **Testing** — `MockChatModel`, asserting prompt content, `ChatClientRequest` capture

**Cheatsheet** — table: Method / Annotation | Purpose | Notes

---

### 7c. spring-ai/rag.html — RAG & VectorStore

**Title:** `Spring AI RAG & VectorStore`

**Version banner:** both `.badge-ai1` and `.badge-ai2`

**Tabs:**

1. **How RAG Works** — Conceptual overview. SVG ingestion pipeline diagram: `DocumentReader` → `TextSplitter` → `EmbeddingModel` → `VectorStore`. SVG retrieval diagram: user query → embed → cosine similarity search → inject context → LLM
2. **Document ETL** — `DocumentReader` implementations (`TextReader`, `PdfDocumentReader`, `TikaDocumentReader`), `TokenTextSplitter` configuration, `KeywordMetadataEnricher`; full ingestion code example
3. **VectorStore** — `VectorStore` interface, `SimpleVectorStore` (in-memory), PGVector setup (pom.xml + `application.properties`), similarity search API (`SearchRequest.query(...).withTopK(4)`)
4. **Retrieval** — `QuestionAnswerAdvisor` (1.x), `RetrievalAugmentationAdvisor` (1.x/2.x), pluggable pre/post-retrieval steps, query rewriting, re-ranking
5. **Advanced** — Hybrid search (keyword + vector), metadata filtering, multi-vector-store routing, `DocumentTransformer` chain

**Cheatsheet** — table: Class/Interface | Role | Key method

---

### 7d. spring-ai/tools-advisors.html — Tools & Advisors

**Title:** `Spring AI Tools & Advisors`

**Version banner:** both badges, with 2.x callouts for agentic changes

**Tabs:**

1. **Tool Basics** — `@Tool` annotation on Java methods, JSON schema auto-generation, `@ToolParam` for descriptions/optionality, registering via `.tools(obj)` on `ChatClient`
2. **Tool Context & Agentic Loops** — `ToolContext` for passing runtime state, transparent tool-invocation loop, Spring AI 2.x composable agentic architecture, `ToolCallbackProvider` bean
3. **Agentic Patterns** — Multi-tool orchestration example (a planner agent that calls search + calculator tools), error handling in tool responses, tool result formatting
4. **Advisors** — `CallAdvisor` / `StreamAdvisor` interfaces, `getOrder()`, built-in advisors (`QuestionAnswerAdvisor`, `MessageChatMemoryAdvisor`, `VectorStoreChatMemoryAdvisor`, `SafeGuardAdvisor`, `SimpleLoggerAdvisor`, `RecursiveAdvisor`), writing a custom advisor

**Cheatsheet** — table: Annotation/Class | Purpose | Notes

---

### 7e. spring-ai/structured-output.html — Structured Output

**Title:** `Spring AI Structured Output`

**Version banner:** both badges

**Tabs:**

1. **BeanOutputConverter** — `BeanOutputConverter<T>`, Java record as target type, `.call().entity(MyClass.class)` shorthand, JSON Schema DRAFT_2020_12 generation, prompt injection
2. **Self-Correcting Output** — `validateSchema()` on `BeanOutputConverter` (Spring AI 2.x), automatic re-prompt loop on schema validation failure, example with a complex nested record
3. **Provider-Native Structured Output** — `useProviderStructuredOutput()` (Spring AI 2.x), OpenAI `response_format` JSON mode, Anthropic tool-use JSON mode, trade-offs vs BeanOutputConverter
4. **Multimodal Structured Output** — Extracting structured data from images (e.g., parse a receipt image into a Java record), combining `media()` with `.entity()`

**Cheatsheet** — table: Method/Class | Purpose | Version (1.x / 2.x)

---

### 7f. spring-ai/version-comparison.html — 1.x vs 2.x

**Title:** `Spring AI Version Comparison`

**Template:** Mirror `spring-core/version-comparison.html` and `spring-boot/version-comparison.html` — same filter bar, same expandable diff row pattern.

**Table structure:** 4 columns:
```html
<tr>
  <th style="width:25%">Feature</th>
  <th style="width:30%">Spring AI 1.x</th>
  <th style="width:30%">Spring AI 2.x</th>
  <th style="width:15%">Type</th>
</tr>
```

**Filter bar:** New / Changed / Removed / Deprecated

**Expected rows** (verify each via web search):
- Tool Calling API (Changed: `@FunctionCallback` → `@Tool` / composable architecture)
- Structured Output (Changed: `validateSchema()` and `useProviderStructuredOutput()` added in 2.x)
- MCP support (New in 1.1/2.x: Model Context Protocol client + server)
- `RecursiveAdvisor` (New in 1.1)
- Agentic loop architecture (Changed: 2.x redesigned composable tool execution)
- Provider additions (New: DeepSeek, Groq, NVIDIA NIM added across 1.x/2.x releases)
- Reasoning model support (New: streaming thinking events in 1.1)
- `RetrievalAugmentationAdvisor` (New: modular RAG in 1.x)
- 0.x → 1.x breaking changes summary row (context for users upgrading)
- Dependency structure (Changed: modular starters in 1.0, no more monolithic artifact)

**Badge classes:** New=`badge-ai2`, Changed=`badge-v7` (amber), Removed=danger inline style, Deprecated=`badge-v7`

**Cheatsheet** — migration quick-reference table.

---

### 7g. spring-ai/providers.html — Model Providers

**Title:** `Spring AI Providers`

**Version banner:** both badges

**Tabs:**

1. **OpenAI** — `spring-ai-openai-spring-boot-starter`, `application.properties` keys (`spring.ai.openai.api-key`, model IDs), GPT-4o example, o-series reasoning models, vision example
2. **Anthropic** — `spring-ai-anthropic-spring-boot-starter`, Claude 3/3.5/3.7 model IDs, streaming thinking (1.1+), image input
3. **Local (Ollama)** — `spring-ai-ollama-spring-boot-starter`, running Ollama locally, `spring.ai.ollama.base-url`, model pull commands, LLaVA multimodal
4. **Cloud Providers** — Amazon Bedrock (multi-model), Google Gemini / Vertex AI, Azure OpenAI — one feature card per provider with starter + config
5. **Other Providers** — Mistral AI, Groq, DeepSeek, NVIDIA NIM, Hugging Face — one card each; note that all follow the same `spring.ai.<provider>.*` config pattern; provider-switching explained (swap the starter, change the config key)

**Cheatsheet** — table: Provider | Starter Artifact | Key Config Property | Key Model IDs

---

## 8. Search Index

After all 7 pages, run:
```bash
python scripts/build_index.py
```

Expected new entries: ~300–400 (7 pages × ~45–60 entries each).

---

## 9. Global Constraints

- No external CDN dependencies — all JS/CSS already bundled
- All hrefs in nav.js must be root-relative: `ROOT + 'spring-ai/page.html'`
- All `<h3>` feature headings must have unique `id` attributes in kebab-case
- Code examples use escaped generics (`&lt;T&gt;` not `<T>`)
- Every table must be wrapped in `<div class="table-wrap">` for mobile scroll
- Dark/light theme compatibility: SVG elements use `var(--text)`, `var(--accent)`, `var(--border)`, `var(--text-muted)`, `var(--text-inverse)` — never hardcoded hex colors
- Cheatsheet section at bottom of every feature page
- Git commit messages: plain descriptive text, no Co-Authored-By trailers of any kind
- Run `python scripts/build_index.py` after completing all pages; commit the updated `assets/search-index.json`
- All Spring AI 1.x and 2.x content sourced via web search — never assumed from prior knowledge
- `chat-client.html` h3 ids: no prefix needed (it's a standalone page)
- `rag.html` h3 ids: no prefix needed
- `tools-advisors.html` h3 ids: no prefix needed
- `structured-output.html` h3 ids: no prefix needed
- `providers.html` h3 ids: prefix with provider name to avoid collisions (e.g., `id="openai-api-key-config"`, `id="anthropic-streaming-thinking"`)
