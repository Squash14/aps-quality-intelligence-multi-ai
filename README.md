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

`<Projeto>` aqui é o **Projeto Lógico**: o nome que você usa para se referir ao contexto de negócio (ex.: `Backoffice`, `PPDS`), agnóstico de ALM. Ele **não** é necessariamente igual ao nome do projeto físico dentro do Azure DevOps — essa coincidência pode existir, mas nunca é assumida pelo framework. A resolução entre o Projeto Lógico informado e o projeto/container real de um ALM (Azure DevOps hoje; Jira ou outro no futuro) é responsabilidade da implementação (Provider/Profile), não do agente interpretando literalmente o texto informado. Ver `docs/DOMAIN_CONTRACT.md` ("Projeto (Logico)") e `docs/CAPABILITY_CONTRACT.md` para o contrato completo.

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
| `qa-orchestrator` | Coordenar o fluxo completo: busca do Work Item, SPEC/BDD, Sincronização Incremental (decidir entre manter, atualizar parcialmente ou regenerar) e publicação na Wiki, ponta a ponta. | `<Projeto> <WorkItemID>` |
| `qa-bdd-specialist` | Gerar ou revisar SPEC funcional e cenários BDD de forma especializada, sem publicar na Wiki. | Projeto, Work Item ou contexto funcional. |
| `qa-wiki-specialist` | Publicar, atualizar, organizar e prevenir duplicidade de páginas na Wiki — auditoria, localização, criação e atualização. | Projeto, Work Item, arquivo/conteúdo e intenção de leitura ou publicação. |
| `qa-bug-specialist` | Criar e manter Bugs no Azure DevOps: checagem de duplicidade, vínculos e ações pós-criação. | Use o template em `docs/BUG_AGENT_TEMPLATE.md`. |
| `qa-health-specialist` | Diagnóstico e auditoria QA somente leitura — hierarquia, Estrutura QA, Wiki, Bugs, cobertura, riscos, gaps e Situação QA, sem alterar nada. Totalmente independente do `qa-orchestrator`. | Projeto e um Epic, Feature, User Story ou Item De Trabalho. |

Escolha o especialista diretamente (`qa-bdd-specialist`, `qa-wiki-specialist`, `qa-bug-specialist` ou `qa-health-specialist`) quando o objetivo já for conhecido — por exemplo, só gerar SPEC/BDD, só validar/publicar Wiki, só criar um Bug, ou só diagnosticar o estado de QA sem alterar nada. Use `qa-orchestrator` quando for necessário coordenar o fluxo completo, do Work Item até a publicação.

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

O setup do Codex gera o profile com:
- `default_tools_approval_mode = "approve"` — auto-aprova chamadas ao servidor MCP `ado`;
- `approval_policy = "on-request"` — o modelo decide quando pedir aprovação para comandos shell;
- `sandbox_mode = "workspace-write"` — permite escrita de arquivos dentro do diretório do projeto (necessário para salvar arquivos em `output/`).

Não é necessário passar flags `--sandbox` ou `--ask-for-approval` ao iniciar o Codex após o setup.

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

Para diagnóstico QA somente leitura:

```text
Use o agente qa-health-specialist para diagnosticar a Feature 12345 do projeto Backoffice.
```

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

Após o setup, abra o Copilot e use diretamente:

```text
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

```text
/agent
qa-health-specialist
Diagnosticar a Feature 12345 do projeto Backoffice.
```

> **Nota:** o `setup-mcp.sh copilot` pré-aprova automaticamente todas as ferramentas do servidor MCP `ado` para este diretório via `~/.copilot/permissions-config.json`. Não é necessário executar `/allow-all` a cada sessão após o setup.

> **Opcional:** `/caveman Ultra` ativa respostas mais curtas (economia de tokens). Não é requisito para executar os agentes.

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
claude
```

### Windows PowerShell

```powershell
.\scripts\setup-mcp.ps1 claude
.\scripts\validate-setup.ps1 claude
claude
```

O setup do Claude gera:
- `.mcp.json` com o servidor MCP `ado`;
- `.claude/settings.json` com `enableAllProjectMcpServers: true` e permissão pré-aprovada para todas as ferramentas do servidor `ado`.

Com essas configurações, `claude` iniciado da raiz do projeto carrega o MCP automaticamente e não solicita confirmação por ferramenta. O flag `--mcp-config .mcp.json` não é necessário.

### Dentro do Claude

Após abrir o Claude na raiz do projeto, use diretamente:

```text
Use o agente qa-orchestrator para Backoffice 11234.
```

Para outros agentes:

