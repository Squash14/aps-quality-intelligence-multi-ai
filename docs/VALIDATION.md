# Checklist de Validacao

Use este checklist para validar o fluxo com um Work Item real antes de compartilhar mudancas com o time.

Nao registre PAT, conteudo sensivel de Work Item, URLs privadas completas ou logs com dados internos em issues, commits ou mensagens publicas.

## Validacao Local

macOS:

```bash
./scripts/check.sh
./scripts/setup-mcp.sh <cliente>
./scripts/validate-setup.sh <cliente>
```

Windows:

```powershell
.\scripts\check.ps1
.\scripts\setup-mcp.ps1 <cliente>
.\scripts\validate-setup.ps1 <cliente>
```

Use `copilot`, `codex` ou `claude` como `<cliente>`. Use `all` somente quando os tres clientes estiverem instalados.

Arquivos esperados:

| Cliente | Arquivo |
| --- | --- |
| Copilot | `~/.copilot/mcp-config.json` |
| Codex | `~/.codex/aps-quality-intelligence-multi-ai.config.toml` |
| Claude | `.mcp.json` |

No Codex, confirme também que o profile gerado contém:

```toml
default_tools_approval_mode = "approve"
```

## Validacao Por Cliente

Gerar o config uma vez nao garante que toda sessao futura carrega o MCP automaticamente — em clientes com profile ou flag de projeto (como o Codex), a ativacao depende de como a sessao e iniciada. Repita a validacao abaixo sempre que abrir uma nova sessao, antes de pedir qualquer agente.

Alem de carregar o config, a conexao e a autenticacao do MCP tambem sao caracteristicas da sessao atual, nao do config gerado. Uma nova sessao pode exibir o MCP como desconectado ou pendente de autenticacao mesmo com o config correto e ja validado antes — isso nao indica setup quebrado. Nesse caso, use o comando de validacao/reconexao do proprio cliente (por exemplo, o comando de listagem ou status de MCP da sessao) para reconectar ou reautenticar antes de pedir qualquer agente.

Copilot:

```bash
copilot
```

Dentro do Copilot:

```text
/mcp show ado
```

Codex:

```bash
codex --profile aps-quality-intelligence-multi-ai
codex --profile aps-quality-intelligence-multi-ai mcp list
```

Dentro da sessao Codex, tambem pode confirmar com:

```text
/mcp
```

Esperado: o servidor MCP configurado para este projeto aparece na lista de MCP servers conectados (nome definido em `MCP_SERVER_NAME` no `.env`; `ado` por padrao). Se a sessao mostrar `MCP servers: 0`, feche e reabra com `codex --profile aps-quality-intelligence-multi-ai` — rodar apenas `codex` carrega somente `~/.codex/config.toml`, sem os MCPs do projeto.

Dentro do Codex, valide o agente:

```text
Use o agente qa-orchestrator para <Projeto> <WorkItemID>.
```

Claude:

```bash
claude --mcp-config .mcp.json --agent qa-orchestrator
claude mcp list
```

Dentro do Claude, tambem pode validar:

```text
Use o agente qa-orchestrator para <Projeto> <WorkItemID>.
```

Resultado esperado: o servidor MCP configurado para este projeto aparece configurado/conectado (nome definido em `MCP_SERVER_NAME` no `.env`; `ado` por padrao).

## Validacao Com Work Item Real

Entrada:

```text
<Projeto> <WorkItemID>
```

Checklist:

* Work Item foi encontrado no projeto informado.
* Busca ficou focada no Work Item e relacoes diretas.
* SPEC foi gerada.
* Cenarios BDD foram gerados.
* Riscos QA e gaps foram identificados quando aplicavel.
* Apenas um arquivo foi criado ou atualizado em `output/`.
* Arquivo existente foi reutilizado quando havia `<WorkItemID>*.md`.
* Wiki correta foi localizada.
* Pagina existente foi atualizada ou nova pagina foi criada sem duplicidade.
* URL da pagina foi retornada.
* Apos publicacao bem-sucedida, arquivo local foi movido para `output/delete/`.
* Em caso de falha na publicacao, arquivo local permaneceu em `output/`.
* Estrutura QA da Feature foi verificada: User Story De QA encontrada, nao encontrada ou ambigua, sempre reportada de forma explicita.
* Quando a User Story De QA foi encontrada, as tres Tasks (`Planejar os testes`, `Executar os testes`, `Equalizar o ambiente`) foram reutilizadas quando ja sincronizadas, atualizadas quando desatualizadas, ou criadas quando ausentes — nunca apenas "criada se faltar".
* Task `Planejar os testes`, quando criada ou atualizada nesta execucao, contem o bloco de conteudo controlado (`[qa-orchestrator:inicio]`/`[qa-orchestrator:fim]`) com link da Feature, link da Wiki/SPEC, `Ultima sincronizacao` e nota de geracao automatica.
* Executar o mesmo pedido (`<Projeto> <WorkItemID>`) uma segunda vez, sem mudar Feature nem Wiki, nao cria nem atualiza Tasks — todas sao reportadas como `Existente` na segunda execucao, e `Ultima sincronizacao` permanece com o mesmo valor da primeira execucao (nao avanca em reuso sem alteracao).
* Alterar a Feature ou republicar a Wiki em uma URL diferente e rodar o `qa-orchestrator` novamente: a Task `Planejar os testes` e reportada como `Atualizada`, com os links do bloco controlado refletindo o novo estado e `Ultima sincronizacao` avancada para o momento da atualizacao.
* Editar manualmente a descricao da Task `Planejar os testes` (fora dos marcadores) e rodar o `qa-orchestrator` novamente: o conteudo manual permanece intacto apos a sincronizacao, e apenas o bloco controlado e atualizado quando necessario.
* Task `Planejar os testes` criada manualmente antes desta versao (sem os marcadores): apos a primeira sincronizacao, o bloco controlado aparece no topo da descricao e todo o conteudo anterior permanece preservado abaixo.

## Validacao Do Agente De Bug

Use quando houver mudanca no `qa-bug-specialist`, em um Profile que ele consome (`profiles/<nome>/profile.json`) ou no template de Bug. Evite criar Bugs artificiais; prefira um defeito real de QA quando possivel.

A suite de regressao completa deste agente — dez cenarios fixos (Bug novo, duplicidade, Task filha, resolucao de Projeto, resolucao de Sprint, descricao completa, campos do processo, evidencias, vinculacao a Feature, resumo final), cada um com objetivo, entrada, comportamento esperado e criterios de aprovacao — vive em [BUG_AGENT_VALIDATION.md](BUG_AGENT_VALIDATION.md). Rode os cenarios afetados pela mudanca antes de compartilhar com o time; rode todos antes de uma mudanca estrutural (Gate, mecanismo de Profile, template de Resultado Final).

Entrada recomendada para um cenario avulso:

```text
Use o agente qa-bug-specialist para criar um bug seguindo docs/BUG_AGENT_TEMPLATE.md.
```

## Evidencia Minima

Registre apenas resultado operacional, sem dados sensiveis:

```text
Cliente:
Projeto:
Work Item:
Arquivo local:
Acao Wiki:
URL validada: sim/nao
Arquivo arquivado: sim/nao
Observacoes:
```
