# Paridade Dos Agentes

Os mesmos agentes existem em tres clientes:

| Agente | Copilot | Codex | Claude | Fonte canonica |
| --- | --- | --- | --- | --- |
| `qa-orchestrator` | `.github/agents/qa-orchestrator.agent.md` | `.codex/agents/qa-orchestrator.toml` | `.claude/agents/qa-orchestrator.md` | `agents/qa-orchestrator.md` |
| `qa-bdd-specialist` | `.github/agents/qa-bdd-specialist.agent.md` | `.codex/agents/qa-bdd-specialist.toml` | `.claude/agents/qa-bdd-specialist.md` | `agents/qa-bdd-specialist.md` |
| `qa-wiki-specialist` | `.github/agents/qa-wiki-specialist.agent.md` | `.codex/agents/qa-wiki-specialist.toml` | `.claude/agents/qa-wiki-specialist.md` | `agents/qa-wiki-specialist.md` |
| `qa-bug-specialist` | `.github/agents/qa-bug-specialist.agent.md` | `.codex/agents/qa-bug-specialist.toml` | `.claude/agents/qa-bug-specialist.md` | `agents/qa-bug-specialist.md` |
| `qa-health-specialist` | `.github/agents/qa-health-specialist.agent.md` | `.codex/agents/qa-health-specialist.toml` | `.claude/agents/qa-health-specialist.md` | `agents/qa-health-specialist.md` |

## Um Unico Mecanismo De Paridade

Todos os cinco agentes tem fonte canonica em `agents/<nome>.md`. Os tres arquivos de cliente sao **gerados** por `node scripts/render-agents.mjs agents/<nome>.md` e nunca devem ser editados diretamente. `scripts/render-agents.mjs --check-all` (parte de `./scripts/check.sh`) falha com `DRIFT` se um gerado nao bater byte a byte com o que a fonte produziria. Para os cinco agentes, paridade entre clientes e garantida por construcao.

Historico da migracao: `qa-bdd-specialist` migrou em DEC-0008, `qa-health-specialist` ja nasceu com fonte canonica em DEC-0010, e `qa-orchestrator` — o ultimo agente ainda mantido manualmente nos tres formatos, com uma divergencia real ja registrada e corrigida em DEC-0008 (criterio de desempate ao encontrar multiplos arquivos compativeis em `output/`, presente apenas na versao Copilot) — migrou em DEC-0011, consolidando o comportamento mais completo entre as tres variantes anteriores (secoes explicitas de Entrada, Sincronizacao Incremental em tabela, Delegacao com contexto obrigatorio por especialista, Wiki, Arquivamento e Validacao Final — antes presentes apenas na versao Copilot). Isso fecha a Etapa 3 do plano de migracao registrado em DEC-0003. Nenhum agente deste framework depende hoje de manutencao manual multi-cliente.

O Gate De Preparacao De Ambiente (`docs/DOMAIN_CONTRACT.md`, ver `docs/DECISIONS.md` DEC-0006) ja seguia esse principio antes mesmo da migracao completa: nenhum agente mantem sua propria versao da logica do Gate — todos os cinco apenas referenciam a mesma secao de `docs/DOMAIN_CONTRACT.md` com uma instrucao curta e identica.

## Regra De Manutencao

Ao mudar um agente, siga o fluxo correspondente descrito em `docs/MAINTENANCE.md` ("Manutencao" > Agentes), de acordo com a linha "Fonte canonica" da tabela acima.

Execute:

```bash
./scripts/check.sh
```

No Windows:

```powershell
.\scripts\check.ps1
```

Ambos rodam automaticamente em `push`/`pull_request` (`.github/workflows/check.yml`, ver `docs/DECISIONS.md` DEC-0002).

O script `scripts/validate-agent-assets.mjs` valida, para todos os cinco agentes, independentemente de terem fonte canonica:

* arquivos obrigatorios;
* nome do agente;
* bloco `developer_instructions` no Codex;
* conceitos obrigatorios por agente (presenca de palavras/frases-chave, nao equivalencia de comportamento).

O script `scripts/render-agents.mjs --check-all` valida, para todos os cinco agentes, que os tres arquivos gerados equivalem exatamente ao que a fonte produz.

Essa validacao reduz divergencia, mas nao substitui teste real com Azure DevOps quando o comportamento mudar.
