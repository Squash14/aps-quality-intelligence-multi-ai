# Paridade Dos Agentes

Os mesmos agentes existem em tres clientes:

| Agente | Copilot | Codex | Claude |
| --- | --- | --- | --- |
| `qa-orchestrator` | `.github/agents/qa-orchestrator.agent.md` | `.codex/agents/qa-orchestrator.toml` | `.claude/agents/qa-orchestrator.md` |
| `qa-bdd-specialist` | `.github/agents/qa-bdd-specialist.agent.md` | `.codex/agents/qa-bdd-specialist.toml` | `.claude/agents/qa-bdd-specialist.md` |
| `qa-wiki-specialist` | `.github/agents/qa-wiki-specialist.agent.md` | `.codex/agents/qa-wiki-specialist.toml` | `.claude/agents/qa-wiki-specialist.md` |
| `qa-bug-specialist` | `.github/agents/qa-bug-specialist.agent.md` | `.codex/agents/qa-bug-specialist.toml` | `.claude/agents/qa-bug-specialist.md` |

## Regra De Manutencao

Ao mudar um agente, atualize os tres formatos no mesmo commit.

Execute:

```bash
./scripts/check.sh
```

No Windows:

```powershell
.\scripts\check.ps1
```

O script `scripts/validate-agent-assets.mjs` valida:

* arquivos obrigatorios;
* nome do agente;
* bloco `developer_instructions` no Codex;
* conceitos obrigatorios por agente.

Essa validacao reduz divergencia, mas nao substitui teste real com Azure DevOps quando o comportamento mudar.
