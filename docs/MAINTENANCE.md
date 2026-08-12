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
| `providers/` | (planejado — Fase 2, ver `docs/DECISIONS.md` DEC-0003) Adaptadores de Sistema ALM, um por ALM suportado. Ainda nao existe nesta etapa. |
| `profiles/` | Configuracao concreta de cada workspace/organizacao (ver `docs/DECISIONS.md` DEC-0004). Primeiro Profile real: `profiles/apsen-arquitetura/profile.json`, lido em runtime por `qa-bug-specialist`. |
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
* Todo agente — incluindo os tres especialistas, que podem ser chamados diretamente pelo usuario sem passar por `qa-orchestrator` (ver `docs/USAGE.md`) — executa o Gate De Preparacao De Ambiente (`docs/DOMAIN_CONTRACT.md`) como primeiro passo do proprio fluxo, antes de ler documentacao adicional, consultar o Item De Trabalho ou delegar. Ver `docs/DECISIONS.md`, DEC-0006.

## Manutencao

Existem hoje **dois fluxos validos** para alterar um agente, dependendo se ele ja tem fonte canonica em `agents/`. Confirme qual fluxo se aplica antes de editar qualquer arquivo — editar o arquivo errado gera `DRIFT` no `check.sh`/CI ou, pior, uma divergencia silenciosa entre clientes que nenhum check hoje cobre.

### Agente com fonte canonica (`agents/<nome>.md` existe)

Hoje: `qa-bug-specialist`, `qa-wiki-specialist`, `qa-bdd-specialist`.

1. Edite apenas `agents/<nome>.md` (secoes `## Comportamento Compartilhado` e `## Particularidades Por Cliente`).
2. Rode `node scripts/render-agents.mjs agents/<nome>.md` para regenerar `.claude/agents/`, `.codex/agents/` e `.github/agents/`.
3. Nunca edite os tres arquivos gerados diretamente — a proxima regeneracao sobrescreve qualquer edicao manual sem aviso.
4. Execute `./scripts/check.sh` (valida, entre outras coisas, que os gerados batem com a fonte via `render-agents.mjs --check-all`).
5. Valide com um Work Item real antes de compartilhar com o time. Para `qa-bug-specialist`, use a suite de regressao em `docs/BUG_AGENT_VALIDATION.md` — rode os cenarios afetados pela mudanca, e todos os dez antes de uma mudanca estrutural.

### Agente ainda sem fonte canonica (`agents/<nome>.md` nao existe)

Hoje: `qa-orchestrator`. Este agente ja divergiu de forma real entre clientes porque depende inteiramente de disciplina manual — ver `docs/AGENT_PARITY.md` para o estado atual dessa divergencia.

1. Leia o arquivo do agente afetado nos tres clientes antes de editar, para entender se ja existe divergencia previa.
2. Atualize os tres formatos manualmente: `.github/agents`, `.codex/agents` e `.claude/agents`, com o mesmo comportamento funcional.
3. Preserve o formato publico de entrada.
4. Execute `./scripts/check.sh` — hoje ele so confirma presenca de arquivo e de conceitos-chave (`scripts/validate-agent-assets.mjs`), **nao** equivalencia semantica completa entre os tres arquivos. Passar no check nao garante paridade real para esses dois agentes.
5. Valide com um Work Item real em pelo menos dois clientes antes de compartilhar com o time.
6. Ao terminar, considere migrar o agente para fonte canonica (`agents/<nome>.md`) seguindo o padrao de `qa-bug-specialist`/`qa-wiki-specialist`, para que o proximo check cubra esse agente por completo.

### Provider (planejado — Fase 2, ver `docs/DECISIONS.md` DEC-0003)

Esta estrutura ainda nao existe no repositorio nesta etapa (Etapa 1 do plano de migracao registrado em DEC-0003). Esta secao documenta o contrato que a extracao de Azure DevOps/Apsen (Etapa 3 do plano) e qualquer Provider futuro devem seguir quando forem de fato criados.

Um Provider vive em `providers/<nome>/` e e responsavel por:

