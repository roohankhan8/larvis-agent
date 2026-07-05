# Connected Writer Workspace Plan

## Summary

Turn the current AI lab site into a connected writer workspace built around a single saved **content project**. Keep direct access to the specialized pages, but make the primary experience a **guided workflow** that moves writers through:

- brief or draft input
- analysis
- generation and refinement
- tool-assisted polish
- conversational revision
- final export

The first version should optimize for **mixed content**: short-form marketing copy and longer editorial drafts. It should remain **anonymous-friendly**, but cross-page continuity must be backed by a shared project and session model instead of isolated page-local forms.

## Key Changes

### 1. Introduce a Shared Content Project Model

Add a first-class `ContentProject` entity as the unit of work for the whole app.

Store:

- title
- working brief or source text
- target format
- audience
- tone
- status
- latest draft
- structured analysis
- selected model settings
- timestamps
- owner or device link

Add child records or JSON-backed sections for:

- draft versions
- structured analysis output
- prompt runs
- tool outputs
- conversation thread reference
- final approved output

Link projects to authenticated users when available, otherwise to the existing device and guest tracking model.

### 2. Reframe the App Around One Workflow Page Plus Connected Specialist Pages

Keep the existing pages, but stop presenting them as unrelated experiments.

Add a new top-level writer workspace or dashboard page as the primary entrypoint.

This workspace should:

- list recent projects
- create a new project from a brief or pasted draft
- show progress through workflow stages
- deep-link into each specialist page with the current project loaded

Update navigation so every specialist page understands a `project` context and can return to the workspace.

### 3. Connect Each Current Page to the Shared Project

#### Analyze Content

This becomes the intake and structure step.

- load source content from the project
- save title, category, summary, and tags back onto the project
- let the user promote analysis output into the working brief or draft

#### Prompt Playground

This becomes draft generation and refinement.

- start from project brief plus project analysis
- save each generated output as a project draft version
- allow `set as current draft`

#### Tool Lab

This becomes guided polish.

- use project audience, goal, and content type to run deterministic helpers
- save tool-assisted outputs back to the project as alternative draft versions

#### Conversation Lab

This becomes revision chat.

- bind the conversation to the current project instead of an isolated lab thread
- let the chat reference the current draft
- write revisions back into the project

#### Streaming Lab

This becomes long-generation or finalization mode.

- stream generation for a selected project task such as rewrite, expansion, or final pass
- save the completed streamed output as a draft or final version

### 4. Standardize Shared Project Context and Handoff Behavior

Define one shared project payload used by all writer pages.

Each page should receive:

- project identity
- current draft
- source brief or content
- audience, tone, goal, and content type
- latest structured analysis
- linked conversation metadata

Add explicit handoff actions between pages:

- `Analyze this draft`
- `Open in Prompt Playground`
- `Refine in Conversation`
- `Polish with Tools`
- `Finalize with Streaming`

Remove isolated `lab-only` framing from primary UI copy and replace it with writer workflow language.

### 5. Preserve Specialist Flexibility Without Fragmenting the Product

Keep advanced controls on specialist pages.

Add a simple path from the workspace so non-technical writers can use the app without tuning every model setting.

Default model and provider choices should remain Groq-based for current text generation pages.

Advanced settings should be secondary, collapsible, or grouped under `Advanced controls` where appropriate.

## Implementation Changes

### Backend

- Add a `ContentProject` model, migration, relationships, and factories.
- Add project-aware controllers or update existing ones so each workflow endpoint accepts a project id and persists results back into it.
- Add project authorization rules:
  - authenticated users see their own projects
  - guests see only device-linked projects
- Reuse current `devices`, conversation persistence, and saved entry tables where sensible, but make the project the top-level parent.
- Prefer one shared service or action layer for `apply generated result to project` so all pages save data consistently.

### Frontend

- Add a writer workspace page that becomes the main homepage or the clear primary CTA from home.
- Add project-aware routing, via query param or route segment, but standardize on one pattern across all pages.
- Add a shared project header or sidebar on specialist pages showing:
  - project name
  - current stage
  - current draft status
  - quick navigation to adjacent steps
- Add reusable UI for:
  - project creation
  - recent projects
  - draft version selection
  - `use this output` actions
- Replace isolated result panels with project actions such as:
  - `save as draft`
  - `replace current draft`
  - `continue to next step`

### Public Interfaces and Types

- New shared `ContentProject` payload or type across Inertia pages.
- Existing page POST endpoints become project-aware and must accept a project identifier.
- Conversation flow becomes project-bound rather than free-floating.
- Streaming output endpoint must support writing results into a project draft or final slot.

## Test Plan

- Feature tests for project creation as guest and as authenticated user.
- Feature tests that each existing page can load a project and save results back to it.
- Feature tests for handoff flow:
  - analyze -> prompt -> save draft
  - draft -> tool lab -> save polished version
  - draft -> conversation -> persist updated thread
  - draft -> streaming -> save final output
- Authorization tests for user-owned vs guest or device-owned projects.
- Inertia tests ensuring project context props are present on all connected pages.
- Frontend acceptance scenarios:
  - create a new project from home
  - move through the guided workflow without losing state
  - leave a page and come back with project data intact
  - switch between multiple drafts or versions inside one project
- Regression tests to preserve current isolated capabilities where they remain exposed.

## Assumptions and Defaults

- Product shape: **hybrid leaning guided**. The main experience is a single workflow, but specialist pages remain directly accessible.
- Primary saved object: **content project**.
- Initial audience: **content writers working on both marketing and editorial content**.
- Access model: **anonymous-friendly**, using the existing device and guest tracking until sign-up, then linking work to the account.
- Provider scope: continue using current Groq-based text generation where already implemented.

Out of scope for this first connected version:

- external CMS publishing
- team collaboration or multi-user editing
- queue-based async writer workflow
- non-text asset pipelines
