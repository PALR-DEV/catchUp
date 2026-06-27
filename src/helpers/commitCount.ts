import type { StringValue } from "ms";
import { execSync } from "child_process";
import { promisify } from "util";
import { exec } from "child_process";
import { sinceDate } from "../libs/time";

const execAsync = promisify(exec);

export async function getCommitCount(timeframe: StringValue): Promise<number> {
    const since = sinceDate(timeframe).toISOString();
    try {
        const { stdout } = await execAsync(`git rev-list --count --since="${since}" HEAD`);
        return parseInt(stdout.trim(), 10);
    } catch {
        throw new Error("Failed to retrieve commit count.");
    }
}