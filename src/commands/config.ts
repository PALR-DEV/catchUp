import * as p from "@clack/prompts";
import { type Provider } from "../types/index";
import { getConfigDisplay, loadConfig, saveConfig } from "../libs/config";

export function showConfig() {
    const config = loadConfig();
    if (!config) {
        p.log.error("No config found. Run catchup init first.");
        return;
    }
    p.log.info(getConfigDisplay(config));
}

export function setProvider(provider: string) {
    console.clear();
    const config = loadConfig();
    if (!config) {
        p.log.error("No config found. Run catchup init first.");
        return;
    }
    saveConfig({ ...config, provider: provider as Provider });
    p.log.success(`Provider updated to ${provider}`);
}

export function setKey(key: string) {
    const config = loadConfig();
    if (!config) {
        p.log.error("No config found. Run catchup init first.");
        return;
    }
    saveConfig({ ...config, apiKey: key });
    p.log.success("API key updated.");
}