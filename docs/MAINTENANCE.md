# Guia de Manutencao

Este guia cobre arquitetura, agentes, skills, manutencao, seguranca e publicacao.

## Arquitetura

```text
Usuario
  |
  | Copilot | Codex | Claude
  v
Cliente IA
  |
  | Azure DevOps MCP
  v
Work Item + contexto
  |
  | agentes/instrucoes QA
  v
SPEC + BDD + cobertura QA + Wiki
```

Componentes:

| Area | Responsabilidade |
| --- | --- |
| `agents/` | Fonte canonica de agentes ja migrados (ver "Agentes" abaixo). Renderiza para os tres clientes via `scripts/render-agents.mjs`. |
| `clients/copilot/` | Template MCP do Copilot. |
| `clients/codex/` | Template de profile MCP do Codex. |
| `clients/claude/` | Template MCP do Claude Code. |
| `scripts/` | Setup e validacao para macOS e Windows. |
| `.github/agents/` | Agentes do Copilot. |
| `.github/copilot-instructions.md` | Instrucoes do Copilot. |
| `AGENTS.md` | Instrucoes raiz para Codex. |
| `.codex/agents/` | Agentes de projeto do Codex. |
| `CLAUDE.md` | Instrucoes raiz para Claude Code. |
| `.claude/agents/` | Subagentes de projeto do Claude Code. |
| `.agents/skills/` | Skills Caveman/cavecrew usadas pelo projeto. |
| `docs/` | Documentacao de uso, manutencao e validacao. |
| `skills-lock.json` | Controle de versao das skills. |

## Contrato Funcional

A interface publica do fluxo principal permanece:

```text
<Projeto> <WorkItemID>
```

Saida esperada:

* SPEC Markdown;
* cenarios BDD;
* riscos QA e gaps quando aplicavel;
* publicacao ou atualizacao de Wiki quando solicitada pelo fluxo;
* resultado consolidado com arquivo, pagina, acao e URL quando houver publicacao.

## Clientes

| Cliente | Config versionado | Config gerado | Observacao |
| --- | --- | --- | --- |
| Copilot | `clients/copilot/mcp-config.template.json` | `~/.copilot/mcp-config.json` | Continua usando `.github/agents`. |
| Codex | `clients/codex/config.template.toml` | `~/.codex/aps-quality-intelligence-multi-ai.config.toml` | Use com `codex --profile aps-quality-intelligence-multi-ai`; agentes ficam em `.codex/agents`; o servidor MCP configurado (`MCP_SERVER_NAME`, `ado` por padrao) usa `default_tools_approval_mode = "approve"`. |
| Claude | `clients/claude/mcp-config.template.json` | `.mcp.json` | Use com `claude --mcp-config .mcp.json`; agentes ficam em `.claude/agents`. |

### Ativacao De MCP: Config Global Vs Config Por Profile

Cada cliente carrega MCP de uma destas duas formas: um arquivo de config global, lido automaticamente ao iniciar o cliente sem flags, ou um arquivo/profile especifico do projeto, que so e carregado quando o usuario passa a flag correspondente.

| Cliente | Comportamento padrao (sem flags) | Como ativar o MCP deste projeto |
| --- | --- | --- |
| Copilot | Le `~/.copilot/mcp-config.json` automaticamente. | Nenhuma flag adicional; o setup escreve direto no arquivo global. |
| Codex | Le apenas `~/.codex/config.toml`. Nao carrega profiles nomeados automaticamente. | `codex --profile aps-quality-intelligence-multi-ai`. |
| Claude | Nao carrega MCP de projeto sem flag. | `claude --mcp-config .mcp.json`. |

Essa licao vem de uma validacao real: iniciar `codex` sem `--profile` carrega `~/.codex/config.toml` (0 MCP do projeto) silenciosamente — sem erro, sem aviso — dando a falsa impressao de que os agentes ou o framework estavam com problema, quando o unico problema era a forma de inicializar o cliente.

Se um adaptador de cliente futuro (novo cliente de IA) usar o mesmo padrao de config por profile/flag do Codex ou do Claude, a documentacao operacional desse cliente (README, SETUP, VALIDATION) deve deixar explicito:

* que existe uma config global carregada por padrao, distinta da config do projeto;
* qual flag ou comando ativa a config do projeto;
* como confirmar, dentro da propria sessao do cliente, que o MCP do projeto foi carregado antes de usar qualquer agente.

## Agentes

| Agente | Responsabilidade |
| --- | --- |
| `qa-orchestrator` | Ponto de entrada publico e fluxo ponta a ponta. |
| `qa-bdd-specialist` | SPEC, cenarios BDD, riscos, gaps e cobertura QA. |
| `qa-wiki-specialist` | Destino, auditoria, atualizacao e publicacao na Wiki. |
| `qa-bug-specialist` | Analise de defeitos e criacao de Bug no Azure DevOps. |

Regras de fronteira:

* `qa-orchestrator` coordena e consolida, mas nao duplica regras detalhadas dos especialistas.
* `qa-bdd-specialist` gera conteudo funcional e arquivo local, mas nao publica na Wiki.
* `qa-wiki-specialist` decide destino e publica, mas nao inventa regra funcional.
* `qa-bug-specialist` atua somente quando o pedido envolver defeito.
* Especialistas devem reutilizar contexto recebido e evitar novas chamadas MCP quando os dados ja forem suficientes.