1. Declarar, em `providers/<nome>/provider.md`, quais Capacidades de `docs/CAPABILITY_CONTRACT.md` ele cumpre. `Buscar Item De Trabalho` e obrigatoria para qualquer Provider valido. As demais sao opcionais, mas seguem a regra de emparelhamento descrita la: Buscar Documento/Publicar Documento so existem juntas, assim como Buscar Defeito/Criar Defeito e Buscar Item De Trabalho/Sincronizar Item De Trabalho — nunca metade de um par.
2. Mapear o vocabulario de hierarquia do ALM (ex.: Epic/Feature/User Story/Task no Azure DevOps) para os termos de `docs/DOMAIN_CONTRACT.md`.
3. Declarar o que constitui, para aquele tipo de ALM, uma instancia conectavel (Organizacao no Azure DevOps, Site no Jira, Conta no GitHub etc.) — e isso que um Profile aponta como qual instancia concreta esta em uso.
4. Referenciar, sem embutir no texto de `provider.md`, um artefato de configuracao de conexao na mesma pasta (hoje sempre um template MCP, ex. `mcp-config.template.json`). O texto de `provider.md` nunca deve citar mecanismo de transporte, nome de tool MCP ou detalhe de protocolo — trocar o mecanismo no futuro deve exigir trocar esse arquivo, nunca reescrever `provider.md`.
5. **Arquitetura-alvo para Resolucao De Projeto:** resolver, internamente a cada Capacidade que recebe Projeto como entrada (`Buscar Item De Trabalho`, `Buscar Defeito`, `Criar Defeito`, `Sincronizar Item De Trabalho` etc.), o Projeto (Logico) informado pelo usuario para o projeto ou container fisico correspondente daquela instancia, usando o mapeamento declarado pelo Profile ativo (`sistema_alm.mapeamento_projeto_logico`). Esta resolucao e responsabilidade exclusiva do Provider (`docs/CAPABILITY_CONTRACT.md`, linha "Toda ocorrencia de 'Projeto'..."), nunca exposta ao Agente como uma etapa ou Capacidade propria — o Agente apenas informa o Projeto e recebe o resultado ja resolvido das Capacidades que chama. Ate o Provider ser extraido, ver "Profile" abaixo para a implementacao provisoria em vigor.

Um Provider nao decide regra de negocio de QA, nao gera SPEC/BDD, nao decide layout de saida — isso permanece responsabilidade dos agentes. Validacao esperada quando esta estrutura existir: confirmar que os pares de Capacidade estao completos e que `Buscar Item De Trabalho` esta presente, alem de validacao ponta a ponta com um Item De Trabalho real.

### Profile

O primeiro Profile real do framework existe em `profiles/apsen-arquitetura/profile.json` (ver `docs/DECISIONS.md` DEC-0004), usado hoje apenas por `qa-bug-specialist`. Um Profile vive em `profiles/<nome>/profile.json` e e responsavel por declarar, para um workspace/organizacao especifico:

* qual Provider este workspace usa (hoje declarado apenas como identificador textual, ex. `"provider": "azure-devops"` — `providers/` formal ainda nao existe, ver secao "Provider" acima);
* o valor concreto da instancia de Sistema ALM (ex.: organizacao Azure DevOps "Apsen") e qual(is) Projeto(s) dentro dela, incluindo o mapeamento entre o Projeto (Logico) informado pelo usuario e o projeto fisico correspondente quando os nomes divergirem (`sistema_alm.mapeamento_projeto_logico`, ver "Implementacao Provisoria De Resolucao De Projeto" abaixo) — este campo e puramente declarativo: lista pares `logico`/`fisico` (e `aliases` opcionais), sem nenhuma logica de resolucao;
* onde estao as credenciais — apenas a referencia de onde carregar, nunca o segredo em si (Principio 8 de `docs/PRINCIPLES.md`);
* convencoes daquele workspace especifico, nao do ALM em geral (ex.: nomes de campo customizado como `Custom.Causadoproblema`, valores aceitos e aliases como `"Bug em produção"`, estrutura de paginas do Repositorio De Documentacao);
* a politica de atribuicao automatica de responsavel — o que fazer quando o usuario nao informa um nome. O padrao seguro e nao definir responsavel, preservando o comportamento atual de `qa-bug-specialist`;
* a politica de evidencias aceitas (tipos e limites suportados), quando o Provider implementar Anexar Evidencias;
* acoes por evento (`acoes_por_evento`) — passos adicionais automaticos que um Agente executa apos um evento proprio (ex.: `apos_criar_defeito`), declarados como uma lista de acoes tipadas (campo `tipo`) por chave de evento. A primeira implementacao real e `qa-bug-specialist`, ver `docs/BUG_AGENT_TEMPLATE.md`. O nome do container e generico de proposito — um Agente futuro pode declarar sua propria chave de evento (ex.: `apos_publicar_documento`) no mesmo bloco, sem precisar de um conceito ou contrato novo.