```text
Use o agente qa-bdd-specialist para gerar SPEC e cenários BDD do Work Item Backoffice 11234, sem publicar na Wiki.
```

```text
Use o agente qa-wiki-specialist para validar o destino Wiki do Work Item Backoffice 11234 sem publicar.
```

```text
Use o agente qa-bug-specialist para criar um bug seguindo docs/BUG_AGENT_TEMPLATE.md.
```

```text
Use o agente qa-health-specialist para diagnosticar a Feature 12345 do projeto Backoffice.
```

Validar MCP no Claude:

```bash
claude mcp list
```

Esperado: o servidor MCP `ado` aparece configurado/conectado.

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
/agent
qa-orchestrator
Backoffice 11234
```

No Claude Code e no Codex, prefira pedir o agente explicitamente em português:

```text
Use o agente qa-orchestrator para Backoffice 11234.
```

## Antes De Usar Qualquer Agente

Todo agente deste framework depende do Azure DevOps para localizar Work Item, consultar Wiki e demais recursos. Antes de pedir qualquer agente, confirme que o servidor MCP configurado para este projeto (nome definido em `MCP_SERVER_NAME` no `.env`; `ado` por padrão) está carregado na sessão do cliente escolhido:

| Cliente | Como validar dentro da sessão |
| --- | --- |
| Codex | `/mcp` |
| Copilot | `/mcp show <nome do MCP>` (use `ado`, salvo se você alterou `MCP_SERVER_NAME`) |
| Claude | `claude mcp list` (fora da sessão) |

Se o servidor não aparecer, não peça o agente ainda — um agente chamado sem o MCP Azure DevOps disponível não consegue consultar Work Item nem Wiki, mesmo que o restante do framework esteja correto, e o sintoma observado (agente não encontra nada) facilmente é confundido com um problema no agente ou no framework.

A configuração persistente gerada pelo setup (`.mcp.json`, `.claude/settings.json`, o profile do Codex, `~/.copilot/permissions-config.json`) e a conexão/autenticação da sessão atual são coisas diferentes. Uma vez validado, o setup não precisa ser refeito a cada sessão — mas a conexão e a autenticação do MCP valem apenas para a sessão atual do cliente, não para o config gerado em disco. Se o servidor não aparecer, a causa mais comum é a sessão (MCP ainda não conectado ou pedindo reautenticação), não a configuração: primeiro reconecte ou reautentique usando o comando de MCP do próprio cliente (tabela acima). Isso pode variar conforme o cliente e a implementação do MCP em uso, e não significa que o setup precise ser executado novamente. Só revise a seção de setup do cliente escolhido se, mesmo após reconectar/reautenticar, o servidor continuar ausente.

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
Decisão SPEC:
Página:
Caminho:
Ação executada:
Resultado:
URL da página:
Arquivo local:

Estrutura QA:

User Story QA:
Tasks:
- Planejar os testes:
- Executar os testes:
- Equalizar o ambiente:
Links das Tasks criadas:

Decisao De Delegacao:
- qa-bdd-specialist: <Executado | Nao Executado> - <motivo>
- qa-wiki-specialist: <Executado | Nao Executado> - <motivo>
- qa-bug-specialist: <Executado | Nao Executado> - <motivo>

Resumo Do Fluxo:
```

Para `Decisão SPEC`, esperado:

```text
Mantido sem alterações
Atualizado parcialmente
Regenerado
```

Antes de decidir manter, atualizar ou regenerar, o `qa-orchestrator` compara o Work Item atual (descrição, critérios de aceite, comentários relevantes, e Epic/Feature/User Stories/Tasks/Bugs relacionados) contra o documento local e a página Wiki existentes, e classifica cada diferença como sem impacto documental, atualização incremental ou regeneração completa — a existência prévia de um arquivo ou página nunca é, por si só, motivo para manter o SPEC sem essa análise.

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

Após sincronizar SPEC/BDD/Wiki (mesmo quando `Decisão SPEC` for `Mantido sem alterações`), o `qa-orchestrator` garante a estrutura mínima de QA da Feature relacionada **e a mantém sincronizada** — nunca apenas "cria se faltar": localiza a User Story de QA filha direta da Feature (título contendo "QA" ou Tag "QA") e, quando encontrada, para cada uma das três Tasks fixas — `Planejar os testes`, `Executar os testes`, `Equalizar o ambiente` — decide entre reutilizar (já existe e já está sincronizada), atualizar (já existe mas está desatualizada) ou criar (ausente), sempre buscando antes de agir, nunca duplicando entre execuções. A Task `Planejar os testes` carrega um bloco de conteúdo controlado pelo framework (link da Feature, link da Wiki/SPEC, data/hora `Última sincronização` e nota de geração automática), delimitado por marcadores; ao criar ou atualizar, apenas esse bloco é escrito — qualquer conteúdo manual do QA fora dele é sempre preservado, nunca sobrescrito. `Última sincronização` só avança quando o bloco é criado ou quando Feature/Wiki realmente mudam — nunca a cada execução em que a Task é apenas reutilizada — para que reflita a última sincronização real, útil para auditoria sem precisar consultar histórico. Quando a User Story de QA não é encontrada, o agente reporta isso e **não a cria automaticamente** nesta versão; quando há mais de uma candidata, reporta a ambiguidade sem escolher nenhuma.