## Manutencao

Existem hoje **dois fluxos validos** para alterar um agente, dependendo se ele ja tem fonte canonica em `agents/`. Confirme qual fluxo se aplica antes de editar qualquer arquivo — editar o arquivo errado gera `DRIFT` no `check.sh`/CI ou, pior, uma divergencia silenciosa entre clientes que nenhum check hoje cobre.

### Agente com fonte canonica (`agents/<nome>.md` existe)

Hoje: `qa-bug-specialist`, `qa-wiki-specialist`.

1. Edite apenas `agents/<nome>.md` (secoes `## Comportamento Compartilhado` e `## Particularidades Por Cliente`).
2. Rode `node scripts/render-agents.mjs agents/<nome>.md` para regenerar `.claude/agents/`, `.codex/agents/` e `.github/agents/`.
3. Nunca edite os tres arquivos gerados diretamente — a proxima regeneracao sobrescreve qualquer edicao manual sem aviso.
4. Execute `./scripts/check.sh` (valida, entre outras coisas, que os gerados batem com a fonte via `render-agents.mjs --check-all`).
5. Valide com um Work Item real antes de compartilhar com o time.

### Agente ainda sem fonte canonica (`agents/<nome>.md` nao existe)

Hoje: `qa-orchestrator`, `qa-bdd-specialist`. Esses dois agentes ja divergiram de forma real entre clientes porque dependem inteiramente de disciplina manual — ver `docs/AGENT_PARITY.md` para o estado atual dessa divergencia.

1. Leia o arquivo do agente afetado nos tres clientes antes de editar, para entender se ja existe divergencia previa.
2. Atualize os tres formatos manualmente: `.github/agents`, `.codex/agents` e `.claude/agents`, com o mesmo comportamento funcional.
3. Preserve o formato publico de entrada.
4. Execute `./scripts/check.sh` — hoje ele so confirma presenca de arquivo e de conceitos-chave (`scripts/validate-agent-assets.mjs`), **nao** equivalencia semantica completa entre os tres arquivos. Passar no check nao garante paridade real para esses dois agentes.
5. Valide com um Work Item real em pelo menos dois clientes antes de compartilhar com o time.
6. Ao terminar, considere migrar o agente para fonte canonica (`agents/<nome>.md`) seguindo o padrao de `qa-bug-specialist`/`qa-wiki-specialist`, para que o proximo check cubra esse agente por completo.

No Windows, use tambem:

```powershell
.\scripts\check.ps1
```

Ambos os checks rodam automaticamente em `push`/`pull_request` via `.github/workflows/check.yml` (ver `docs/DECISIONS.md`, DEC-0002). Isso reduz — mas nao elimina — a chance de divergencia passar despercebida: para agentes sem fonte canonica, o CI so pega ausencia de arquivo ou de conceito-chave, nao diferenca de comportamento linha a linha. Nenhum dos dois checks substitui validacao real no Azure DevOps quando houver mudanca de comportamento.

Antes de alterar scripts de setup:

```bash
./scripts/check.sh
```

Para Windows, valide manualmente no PowerShell:

```powershell
.\scripts\setup-mcp.ps1
.\scripts\validate-setup.ps1
```

Para validacao ponta a ponta com Work Item real, use [VALIDATION.md](VALIDATION.md).

Checklist de PR:

* `.env` nao esta commitado.
* `.mcp.json` nao esta commitado.
* configs MCP gerados nao estao commitados.
* README e docs estao alinhados.
* Nomes dos agentes batem com os arquivos em `.github/agents/`.
* Agentes equivalentes existem em `.codex/agents/` e `.claude/agents/`.
* Conceitos obrigatorios dos agentes passam em `scripts/validate-agent-assets.mjs`.
* Se o agente tem fonte canonica em `agents/`, ela foi editada e `node scripts/render-agents.mjs agents/<nome>.md` foi rodado (nunca editar os tres gerados direto).
* Se o agente ainda nao tem fonte canonica, os tres arquivos foram revisados lado a lado para o mesmo comportamento — o check automatizado nao garante isso para esses agentes.
* Scripts de setup e validacao continuam alinhados com os docs.
* Um fluxo com Work Item real foi verificado quando houve mudanca de comportamento dos agentes.

## Seguranca

Nunca commite ou compartilhe:

* `.env`
* PAT do Azure DevOps
* `.mcp.json`
* config MCP gerado
* logs com dados sensiveis de Work Items
* `output/`

Se um PAT vazar:

1. Revogue o PAT no Azure DevOps.
2. Gere um novo PAT.
3. Atualize o `.env`.
4. Execute o setup novamente.
5. Revise atividade recente no repositorio e no Azure DevOps.

## Publicacao

Fluxo recomendado:

```bash
git checkout -b feature/short-description
git add .
git commit -m "docs: concise message"
git push -u origin feature/short-description
```

Mantenha mudancas pequenas e revisaveis. Use mensagens de commit em ingles.
