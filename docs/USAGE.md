# Uso

## Antes De Comecar

Todo agente deste framework depende do MCP Azure DevOps para localizar Work Item, consultar Wiki e demais recursos. Antes de pedir qualquer agente, confirme que esse MCP esta carregado na sessao atual do cliente escolhido — veja `docs/SETUP.md`, secao "Validar Ativacao Do MCP".

Um agente chamado sem o MCP Azure DevOps disponivel nao encontra Work Item nem Wiki. O sintoma parece um bug do agente ou do framework, mas a causa costuma ser a sessao do cliente sem o MCP carregado (por exemplo, Codex iniciado sem `--profile`).

## Fluxo Principal

Entrada publica:

```text
<Projeto> <WorkItemID>
```

No Codex:

```text
Use o agente qa-orchestrator para Backoffice 11234.
```

## SPEC/BDD Sem Wiki

```text
Use o agente qa-bdd-specialist para gerar SPEC e cenarios BDD do Work Item Backoffice 11234, sem publicar na Wiki.
```

## Wiki

Somente validar destino:

```text
Use o agente qa-wiki-specialist para validar o destino Wiki do Work Item Backoffice 11234 sem publicar.
```

Publicar quando o fluxo pedir:

```text
Use o agente qa-wiki-specialist para publicar a documentacao gerada para o Work Item Backoffice 11234.
```

## Bug

Use o template:

```text
Use o agente qa-bug-specialist para criar um bug seguindo docs/BUG_AGENT_TEMPLATE.md.
```

O agente deve:

* buscar duplicidade antes de criar;
* normalizar `Bug em produção`;
* normalizar `Erros de Codificação`;
* identificar sprint ativa;
* resolver `Assigned To`;
* criar o Bug;
* vincular parent quando informado;
* retornar URL.
