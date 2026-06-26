# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun install          # install dependencies
bun run dev          # run the CLI in development
bun build src/index.ts --outdir dist --target node  # build to dist/
```

There are no tests configured yet (`npm test` exits 1).

Formatting is handled by Prettier — run `bunx prettier --write .` to format.

## Architecture

**catchup** is a CLI tool that summarizes git changes over a given timeframe using an LLM. Users run `catchup since <timeframe>` (e.g. `1w`, `3d`, `2h`) from inside any git repo.

### Data flow for `since`

1. `src/index.ts` — Commander entry point. Parses args and routes to command handlers.
2. `src/commands/since.ts` — Orchestrates the full flow: load config → get git diff → summarize with AI → render output.
3. `src/libs/git.ts` — Calls `git log --since` and `git diff --stat HEAD@{timeframe}` via `execSync`, concatenates them into a single diff string.
4. `src/libs/llm.ts` — Selects the AI model based on `config.provider`, builds the prompt, and calls Vercel AI SDK's `generateText`.
5. `src/libs/render.ts` — Three output modes: terminal markdown (default), save to `catchup-<date>.md`, or open rendered HTML in browser.

### Configuration

Config is stored at `~/.catchuprc` as JSON. `loadConfig()` falls back to env vars `CATCHUP_PROVIDER` and `CATCHUP_API_KEY` if the file doesn't exist.

Supported providers (`src/types/index.ts`): `"claude"` (Anthropic, uses `claude-sonnet-4-6`) and `"openai"` (uses `gpt-4o`). The `"ollama"` type exists but is not yet implemented in `llm.ts`.

### Stubs

The `init` and `config` commands are declared in `src/index.ts` but have no `.action()` handlers yet — they are unimplemented.

### Key dependencies

- **Vercel AI SDK** (`ai`, `@ai-sdk/anthropic`, `@ai-sdk/openai`) — LLM abstraction layer
- **Commander** — CLI argument parsing
- **@clack/prompts** — terminal spinners and interactive prompts
- **marked + marked-terminal** — render markdown in the terminal
- **ms** — parse human-readable timeframes like `"2h"` into milliseconds
