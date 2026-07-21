# QA Agent Suite Multi IA

Automação de documentação QA com Azure DevOps MCP e agentes especializados. O projeto pode ser usado com **Codex**, **GitHub Copilot** ou **Claude Code**, em **macOS** e **Windows**.

Você escolhe um cliente e segue somente o roteiro dele. Não precisa configurar os três para começar.

## O Que Este Projeto Faz

Entrada principal:

```text
<Projeto> <WorkItemID>
```

Exemplo:

```text
Backoffice 11234
```

Saída esperada:

* busca focada do Work Item no Azure DevOps;
* SPEC funcional;
* cenários BDD;
* riscos QA;
* gaps;
* arquivo Markdown em `output/`;
* publicação ou atualização na Wiki quando aplicável;
* arquivo movido para `output/delete/` somente após publicação bem-sucedida.

## Clientes Suportados

| Cliente | Use quando | Agentes | MCP gerado |
| --- | --- | --- | --- |
| Codex | Você quer trabalhar pelo Codex CLI. | `AGENTS.md` e `.codex/agents/*.toml` | `~/.codex/aps-quality-intelligence-multi-ai.config.toml` |
| GitHub Copilot | Você quer usar agentes do Copilot. | `.github/agents/*.agent.md` | `~/.copilot/mcp-config.json` |
| Claude Code | Você quer trabalhar pelo Claude Code. | `CLAUDE.md` e `.claude/agents/*.md` | `.mcp.json` |

Agentes disponíveis nos três clientes:

| Agente | Quando usar | O que passar |
| --- | --- | --- |
| `qa-orchestrator` | Fluxo completo de documentação QA. | `<Projeto> <WorkItemID>` |
| `qa-bdd-specialist` | Gerar SPEC/BDD sem publicar Wiki. | Projeto, Work Item ou contexto funcional. |
| `qa-wiki-specialist` | Auditar, localizar, criar ou atualizar Wiki. | Projeto, Work Item, arquivo/conteúdo e intenção de leitura ou publicação. |
| `qa-bug-specialist` | Analisar defeito e criar/localizar Bug. | Use o template em `docs/BUG_AGENT_TEMPLATE.md`. |

Na maioria dos casos, use `qa-orchestrator`.

## Pré-Requisitos

Obrigatórios:

* Git
* Node.js
* npm
* `npx`
* acesso à organização Apsen no Azure DevOps
* PAT do Azure DevOps com:
  * `Work Items: Read & Write`
  * `Wiki: Read & Write`, quando houver publicação Wiki
  * `Project and Team: Read`

Instale o cliente que você quer usar:

* Codex CLI para usar Codex;
* GitHub Copilot CLI para usar Copilot;
* Claude Code para usar Claude.

## 1. Criar o `.env`

macOS:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Edite o `.env`:

```env
AZURE_DEVOPS_ORG=Apsen
AZURE_DEVOPS_ORG_URL=https://dev.azure.com/Apsen
AZURE_DEVOPS_PAT=SEU_PAT_REAL
```

Não commite o `.env`.

## 2. Escolher Um Cliente

Alvos aceitos pelos scripts:

```text
codex | copilot | claude | all
```

Use `all` somente se os três clientes estiverem instalados. Para testar agora, escolha um.

## Roteiro Codex

Use este roteiro se você escolheu Codex.

> **Importante:** rodar apenas `codex` carrega somente `~/.codex/config.toml`. O MCP deste projeto fica em um profile nomeado (`~/.codex/aps-quality-intelligence-multi-ai.config.toml`) e só é carregado quando você inicia com `--profile aps-quality-intelligence-multi-ai`. Sem esse profile, a sessão mostra `MCP servers: 0` e nenhum agente deste projeto consegue consultar Azure DevOps. Isso não é uma falha do framework nem dos agentes — é o comportamento padrão do Codex CLI para profiles de projeto. Sempre inicie com o comando abaixo.

### macOS

