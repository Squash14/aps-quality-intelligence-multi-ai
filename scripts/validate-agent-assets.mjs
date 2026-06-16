import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(new URL("..", import.meta.url).pathname);
const expectedAgents = [
  "qa-orchestrator",
  "qa-bdd-specialist",
  "qa-wiki-specialist",
  "qa-bug-specialist",
];

function read(filePath) {
  return fs.readFileSync(path.join(rootDir, filePath), "utf8");
}

function assertFile(filePath) {
  assert.equal(
    fs.existsSync(path.join(rootDir, filePath)),
    true,
    `Arquivo obrigatorio ausente: ${filePath}`,
  );
}

function assertIncludes(content, expected, filePath) {
  assert.equal(
    content.includes(expected),
    true,
    `${filePath} nao contem: ${expected}`,
  );
}

for (const agent of expectedAgents) {
  const copilotPath = `.github/agents/${agent}.agent.md`;
  const codexPath = `.codex/agents/${agent}.toml`;
  const claudePath = `.claude/agents/${agent}.md`;

  assertFile(copilotPath);
  assertFile(codexPath);
  assertFile(claudePath);

  const copilot = read(copilotPath);
  const codex = read(codexPath);
  const claude = read(claudePath);

  assertIncludes(copilot, `name: ${agent}`, copilotPath);
  assertIncludes(codex, `name = "${agent}"`, codexPath);
  assertIncludes(codex, "developer_instructions", codexPath);
  assertIncludes(claude, `name: ${agent}`, claudePath);
  assertIncludes(claude, "description:", claudePath);
}

for (const filePath of [
  "clients/copilot/mcp-config.template.json",
  "clients/codex/config.template.toml",
  "clients/claude/mcp-config.template.json",
  "AGENTS.md",
  "CLAUDE.md",
]) {
  assertFile(filePath);
}

console.log("OK - agent assets cover Copilot, Codex, and Claude");
