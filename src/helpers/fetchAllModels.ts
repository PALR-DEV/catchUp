import type { GatewayModel, RawGatewayModel } from "../types";

export const SUPPORTED_PROVIDERS = ['anthropic', 'openai'] as const;
export type SupportedProvider = typeof SUPPORTED_PROVIDERS[number];

export async function fetchProviderModels(provider: SupportedProvider): Promise<GatewayModel[]> {
    const res = await fetch('https://ai-gateway.vercel.sh/v1/models');
    const { data }: { data: RawGatewayModel[] } = await res.json();

    return data
        .filter(m => m.type === 'language' && m.id.startsWith(`${provider}/`))
        .map(({ pricing, ...rest }) => rest);
}