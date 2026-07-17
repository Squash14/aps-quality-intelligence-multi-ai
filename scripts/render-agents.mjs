import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(new URL("..", import.meta.url).pathname);
const KNOWN_CLIENTS = ["Claude", "Codex", "Copilot"];

function parseFrontmatter(content, sourceLabel) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) {
    throw new Error(`Frontmatter nao encontrado ou malformado em ${sourceLabel}`);
  }

  const [, frontmatterBlock, rest] = match;
  const fields = {};

  for (const line of frontmatterBlock.split("\n")) {
    const separatorIndex = line.indexOf(":");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    fields[key] = value;
  }

  return { fields, rest };
}

function extractSection(content, startMarker, endMarker, sourceLabel) {
  const startIndex = content.indexOf(startMarker);

  if (startIndex === -1) {
    throw new Error(`Secao obrigatoria "${startMarker}" nao encontrada em ${sourceLabel}`);
  }

  const afterStart = startIndex + startMarker.length;
  const endIndex = endMarker ? content.indexOf(endMarker, afterStart) : -1;

  if (endMarker && endIndex === -1) {
    throw new Error(`Secao obrigatoria "${endMarker}" nao encontrada em ${sourceLabel}`);
  }

  return content.slice(afterStart, endIndex === -1 ? content.length : endIndex).trim();
}

function parseClientBlocks(particularitiesText, sourceLabel) {
  const trimmed = particularitiesText.trim();

  if (trimmed && !trimmed.startsWith("### ")) {
    throw new Error(
      `Conteudo fora de um cabecalho "### <Cliente>" em "## Particularidades Por Cliente" de ${sourceLabel}`,
    );
  }

  const blocks = {};
  const parts = `\n${trimmed}`.split(/\n### /).slice(1);

  for (const part of parts) {
    const newlineIndex = part.indexOf("\n");
    const clientName = (newlineIndex === -1 ? part : part.slice(0, newlineIndex)).trim();
    const body = newlineIndex === -1 ? "" : part.slice(newlineIndex + 1);

    if (!clientName) {
      throw new Error(`Cabecalho de cliente vazio em "## Particularidades Por Cliente" de ${sourceLabel}`);
    }

    if (!KNOWN_CLIENTS.includes(clientName)) {
      throw new Error(
        `Cliente desconhecido "${clientName}" em ${sourceLabel}. Clientes reconhecidos: ${KNOWN_CLIENTS.join(", ")}.`,
      );
    }

    if (blocks[clientName] !== undefined) {
      throw new Error(`Cliente "${clientName}" duplicado em ${sourceLabel}`);
    }

    blocks[clientName] = body.trim();
  }

  for (const client of KNOWN_CLIENTS) {
    if (blocks[client] === undefined) {
      throw new Error(`Secao obrigatoria "### ${client}" ausente em ${sourceLabel}`);
    }
  }

  return blocks;
}

function parseClientBlock(blockText) {
  if (!blockText) {
    return { description: null, nicknameCandidates: null, extra: "" };
  }

  let description = null;
  let nicknameCandidates = null;
  const extraLines = [];

  for (const line of blockText.split("\n")) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("description:")) {
      description = trimmedLine.slice("description:".length).trim();
    } else if (trimmedLine.startsWith("nickname_candidates:")) {
      nicknameCandidates = trimmedLine
        .slice("nickname_candidates:".length)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    } else {
      extraLines.push(line);
    }
  }

  return { description, nicknameCandidates, extra: extraLines.join("\n").trim() };
}

function composeBody(sharedBody, extra) {
  return extra ? `${sharedBody}\n\n${extra}` : sharedBody;
}

function stripCodeFences(text) {
  return text
    .split("\n")
    .filter((line) => !line.trim().startsWith("```"))
    .join("\n");
}

/**
 * Fully in-memory: parses raw canonical source text and returns the
 * rendered output for the three clients. No filesystem access.
 */
