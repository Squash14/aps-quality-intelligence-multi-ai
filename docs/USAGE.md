# Uso

## Antes De Comecar

Todo agente deste framework depende do MCP Azure DevOps para localizar Work Item, consultar Wiki e demais recursos. Antes de pedir qualquer agente, confirme que esse MCP esta carregado na sessao atual do cliente escolhido — veja `docs/SETUP.md`, secao "Validar Ativacao Do MCP".

Um agente chamado sem o MCP Azure DevOps disponivel nao encontra Work Item nem Wiki. O sintoma parece um bug do agente ou do framework, mas a causa costuma ser a sessao do cliente sem o MCP carregado (por exemplo, Codex iniciado sem `--profile`).

Todo agente — `qa-orchestrator` e qualquer um dos tres especialistas chamado diretamente (ver secoes abaixo) — valida isso automaticamente como primeiro passo (Gate De Preparacao De Ambiente, `docs/DOMAIN_CONTRACT.md`) e interrompe antes de qualquer analise quando algo estiver faltando. A interrupcao vem com um diagnostico acionavel: causa da falha, Cliente De IA identificado, os comandos concretos desse Cliente (`docs/SETUP.md`, `docs/TROUBLESHOOTING.md`) para preparar o ambiente, como validar a correcao, e a orientacao de repetir exatamente o mesmo pedido em seguida. Preparar o ambiente antes de pedir o agente evita a interrupcao, mas nao e mais a unica linha de defesa.

## Fluxo Principal

Entrada publica:

```text
<Projeto> <WorkItemID>
```

No Codex:

```text
Use o agente qa-orchestrator para Backoffice 11234.
```

Ao final do fluxo, o `qa-orchestrator` também garante a estrutura mínima de QA da Feature relacionada e a mantém sincronizada (nunca apenas "cria se faltar"): localiza a User Story de QA filha direta da Feature e, para cada uma das três Tasks `Planejar os testes`, `Executar os testes` e `Equalizar o ambiente`, reutiliza (já sincronizada), atualiza (existente porém desatualizada) ou cria (ausente) — sem duplicidade entre execuções. A Task `Planejar os testes` recebe um bloco de conteúdo controlado (link da Feature, link da Wiki/SPEC, data/hora `Última sincronização`, nota de geração automática) que é sincronizado sem nunca sobrescrever conteúdo manual do QA fora desse bloco; `Última sincronização` só avança quando o bloco muda de fato, não a cada execução. Quando a User Story de QA não existe, o agente apenas reporta isso; não a cria automaticamente nesta versão. Ver o resultado final em [README.md](../README.md#resultado-final-esperado).

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

## Diagnóstico QA (somente leitura)

```text
Use o agente qa-health-specialist para diagnosticar a Feature 12345 do projeto Backoffice.
```

Ponto de entrada aceito nesta versão: Epic, Feature, User Story ou outro Item de Trabalho — sempre acompanhado do Projeto. Projeto, Sprint e Backlog como ponto de entrada ainda não são suportados; o agente informa isso explicitamente em vez de adivinhar.

Totalmente independente: pode ser chamado diretamente, sem nunca depender do `qa-orchestrator`. Nunca cria, atualiza, sincroniza ou publica nada — descobre a hierarquia relacionada (Features, User Stories, Tasks, Bugs, Wiki) e produz um relatório único `# DIAGNÓSTICO QA` com hierarquia encontrada, Fluxo QA Observado, Estrutura QA, Wiki, Bugs, cobertura, riscos, gaps, Pendências Encontradas, Oportunidades De Melhoria, Situação QA (`Estruturado`, `Parcial` ou `Insuficiente Para Avaliação`, sem score nem peso) e Próximas Ações Sugeridas. Toda informação não determinável é reportada com o motivo (permissão insuficiente, ausência de relação declarada, limitação da capacidade, informação inexistente ou ambiguidade não resolvida).
