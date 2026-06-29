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
};

export interface Config {
    provider: Provider;
    apiKey?: string;
    model?: string;
    max_tokens?: number;
    context_window?: number;
    system_prompt_option?: string;
}

export interface GatewayModel {
    id: string;
    object: string;
    created: number;
    released: number;
    owned_by: string;
    name: string;
    description: string;
    context_window: number;
    max_tokens: number;
    type: 'language' | 'image' | 'embedding' | 'speech' | 'realtime' | 'transcription';
    tags?: string[];
}


export interface RawGatewayModel extends GatewayModel {
    pricing: Record<string, unknown>;
}