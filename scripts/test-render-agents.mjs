import assert from "node:assert/strict";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { renderFromSource } from "./render-agents.mjs";

const rootDir = path.resolve(new URL("..", import.meta.url).pathname);
const scriptPath = path.join(rootDir, "scripts", "render-agents.mjs");

function fixture({ codex = "", copilot = "", claude = "" } = {}) {
  return `---
name: fixture-agent
description: Fixture agent for tests.
---

## Comportamento Compartilhado

Corpo compartilhado de teste.

## Particularidades Por Cliente

### Codex

${codex}

### Copilot

${copilot}

### Claude

${claude}
`;
}

function testRenderSuccess() {
  const rendered = renderFromSource(
    fixture({
      codex: "nickname_candidates: Fixture, Fixture Two",
      copilot: 'description: [INTERNO] Nao use diretamente.\n\nMensagem extra do Copilot.',
    }),
    "fixture-agent.md",
  );

  assert.equal(rendered.name, "fixture-agent");

  assert.equal(
    rendered.claudeOutput,
    "---\nname: fixture-agent\ndescription: Fixture agent for tests.\n---\n\nCorpo compartilhado de teste.\n",
  );

  assert.match(rendered.copilotOutput, /^---\ndescription: "\[INTERNO\] Nao use diretamente\."\nname: fixture-agent\n---\n\n# fixture-agent instructions\n\n/);
  assert.match(rendered.copilotOutput, /Corpo compartilhado de teste\./);
  assert.match(rendered.copilotOutput, /Mensagem extra do Copilot\./);

  assert.match(rendered.codexOutput, /^name = "fixture-agent"\ndescription = "Fixture agent for tests\."\ndeveloper_instructions = """\n/);
  assert.match(rendered.codexOutput, /nickname_candidates = \["Fixture", "Fixture Two"\]/);
}

function testRejectUnknownClient() {
  const raw = fixture().replace("### Claude", "### ChatGPT");

  assert.throws(
    () => renderFromSource(raw, "fixture-agent.md"),
    /Cliente desconhecido "ChatGPT"/,
  );
}

function testRejectMissingRequiredClient() {
  const raw = fixture().replace(/### Claude[\s\S]*$/, "");

  assert.throws(
    () => renderFromSource(raw, "fixture-agent.md"),
    /Secao obrigatoria "### Claude" ausente/,
  );
}

function testRejectMissingSharedBehaviorSection() {
  const raw = fixture().replace("## Comportamento Compartilhado", "## Secao Errada");

  assert.throws(
    () => renderFromSource(raw, "fixture-agent.md"),
    /Secao obrigatoria "## Comportamento Compartilhado" nao encontrada/,
  );
}

function testRejectMalformedFrontmatter() {
  const raw = fixture().replace(/^---\n/, "");

  assert.throws(
    () => renderFromSource(raw, "fixture-agent.md"),
    /Frontmatter nao encontrado ou malformado/,
  );
}

function testRejectContentOutsideClientHeader() {
  const raw = fixture().replace(
    "## Particularidades Por Cliente\n\n### Codex",
    "## Particularidades Por Cliente\n\ntexto perdido\n\n### Codex",
  );

  assert.throws(
    () => renderFromSource(raw, "fixture-agent.md"),
    /Conteudo fora de um cabecalho/,
  );
}

function testCliUsageWithoutArgs() {
  const result = spawnSync(process.execPath, [scriptPath], { encoding: "utf8" });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Uso: node scripts\/render-agents\.mjs/);
}

function testCliCheckMissingSource() {
  const result = spawnSync(
    process.execPath,
    [scriptPath, "agents/does-not-exist.md", "--check"],
    { encoding: "utf8" },
  );

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /ERRO:/);
}

testRenderSuccess();
testRejectUnknownClient();
testRejectMissingRequiredClient();
testRejectMissingSharedBehaviorSection();
testRejectMalformedFrontmatter();
testRejectContentOutsideClientHeader();
testCliUsageWithoutArgs();
testCliCheckMissingSource();

console.log("OK - render-agents tests passed");
