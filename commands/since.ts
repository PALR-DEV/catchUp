import type { StringValue } from "ms";

import * as p from "@clack/prompts";
import { loadConfig } from "../libs/config";
import { getDiff } from "../libs/git";
import { summarize } from "../libs/llm";
import { openInBrowser, renderMarkdown, saveToFile } from "../libs/render";

export async function sinceCommand(
    timeframe: StringValue,
    options: { browser?: boolean; save?: boolean }
) {
    console.clear();
    p.intro("catchup");

    const config = loadConfig();

    if (!config) {
        p.log.error("No config found. Run catchup init first.");
        process.exit(1);
    }

    const spinner = p.spinner();

    try {
        spinner.start(`Fetching changes for the last ${timeframe}...`);
        const diff = getDiff(timeframe);

        if (!diff) {
            spinner.stop();
            p.log.warn("No changes found for that timeframe.");
            process.exit(0);
        }

        spinner.message("Summarizing with AI...");
        const summary = await summarize(diff, config);
        spinner.stop("Done!");

        p.outro("catchup complete");

        if (options.browser) return openInBrowser(summary);
        if (options.save) return saveToFile(summary);

        renderMarkdown(summary);
    } catch (error) {
        spinner.stop();
        p.log.error(error instanceof Error ? error.message : "Something went wrong.");
        process.exit(1);
    }
}