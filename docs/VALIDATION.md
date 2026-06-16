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

Resultado esperado: o servidor `ado` aparece configurado/conectado.

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
