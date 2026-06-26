import { execSync } from "child_process";
import { sinceDate } from "./time";
import type { StringValue } from "ms";
import * as p from "@clack/prompts";
export function getDiff(timeframe: StringValue) {
    const since = sinceDate(timeframe).toISOString();

    try {
        const log = execSync(`git log --since="${since}" --oneline`).toString();
        const diff = execSync(`git diff --stat HEAD@{${timeframe}}`).toString();
        if (!log && !diff) return "";
        return `COMMITS:\n${log}\n\nDIFF SUMMARY:\n${diff}`;
    } catch {
        throw new Error("No commits found in this repository.");
    }
}