# Uso

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