```bash
./scripts/setup-mcp.sh codex
./scripts/validate-setup.sh codex
codex --profile aps-quality-intelligence-multi-ai
```

### Windows PowerShell

```powershell
.\scripts\setup-mcp.ps1 codex
.\scripts\validate-setup.ps1 codex
codex --profile aps-quality-intelligence-multi-ai
```

O setup do Codex gera o profile com `default_tools_approval_mode = "approve"` para o servidor MCP configurado (nome definido em `MCP_SERVER_NAME` no `.env`; `ado` por padrão neste projeto). Isso evita perguntas repetidas para cada chamada Azure DevOps, como `wit_get_work_item`, `wit_get_work_items_batch_by_ids`, `wiki_list_wikis` e `search_wiki`.

Se você já tinha gerado o profile antes desta configuração, rode novamente:

```bash
./scripts/setup-mcp.sh codex
./scripts/validate-setup.sh codex
```

Depois feche a sessão Codex aberta e inicie outra:

```bash
codex --profile aps-quality-intelligence-multi-ai
```

No Codex CLI, comandos de permissao como `/allow-all` nao sao suportados dentro da sessao. Se precisar reduzir prompts de aprovacao, defina isso ao iniciar o Codex:

```bash
codex --profile aps-quality-intelligence-multi-ai \
  --sandbox workspace-write \
  --ask-for-approval on-request
```

Para uma sessao totalmente liberada, use somente em ambiente confiavel:

```bash
codex --profile aps-quality-intelligence-multi-ai \
  --dangerously-bypass-approvals-and-sandbox
```

### Dentro do Codex

Para o fluxo completo:

```text
Use o agente qa-orchestrator para Backoffice 11234.
```

Para gerar só SPEC/BDD:

```text
Use o agente qa-bdd-specialist para gerar SPEC e cenários BDD do Work Item Backoffice 11234, sem publicar na Wiki.
```

Para Wiki:

```text
Use o agente qa-wiki-specialist para validar o destino Wiki do Work Item Backoffice 11234 sem publicar.
```

Para Bug:

```text
Use o agente qa-bug-specialist para criar um bug seguindo docs/BUG_AGENT_TEMPLATE.md.
```

Template completo: [docs/BUG_AGENT_TEMPLATE.md](docs/BUG_AGENT_TEMPLATE.md).

Validar MCP no Codex, antes de pedir qualquer agente:

```bash
codex --profile aps-quality-intelligence-multi-ai mcp list
```

Ou, dentro de uma sessão Codex já aberta:

```text
/mcp
```

Esperado em ambos: o servidor MCP configurado para este projeto aparece na lista (nome definido em `MCP_SERVER_NAME` no `.env`; `ado` por padrão). Se ele não aparecer, ou se a sessão mostrar `MCP servers: 0`, feche o Codex e reabra com `codex --profile aps-quality-intelligence-multi-ai` antes de usar qualquer agente.

## Roteiro Copilot

Use este roteiro se você escolheu GitHub Copilot.

### macOS

```bash
./scripts/setup-mcp.sh copilot
./scripts/validate-setup.sh copilot
copilot
```

### Windows PowerShell

```powershell
.\scripts\setup-mcp.ps1 copilot
.\scripts\validate-setup.ps1 copilot
copilot
```

### Dentro do Copilot

Comandos recomendados no início da sessão:

```text
/allow-all
/caveman Ultra
/agent
qa-orchestrator
Backoffice 11234
```

Para escolher outro agente:

```text
/agent
qa-bdd-specialist
Backoffice 11234
```

```text
/agent
qa-wiki-specialist
Validar destino Wiki do Work Item Backoffice 11234 sem publicar.
```

```text
/agent
qa-bug-specialist
Projeto Backoffice. Defeito: <descrição do defeito>.
```

Validar MCP dentro do Copilot:

```text
/mcp show ado
```

Esperado:

```text
Status: Connected
```

## Roteiro Claude Code

Use este roteiro se você escolheu Claude Code.

