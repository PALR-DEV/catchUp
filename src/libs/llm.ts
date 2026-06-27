import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { type Config } from "../types/index";
import { ollama } from 'ai-sdk-ollama';



function getModel(config: Config) {
    switch (config.provider) {
        case "anthropic":
            return createAnthropic({ apiKey: config.apiKey })("claude-haiku-4-5");
        case "openai":
            return createOpenAI({ apiKey: config.apiKey })("gpt-4o");
        case "ollama":
            return ollama("qwen3:8b");
        default:
            throw new Error(`Unsupported provider: ${config.provider}`);
    }
}


function buildPrompt(diff: string): string {
    return `You are a senior software engineer reviewing a git diff. Summarize the changes clearly in markdown using the following sections:

## What Changed
List new features, files added, and functionality introduced.

## Code Changes
Highlight the most important code-level changes. Show relevant snippets if they help explain the change.

## Refactored or Removed
List anything that was reorganized, renamed, or deleted.

## Architectural Shifts
Note any patterns, structural changes, or design decisions worth calling out.

Be concise and developer-friendly. Use bullet points. Include code snippets where relevant using markdown code blocks.

Here is the git diff:
${diff}`;
}

export async function summarize(diff: string, config: Config): Promise<string> {
    const model = getModel(config);
    const { text } = await generateText({
        model,
        prompt: buildPrompt(diff),
        
    });

    return text
    .replace(/^```[\w]*\n?/, "")
    .replace(/\n?```$/, "")
    .trim();
}