import { execSync } from "child_process";

export function isOllamaRunning(): boolean {
    try {
        execSync("curl -s http://localhost:11434", { stdio: "ignore" });
        return true;
    } catch {
        return false;
    }
}
