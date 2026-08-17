import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(new URL("..", import.meta.url).pathname);
const expectedAgents = [
  "qa-orchestrator",
  "qa-bdd-specialist",
  "qa-wiki-specialist",
  "qa-bug-specialist",
  "qa-health-specialist",
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
    "Gate De Preparacao De Ambiente",
    "Estrutura QA Minima Da Feature",
    "User Story De QA",
    "Planejar os testes",
    "Executar os testes",
    "Equalizar o ambiente",
    "nunca cria Tasks duplicadas",
    "Sincronizar Item De Trabalho",
    "desatualizada",
    "qa-orchestrator:inicio",
    "preservando",
    "Ultima sincronizacao",
    "metadado de auditoria",
  ],
  "qa-bdd-specialist": [
    "SPEC",
    "Cenarios BDD",
    "Riscos QA",
    "Gaps",
    "Nao publique na Wiki",
    "output/",
    "nao invent",
    "Gate De Preparacao De Ambiente",
  ],
  "qa-wiki-specialist": [
    "Wiki",
    "SPEC",
    "search_wiki",
    "busca focada",
    "publicar",
    "path",
    "URL",
    "Gate De Preparacao De Ambiente",
  ],
  "qa-bug-specialist": [
    "Tipo Do Defeito",
    "Profile ativo",
    "Item De Trabalho Relacionado",
    "Assigned To",
    "Gate De Preparacao De Ambiente",
    "parent",
    "duplicidade",
    "Evidencias: Nao informado",
    "acoes_por_evento",
    "Acoes Pos-Criacao",
  ],
  "qa-health-specialist": [
    "Gate De Preparacao De Ambiente",
    "somente leitura",
    "Estrategia De Descoberta Por Tipo De Entrada",
    "Determinismo",
    "Situacao QA",
    "Insuficiente Para Avaliacao",
    "Fluxo QA Observado",
    "Pendencias Encontradas",
    "Proximas Acoes Sugeridas",
    "Informacoes Nao Determinaveis",
    "Buscar Item De Trabalho",
    "qa-wiki-specialist",
    "qa-orchestrator",
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
  "profiles/apsen-arquitetura/profile.json",
]) {
  assertFile(filePath);
}

// Regression guard for DEC-0006/DEC-0007: the Gate De Preparacao De Ambiente has a
// single specification in docs/DOMAIN_CONTRACT.md; every agent only references it.
// Checking behavior here (not per-agent) is what actually protects the contract.
const domainContractPath = "docs/DOMAIN_CONTRACT.md";
const domainContract = read(domainContractPath);
const gateContractRequirements = [
  // Falha bloqueia o pedido original: nenhum Item De Trabalho, nenhuma
  // documentacao funcional gerada, nenhum especialista/delegacao segue em frente.
  "nao consulta o Item De Trabalho",
  "nao inicia analise",
  "nao gera Documento",
  "nao delega para outro Agente",
  "interrompe imediatamente",
  // O diagnostico identifica causa e orienta a correcao com base nos docs do proprio framework.
  "identifica exatamente qual item do Gate falhou e a causa",
  "docs/SETUP.md",
  "docs/TROUBLESHOOTING.md",
  // O Gate exige identificar o Cliente De IA, e o diagnostico depende dessa
  // identificacao para direcionar a orientacao a esse Cliente especifico.
  "o Cliente De IA em uso esta identificado",
  "identifica qual Cliente De IA esta em uso nesta sessao",
  // Apos corrigir, o usuario repete o mesmo pedido, sem reformular.
  "repetir exatamente o mesmo pedido original",
];

for (const expected of gateContractRequirements) {
  assertSemanticIncludes(domainContract, expected, domainContractPath);
}

for (const agent of expectedAgents) {
  for (const [clientPath, content] of [
    [`.github/agents/${agent}.agent.md`, read(`.github/agents/${agent}.agent.md`)],
    [`.codex/agents/${agent}.toml`, read(`.codex/agents/${agent}.toml`)],
    [`.claude/agents/${agent}.md`, read(`.claude/agents/${agent}.md`)],
  ]) {
    assertSemanticIncludes(
      content,
      "Gate De Preparacao De Ambiente",
      clientPath,
    );
    assertSemanticIncludes(content, "docs/DOMAIN_CONTRACT.md", clientPath);
  }
}

console.log("OK - agent assets cover Copilot, Codex, and Claude");
console.log("OK - Gate De Preparacao De Ambiente contract intact in docs/DOMAIN_CONTRACT.md");
