import { Command } from "commander";
import { sinceCommand } from "./commands/since";
import { initCommand } from "./commands/init";
import { showConfig, setProvider, setKey } from "./commands/config";


const C1 = "\x1b[95m";  // bright magenta
const C2 = "\x1b[35m";  // magenta
const C3 = "\x1b[34m";  // blue
const C4 = "\x1b[36m";  // cyan
const C5 = "\x1b[96m";  // bright cyan
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

const BANNER = `
${C1} ██████╗ █████╗ ████████╗ ██████╗██╗  ██╗██╗   ██╗██████╗
${C2}██╔════╝██╔══██╗╚══██╔══╝██╔════╝██║  ██║██║   ██║██╔══██╗
${C3}██║     ███████║   ██║   ██║     ███████║██║   ██║██████╔╝
${C4}██║     ██╔══██║   ██║   ██║     ██╔══██║██║   ██║██╔═══╝
${C5}╚██████╗██║  ██║   ██║   ╚██████╗██║  ██║╚██████╔╝██║
${C5} ╚═════╝╚═╝  ╚═╝   ╚═╝    ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝${RESET}
${DIM}                      stay in the loop.${RESET}
`;

const program = new Command();
const configCmd = program.command("config").description("Manage your catchup config");


program
  .name("catchup")
  .description("Summarize codebase changes while you were away")
  .version("1.0.0")
  .addHelpText("beforeAll", BANNER);

program
  .command("since <timeframe>")
  .description("Summarize changes e.g. 1w, 3d, 2h")
  .option("--browser", "Open summary in browser")
  .option("--save", "Save summary as markdown file")
  .action(sinceCommand);

  
program.command("init").description("Setup your AI provider")
.action(initCommand);

configCmd
  .command("show")
  .description("Show current config")
  .action(showConfig);

configCmd
  .command("set-provider <provider>")
  .description("Change AI provider (claude, openai)")
  .action(setProvider);

configCmd
  .command("set-key <key>")
  .description("Update your API key")
  .action(setKey);

program.parseAsync(process.argv);
