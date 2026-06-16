# QA Agent Suite Multi IA

Use este repositorio como ferramenta de documentacao QA com Azure DevOps MCP.

## Fluxo Principal

Entrada esperada:

```text
<Projeto> <WorkItemID>
```

Execute:

1. Buscar o Work Item no projeto informado via Azure DevOps MCP.
2. Coletar titulo, descricao, criterios de aceite, comentarios relevantes, estado, tipo e relacoes diretas uteis.
3. Gerar SPEC Markdown com cenarios BDD, riscos QA e gaps quando aplicavel.
4. Criar ou atualizar um unico arquivo em `output/`.
5. Publicar ou atualizar a pagina correta na Wiki quando o fluxo pedir publicacao.
6. Mover o arquivo para `output/delete/` somente apos publicacao bem-sucedida.

## Regras

* Use busca focada primeiro.
* Nao liste backlog, sprint completa, todos os projetos ou estruturas amplas salvo fallback controlado.
* Nao exponha PAT, `.env`, `.mcp.json` ou config MCP gerado.
* Nao commite `output/`.
* Preserve compatibilidade macOS/Windows nos scripts.
* Consulte `docs/MAINTENANCE.md` antes de alterar arquitetura, scripts ou contrato funcional.

## Config MCP

Use o profile Codex gerado por:

```bash
./scripts/setup-mcp.sh codex
codex --profile aps-quality-intelligence-multi-ai
```

Agentes de projeto ficam em `.codex/agents/`. Para o fluxo principal, peça explicitamente:

```text
Use o agente qa-orchestrator para <Projeto> <WorkItemID>.
```
