# QA Agent Suite Multi IA

Use este projeto para documentacao QA com Azure DevOps MCP.

## Entrada

```text
<Projeto> <WorkItemID>
```

## Conduta

* Buscar Work Item via Azure DevOps MCP com escopo focado.
* Gerar SPEC, cenarios BDD, cobertura QA, riscos e gaps quando houver evidencia.
* Usar `output/` para arquivo local e `output/delete/` apenas apos publicacao bem-sucedida.
* Publicar ou atualizar Wiki sem duplicar pagina quando o fluxo pedir publicacao.
* Nunca expor PAT, `.env`, `.mcp.json` ou configs MCP gerados.
* Manter scripts compativeis com macOS e Windows.

## Referencias

* `README.md` para setup e uso.
* `docs/MAINTENANCE.md` para arquitetura e manutencao.
* `docs/VALIDATION.md` para checklist ponta a ponta.

## Config MCP

Use o config Claude gerado por:

```bash
./scripts/setup-mcp.sh claude
claude --mcp-config .mcp.json --agent qa-orchestrator
```

Subagentes de projeto ficam em `.claude/agents/`.
