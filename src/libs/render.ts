import { marked, Renderer } from "marked";
import TerminalRenderer from "marked-terminal";
import fs from "fs";
import open from "open";

marked.setOptions({ renderer: new TerminalRenderer() as unknown as Renderer });

export function renderMarkdown(markdown: string): void {
    console.log(marked(markdown));
}

export function saveToFile(markdown: string): void {
    const filename = `catchup-${new Date().toISOString().split("T")[0]}.md`;
    fs.writeFileSync(filename, markdown);
    console.log(`Saved to ${filename}`);
}

export function openInBrowser(markdown: string): void {
    const html = `
    <html>
      <body style="font-family:sans-serif;max-width:800px;margin:40px auto;padding:0 20px">
        ${marked(markdown)}
      </body>
    </html>
  `;
    const tmpFile = `/tmp/catchup-summary.html`;
    fs.writeFileSync(tmpFile, html);
    open(tmpFile);

    //TODO: maybe in the future we want to delete it after it is opened, but for now we can leave it like that.
}