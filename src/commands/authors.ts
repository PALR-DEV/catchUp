import * as p from "@clack/prompts";
import { execSync } from "child_process";

export async function authorsCommand(): Promise<void> {
    console.clear();
    p.intro("Catchup — Authors");

    try {
        const stdout = execSync(`git log --pretty=format:"%an" | sort | uniq -c | sort -rn`)
            .toString()
            .trim();

        if (!stdout) {
            p.log.warn("No authors found in this repository.");
            process.exit(0);
        }

        p.note(stdout, "Authors in this repository");
    } catch {
        p.log.error("Failed to retrieve authors. Are you in a git repository?");
        process.exit(1);
    }
}
