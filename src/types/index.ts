export type Provider = "anthropic" | "openai" | "ollama";

export interface Config {
    provider:Provider;
    apiKey?:string;
    model?:string;
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