import fs from "fs";
import path from "path";
import os from "os";
import { type Config } from "../types/index";

const CONFIG_PATH = path.join(os.homedir(), ".catchuprc");


export function loadConfig(): Config | null {
    if (fs.existsSync(CONFIG_PATH)) {
        return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
    }

    if (process.env.CATCHUP_PROVIDER) {
        return {
            provider: process.env.CATCHUP_PROVIDER as Config["provider"],
            apiKey: process.env.CATCHUP_API_KEY,
            model: process.env.CATCHUP_MODEL,
        }
    }
    return null;
}

export function saveConfig(config: Config): void {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
}

export function getConfigDisplay(config: Config): string {
    const display = {
        provider: config.provider,
        apiKey: config.apiKey ? "****" + config.apiKey.slice(-4) : "none",
        model: config.model ?? "none",
        maxTokens: config.max_tokens ? new Intl.NumberFormat('en', {notation: 'compact'}).format(config.max_tokens) : "not set",
        contextWindow: config.context_window ? new Intl.NumberFormat('en', {notation: 'compact'}).format(config.context_window) : "not set",
    };
    return JSON.stringify(display, null, 2);
}