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
                hint: "free and local, but requires Ollama to be installed",
            },
        ],
    });

    if (p.isCancel(provider)) {
        p.cancel("Setup cancelled.");
        process.exit(0);
    }

    let apiKey: string | undefined;
    let model: string | undefined;

    if (provider !== "ollama") {
        apiKey = (await p.password({
            message: "Enter your API key:",
            mask: "*",
            validate: (val) => (!val ? "API key is required" : undefined),
        })) as string;

        if (p.isCancel(apiKey)) {
            p.cancel("Setup cancelled.");
            process.exit(0);
        }
    } else {
        p.log.info(
            "Make sure Ollama is installed and running with: ollama serve"
        );
        const ollamaModel = await p.text({
            message: "What model do you want to use?",
            placeholder: "mistral",
            defaultValue: "mistral",
        });

        if (p.isCancel(ollamaModel)) {
            p.cancel("Setup cancelled.");
            process.exit(0);
        }
        model = ollamaModel as string;
    }

    saveConfig({ provider: provider as Provider, apiKey, model });
    p.log.success("All done!");
    p.outro("Config saved! You are ready to use catchup.");
}