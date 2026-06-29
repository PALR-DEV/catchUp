import type { GatewayModel } from "../types";

export const SUPPORTED_PROVIDERS = ['anthropic', 'openai', 'ollama'] as const;
export type SupportedProvider = typeof SUPPORTED_PROVIDERS[number];

const MODELS: Record<Exclude<SupportedProvider, 'ollama'>, GatewayModel[]> = {
    anthropic: [
        { id: "claude-opus-4-8",   name: "Claude Opus 4.8"   },
        { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6" },
        { id: "claude-haiku-4-5",  name: "Claude Haiku 4.5"  },
    ],
    openai: [
        { id: "gpt-4o",       name: "GPT-4o"        },
        { id: "gpt-4o-mini",  name: "GPT-4o Mini"   },
        { id: "o3",           name: "o3"            },
        { id: "o3-mini",      name: "o3 Mini"       },
        { id: "gpt-4.1",      name: "GPT-4.1"       },
        { id: "gpt-4.1-mini", name: "GPT-4.1 Mini"  },
    ],
};

export function fetchProviderModels(provider: Exclude<SupportedProvider, 'ollama'>): GatewayModel[] {
    return MODELS[provider];
}