`Decisão De Delegação` reporta, sempre, os três especialistas que o `qa-orchestrator` pode chamar (`qa-bdd-specialist`, `qa-wiki-specialist`, `qa-bug-specialist`), cada um como `Executado` ou `Não Executado` com o motivo objetivo da decisão — o `qa-orchestrator` evita chamadas desnecessárias reaproveitando evidência já coletada no próprio fluxo (a classificação da Sincronização Incremental, e a página Wiki/tipo do Work Item já localizados), nunca fazendo uma chamada MCP nova só para decidir. Por exemplo: quando a Sincronização Incremental classifica todas as diferenças como `Sem impacto documental` e já existe uma página Wiki válida, nem `qa-bdd-specialist` nem `qa-wiki-specialist` são chamados nessa execução — a URL já conhecida é reutilizada diretamente no resultado. `qa-bug-specialist` só é chamado quando o tipo do Work Item for Bug ou o pedido mencionar defeito explicitamente. `Resumo Do Fluxo` fecha o resultado com 1 a 2 frases resumindo quantos especialistas foram executados nesta chamada.

## qa-health-specialist

Especialista de diagnóstico e auditoria QA **estritamente somente leitura** — nunca cria, atualiza, sincroniza ou publica nada no Azure DevOps, na Wiki ou em arquivos do projeto. Totalmente independente do `qa-orchestrator`: pode ser chamado a qualquer momento, sem depender do fluxo completo.

**Objetivo:** dado um Epic, Feature, User Story ou outro Item De Trabalho, descobrir a hierarquia relacionada e produzir um diagnóstico QA consolidado — hierarquia, Fluxo QA Observado, Estrutura QA, Wiki, Bugs relacionados, cobertura QA, riscos, gaps, inconsistências, Pendências Encontradas, Situação QA e Maturidade QA — sem alterar nada.

**Quando usar:**

* Para saber rapidamente "como está a estrutura QA desta Feature/Epic?" antes de decidir o que fazer.
* Para auditar um Epic inteiro e priorizar em quais Features investir primeiro.
* Como checagem prévia antes de rodar `qa-orchestrator`, `qa-bdd-specialist` ou `qa-wiki-specialist`, para saber o que já existe e o que falta.

**Quando não usar:**

* Para criar, publicar ou atualizar Wiki, SPEC, Bugs ou a Estrutura QA mínima — este agente nunca escreve nada; use `qa-orchestrator`, `qa-wiki-specialist`, `qa-bdd-specialist` ou `qa-bug-specialist` para isso.
* Para gerar SPEC, cenários BDD ou análise de regra de negócio — isso é `qa-bdd-specialist`.
* Para auditoria estrutural detalhada da Wiki (páginas órfãs, duplicadas, fora do padrão) — isso é `qa-wiki-specialist`.
* Como Ponto De Entrada, Projeto, Sprint ou Backlog inteiros não são suportados nesta versão — apenas Epic, Feature, User Story ou outro Item De Trabalho, sempre com o Projeto.

**Entradas aceitas:** `<Projeto> <IdentificadorDoItem>`, onde o item é um Epic, Feature, User Story ou outro Item De Trabalho (Task, Bug etc. — o agente sobe até a Feature ancestral mais próxima).

Exemplos de prompts:

```text
Use o agente qa-health-specialist para diagnosticar a Feature 12345 do projeto Backoffice.
```

```text
Use o agente qa-health-specialist para auditar o Epic 9900 do projeto PPDS, sem alterar nada.
```

```text
Use o agente qa-health-specialist para verificar a Estrutura QA e a Wiki da User Story 12399 do projeto Backoffice.
```

Exemplo resumido do relatório esperado:

