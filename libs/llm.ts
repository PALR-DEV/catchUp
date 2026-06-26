import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { openai } from "@ai-sdk/openai";
import { type Config } from "../types/index";



function getModel(config: Config) {
    switch (config.provider) {
        case "claude":
            return anthropic("claude-sonnet-4-6");
        case "openai":
            return openai("gpt-4o");
        default:
            throw new Error(`Unsupported provider: ${config.provider}`);
    }
}


function buildPrompt(diff: string): string {
    return `You are a senior software engineer. Summarize the following git changes clearly in markdown:
- What changed
- What was refactored or removed
- Any important patterns or architectural shifts

Keep it concise and developer-friendly.

${diff}`;
}

export async function summarize(diff: string, config: Config): Promise<string> {
    const model = getModel(config);
    const { text } = await generateText({
        model,
        prompt: buildPrompt(diff),
    });

    return text;
}