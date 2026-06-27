import { marked, Marked, Renderer } from "marked";
import TerminalRenderer from "marked-terminal";
import fs from "fs";
import open from "open";

const terminalMarked = new Marked();
terminalMarked.setOptions({ renderer: new TerminalRenderer() as unknown as Renderer });

const htmlMarked = new Marked();

export async function renderMarkdown(markdown: string): Promise<void> {
  const rendered = await terminalMarked.parse(markdown);
  console.log(rendered);
}

export function saveToFile(markdown: string): void {
  const filename = `catchup-${new Date().toISOString().split("T")[0]}.md`;
  fs.writeFileSync(filename, markdown);
  console.log(`Saved to ${filename}`);
}

export async function openInBrowser(markdown: string): Promise<void> {
  const htmlContent = await htmlMarked.parse(markdown);

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>catchup summary</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #ffffff;
      color: #111111;
      padding: 40px 20px;
    }
    #content {
      max-width: 800px;
      margin: 0 auto;
    }
    h1, h2, h3 {
      color: #111111;
      margin: 24px 0 12px;
      font-weight: 600;
    }
    h2 { border-bottom: 1px solid #eeeeee; padding-bottom: 6px; }
    p {
      line-height: 1.7;
      margin-bottom: 16px;
      color: #333333;
    }
    code {
      background: #f4f4f4;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
      color: #111111;
      font-size: 0.9em;
    }
    pre {
      background: #f4f4f4;
      padding: 16px;
      border-radius: 6px;
      overflow-x: auto;
      margin-bottom: 16px;
      border: 1px solid #e0e0e0;
    }
    pre code {
      background: none;
      padding: 0;
    }
    ul, ol {
      padding-left: 24px;
      margin-bottom: 16px;
    }
    li { line-height: 1.7; margin-bottom: 4px; color: #333333; }
    header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;
      padding-bottom: 16px;
      border-bottom: 2px solid #111111;
    }
    header h1 { 
      margin: 0; 
      font-size: 1.4rem; 
      letter-spacing: -0.5px;
      border: none;
    }
    .date { color: #888888; font-size: 0.85rem; }
  </style>
</head>
<body>
  <div id="content">
    <header>
      <h1>catchup</h1>
      <span class="date">${new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}</span>
    </header>
    ${htmlContent}
  </div>
</body>
</html>
  `;

  const tmpFile = `/tmp/catchup-summary.html`;
  fs.writeFileSync(tmpFile, html);
  await open(tmpFile);
}