### macOS

```bash
./scripts/setup-mcp.sh claude
./scripts/validate-setup.sh claude
claude --mcp-config .mcp.json --agent qa-orchestrator
```

### Windows PowerShell

```powershell
.\scripts\setup-mcp.ps1 claude
.\scripts\validate-setup.ps1 claude
claude --mcp-config .mcp.json --agent qa-orchestrator
```

### Dentro do Claude

Se abriu com `--agent qa-orchestrator`, informe:

```text
Backoffice 11234
```

Ou peça explicitamente:

```text
Use o agente qa-orchestrator para Backoffice 11234.
```

Para outros agentes:

```bash
claude --mcp-config .mcp.json --agent qa-bdd-specialist
```

```bash
claude --mcp-config .mcp.json --agent qa-wiki-specialist
```

```bash
claude --mcp-config .mcp.json --agent qa-bug-specialist
```

Validar MCP no Claude:

```bash
claude --mcp-config .mcp.json mcp list
```

Esperado: o servidor MCP configurado para este projeto aparece configurado/conectado (nome definido em `MCP_SERVER_NAME` no `.env`; `ado` por padrão).

## Skills E Comandos Úteis

As skills Caveman ficam versionadas em `.agents/skills/`. Use quando o cliente carregar comandos/skills do projeto.

Comandos úteis:

| Comando | Uso |
| --- | --- |
| `/caveman Ultra` | Respostas mais curtas, útil para economizar tokens. |
| `/caveman` | Ativa modo caveman padrão. |
| `stop caveman` | Volta ao estilo normal. |
| `/caveman-help` | Mostra ajuda dos comandos Caveman. |
| `/review` ou `/caveman-review` | Apoio para review de diff/PR, quando disponível. |
| `/commit` ou `/caveman-commit` | Apoio para mensagem de commit, quando disponível. |
| `/caveman-stats` | Estatísticas de uso, quando disponível. |

No Copilot, o fluxo histórico recomendado é:

```text
/allow-all
/caveman Ultra
/agent
qa-orchestrator
Backoffice 11234
```

No Claude Code, comandos como `/allow-all` podem existir conforme a versao/configuracao do cliente.

No Codex CLI, `/allow-all` nao existe. Configure permissoes por flags ao iniciar o cliente, por exemplo:

```bash
codex --profile aps-quality-intelligence-multi-ai --sandbox workspace-write --ask-for-approval on-request
```

No Codex e no Claude, prefira pedir o agente explicitamente em portugues:

```text
Use o agente qa-orchestrator para Backoffice 11234.
```

## Antes De Usar Qualquer Agente

Todo agente deste framework depende do Azure DevOps para localizar Work Item, consultar Wiki e demais recursos. Antes de pedir qualquer agente, confirme que o servidor MCP configurado para este projeto (nome definido em `MCP_SERVER_NAME` no `.env`; `ado` por padrão) está carregado na sessão do cliente escolhido:

| Cliente | Como validar dentro da sessão |
| --- | --- |
| Codex | `/mcp` |
| Copilot | `/mcp show <nome do MCP>` (use `ado`, salvo se você alterou `MCP_SERVER_NAME`) |
| Claude | `claude --mcp-config .mcp.json mcp list` (fora da sessão) |

Se o servidor não aparecer, não peça o agente ainda. Revise a seção de setup do cliente escolhido primeiro — um agente chamado sem o MCP Azure DevOps disponível não consegue consultar Work Item nem Wiki, mesmo que o restante do framework esteja correto, e o sintoma observado (agente não encontra nada) facilmente é confundido com um problema no agente ou no framework.

## Resultado Final Esperado

O `qa-orchestrator` deve responder neste formato:

```text
# RESULTADO

Projeto:
Wiki:
Work Item:
Epic:
Feature:
Arquivo gerado:
Página:
Caminho:
Ação executada:
Resultado:
URL da página:
Arquivo local:
```

Para `Ação executada`, esperado:

