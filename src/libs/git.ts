import { sinceDate } from "./time";
import type { StringValue } from "ms";
import { exec } from "child_process";
import { promisify } from "util";
const execAsync = promisify(exec);

async function getBaseBranch(): Promise<string> {
    try {
        const { stdout } = await execAsync("git symbolic-ref refs/remotes/origin/HEAD");
        return stdout.trim().replace("refs/remotes/origin/", "");
    } catch {
        return "main";
    }
}

export async function getDiff(timeframe: StringValue, author?: string, branch?: string, grep?: string): Promise<string> {
    const since = sinceDate(timeframe).toISOString();
    try {
        const authorFilter = author ? `--author="${author}"` : "";
        const grepFilter = grep ? `--grep="${grep}"` : "";
        const range = branch ? `${await getBaseBranch()}..${branch}` : "";
        const { stdout } = await execAsync(
            `git --no-pager log --since="${since}" ${authorFilter} ${grepFilter} ${range} --pretty --no-color --patch`,
            { maxBuffer: 1024 * 1024 * 250 }
        );
        if (!stdout) return "";
        return stdout;
    } catch {
        throw new Error("No commits found in this repository.");
    }
}

export async function getCommitList(timeframe:StringValue, author?: string, branch?: string, grep?: string): Promise<string[]> {
    const since = sinceDate(timeframe).toISOString();
    try {
        const authorFilter = author ? `--author="${author}"` : "";
        const grepFilter = grep ? `--grep="${grep}"` : "";
        const range = branch ? `${await getBaseBranch()}..${branch}` : "";
        const { stdout } = await execAsync(
            `git --no-pager log --since="${since}" ${authorFilter} ${grepFilter} ${range} --pretty=format:"%h  %s  —  %an,  %ar"`,
            { maxBuffer: 1024 * 1024 * 10 }
        );
        if (!stdout) return [];
        return stdout.trim().split("\n").filter(line => line !== "")
    } catch (error) {
        throw new Error("No commits found in this repository.");
    }
}
