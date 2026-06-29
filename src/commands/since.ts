import type { StringValue } from "ms";

import * as p from "@clack/prompts";
import { loadConfig } from "../libs/config";
import { getCommitList, getDiff } from "../libs/git";
import { summarize } from "../libs/llm";
import { openInBrowser, renderMarkdown, saveToFile } from "../libs/render";
import { isOllamaRunning } from "../helpers/ollama";
import { getCommitCount } from "../helpers/commitCount";

export async function sinceCommand(
    timeframe: StringValue,
    options: { browser?: boolean; save?: boolean, author?: string, branch?: string, grep?: string }
) {
    console.clear();
    p.intro("Catchup");

    if(options.author) {
        p.log.info(`Filtering commits by author: ${options.author}`);
    }

    if(options.branch) {
        p.log.info(`Filtering commits by branch: ${options.branch}`);
    }

    if (options.grep) {
        p.log.info(`Filtering commits by message pattern: ${options.grep}`);
        const commits = await getCommitList(timeframe, options.author, options.branch, options.grep);
        if (commits.length > 0) {
            p.note(commits.join("\n"), `Commits matched (${commits.length})`);
        }
    }
    
    const config = loadConfig();

    if (!config) {
        p.log.error("No config found. Run catchup init first.");
        process.exit(1);
    }

    if (config.provider === "ollama") {
        if (!isOllamaRunning()) {
            p.log.error("Ollama is not running. Start it with: ollama serve");
            process.exit(1);
        }
    }

    const spinner = p.spinner();

    try {
        spinner.start(`Fetching changes for the last ${timeframe}...`);
        const diff = await getDiff(timeframe, options.author, options.branch, options.grep);

        
        if (!diff && (await getCommitCount(timeframe)) === 0) {
            spinner.stop("No changes found for that timeframe.");
            process.exit(0);
        }

        if(!diff && options.author) {
            spinner.stop(`No commits found for author "${options.author}" in the last ${timeframe}.`);
            process.exit(0);
        }

        spinner.stop("✓ Changes fetched!");

        spinner.start("Summarizing with AI...");
        const summary = await summarize(diff, config, options.grep ? "GREP_FILTER" : undefined);
        spinner.stop("✓ Done!");

        p.outro("catchup complete");

        if (options.browser) return openInBrowser(summary);
        if (options.save) return saveToFile(summary);

        await renderMarkdown(summary);
    } catch (error) {
        spinner.stop();
        p.log.error(error instanceof Error ? error.message : "Something went wrong.");
        process.exit(1);
    }
}

// TODO: handle git warning "log for 'HEAD' only goes back to <date>"
// when the repo history is shorter than the requested timeframe,
// parse the warning and use the earliest available date instead.