# Paridade Dos Agentes

Os mesmos agentes existem em tres clientes:

| Agente | Copilot | Codex | Claude | Fonte canonica |
| --- | --- | --- | --- | --- |
| `qa-orchestrator` | `.github/agents/qa-orchestrator.agent.md` | `.codex/agents/qa-orchestrator.toml` | `.claude/agents/qa-orchestrator.md` | Nao existe ainda — mantido manualmente nos tres formatos. |
| `qa-bdd-specialist` | `.github/agents/qa-bdd-specialist.agent.md` | `.codex/agents/qa-bdd-specialist.toml` | `.claude/agents/qa-bdd-specialist.md` | `agents/qa-bdd-specialist.md` |
| `qa-wiki-specialist` | `.github/agents/qa-wiki-specialist.agent.md` | `.codex/agents/qa-wiki-specialist.toml` | `.claude/agents/qa-wiki-specialist.md` | `agents/qa-wiki-specialist.md` |
| `qa-bug-specialist` | `.github/agents/qa-bug-specialist.agent.md` | `.codex/agents/qa-bug-specialist.toml` | `.claude/agents/qa-bug-specialist.md` | `agents/qa-bug-specialist.md` |
| `qa-health-specialist` | `.github/agents/qa-health-specialist.agent.md` | `.codex/agents/qa-health-specialist.toml` | `.claude/agents/qa-health-specialist.md` | `agents/qa-health-specialist.md` |

## Dois Mecanismos De Paridade, Nao Um So

O framework esta em migracao parcial de um modelo de manutencao para outro. Isso muda o que "atualizar um agente" significa na pratica, dependendo do agente:

* **Com fonte canonica** (`qa-wiki-specialist`, `qa-bug-specialist`, `qa-bdd-specialist`, `qa-health-specialist`): o conteudo vive em `agents/<nome>.md`. Os tres arquivos de cliente sao **gerados** por `node scripts/render-agents.mjs agents/<nome>.md` e nunca devem ser editados diretamente. `scripts/render-agents.mjs --check-all` (parte de `./scripts/check.sh`) falha com `DRIFT` se um gerado nao bater byte a byte com o que a fonte produziria. Para esses tres agentes, paridade entre clientes e garantida por construcao. `qa-bdd-specialist` migrou para este modelo em DEC-0008 (`docs/DECISIONS.md`), consolidando o comportamento mais completo entre as tres variantes anteriores (formato Gherkin explicito, gate de validacao de suficiencia, cobertura de cenario estendida, taxonomia de riscos/gaps e checklist final — antes presentes apenas na versao Copilot).
* **Sem fonte canonica** (`qa-orchestrator`): o conteudo dos tres arquivos e escrito e mantido a mao. Nao existe nenhuma checagem de equivalencia semantica entre eles — apenas presenca de conceitos-chave (ver abaixo). Uma divergencia real ja foi observada aqui (criterio de desempate ao encontrar multiplos arquivos compativeis em `output/`, presente apenas na versao Copilot) e corrigida manualmente em DEC-0008 — mas a ausencia de fonte canonica significa que uma proxima mudanca pode reintroduzir divergencia sem que `./scripts/check.sh` detecte, ja que o check nao foi desenhado para pegar esse tipo de diferenca. Migrar `qa-orchestrator` para fonte canonica, seguindo o padrao ja aplicado aos outros tres agentes, continua pendente.

O Gate De Preparacao De Ambiente (`docs/DOMAIN_CONTRACT.md`, ver `docs/DECISIONS.md` DEC-0006) e uma excecao deliberada a esse risco: nenhum agente mantem sua propria versao da logica do Gate, mesmo `qa-orchestrator` sem fonte canonica — todos os quatro apenas referenciam a mesma secao de `docs/DOMAIN_CONTRACT.md` com uma instrucao curta e identica. Isso evita que o Gate especificamente vire uma nova fonte de divergencia enquanto a migracao de `qa-orchestrator` continua pendente.

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

O script `scripts/render-agents.mjs --check-all` valida, apenas para agentes com fonte canonica, que os tres arquivos gerados equivalem exatamente ao que a fonte produz.

Essa validacao reduz divergencia, mas nao substitui teste real com Azure DevOps quando o comportamento mudar — e, para `qa-orchestrator` (o unico agente ainda sem fonte canonica), nao garante paridade de comportamento entre clientes.
