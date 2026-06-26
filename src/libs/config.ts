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
        }
    }
    return null;
}

export function saveConfig(config: Config): void {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
}

export function getConfigDisplay(config: Config): string {
    if (config.provider === "ollama") {
        return `Provider: ollama\nModel:    ${config.model}`;
    }
        return `Provider: ${config.provider}\nAPI Key:  ${config.apiKey ? "****" + config.apiKey.slice(-4) : "none"
}`;
}