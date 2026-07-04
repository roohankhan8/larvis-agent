# Laravel AI SDK Learning Roadmap

Build this project by extending the current content-analysis workflow, and use each feature to learn one Laravel AI SDK concept at a time.

## Goal
Turn the existing analyzer into a small product that can:
- analyze content
- save analyzed posts
- remember previous interactions
- enrich content with AI tools
- process long tasks in the background
- search saved content semantically

## Current Baseline
The app already has:
- an Inertia/React page at `/analyze-content`
- a web controller for analysis
- a `CategorizedPost` model
- a save path that stores title, category, summary, and tags
- Laravel AI SDK agents and tools already in use

## Roadmap

### 1. Strengthen the save flow
Learn:
- `Promptable`
- `HasStructuredOutput`
- basic tool-driven persistence

Build:
- keep the current analysis + save flow stable
- make sure every successful analysis creates a `CategorizedPost`
- return the saved record in the response so the UI can show it immediately

### 2. Add conversation memory
Learn:
- `Conversational`
- `RemembersConversations`

Build:
- let users continue a prior analysis instead of starting from scratch
- store conversation state per user
- add a "continue previous analysis" UI path

### 3. Add AI tools for enrichment
Learn:
- `HasTools`
- custom tool classes
- structured tool outputs

Build:
- add tools for features like:
  - generating tags
  - suggesting categories
  - generating a banner image
  - cleaning up titles
- keep each tool small and testable

### 4. Move heavy work to jobs
Learn:
- `queue()`
- async AI processing patterns

Build:
- send long-running analysis to the queue
- show a pending state in the UI
- persist results when the job finishes

### 5. Add streaming responses
Learn:
- AI SDK streaming routes
- progressive output handling in the frontend

Build:
- show partial analysis text as it is produced
- keep the UI responsive during long prompts

### 6. Add embeddings and semantic search
Learn:
- embeddings
- vector store concepts
- retrieval over saved records

Build:
- embed saved posts
- add semantic search over existing content
- let users search by meaning, not exact keywords

### 7. Add a lightweight RAG layer
Learn:
- retrieval-augmented generation
- file or store-backed context injection

Build:
- answer questions from previously saved posts
- cite or surface the most relevant saved content
- keep the context limited to the app's own data

## Testing Strategy
Add tests as each feature lands:
- analysis validation and success response
- save flow creates a `CategorizedPost`
- AI SDK fake-based tests for agents and tools
- queue behavior for background work
- semantic search behavior once embeddings exist
- frontend request flow for the main page

## Working Rules
- Prefer small, incremental changes.
- Use the existing content analyzer as the learning backbone.
- Add one new SDK concept per milestone.
- Keep the UI and backend changes aligned.
- Verify each milestone with tests and a production build.

## Milestone Order
1. Save flow and result display
2. Conversation memory
3. Tools for enrichment
4. Queueing
5. Streaming
6. Embeddings and search
7. RAG over saved content
