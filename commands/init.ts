import * as p from "@clack/prompts";

import { type Provider } from "../types/index";
import { saveConfig } from "../libs/config";

export async function initCommand() {
    console.clear();
    p.intro("catchup — setup");

    const provider = await p.select({
        message: "Which AI provider do you want to use?",
        options: [
            { value: "claude", label: "Claude (Anthropic)" },
            { value: "openai", label: "OpenAI" },
            {
                value: "ollama",
                label: "Ollama (local)",
                hint: "coming soon",
                disabled: true,
            },
        ],
    });

    if (p.isCancel(provider)) {
        p.cancel("Setup cancelled.");
        process.exit(0);
    }

    let apiKey: string | undefined;

    if (provider) {
        apiKey = (await p.password({
            message: "Enter your API key:",
            mask: "*",
            validate: (val) => (!val ? "API key is required" : undefined),
        })) as string;

        if (p.isCancel(apiKey)) {
            p.cancel("Setup cancelled.");
            process.exit(0);
        }
    }

    saveConfig({ provider: provider as Provider, apiKey });
    p.log.success("All done!");  
    p.outro("Config saved! You are ready to use catchup.");
}