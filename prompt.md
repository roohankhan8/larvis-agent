# Groq Text Lab Expansion

Keep the current content analyzer page and its save flow unchanged. Add separate pages that each demonstrate one Laravel AI SDK text-generation concept using Groq only.

## Goal
Turn this project into a small lab of focused AI demos that can:
- generate text with Groq
- show structured output
- remember conversations
- use tools
- stream responses
- queue long-running work

## Current Baseline
The app already has:
- an Inertia/React page at `/analyze-content`
- a web controller for analysis
- a `CategorizedPost` model
- a save path that stores title, category, summary, and tags
- Laravel AI SDK agents and tools already in use

Treat `AnalyzeContent` as the baseline reference page, not as the place to add the new demos.

## Implementation Notes
- Keep Groq as the only text-generation provider for all new demos.
- Reuse the current Laravel + Inertia + React stack.
- Prefer one controller per new lab page.
- Prefer one agent class per concept so the lesson stays isolated.
- Use Wayfinder-generated route helpers for every frontend request.
- Use `routes/web.php` for all new browser-facing pages and POST endpoints.
- Leave the existing analyzer route and save flow intact unless a bug fix is required.

## Roadmap

### 1. Prompt Playground
Learn:
- `Promptable`
- provider/model selection
- prompt shaping
- temperature and response tuning

Build:
- create a simple text-generation page for Groq
- let the user submit a prompt and see the raw answer
- expose a few safe prompt controls like tone or length
- suggested route: `/prompt-playground`
- suggested files:
  - `app/Http/Controllers/PromptPlaygroundController.php`
  - `app/Ai/Agents/PromptPlaygroundAgent.php`
  - `resources/js/pages/PromptPlayground.tsx`

### 2. Structured Extractor
Learn:
- `HasStructuredOutput`
- JSON schema design
- parsing structured responses

Build:
- create a page that extracts fields from text into JSON
- render the structured result in the UI
- keep the schema small and easy to understand
- suggested route: `/structured-extractor`
- suggested files:
  - `app/Http/Controllers/StructuredExtractorController.php`
  - `app/Ai/Agents/StructuredExtractorAgent.php`
  - `resources/js/pages/StructuredExtractor.tsx`

### 3. Conversation Lab
Learn:
- `Conversational`
- `RemembersConversations`
- conversation state and continuation

Build:
- create a page for asking follow-up questions to the same agent
- persist or reuse conversation identifiers
- show how context changes the answer
- suggested route: `/conversation-lab`
- suggested files:
  - `app/Http/Controllers/ConversationLabController.php`
  - `app/Ai/Agents/ConversationLabAgent.php`
  - `resources/js/pages/ConversationLab.tsx`

### 4. Tool Lab
Learn:
- `HasTools`
- custom tool classes
- tool outputs

Build:
- create a page that demonstrates one or two text-only tools
- keep the tools simple and deterministic
- show tool calls affecting the final answer
- suggested route: `/tool-lab`
- suggested files:
  - `app/Http/Controllers/ToolLabController.php`
  - `app/Ai/Agents/ToolLabAgent.php`
  - `app/Ai/Tools/*.php`
  - `resources/js/pages/ToolLab.tsx`

### 5. Streaming Lab
Learn:
- streaming responses
- progressive UI updates

Build:
- create a page that streams a Groq response token by token or chunk by chunk
- show partial output while the response is still generating
- keep the interface responsive during long generations
- suggested route: `/streaming-lab`
- suggested files:
  - `app/Http/Controllers/StreamingLabController.php`
  - `app/Ai/Agents/StreamingLabAgent.php`
  - `resources/js/pages/StreamingLab.tsx`

### 6. Queue Lab
Learn:
- `queue()`
- background AI processing patterns

Build:
- create a page that starts a queued generation job
- show pending and completed states
- surface job completion in the UI
- suggested route: `/queue-lab`
- suggested files:
  - `app/Http/Controllers/QueueLabController.php`
  - `app/Ai/Agents/QueueLabAgent.php`
  - `app/Jobs/*.php`
  - `resources/js/pages/QueueLab.tsx`

## Testing Strategy
Add tests as each feature lands:
- prompt page validation and text generation success
- structured output shape and schema validation
- conversation continuation behavior
- tool execution behavior
- streaming and queue state handling
- frontend request flow for each page
- Suggested test files:
  - `tests/Feature/PromptPlaygroundTest.php`
  - `tests/Feature/StructuredExtractorTest.php`
  - `tests/Feature/ConversationLabTest.php`
  - `tests/Feature/ToolLabTest.php`
  - `tests/Feature/StreamingLabTest.php`
  - `tests/Feature/QueueLabTest.php`

## Working Rules
- Prefer small, incremental changes.
- Keep `AnalyzeContent` unchanged unless a bug fix is required.
- Use Groq only for text generation.
- Add one new SDK concept per page.
- Keep the UI and backend changes aligned.
- Verify each milestone with tests and a production build.
- Regenerate Wayfinder after adding or changing web routes.

## Milestone Order
1. Prompt Playground
2. Structured Extractor
3. Conversation Lab
4. Tool Lab
5. Streaming Lab
6. Queue Lab
