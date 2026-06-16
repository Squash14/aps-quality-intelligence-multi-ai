import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const rootDir = path.resolve(new URL("..", import.meta.url).pathname);
const scriptPath = path.join(rootDir, "scripts", "render-mcp-config.mjs");
const copilotTemplatePath = path.join(
  rootDir,
  "clients",
  "copilot",
  "mcp-config.template.json",
);
const codexTemplatePath = path.join(
  rootDir,
  "clients",
  "codex",
  "config.template.toml",
);
const claudeTemplatePath = path.join(
  rootDir,
  "clients",
  "claude",
  "mcp-config.template.json",
);

function runRender(envContent, templatePath = copilotTemplatePath, outputName = "mcp-config.json") {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "aps-mcp-render-"));
  const envPath = path.join(tempDir, ".env");
  const outputPath = path.join(tempDir, outputName);

  fs.writeFileSync(envPath, envContent);

  const result = spawnSync(
    process.execPath,
    [scriptPath, envPath, templatePath, outputPath],
    { encoding: "utf8" },
  );

  return { tempDir, outputPath, result };
}

function cleanup(tempDir) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

function exampleEnv() {
  return `
AZURE_DEVOPS_ORG=ExampleOrg
AZURE_DEVOPS_ORG_URL=https://dev.azure.com/ExampleOrg
AZURE_DEVOPS_PAT=fake-test-token-not-secret
MCP_SERVER_NAME=ado
MCP_PACKAGE=@azure-devops/mcp
`;
}

function assertNoSecretLeak(result) {
  assert.equal(result.stdout.includes("fake-test-token-not-secret"), false);
  assert.equal(result.stderr.includes("fake-test-token-not-secret"), false);
}

function testRenderCopilotSuccess() {
  const { tempDir, outputPath, result } = runRender(exampleEnv());

  try {
    assert.equal(result.status, 0, result.stderr);

    const raw = fs.readFileSync(outputPath, "utf8");
    assert.equal(raw.includes("__ORG__"), false);
    assert.equal(raw.includes("__ORG_URL__"), false);
    assert.equal(raw.includes("__PAT__"), false);

    const rendered = JSON.parse(raw);
    assert.equal(rendered.mcpServers.ado.args[1], "@azure-devops/mcp");
    assert.equal(rendered.mcpServers.ado.args[2], "ExampleOrg");
    assert.equal(
      rendered.mcpServers.ado.env.AZURE_DEVOPS_ORG_URL,
      "https://dev.azure.com/ExampleOrg",
    );
    assert.equal(
      rendered.mcpServers.ado.env.AZURE_DEVOPS_PAT,
      "fake-test-token-not-secret",
    );
    assertNoSecretLeak(result);
  } finally {
    cleanup(tempDir);
  }
}

function testRenderCodexTomlSuccess() {
  const { tempDir, outputPath, result } = runRender(
    exampleEnv(),
    codexTemplatePath,
    "profile.config.toml",
  );

  try {
    assert.equal(result.status, 0, result.stderr);

    const raw = fs.readFileSync(outputPath, "utf8");
    assert.equal(raw.includes("__ORG__"), false);
    assert.equal(raw.includes("__ORG_URL__"), false);
    assert.equal(raw.includes("__PAT__"), false);
    assert.match(raw, /\[mcp_servers\.ado\]/);
    assert.match(raw, /args = \["-y", "@azure-devops\/mcp", "ExampleOrg"\]/);
    assert.match(raw, /default_tools_approval_mode = "approve"/);
    assert.match(
      raw,
      /AZURE_DEVOPS_ORG_URL = "https:\/\/dev\.azure\.com\/ExampleOrg"/,
    );
    assert.match(raw, /AZURE_DEVOPS_PAT = "fake-test-token-not-secret"/);
    assertNoSecretLeak(result);
  } finally {
    cleanup(tempDir);
  }
}

function testRenderClaudeSuccess() {
  const { tempDir, outputPath, result } = runRender(
    exampleEnv(),
    claudeTemplatePath,
  );

  try {
    assert.equal(result.status, 0, result.stderr);

    const rendered = JSON.parse(fs.readFileSync(outputPath, "utf8"));
    assert.equal(rendered.mcpServers.ado.args[1], "@azure-devops/mcp");
    assert.equal(rendered.mcpServers.ado.args[2], "ExampleOrg");
    assert.equal(
      rendered.mcpServers.ado.env.AZURE_DEVOPS_PAT,
      "fake-test-token-not-secret",
    );
    assertNoSecretLeak(result);
  } finally {
    cleanup(tempDir);
  }
}

function testRejectPlaceholderPat() {
  const { tempDir, outputPath, result } = runRender(`
AZURE_DEVOPS_ORG=ExampleOrg
AZURE_DEVOPS_ORG_URL=https://dev.azure.com/ExampleOrg
AZURE_DEVOPS_PAT=SEU_PAT_AQUI
`);

  try {
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /AZURE_DEVOPS_PAT ainda esta com valor de exemplo/);
    assert.equal(fs.existsSync(outputPath), false);
  } finally {
    cleanup(tempDir);
  }
}

function testRejectMissingOrg() {
  const { tempDir, outputPath, result } = runRender(`
AZURE_DEVOPS_ORG_URL=https://dev.azure.com/ExampleOrg
AZURE_DEVOPS_PAT=fake-test-token-not-secret
`);

  try {
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /AZURE_DEVOPS_ORG nao informado/);
    assert.equal(fs.existsSync(outputPath), false);
  } finally {
    cleanup(tempDir);
  }
}

testRenderCopilotSuccess();
testRenderCodexTomlSuccess();
testRenderClaudeSuccess();
testRejectPlaceholderPat();
testRejectMissingOrg();

console.log("OK - render-mcp-config tests passed");
