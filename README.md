# Larvis Agent

A writer-focused web app built with Laravel 13, Inertia.js v3, React 19 and the [Laravel AI SDK](https://github.com/laravel/ai). It takes content from a rough brief or draft to a polished final version in one connected workflow, with each `ContentProject` carrying its brief, analysis, drafts, conversation context and model settings across every step.

## Features

- **Writer Workspace** (`/`): create content projects and reopen recent ones
- **Analyze Content** (`/analyze-content`): extract a title, category, summary and tags from raw writing
- **Prompt Playground** (`/prompt-playground`): experiment with prompts and model settings
- **Conversation Lab** (`/conversation-lab`): multi-turn chat with project context
- **Tool Lab** (`/tool-lab`): agents that call tools (audience snapshot, call to action, save post)
- **Streaming Lab** (`/streaming-lab`): streamed AI responses
- Login/registration, with guest access tracked per device

## Stack

- PHP 8.3, Laravel 13, `laravel/ai`
- Inertia.js v3, React 19, TypeScript, Vite, Tailwind CSS v4
- Laravel Wayfinder for typed routes
- Pest v4, Pint, Larastan, ESLint, Prettier

## Getting Started

Requirements: PHP 8.3+, Composer, Node.js.

```bash
composer run setup   # installs deps, creates .env, generates key, migrates, builds assets
```

Then add an API key for your AI provider to `.env`. The default text provider is Groq (`config/ai.php`):

```env
GROQ_API_KEY=your-key
```

Start the dev server, queue worker and Vite together:

```bash
composer run dev
```

With Laravel Herd, the app is served at `http://larvis-agent.test`.

## Testing & Quality

```bash
php artisan test --compact   # Pest test suite
vendor/bin/pint              # PHP formatting
npm run lint                 # ESLint
npm run types:check          # TypeScript
```

## Further Docs

- [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md): product and architecture overview
- [deployment_guide.md](deployment_guide.md): deploying to Fly.io or Render
- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md): UI design system

## License

MIT
