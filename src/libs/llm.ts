import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { SYSTEM_PROMPTS, type Config } from "../types/index";
import { ollama } from 'ai-sdk-ollama';

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

export async function summarize(diff: string, config: Config, systemPromptKey?: string): Promise<string> {
    const model = getModel(config);
        const { text } = await generateText({
            model,
            timeout: { totalMs: 1800000 },
            system: SYSTEM_PROMPTS[systemPromptKey ?? config.system_prompt_option ?? "SR_SOFTWARE_ENGINEER_BRIEF"],
            prompt: diff,
            maxOutputTokens: config.max_tokens || undefined,
        });
        return text
            .replace(/^```[\w]*\n?/, "")
            .replace(/\n?```$/, "")
            .trim();
}