Multiplos Profiles podem apontar para o mesmo Provider (dois workspaces diferentes, ambos em Azure DevOps, por exemplo). Um Profile aponta para exatamente um Provider.

**Mecanismo de carregamento:** leitura em runtime, nao merge em tempo de renderizacao. O agente e instruido, no proprio texto de `agents/qa-bug-specialist.md`, a ler o arquivo do Profile ativo no inicio da execucao antes de resolver Projeto, Tipo Do Defeito, Causa do problema ou qualquer outra convencao especifica do workspace. `scripts/render-agents.mjs` no conhece Profile e nao precisa mudar — o agente renderizado permanece identico independentemente de qual Profile esta ativo. Essa escolha (runtime vs render-time) foi deliberada: com um unico Profile em uso hoje, mesclar em tempo de renderizacao adicionaria uma dimensao de build (agente x cliente x Profile) sem necessidade real ainda (Principio 1). Revisitar quando houver demanda real por multiplos Profiles simultaneos no mesmo agente renderizado.

**Implementacao Provisoria De Resolucao De Projeto e Time (aplica-se a todos os Agentes que invocam Capacidades com Projeto como parametro):** a arquitetura-alvo (ver "Provider" acima) atribui a resolucao de Projeto (Logico) para projeto fisico exclusivamente ao Provider, nunca ao Agente. Como `providers/` ainda nao existe neste repositorio, todo Agente que invocar Capacidades que recebam Projeto como parametro (`Buscar Item De Trabalho`, `Buscar Defeito`, `Criar Defeito`, `Sincronizar Item De Trabalho`, `Buscar Documento`, `Publicar Documento`, `Obter Sprint` e equivalentes) executa hoje, provisoriamente, o mesmo procedimento que o Provider executara: ler `sistema_alm.mapeamento_projeto_logico` do Profile ativo, resolver o Projeto informado contra as entradas `logico`/`aliases` declaradas ali e, na ausencia de correspondencia, usar o proprio valor informado como identificador do projeto no ALM (fallback que preserva o comportamento anterior, quando nenhuma resolucao existia). Se o projeto resultante nao existir no ALM, o agente interrompe e informa explicitamente que falta uma entrada em `mapeamento_projeto_logico`, em vez de perguntar ao usuario qual projeto usar. O Projeto Fisico resolvido deve ser passado como parametro explicito em toda chamada ao MCP ou mecanismo de transporte equivalente durante o restante do fluxo — nunca omitido, nunca deixado em branco para o MCP solicitar interativamente (ver `docs/DOMAIN_CONTRACT.md`, "Propagacao Do Contexto Resolvido"). Da mesma forma, o Time resolvido a partir de `sistema_alm.time_padrao` do Profile ativo deve ser passado explicitamente em toda chamada que aceite team/time como parametro — nunca deixado implicito nem solicitado ao usuario quando o Profile ja o declara; se o Profile nao declarar um Time para o projeto resolvido, interromper e informar que falta essa configuracao. Este procedimento existe apenas para que o comportamento observado hoje seja identico ao da arquitetura-alvo; ele migra inteiramente para dentro do Provider assim que `providers/` for extraido (Etapa 3 de DEC-0003), sem exigir mudanca de contrato nem de Profile.

Ao criar um novo Profile:

1. Criar `profiles/<nome>/profile.json` com os campos acima.
2. Nunca embutir segredo ou credencial no arquivo.
3. Se o agente que vai consumir o Profile ainda referenciar valores hardcoded no proprio texto (vazamento de vocabulario, Principio 4), extrai-los para o Profile como parte da mesma mudanca — nao adicionar Profile sem remover o hardcode equivalente.
4. Validar com um Work Item real antes de considerar o Profile pronto para uso do time.

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
* Se o Gate De Preparacao De Ambiente foi alterado, a mudanca foi feita apenas em `docs/DOMAIN_CONTRACT.md` — nenhum agente recebeu logica reescrita ou parafraseada do Gate, apenas a referencia curta ja existente.

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
