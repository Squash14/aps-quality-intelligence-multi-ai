/**
 * update-copilot-permissions.mjs
 *
 * Merges all known ADO MCP tool approvals for the current project path into
 * ~/.copilot/permissions-config.json so /allow-all is not needed every session.
 *
 * Usage: node scripts/update-copilot-permissions.mjs <env-file> <project-root>
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const [, , envPath, projectRoot] = process.argv;

if (!envPath || !projectRoot) {
  console.error("Uso: node scripts/update-copilot-permissions.mjs <env> <project-root>");
  process.exit(1);
}

function readEnv(filePath) {
  const values = {};
  const content = fs.readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const sep = line.indexOf("=");
    if (sep === -1) continue;
    const key = line.slice(0, sep).trim();
    let value = line.slice(sep + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }
  return values;
}

const env = readEnv(envPath);
const serverName = env.MCP_SERVER_NAME || "ado";
const copilotHome = process.env.COPILOT_HOME || path.join(os.homedir(), ".copilot");
const permissionsPath = path.join(copilotHome, "permissions-config.json");
const absProjectRoot = path.resolve(projectRoot);

// All known ADO MCP tool names for the @azure-devops/mcp package.
const ADO_TOOLS = [
  "advsec_get_alert_details",
  "advsec_get_alerts",
  "core_get_identity_ids",
  "core_list_project_teams",
  "core_list_projects",
  "pipelines_artifact",
  "pipelines_build",
  "pipelines_build_log",
  "pipelines_definition",
  "pipelines_run",
  "pipelines_write",
  "repo_branch",
  "repo_create_branch",
  "repo_file",
  "repo_pull_request",
  "repo_pull_request_thread",
  "repo_pull_request_thread_write",
  "repo_pull_request_write",
  "repo_repository",
  "repo_search_commits",
  "search_code",
  "search_wiki",
  "search_workitem",
  "testplan",
  "testplan_show_test_results_from_build_id",
  "testplan_test_case_write",
  "testplan_test_plan_write",
  "testplan_test_suite_write",
  "wiki",
  "wiki_upsert_page",
  "wit_backlog",
  "wit_query",
  "wit_work_item",
  "wit_work_item_attachment",
  "wit_work_item_comment_write",
  "wit_work_item_link_write",
  "wit_work_item_write",
  "work",
  "work_capacity_write",
  "work_iteration_write",
  // Legacy tool names kept for backward compatibility with older MCP package versions.
  "wit_get_work_item",
  "wit_get_work_items_batch_by_ids",
  "wiki_get_page",
  "wiki_get_page_content",
  "wiki_list_pages",
  "wiki_list_wikis",
  "wiki_create_or_update_page",
  "wit_list_work_item_comments",
  "wit_query_by_wiql",
  "wit_get_work_item_type",
  "wit_create_work_item",
  "wit_work_items_link",
  "wit_add_child_work_items",
  "wit_add_work_item_comment",
  "wit_my_work_items",
  "work_list_team_iterations",
];

// Read or create permissions config.
let config = { locations: {} };
if (fs.existsSync(permissionsPath)) {
  try {
    config = JSON.parse(fs.readFileSync(permissionsPath, "utf8"));
  } catch {
    console.error(`AVISO: nao foi possivel ler ${permissionsPath}. Criando novo.`);
    config = { locations: {} };
  }
}

if (!config.locations) config.locations = {};
if (!config.locations[absProjectRoot]) config.locations[absProjectRoot] = {};
const loc = config.locations[absProjectRoot];
if (!Array.isArray(loc.tool_approvals)) loc.tool_approvals = [];

const existing = new Set(
  loc.tool_approvals
    .filter((e) => e.kind === "mcp" && e.serverName === serverName)
    .map((e) => e.toolName),
);

let added = 0;
for (const toolName of ADO_TOOLS) {
  if (!existing.has(toolName)) {
    loc.tool_approvals.push({ kind: "mcp", serverName, toolName });
    added++;
  }
}

// Ensure write permission is present (needed for file operations in the project).
const hasWrite = loc.tool_approvals.some((e) => e.kind === "write");
if (!hasWrite) {
  loc.tool_approvals.push({ kind: "write" });
  added++;
}

fs.mkdirSync(path.dirname(permissionsPath), { recursive: true });
fs.writeFileSync(permissionsPath, JSON.stringify(config, null, 4) + "\n");

console.log(
  `OK - Copilot permissions atualizadas em ${permissionsPath} (+${added} novas aprovacoes para o servidor "${serverName}" em ${absProjectRoot})`,
);
