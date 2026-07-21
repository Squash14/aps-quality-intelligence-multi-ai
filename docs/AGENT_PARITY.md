# Paridade Dos Agentes

Os mesmos agentes existem em tres clientes:

| Agente | Copilot | Codex | Claude | Fonte canonica |
| --- | --- | --- | --- | --- |
| `qa-orchestrator` | `.github/agents/qa-orchestrator.agent.md` | `.codex/agents/qa-orchestrator.toml` | `.claude/agents/qa-orchestrator.md` | Nao existe ainda — mantido manualmente nos tres formatos. |
| `qa-bdd-specialist` | `.github/agents/qa-bdd-specialist.agent.md` | `.codex/agents/qa-bdd-specialist.toml` | `.claude/agents/qa-bdd-specialist.md` | Nao existe ainda — mantido manualmente nos tres formatos. |
| `qa-wiki-specialist` | `.github/agents/qa-wiki-specialist.agent.md` | `.codex/agents/qa-wiki-specialist.toml` | `.claude/agents/qa-wiki-specialist.md` | `agents/qa-wiki-specialist.md` |
| `qa-bug-specialist` | `.github/agents/qa-bug-specialist.agent.md` | `.codex/agents/qa-bug-specialist.toml` | `.claude/agents/qa-bug-specialist.md` | `agents/qa-bug-specialist.md` |

## Dois Mecanismos De Paridade, Nao Um So

O framework esta em migracao parcial de um modelo de manutencao para outro. Isso muda o que "atualizar um agente" significa na pratica, dependendo do agente:

* **Com fonte canonica** (`qa-wiki-specialist`, `qa-bug-specialist`): o conteudo vive em `agents/<nome>.md`. Os tres arquivos de cliente sao **gerados** por `node scripts/render-agents.mjs agents/<nome>.md` e nunca devem ser editados diretamente. `scripts/render-agents.mjs --check-all` (parte de `./scripts/check.sh`) falha com `DRIFT` se um gerado nao bater byte a byte com o que a fonte produziria. Para esses dois agentes, paridade entre clientes e garantida por construcao.
* **Sem fonte canonica** (`qa-orchestrator`, `qa-bdd-specialist`): cada um dos tres arquivos e escrito e mantido a mao. Nao existe nenhuma checagem de equivalencia semantica entre eles — apenas presenca de conceitos-chave (ver abaixo). **Esses dois agentes ja divergiram de forma real**: a versao Copilot de ambos contem regras que as versoes Codex e Claude nao tem (por exemplo, criterio de desempate ao encontrar multiplos arquivos compativeis em `output/` no `qa-orchestrator`, e formato Gherkin explicito, regra de "ignorar mudanca administrativa sem impacto QA" e lista estendida de tipos de cenario no `qa-bdd-specialist`). Isso e uma violacao pratica do Principio 3 (Agnosticismo De IA) que passa despercebida porque `./scripts/check.sh` continua reportando sucesso — o check nao foi desenhado para pegar esse tipo de divergencia. Ver proposta de correcao no relatorio de revisao arquitetural (migrar ambos para fonte canonica, reconciliando o conteudo com decisao explicita sobre qual comportamento adotar).

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

O script `scripts/validate-agent-assets.mjs` valida, para todos os quatro agentes, independentemente de terem fonte canonica:

* arquivos obrigatorios;
* nome do agente;
* bloco `developer_instructions` no Codex;
* conceitos obrigatorios por agente (presenca de palavras/frases-chave, nao equivalencia de comportamento).

O script `scripts/render-agents.mjs --check-all` valida, apenas para agentes com fonte canonica, que os tres arquivos gerados equivalem exatamente ao que a fonte produz.

Essa validacao reduz divergencia, mas nao substitui teste real com Azure DevOps quando o comportamento mudar — e, para agentes sem fonte canonica, nao garante paridade de comportamento entre clientes.
