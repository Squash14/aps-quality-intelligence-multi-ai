import fs from "node:fs";
import path from "node:path";

const [, , sourcePath, flag] = process.argv;
const checkOnly = flag === "--check";

if (!sourcePath) {
  console.error("Uso: node scripts/render-agents.mjs <agents/<nome>.md> [--check]");
  process.exit(1);
}

const rootDir = path.resolve(new URL("..", import.meta.url).pathname);

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) {
    throw new Error(`Frontmatter nao encontrado em ${sourcePath}`);
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

function extractSection(content, startMarker, endMarker) {
  const startIndex = content.indexOf(startMarker);

  if (startIndex === -1) {
    throw new Error(`Secao "${startMarker}" nao encontrada em ${sourcePath}`);
  }

  const afterStart = startIndex + startMarker.length;
  const endIndex = endMarker ? content.indexOf(endMarker, afterStart) : -1;

  if (endMarker && endIndex === -1) {
    throw new Error(`Secao "${endMarker}" nao encontrada em ${sourcePath}`);
  }

  return content.slice(afterStart, endIndex === -1 ? content.length : endIndex).trim();
}

function parseClientBlocks(particularitiesText) {
  const blocks = {};
  const parts = `\n${particularitiesText}`.split(/\n### /).slice(1);

  for (const part of parts) {
    const newlineIndex = part.indexOf("\n");
    const clientName = (newlineIndex === -1 ? part : part.slice(0, newlineIndex)).trim();
    const body = newlineIndex === -1 ? "" : part.slice(newlineIndex + 1);

    blocks[clientName] = body.trim();
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
    const trimmed = line.trim();

    if (trimmed.startsWith("description:")) {
      description = trimmed.slice("description:".length).trim();
    } else if (trimmed.startsWith("nickname_candidates:")) {
      nicknameCandidates = trimmed
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

const raw = fs.readFileSync(path.join(rootDir, sourcePath), "utf8");
const { fields, rest } = parseFrontmatter(raw);
const name = fields.name;
const defaultDescription = fields.description;

if (!name || !defaultDescription) {
  throw new Error(`"name" ou "description" ausente no frontmatter de ${sourcePath}`);
}

const sharedBody = extractSection(rest, "## Comportamento Compartilhado", "## Particularidades Por Cliente");
const particularitiesRaw = extractSection(rest, "## Particularidades Por Cliente", null);
const clientBlocks = parseClientBlocks(particularitiesRaw);

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

const targets = [
  { clientLabel: "Claude", filePath: path.join(rootDir, ".claude/agents", `${name}.md`), content: claudeOutput },
  { clientLabel: "Copilot", filePath: path.join(rootDir, ".github/agents", `${name}.agent.md`), content: copilotOutput },
  { clientLabel: "Codex", filePath: path.join(rootDir, ".codex/agents", `${name}.toml`), content: codexOutput },
];

if (checkOnly) {
  let hasDrift = false;

  for (const target of targets) {
    const current = fs.existsSync(target.filePath) ? fs.readFileSync(target.filePath, "utf8") : null;

    if (current !== target.content) {
      hasDrift = true;
      console.error(`DRIFT: ${target.filePath} nao corresponde ao gerado a partir de ${sourcePath}.`);
    }
  }

  if (hasDrift) {
    console.error("Rode 'node scripts/render-agents.mjs " + sourcePath + "' para regenerar.");
    process.exit(1);
  }

  console.log(`OK - ${sourcePath} equivalente aos tres arquivos gerados`);
  process.exit(0);
}

for (const target of targets) {
  fs.writeFileSync(target.filePath, target.content);
  console.log(`Gerado: ${target.filePath}`);
}