```text
Página criada
Página atualizada
Publicação falhou
```

Para `Arquivo local`, esperado:

```text
Movido para output/delete/
Preservado em output/ devido a falha
```

## Validação De Manutenção

macOS/Linux:

```bash
./scripts/check.sh
```

Esse check valida:

* sintaxe dos scripts shell;
* sintaxe do renderizador Node;
* renderização MCP para Copilot, Codex e Claude;
* presença e conceitos obrigatórios dos agentes nos três clientes;
* `git diff --check`.

Windows PowerShell:

```powershell
.\scripts\check.ps1
```

Para validar setup MCP de um cliente específico no Windows:

```powershell
.\scripts\setup-mcp.ps1 codex
.\scripts\validate-setup.ps1 codex
```

Troque `codex` por `copilot` ou `claude`.

## Estrutura

```text
aps-quality-intelligence-multi-ai/
├── README.md
├── AGENTS.md
├── CLAUDE.md
├── .env.example
├── agents/
│   └── (fonte canonica de agentes ja migrados; ver docs/AGENT_PARITY.md)
├── clients/
│   ├── copilot/
│   ├── codex/
│   └── claude/
├── .github/
│   ├── copilot-instructions.md
│   ├── agents/
│   └── workflows/
├── .codex/
│   └── agents/
├── .claude/
│   └── agents/
├── .agents/
│   └── skills/
├── docs/
├── scripts/
└── skills-lock.json
```

## Segurança

Nunca commite:

* `.env`
* PAT do Azure DevOps
* `.mcp.json`
* configs MCP gerados
* logs com dados sensíveis
* `output/`

Os templates versionados não contêm token. Os arquivos gerados localmente podem conter PAT.

## Problemas Comuns

| Problema | O que fazer |
| --- | --- |
| `MCP não configurado` | Rode `setup-mcp` para o cliente escolhido. |
| `PAT ainda está com valor de exemplo` | Edite `.env`, troque `AZURE_DEVOPS_PAT` e rode setup novamente. |
| `npx não encontrado` | Instale Node.js/npm e abra um novo terminal. |
| Cliente não encontrado | Instale Copilot CLI, Codex CLI ou Claude Code conforme o alvo escolhido. |
| Servidor MCP do projeto não aparece na sessão | Rode setup e validate novamente para o mesmo cliente. |
| Agente não encontrado | Confirme que está na raiz do projeto e reinicie o cliente. |
| Você escolheu Codex mas abriu Copilot | Feche o cliente errado e siga apenas o roteiro Codex. |
| Codex mostra `Unrecognized command '/allow-all'` | Normal no Codex CLI. Use flags de inicializacao como `--sandbox workspace-write --ask-for-approval on-request` ou `--dangerously-bypass-approvals-and-sandbox`. |
| Codex mostra `MCP servers: 0` | Você iniciou `codex` sem `--profile aps-quality-intelligence-multi-ai`. Sem esse profile, o Codex carrega somente `~/.codex/config.toml` e nenhum MCP do projeto. Feche a sessão e inicie com `codex --profile aps-quality-intelligence-multi-ai`. |
| Agente não encontra Work Item, Wiki ou qualquer dado mesmo com setup correto | Confirme que o MCP Azure DevOps está carregado na sessão atual (`/mcp` no Codex, `/mcp show <nome do MCP>` no Copilot, `claude mcp list` no Claude) antes de repetir o pedido. Veja [Antes De Usar Qualquer Agente](#antes-de-usar-qualquer-agente). |

## Documentação Complementar

* [Guia de manutenção](docs/MAINTENANCE.md)
* [Checklist de validação](docs/VALIDATION.md)
* [Setup detalhado](docs/SETUP.md)
* [Uso dos agentes](docs/USAGE.md)
* [Troubleshooting](docs/TROUBLESHOOTING.md)
* [Paridade dos agentes](docs/AGENT_PARITY.md)
* [Scripts](scripts/README.md)
* [Clientes](clients/README.md)