```text
# DIAGNOSTICO QA

## Resumo Executivo
Projeto: Backoffice
Item Analisado: Epic 9900 - Onboarding
Features: 6
Features Com Estrutura QA Completa: 1 de 6
...
Situacao QA: Parcial
Maturidade QA: Basica

Conclusao:
Estrutura funcional parcialmente consolidada. A estrutura QA, no entanto,
esta classificada como basica. A principal recomendacao e Criar User Story
De QA antes de evoluir as demais dimensoes.

## Acoes Rapidas
🔴 Criar User Story De QA (5 Features)
🔴 Criar Wiki (6 Features)
...

## Maturidade QA
Classificacao: Basica
Base Da Maturidade QA: Estrutura QA: 🔴 | Wiki: 🔴 | Documentacao: 🟡 | Bugs: ⚪

## Padrao Global Encontrado
Wiki ausente; User Story De QA ausente — presente em 5 de 6 Features (100,
101, 104, 108, 112).

## Visao Por Feature
### Feature 100 - Cadastro De Usuario
...
Artefatos QA:
- Documentacao QA: Nao encontrada
- Wiki: Nao encontrada
Pendencias Principais:
- Segue o Padrao Global Encontrado (ver secao acima)
...

## Priorizacao - Proximas Acoes Sugeridas
### Prioridade Alta
- Criar Wiki (6 Features: 100, 101, 104, 108, 112, 115)
- Criar User Story De QA (5 Features: 100, 101, 104, 108, 112)
...

## Conclusao QA
Estrutura funcional parcialmente consolidada. A estrutura QA, no entanto,
esta classificada como basica. A principal recomendacao e Criar User Story
De QA antes de evoluir as demais dimensoes.
```

Especificação completa (Responsabilidade, Limites, Estratégia De Descoberta, Determinismo, Situação QA, Maturidade QA, Padrão Global De Pendências, Semáforo e o Relatório completo): `agents/qa-health-specialist.md`.

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
│   └── fonte canonica dos cinco agentes (qa-orchestrator, qa-bdd-specialist,
│       qa-bug-specialist, qa-wiki-specialist, qa-health-specialist)
│       (ver docs/AGENT_PARITY.md)
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

## Branches Do Projeto

* `main` — versão estável do framework.
* `develop` — branch permanente de desenvolvimento, evolução e validação.

Fluxo: `develop` → validação → Pull Request → `main`.

Branches específicas ou temporárias (ex.: para uma mudança pontual) podem existir quando necessário, mas `main` e `develop` são as branches permanentes do projeto.

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
| Servidor MCP do projeto não aparece na sessão | Primeiro reconecte/reautentique via comando de MCP do cliente (veja [Antes De Usar Qualquer Agente](#antes-de-usar-qualquer-agente)). Só rode setup e validate novamente se o servidor continuar ausente depois disso. |
| Agente não encontrado | Confirme que está na raiz do projeto e reinicie o cliente. |
| Você escolheu Codex mas abriu Copilot | Feche o cliente errado e siga apenas o roteiro Codex. |
| `Codex mostra Unrecognized command '/allow-all'` | Normal no Codex CLI. Desde o setup, `approval_policy = "on-request"` e `sandbox_mode = "workspace-write"` estão no profile — não é necessário nenhuma flag adicional. |
| Codex mostra `MCP servers: 0` | Você iniciou `codex` sem `--profile aps-quality-intelligence-multi-ai`. Sem esse profile, o Codex carrega somente `~/.codex/config.toml` e nenhum MCP do projeto. Feche a sessão e inicie com `codex --profile aps-quality-intelligence-multi-ai`. |
| Agente não encontra Work Item, Wiki ou qualquer dado mesmo com setup correto | Confirme que o MCP Azure DevOps está carregado na sessão atual (`/mcp` no Codex, `/mcp show <nome do MCP>` no Copilot, `claude mcp list` no Claude) antes de repetir o pedido. Veja [Antes De Usar Qualquer Agente](#antes-de-usar-qualquer-agente). |
| Nova sessão mostra aviso de autenticação ou conexão MCP pendente, mesmo com setup já validado antes | Isso é esperado: a conexão e a autenticação do MCP valem para a sessão atual do cliente, não para o config gerado em disco. Use o comando de MCP do próprio cliente para reconectar ou reautenticar antes de pedir qualquer agente; não é necessário rodar `setup-mcp` novamente. |

## Documentação Complementar

* [Guia de manutenção](docs/MAINTENANCE.md)
* [Checklist de validação](docs/VALIDATION.md)
* [Suíte de regressão do qa-bug-specialist](docs/BUG_AGENT_VALIDATION.md)
* [Setup detalhado](docs/SETUP.md)
* [Uso dos agentes](docs/USAGE.md)
* [Troubleshooting](docs/TROUBLESHOOTING.md)
* [Paridade dos agentes](docs/AGENT_PARITY.md)
* [Scripts](scripts/README.md)
* [Clientes](clients/README.md)
