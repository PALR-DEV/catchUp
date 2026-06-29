import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getSystemPromptPath(filename: string): string {
    const prodPath = join(__dirname, "systemPrompts", filename);
    if (existsSync(prodPath)) {
        return prodPath;
    }
    const devPath = join(__dirname, "../systemPrompts", filename);
    if (existsSync(devPath)) {
        return devPath;
    }

    throw new Error(`System prompt not found: ${filename}`);
}

export type Provider = "anthropic" | "openai" | "ollama";

export const SYSTEM_PROMPTS: Record<string, string> = {
    get SR_SOFTWARE_ENGINEER_BUDDY(): string {
        return readFileSync(getSystemPromptPath("srSoftwareEngineerBuddy.md"), "utf-8");
    },
    get SR_SOFTWARE_ENGINEER_BRIEF(): string {
        return readFileSync(getSystemPromptPath("srSoftwareEngineerBrief.md"), "utf-8");
    },

    get GREP_FILTER(): string {
        return readFileSync(getSystemPromptPath("grepFilter.md"), "utf-8");
    },

};

export interface Config {
    provider: Provider;
    apiKey?: string;
    model?: string;
    max_tokens?: number;
    system_prompt_option?: string;
}

export type GatewayModel = {
    id: string;
    name: string;
};