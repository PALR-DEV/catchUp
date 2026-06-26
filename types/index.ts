export type Provider = "claude" | "openai" | "ollama";

export interface Config {
    provider:Provider;
    apiKey?:string;
}