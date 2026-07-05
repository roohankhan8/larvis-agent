# Larvis Agent Project Overview

## What This Project Is

Larvis Agent is a Laravel 13 application that uses Inertia.js v3 with React 19 for the frontend and the Laravel AI SDK for AI-powered workflows. The project is structured as a single web application with several interactive AI labs, basic authentication, and persistent storage for generated results and conversations.

Local development URL:

- `http://larvis-agent.test`

## Core Stack

- Backend: Laravel 13, PHP 8.3
- Frontend: Inertia.js v3, React 19, TypeScript, Vite
- Styling: Tailwind CSS v4
- AI layer: `laravel/ai`
- Testing: Pest v4, PHPUnit 12
- Quality tools: Laravel Pint, ESLint, Prettier, Larastan
- Database: MySQL

## Main User-Facing Features

The route layer shows four primary product areas:

### 1. Analyze Content

- `GET /analyze-content`
- `POST /analyze-content`
- `POST /analyze-and-save`

This area appears to let users submit content for AI analysis and optionally save the analyzed result.

### 2. Prompt Playground

- `GET /prompt-playground`
- `POST /prompt-playground`

This feature is intended for experimenting with prompts and saving prompt/response runs.

### 3. Conversation Lab

- `GET /conversation-lab`
- `POST /conversation-lab`

This area supports multi-message AI conversations backed by stored conversation data.

### 4. Streaming Lab

- `GET /streaming-lab`
- `POST /streaming-lab`

This lab is designed for streamed AI responses and keeps a history of prompt/response entries.

## Authentication

The application includes standard guest-only authentication flows:

- `GET /login`
- `POST /login`
- `GET /register`
- `POST /register`
- `POST /logout`

Authenticated and guest device behavior is also tracked through a custom middleware layer and a `devices` table.

## Frontend Structure

The frontend is an Inertia React app. Important directories include:

- `resources/js/pages`
  - `AnalyzeContent.tsx`
  - `PromptPlayground.tsx`
  - `ConversationLab.tsx`
  - `StreamingLab.tsx`
  - `Login.tsx`
  - `Register.tsx`
  - `welcome.tsx`
- `resources/js/layouts`
- `resources/js/types`
- `resources/css`

Laravel routes return Inertia pages instead of Blade-rendered screens for the main application UI.

## Backend Structure

Important backend areas include:

- `app/Http/Controllers`
  - Web controllers for each AI workflow
  - Authentication controller
  - API controller for content analysis
- `app/Ai/Agents`
  - `ContentAnalyzer`
  - `StructuredContentAnalyzer`
  - `PromptPlaygroundAgent`
  - `ConversationLabAgent`
  - `StreamingLabAgent`
- `app/Ai/Tools`
  - Custom AI tools for saving posts and post images
- `app/Models`
  - `User`
  - `Device`
  - `CategorizedPost`
  - `PromptPlaygroundEntry`
  - `StreamingLabEntry`

This layout suggests a clear separation between HTTP controllers, AI agents, AI tools, and persisted domain models.

## Database Overview

The current schema shows the application stores both user/account data and AI workflow data.

Main tables:

- `users`
- `devices`
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

### Stored AI Data

- `prompt_playground_entries` stores prompt runs with provider, model, tone, length, temperature, and `top_p`
- `streaming_lab_entries` stores streamed prompt/response pairs
- `agent_conversations` and `agent_conversation_messages` store conversation threads and message history
- `categorized_posts` stores analyzed or generated content metadata such as title, category, tags, summary, and banner path

## Testing

The test suite uses Pest and currently includes feature coverage for:

- authentication flow
- content analysis
- conversation lab
- prompt playground
- streaming lab

There is also a base unit example test and standard Pest bootstrap files.

## Development Notes

- The app follows standard Laravel directory conventions with Inertia React pages under `resources/js/pages`
- Vite is used for frontend development and production builds
- Formatting and linting are handled with Pint, ESLint, and Prettier
- The repository includes a `DESIGN_SYSTEM.md`, which indicates the UI is expected to follow project-specific design rules

## Summary

Larvis Agent is a Laravel + Inertia + React AI application focused on interactive experimentation. Its main capabilities are content analysis, prompt testing, conversational AI, and streaming responses, with persistence for saved outputs, conversations, and user/device context.
