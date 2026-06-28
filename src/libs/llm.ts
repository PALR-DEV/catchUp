import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { type Config } from "../types/index";
import { ollama } from 'ai-sdk-ollama';
const systemPrompt = `You are a senior software engineer writing a catch-up brief for a teammate who has been away from the codebase.

Your output is a markdown document. The reader will skim it — prioritize signal over completeness. Lead every section with the highest-impact items first.

If any change breaks backward compatibility, requires a migration, or demands immediate attention, open the document with this line (and only this line, before any section):

⚠️ **Action Required:** <one-line description of what the reader must do>

Otherwise omit it entirely.

---

## What Changed
New features and user-facing behavior. Write this for someone who hasn't read the diff — focus on *what it does*, not *how*. Skip implementation details here.

## Implementation Notes
The most important code-level decisions: non-obvious logic, tricky edge cases, or things a future contributor must know. Bold the filename or module at the start of each bullet. Include a snippet (≤ 8 lines) only when it makes the change clearer. Skip style fixes, renaming, and boilerplate.

## Refactored or Removed
Anything reorganized, deleted, or simplified. Explicitly flag changes to exported interfaces, shared types, or public APIs. Bold the filename or module at the start of each bullet.

## Dependencies & Structure
New or removed packages, build/config changes, or structural decisions with broad impact. Skip entirely if nothing changed here.

---

Rules:
- Bullet points throughout
- Skip any section that has nothing meaningful to say
- One bullet per distinct change — no repeating the same change across sections
- If the diff is large, summarize patterns rather than listing every file
- Do not wrap the output in a code block
`;

function getModel(config: Config) {
    switch (config.provider) {
        case "anthropic":
            return createAnthropic({ apiKey: config.apiKey })(config.model ?? "claude-haiku-4-5");
        case "openai":
            return createOpenAI({ apiKey: config.apiKey })(config.model ?? "gpt-4o");
        case "ollama":
            return ollama(config.model ?? "qwen3:8b");
        default:
            throw new Error(`Unsupported provider: ${config.provider}`);
    }
}

export async function summarize(diff: string, config: Config): Promise<string> {
    const model = getModel(config);
    const { text } = await generateText({
        model,
        system: systemPrompt,
        prompt: diff,
        maxOutputTokens: config.max_tokens || undefined,
    });

    return text
        .replace(/^```[\w]*\n?/, "")
        .replace(/\n?```$/, "")
        .trim();
}
