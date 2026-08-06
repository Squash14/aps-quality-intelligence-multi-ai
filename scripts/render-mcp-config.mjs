import fs from "node:fs";
import path from "node:path";

const [, , envPath, templatePath, outputPath] = process.argv;

if (!envPath || !templatePath || !outputPath) {
  console.error("Uso: node scripts/render-mcp-config.mjs <env> <template> <output>");
  process.exit(1);
}

function readEnv(filePath) {
  const values = {};
  const content = fs.readFileSync(filePath, "utf8");

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    values[key] = value;
  }

  return values;
}

function replacePlaceholders(value, replacements) {
  if (typeof value === "string") {
    return replacements[value] ?? value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => replacePlaceholders(item, replacements));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        replacements[key] ?? key,
        replacePlaceholders(item, replacements),
      ]),
    );
  }

  return value;
}

function escapeTomlString(value) {
  return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

const env = readEnv(envPath);
const org = env.AZURE_DEVOPS_ORG;
const orgUrl = env.AZURE_DEVOPS_ORG_URL;
const pat = env.AZURE_DEVOPS_PAT;
const serverName = env.MCP_SERVER_NAME || "ado";
const mcpPackage = env.MCP_PACKAGE || "@azure-devops/mcp";
const placeholderValues = new Set([
  "pathaqui",
  "SEU_PAT",
  "SEU_PAT_AQUI",
  "__ORG__",
  "__ORG_URL__",
  "__PAT__",
  "__SERVER_NAME__",
  "__MCP_PACKAGE__",
]);

if (!org) {
  console.error(`ERRO: AZURE_DEVOPS_ORG nao informado em ${envPath}.`);
  process.exit(1);
}

if (!orgUrl) {
  console.error(`ERRO: AZURE_DEVOPS_ORG_URL nao informado em ${envPath}.`);
  process.exit(1);
}

if (!pat) {
  console.error(`ERRO: AZURE_DEVOPS_PAT nao informado em ${envPath}.`);
  process.exit(1);
}

if (placeholderValues.has(org)) {
  console.error(
    `ERRO: AZURE_DEVOPS_ORG ainda esta com valor de exemplo em ${envPath}.`,
  );
  console.error("Abra o .env e informe o nome real da organizacao Azure DevOps.");
  process.exit(1);
}

if (placeholderValues.has(orgUrl)) {
  console.error(
    `ERRO: AZURE_DEVOPS_ORG_URL ainda esta com valor de exemplo em ${envPath}.`,
  );
  console.error("Abra o .env e informe a URL real da organizacao Azure DevOps.");
  process.exit(1);
}

if (placeholderValues.has(pat)) {
  console.error(
    `ERRO: AZURE_DEVOPS_PAT ainda esta com valor de exemplo em ${envPath}.`,
  );
  console.error("Abra o .env e troque AZURE_DEVOPS_PAT pelo seu PAT real.");
  process.exit(1);
}

if (placeholderValues.has(serverName)) {
  console.error(
    `ERRO: MCP_SERVER_NAME ainda esta com valor de exemplo em ${envPath}.`,
  );
  process.exit(1);
}

if (!/^[A-Za-z0-9_-]+$/.test(serverName)) {
  console.error(
    `ERRO: MCP_SERVER_NAME deve conter apenas letras, numeros, "_" ou "-" em ${envPath}.`,
  );
  process.exit(1);
}

if (placeholderValues.has(mcpPackage)) {
  console.error(
    `ERRO: MCP_PACKAGE ainda esta com valor de exemplo em ${envPath}.`,
  );
  process.exit(1);
}

const b64Pat = Buffer.from(`:${pat}`).toString("base64");

const replacements = {
  __ORG__: org,
  __ORG_URL__: orgUrl,
  __PAT__: pat,
  __PAT_B64__: b64Pat,
  __SERVER_NAME__: serverName,
  __MCP_PACKAGE__: mcpPackage,
  __MCP_PERMISSION_PREFIX__: `mcp__${serverName}`,
};

const rawTemplate = fs.readFileSync(templatePath, "utf8");
let rendered;

if (templatePath.endsWith(".json")) {
  const template = JSON.parse(rawTemplate);
  rendered = `${JSON.stringify(replacePlaceholders(template, replacements), null, 4)}\n`;
} else {
  rendered = rawTemplate;
  const tomlReplacements = Object.fromEntries(
    Object.entries(replacements).map(([key, value]) => [
      key,
      key === "__SERVER_NAME__" ? value : escapeTomlString(value),
    ]),
  );

  for (const [placeholder, value] of Object.entries(tomlReplacements)) {
    rendered = rendered.replaceAll(placeholder, value);
  }
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, rendered, {
  mode: 0o600,
});

try {
  fs.chmodSync(outputPath, 0o600);
} catch {
  // Windows may ignore POSIX modes; setup scripts still continue.
}