export function renderFromSource(raw, sourceLabel) {
  const { fields, rest } = parseFrontmatter(raw, sourceLabel);
  const name = fields.name;
  const defaultDescription = fields.description;

  if (!name || !defaultDescription) {
    throw new Error(`"name" ou "description" ausente no frontmatter de ${sourceLabel}`);
  }

  const sharedBody = extractSection(rest, "## Comportamento Compartilhado", "## Particularidades Por Cliente", sourceLabel);
  const particularitiesRaw = extractSection(rest, "## Particularidades Por Cliente", null, sourceLabel);
  const clientBlocks = parseClientBlocks(particularitiesRaw, sourceLabel);

  const claude = parseClientBlock(clientBlocks["Claude"]);
  const copilot = parseClientBlock(clientBlocks["Copilot"]);
  const codex = parseClientBlock(clientBlocks["Codex"]);

  const claudeDescription = claude.description || defaultDescription;
  const claudeBody = composeBody(sharedBody, claude.extra);
  const claudeOutput = `---\nname: ${name}\ndescription: ${claudeDescription}\n---\n\n${claudeBody}\n`;

  const copilotDescription = copilot.description || defaultDescription;
  const copilotBody = composeBody(sharedBody, copilot.extra);
  const copilotOutput = `---\ndescription: "${copilotDescription}"\nname: ${name}\n---\n\n# ${name} instructions\n\n${copilotBody}\n`;

  const codexDescription = codex.description || defaultDescription;
  const codexBody = stripCodeFences(composeBody(sharedBody, codex.extra));
  const nicknames = codex.nicknameCandidates || [];
  const nicknameList = nicknames.map((item) => `"${item}"`).join(", ");
  const codexOutput = `name = "${name}"\ndescription = "${codexDescription}"\ndeveloper_instructions = """\n${codexBody}\n"""\nnickname_candidates = [${nicknameList}]\n`;

  return { name, claudeOutput, copilotOutput, codexOutput };
}

function targetsFor(sourcePath, rendered) {
  const { name, claudeOutput, copilotOutput, codexOutput } = rendered;

  return [
    { filePath: path.join(rootDir, ".claude/agents", `${name}.md`), content: claudeOutput },
    { filePath: path.join(rootDir, ".github/agents", `${name}.agent.md`), content: copilotOutput },
    { filePath: path.join(rootDir, ".codex/agents", `${name}.toml`), content: codexOutput },
  ];
}

function renderAgentFile(sourcePath) {
  const raw = fs.readFileSync(path.join(rootDir, sourcePath), "utf8");
  const rendered = renderFromSource(raw, sourcePath);

  const expectedName = path.basename(sourcePath, ".md");
  if (rendered.name !== expectedName) {
    throw new Error(
      `"name" (${rendered.name}) nao bate com o nome do arquivo ${sourcePath} (esperado "${expectedName}")`,
    );
  }

  return targetsFor(sourcePath, rendered);
}

function checkAgentFile(sourcePath) {
  const targets = renderAgentFile(sourcePath);
  let hasDrift = false;

  for (const target of targets) {
    const current = fs.existsSync(target.filePath) ? fs.readFileSync(target.filePath, "utf8") : null;

    if (current !== target.content) {
      hasDrift = true;
      console.error(`DRIFT: ${target.filePath} nao corresponde ao gerado a partir de ${sourcePath}.`);
    }
  }

  if (hasDrift) {
    console.error(`Rode 'node scripts/render-agents.mjs ${sourcePath}' para regenerar.`);
  }

  return !hasDrift;
}

function writeAgentFile(sourcePath) {
  const targets = renderAgentFile(sourcePath);

  for (const target of targets) {
    fs.writeFileSync(target.filePath, target.content);
    console.log(`Gerado: ${target.filePath}`);
  }
}

function discoverAgentSources() {
  const agentsDir = path.join(rootDir, "agents");

  return fs
    .readdirSync(agentsDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join("agents", file))
    .sort();
}

function main() {
  const [, , arg1, arg2] = process.argv;

  if (arg1 === "--check-all") {
    const sources = discoverAgentSources();

    if (sources.length === 0) {
      console.error("Nenhuma fonte encontrada em agents/*.md.");
      process.exit(1);
    }

    let allOk = true;

    for (const source of sources) {
      if (!checkAgentFile(source)) {
        allOk = false;
      }
    }

    if (!allOk) {
      process.exit(1);
    }

    console.log(`OK - ${sources.length} fonte(s) em agents/ equivalem aos arquivos gerados`);
    return;
  }

  const sourcePath = arg1;
  const checkOnly = arg2 === "--check";

  if (!sourcePath) {
    console.error("Uso: node scripts/render-agents.mjs <agents/<nome>.md> [--check]");
    console.error("     node scripts/render-agents.mjs --check-all");
    process.exit(1);
  }

  if (checkOnly) {
    if (!checkAgentFile(sourcePath)) {
      process.exit(1);
    }

    console.log(`OK - ${sourcePath} equivalente aos tres arquivos gerados`);
    return;
  }

  writeAgentFile(sourcePath);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    main();
  } catch (error) {
    console.error(`ERRO: ${error.message}`);
    process.exit(1);
  }
}
