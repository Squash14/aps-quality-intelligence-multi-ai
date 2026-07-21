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

const semanticRequirements = {
  "qa-orchestrator": [
    "<Projeto> <WorkItemID>",
    "busca focada",
    "output/",
    "output/delete/",
    "qa-bdd-specialist",
    "qa-wiki-specialist",
    "PAT",
  ],
  "qa-bdd-specialist": [
    "SPEC",
    "Cenarios BDD",
    "Riscos QA",
    "Gaps",
    "Nao publique na Wiki",
    "output/",
    "nao invent",
  ],
  "qa-wiki-specialist": [
    "Wiki",
    "SPEC",
    "search_wiki",
    "busca focada",
    "publicar",
    "path",
    "URL",
  ],
  "qa-bug-specialist": [
    "Bug em produção",
    "Erros de Codificação",
    "Custom.Causadoproblema",
    "Assigned To",
    "parent",
    "duplicidade",
    "Evidencias: Nao informado",
  ],
};

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

function normalize(content) {
  return content
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function assertSemanticIncludes(content, expected, filePath) {
  assert.equal(
    normalize(content).includes(normalize(expected)),
    true,
    `${filePath} nao contem conceito obrigatorio: ${expected}`,
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

  for (const expected of semanticRequirements[agent]) {
    assertSemanticIncludes(copilot, expected, copilotPath);
    assertSemanticIncludes(codex, expected, codexPath);
    assertSemanticIncludes(claude, expected, claudePath);
  }
}

for (const filePath of [
  "clients/copilot/mcp-config.template.json",
  "clients/codex/config.template.toml",
  "clients/claude/mcp-config.template.json",
  "AGENTS.md",
  "CLAUDE.md",
  "README.md",
  ".github/copilot-instructions.md",
  "docs/PRINCIPLES.md",
  "docs/DOMAIN_CONTRACT.md",
  "docs/DECISIONS.md",
  "docs/MAINTENANCE.md",
  "docs/SETUP.md",
  "docs/USAGE.md",
  "docs/VALIDATION.md",
  "docs/TROUBLESHOOTING.md",
  "docs/AGENT_PARITY.md",
  "docs/BUG_AGENT_TEMPLATE.md",
]) {
  assertFile(filePath);
}

console.log("OK - agent assets cover Copilot, Codex, and Claude");
