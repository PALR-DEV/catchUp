import { sinceDate } from "./time";
import type { StringValue } from "ms";
import { exec, execSync } from "child_process";
import { promisify } from "util";
const execAsync = promisify(exec);

export async function getDiff(timeframe: StringValue, author?: string) {
    const since = sinceDate(timeframe).toISOString();
    try {
        const authorFilter = author ? `--author="${author}"` : "";
        const { stdout } = await execAsync(`git --no-pager log --since="${since}" ${authorFilter} --pretty --no-color --patch`, { maxBuffer: 1024 * 1024 * 250 });
        if (!stdout) return "";
        return stdout;
    } catch  {
        throw new Error("No commits found in this repository.");
    }
}