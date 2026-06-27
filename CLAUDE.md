# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun install                    # install dependencies
bun run dev                    # run CLI in development (executes src/index.ts directly)
bun run build                  # compile to dist/index.js (node target, adds shebang)
bunx prettier --write .        # format all files
```

No tests are configured — `npm test` exits 1.

To try a command locally before building:
```bash
bun run src/index.ts since 1d
bun run src/index.ts init
bun run src/index.ts config show
```

## Architecture

**catchup** is a Node.js CLI tool (built with Bun, distributed as a single `dist/index.js`) that uses an LLM to summarize `git log` output over a user-specified timeframe.

### Request flow for `catchup since <timeframe>`

1. `src/index.ts` — Commander entry point; registers all commands and routes to handlers.
2. `src/commands/since.ts` — Orchestrates: load config → fetch git log → call AI → render output. Supports `--browser`, `--save`, and `--author` flags.
3. `src/libs/git.ts` — Runs `git --no-pager log --since="<ISO date>" [--author="..."] --pretty --no-color --patch` via `execAsync`. Returns the full patch output as a string (250 MB buffer).
4. `src/libs/llm.ts` — Picks the AI model via `getModel(config)`, builds the summarization prompt, and calls Vercel AI SDK's `generateText`. Strips fenced code block wrappers from the response.
5. `src/libs/render.ts` — Three output modes: terminal markdown via `marked-terminal` (default), `saveToFile` writes `catchup-<date>.md`, `openInBrowser` renders HTML and opens `/tmp/catchup-summary.html`.

### Configuration

Config is stored at `~/.catchuprc` as JSON (`Config` type: `provider`, `apiKey`, `model`, `max_tokens`, `context_window`). `loadConfig()` falls back to env vars `CATCHUP_PROVIDER`, `CATCHUP_API_KEY`, and `CATCHUP_MODEL` if the file doesn't exist.

### AI providers

Supported providers are `"anthropic"`, `"openai"`, and `"ollama"` (see `src/types/index.ts`).

- `anthropic` / `openai`: model is user-selected during `catchup init` by fetching the available model list from the Vercel AI Gateway (`https://ai-gateway.vercel.sh/v1/models`). The selected model id, `max_tokens`, and `context_window` are persisted in `~/.catchuprc`.
- `ollama`: uses a hard-coded `qwen3:8b` model in `llm.ts` regardless of config. `isOllamaRunning()` checks `curl http://localhost:11434` before proceeding.

The `getModel` function in `llm.ts` is the single place that maps provider → AI SDK model instance. When adding a new provider, update it here plus `Provider` in `src/types/index.ts` and `fetchProviderModels` in `src/helpers/fetchAllModels.ts`.

### Release

Releases are fully automated via `semantic-release` (see `.github/workflows/release.yml` and `release.config.js`). Commit messages following Conventional Commits drive version bumps and npm publishing.
