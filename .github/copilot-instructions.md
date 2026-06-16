# Copilot Instructions - QA Agent Suite

Este repositorio fornece um unico ponto de entrada publico no Copilot para documentacao QA:

```text
/agent
qa-orchestrator
<Project> <WorkItemID>
```

Exemplo:

```text
Backoffice 11234
```

## Arquivos Principais

| Arquivo | Finalidade |
| --- | --- |
| `README.md` | Comeco rapido orientado. |
| `docs/MAINTENANCE.md` | Arquitetura, agentes, skills, seguranca e publicacao. |
| `.github/agents/qa-orchestrator.agent.md` | Agente publico do fluxo principal. |
| `.github/agents/qa-bdd-specialist.agent.md` | Especialista em SPEC e BDD. |
| `.github/agents/qa-wiki-specialist.agent.md` | Especialista em Wiki. |
| `.github/agents/qa-bug-specialist.agent.md` | Especialista em Bug. |

## Regras Operacionais

* Usuarios interagem pelo `qa-orchestrator`.
* Acesso ao Azure DevOps deve usar MCP.
* O config MCP e gerado pelos scripts de setup, nao editado manualmente.
* Use primeiro buscas focadas no Azure DevOps e na Wiki.
* Use busca ampla apenas como fallback controlado quando a busca focada for insuficiente.
* Reutilize contexto recebido do orchestrator; nao repita chamadas MCP sem necessidade.
* Nao exponha raciocinio interno, chain of thought, PATs ou conteudo do config MCP gerado.
* Mantenha docs enxutos: README e `docs/MAINTENANCE.md`.

## Responsabilidades Dos Agentes

| Agente | Papel |
| --- | --- |
| `qa-orchestrator` | Fluxo publico ponta a ponta. |
| `qa-bdd-specialist` | Analise de requisito, SPEC, BDD e cobertura QA. |
| `qa-wiki-specialist` | Busca, destino, atualizacao e publicacao na Wiki. |
| `qa-bug-specialist` | Analise de defeito e criacao de Bug. |

## Resultado Esperado

```text
SPEC
cenarios BDD
cobertura QA
publicacao na Wiki quando aplicavel
```
