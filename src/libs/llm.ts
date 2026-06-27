import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { type Config } from "../types/index";
import { ollama } from 'ai-sdk-ollama';
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const instructions = readFileSync(join(__dirname, "../prompts/catchup-summary.md"), "utf-8");

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
        instructions,
        prompt: diff,
        maxOutputTokens: config.max_tokens,
    });

    return text
        .replace(/^```[\w]*\n?/, "")
        .replace(/\n?```$/, "")
        .trim();
}
