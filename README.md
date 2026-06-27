# catchup


> Summarize your codebase changes while you were away.

## What is catchup?

A CLI tool that uses AI to summarize everything that changed in your codebase while you were on vacation, out sick, or just away for a few days. No more scrolling through hundreds of commits — just run `catchup since 1w` and get a clean, human-readable summary.

## Installation

```bash
npm install -g @palr-dev/catchup
```

## Setup

```bash
catchup init
```

Follow the prompts to pick your AI provider and enter your API key.

## Usage

```bash
# Summarize changes from the last week
catchup since 1w

# Summarize changes from the last 3 days
catchup since 3d

# Summarize changes from the last 2 hours
catchup since 2h

# Open summary in browser
catchup since 1w --browser

# Save summary as markdown file
catchup since 1w --save
```

## Config

```bash
# Show current config
catchup config show

# Change AI provider
catchup config set-provider openai

# Update API key
catchup config set-key sk-...
```

## Supported Providers

| Provider | Status |
|----------|--------|
| Claude (Anthropic) | ✅ Available |
| OpenAI | ✅ Available |
| Ollama | ✅ Available |

## Supported Timeframes

| Input | Meaning |
|-------|---------|
| `1h` | Last hour |
| `3d` | Last 3 days |
| `1w` | Last week |
| `2w` | Last 2 weeks |

## Tech Stack

- [Bun](https://bun.sh) — runtime & package manager
- [Commander.js](https://github.com/tj/commander.js) — CLI framework
- [Vercel AI SDK](https://sdk.vercel.ai) — unified AI provider interface
- [@clack/prompts](https://github.com/natemoo-re/clack) — beautiful CLI prompts
- [marked](https://marked.js.org) + [marked-terminal](https://github.com/mikaelbr/marked-terminal) — markdown rendering
- [ms](https://github.com/vercel/ms) — timeframe parsing

## License

MIT
