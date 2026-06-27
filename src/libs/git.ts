import { execSync } from "child_process";
import { sinceDate } from "./time";
import type { StringValue } from "ms";
import * as p from "@clack/prompts";
export function getDiff(timeframe: StringValue) {
    const since = sinceDate(timeframe).toISOString();

    try {
        const log = execSync(`git --no-pager log --since="${since}" --pretty --no-color --patch`).toString();
        if (!log) return "";
        return log;
    } catch {
        throw new Error("No commits found in this repository.");
    }
}