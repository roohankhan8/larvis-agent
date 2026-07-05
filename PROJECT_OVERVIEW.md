# Larvis Agent Project Overview

## Product Summary

Larvis Agent is a writer-focused web application built with Laravel 13, Inertia.js v3, React 19, and the Laravel AI SDK. It helps content teams move from a rough brief or draft to a polished final version inside one connected workflow.

The product is centered on a shared `ContentProject`. Each project can carry the source brief, analysis, draft history, conversation context, model settings, and final output across multiple writing steps.

Local development URL:

- `http://larvis-agent.test`

## Core Stack

- Backend: Laravel 13, PHP 8.3
- Frontend: Inertia.js v3, React 19, TypeScript, Vite
- Styling: Tailwind CSS v4
- AI layer: `laravel/ai`
- Routing helpers: Laravel Wayfinder
- Testing: Pest v4, PHPUnit 12
- Quality tools: Laravel Pint, ESLint, Prettier, Larastan
- Database: MySQL

## Main User Journey

The live product is structured around a connected writing flow rather than isolated experiments.

### 1. Writer Workspace

- `GET /`
- `POST /projects`

The home page acts as the main workspace. Users can:

- create a new content project from a brief or draft
- reopen recent projects
- move through each writing step without losing context

### 2. Analyze Content

- `GET /analyze-content`
- `POST /analyze-content`
- `POST /analyze-and-save`

This step helps users turn raw writing into a structured starting point by extracting:

- a suggested title
- a category or content type
- a summary
- tags or key themes

When a project is active, the analysis is saved back into that project.

### 3. Prompt Playground

- `GET /prompt-playground`
- `POST /prompt-playground`

This step is used for draft creation and refinement. Users can adjust tone, output length, temperature, top-p, and model profile, then save the generated result back into the project as a draft version.

### 4. Conversation Lab

- `GET /conversation-lab`
- `POST /conversation-lab`

This step supports revision through chat. It keeps the conversation history in the database and can attach the thread to the active project so users can keep refining the same piece of content over time.

### 5. Tool Lab

- `GET /tool-lab`
- `POST /tool-lab`

This step adds structured help for specific writing goals. It uses deterministic tools to shape content around audience and conversion goals, then saves the result back into the project.

### 6. Streaming Lab

- `GET /streaming-lab`
- `POST /streaming-lab`

This step is used for longer or more visible generation runs. Users can watch the final copy arrive in real time and save the finished version back into the project.

## Authentication And Guest Access

The application includes standard authentication flows:

- `GET /login`
- `POST /login`
- `GET /register`
- `POST /register`
- `POST /logout`

The product is also guest-friendly. Anonymous usage is tracked through the `devices` table and guest device middleware. When a guest later signs up or logs in, project ownership can be linked back to the user account.

## Frontend Structure

The frontend is an Inertia React app. Important directories include:

- `resources/js/pages`
  - `welcome.tsx`
  - `AnalyzeContent.tsx`
  - `PromptPlayground.tsx`
  - `ConversationLab.tsx`
  - `ToolLab.tsx`
  - `StreamingLab.tsx`
  - `Login.tsx`
  - `Register.tsx`
- `resources/js/components`
  - shared UI such as the project context panel
- `resources/js/layouts`
- `resources/js/types`
- `resources/css`

Laravel routes return Inertia pages for the main application interface.

## Backend Structure

Important backend areas include:

- `app/Http/Controllers`
  - workflow controllers for analysis, drafting, chat, tool-assisted writing, streaming, and the writer workspace
  - authentication controller
  - API controller for content analysis
- `app/Http/Controllers/Concerns`
  - shared project resolution logic for connected pages
- `app/Ai/Agents`
  - `ContentAnalyzer`
  - `StructuredContentAnalyzer`
  - `PromptPlaygroundAgent`
  - `ConversationLabAgent`
  - `ToolLabAgent`
  - `StreamingLabAgent`
- `app/Ai/Tools`
  - custom helper tools such as audience and call-to-action guidance
- `app/Support`
  - shared workflow logic for saving project updates
- `app/Models`
  - `User`
  - `Device`
  - `ContentProject`
  - `CategorizedPost`
  - `PromptPlaygroundEntry`
  - `StreamingLabEntry`

## Database Overview

The schema stores both account data and writing workflow data.

Main product tables:

- `users`
- `devices`
- `content_projects`
- `categorized_posts`
- `prompt_playground_entries`
- `streaming_lab_entries`
- `agent_conversations`
- `agent_conversation_messages`

Supporting framework tables:

- `cache`
- `cache_locks`
- `jobs`
- `job_batches`
- `failed_jobs`
- `sessions`
- `password_reset_tokens`
- `migrations`

### Stored Writing Data

- `content_projects` stores the shared project record, including title, source content, audience, tone, goal, analysis, draft history, conversation reference, and final output
- `prompt_playground_entries` stores prompt runs with provider, model, tone, length, temperature, and `top_p`
- `streaming_lab_entries` stores streamed prompt and response pairs
- `agent_conversations` and `agent_conversation_messages` store chat threads and message history
- `categorized_posts` stores structured content metadata such as title, category, summary, tags, and banner path

## Testing

The test suite uses Pest and includes feature coverage for:

- authentication flow
- content analysis
- prompt generation
- conversation persistence
- streaming responses
- tool-assisted writing
- connected writer workflow and project persistence

## Development Notes

- The app follows standard Laravel conventions with Inertia React pages under `resources/js/pages`
- Vite is used for frontend development and production builds
- Formatting and linting are handled with Pint, ESLint, and Prettier
- The repository includes `DESIGN_SYSTEM.md`, which defines the visual language the UI should follow
- Route helpers are generated through Wayfinder for frontend usage

## Summary

Larvis Agent is a connected writing workspace that helps users analyze source material, generate drafts, refine copy, and save progress inside a single project-based workflow.
