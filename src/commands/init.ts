import * as p from "@clack/prompts";

import { type GatewayModel, type Provider } from "../types/index";
import { loadConfig, saveConfig } from "../libs/config";
import { execSync } from "child_process";
import { fetchProviderModels } from "../helpers/fetchAllModels";

export async function initCommand() {
    console.clear();
    const config = loadConfig();
    
    p.intro("catchup — setup");
    if(config) {
        const shouldProceed = await p.confirm({
            message: 'Config already exists. Are you sure you want to overwrite it?',
        });

        if (p.isCancel(shouldProceed) || !shouldProceed) {
            p.cancel("Setup cancelled.");
            process.exit(0);
        }
    }

    const provider = await p.select({
        message: "Which AI provider do you want to use?",
        options: [
            { value: "anthropic", label: "Claude (Anthropic)" },
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
    let modelInfo: GatewayModel | undefined;

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
        const spinner = p.spinner();
        spinner.start("Fetching available models...");
        const models = await fetchProviderModels(provider);
        spinner.stop("Models loaded.");
        const selectedModel = await p.select({
            message: "Which model do you want to use?",
            options: models.map(m => ({
                value: m.id,
                label: m.name,
                hint: `ctx: ${(m.context_window / 1000).toFixed(0)}k`,
            })),
        });

        if (p.isCancel(selectedModel)) {
            p.cancel("Setup cancelled.");
            process.exit(0);
        }
        
        model = selectedModel;
        modelInfo = models.find(m => m.id === selectedModel);

    } else {
        p.log.info(
            "Make sure Ollama is installed and running with: ollama serve"
        );


        const output = execSync("ollama list", { stdio: ["pipe", "pipe", "ignore"] })
            .toString()
            .trim()
            .split("\n")
        p.note(
            output.join("\n"),
            "Available Ollama models"
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
        model = ollamaModel;
    }

    saveConfig({ provider: provider as Provider, apiKey, model, max_tokens:modelInfo?.max_tokens, context_window:modelInfo?.context_window });
    p.log.success("All done!");
    p.outro("Config saved! You are ready to use catchup.");
}