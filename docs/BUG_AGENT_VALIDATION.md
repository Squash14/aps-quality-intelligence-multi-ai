# Suite De Regressao — qa-bug-specialist

Este documento e a suite de regressao do `qa-bug-specialist`: um conjunto fixo de cenarios que cobre o comportamento observavel do agente, para que uma mudanca futura em `agents/qa-bug-specialist.md`, `profiles/<nome>/profile.json` ou `docs/BUG_AGENT_TEMPLATE.md` nao regrida um comportamento ja validado.

## Quando Rodar

* Sempre que `agents/qa-bug-specialist.md` for editado (ver `docs/MAINTENANCE.md`, "Agente com fonte canonica", passo "Validar com um Work Item real").
* Sempre que um Profile usado por este agente (ex. `profiles/apsen-arquitetura/profile.json`) ganhar ou perder um campo que o agente le (ex. `mapeamento_projeto_logico`, `acoes_por_evento`, `tipo_defeito`).
* Sempre que `docs/BUG_AGENT_TEMPLATE.md` mudar a forma de entrada esperada.

Nao e necessario rodar os onze cenarios a cada mudanca trivial — rode ao menos os cenarios cuja area foi afetada pela mudanca, e todos os onze antes de uma mudanca estrutural (ex.: mudar o Gate, mudar o mecanismo de Profile, mudar o template de Resultado Final).

## Como Rodar

Cada cenario e executado de ponta a ponta contra um workspace real (Azure DevOps + MCP configurado), no mesmo espirito de `docs/VALIDATION.md` — esta suite nao substitui `./scripts/check.sh` (que valida arquivo/renderizacao, nao comportamento do agente), e nenhum dos dois substitui o outro.

Notas de execucao:

* Prefira reutilizar um Item De Trabalho relacionado real e de baixo risco (ex. uma Feature ja usada em validacoes anteriores) em vez de criar dados fake no backlog do time.
* Identifique claramente qualquer Bug/Task criado apenas para validar esta suite (ex. prefixo `[Suite De Regressao]` no titulo, ou uma nota no proprio pedido), para permitir limpeza posterior sem confundir com defeitos reais.
* Cenarios que dependem de um Bug ja existente para o mesmo defeito (Cenario 2) podem reaproveitar o Bug criado no Cenario 1 na mesma rodada de validacao.
* Quando o resultado de um criterio depender de dado do workspace (ex. nome da sprint ativa, nome do responsavel), validar o valor contra o que o Azure DevOps realmente retorna naquele momento, nao contra um valor fixo neste documento.

## Cenarios

### Cenario 1 — Criacao De Bug Novo

**Objetivo:** confirmar que o agente cria um Bug completo quando nao ha duplicidade, sem pedir confirmacao.

**Entrada:** pedido no formato de `docs/BUG_AGENT_TEMPLATE.md`, com Projeto, Item De Trabalho Relacionado, Ambiente, Tipo De Teste e conteudo de defeito completo (cenario testado, passos, resultado atual, resultado esperado), para um defeito que nao tenha Bug equivalente no Azure DevOps.

**Comportamento Esperado:** o agente executa o Gate, resolve Projeto e demais convencoes do Profile, pesquisa duplicidade, nao encontra nenhuma, e cria o Bug automaticamente sem perguntar nada ao usuario alem do que nao for resolvivel automaticamente.

**Criterios De Aprovacao:**
* Um novo Work Item do tipo de Bug foi criado no Azure DevOps.
* Nenhuma pergunta de confirmacao foi feita ao usuario antes da criacao.
* `Resultado` no relatorio final e `Bug criado`.
* ID e URL do Bug foram retornados no relatorio final.

### Cenario 2 — Duplicidade Encontrada (Nao Criar Novo Bug)

**Objetivo:** confirmar que o agente nunca cria um segundo Bug para o mesmo defeito.

**Entrada:** o mesmo pedido do Cenario 1 (ou um pedido com titulo/erro/funcionalidade equivalente), executado depois que o Bug do Cenario 1 ja existe no Azure DevOps.

**Comportamento Esperado:** o agente pesquisa duplicidade por titulo, termos do erro, funcionalidade, massa de teste e Work Item relacionado, localiza o Bug do Cenario 1 como equivalente, e retorna o bloco de duplicidade em vez de criar um novo Bug.

**Criterios De Aprovacao:**
* Nenhum novo Work Item foi criado no Azure DevOps.
* O relatorio segue o formato "Bug existente localizado" (ID, Titulo, URL, Motivo da duplicidade).
* O ID retornado e o mesmo do Bug criado no Cenario 1.

### Cenario 3 — Criacao Automatica Da Task Filha

**Objetivo:** confirmar que a acao pos-criacao declarada no Profile (`acoes_por_evento.apos_criar_defeito`) cria a Task filha automaticamente, apenas quando um Bug novo e criado.

**Entrada:** o mesmo pedido do Cenario 1 (Bug novo criado nesta execucao).

**Comportamento Esperado:** apos criar o Bug, o agente le `acoes_por_evento.apos_criar_defeito` no Profile ativo, cria uma Task do tipo e titulo declarados, vinculada como filha do Bug, herdando Area e Iteration do Bug, com `Assigned To` resolvido conforme `atribuir_para` (`usuario_atual` resolve para a identidade autenticada da sessao).

**Criterios De Aprovacao:**
* Uma Task foi criada no Azure DevOps, vinculada como filha (`Child`) do Bug do Cenario 1.
* Area e Iteration da Task sao identicas as do Bug.
* `Assigned To` da Task esta preenchido conforme a politica declarada no Profile.
* A Task aparece no relatorio final, em `Acoes Pos-Criacao`, com ID, Titulo, Area, Iteration, Assigned To e URL.
* Repetir o Cenario 2 (duplicidade) nao cria uma segunda Task — a acao pos-criacao so roda quando um Bug novo e criado nesta execucao.

### Cenario 4 — Resolucao Automatica Do Projeto Logico

**Objetivo:** confirmar que um Projeto Logico que nao coincide com o nome fisico do Azure DevOps e resolvido automaticamente via `sistema_alm.mapeamento_projeto_logico` do Profile ativo, sem pedir confirmacao ao usuario.

**Entrada:** o mesmo pedido do Cenario 1, mas informando como Projeto um identificador logico mapeado no Profile (ex. `PPDS`, mapeado para `Arquitetura`) em vez do nome fisico direto.

**Comportamento Esperado:** o agente resolve o Projeto Logico contra o mapeamento antes de qualquer chamada ao Azure DevOps, usa o projeto fisico correspondente em toda a execucao, e nao pergunta ao usuario qual projeto usar.

**Criterios De Aprovacao:**
* Nenhuma pergunta sobre "qual projeto usar" foi feita ao usuario.
* O Bug (e a Feature relacionada) foram localizados/criados no projeto fisico correto.
* Caso o Projeto Logico informado nao tenha entrada no mapeamento nem coincida com um projeto fisico real, o agente interrompe e informa explicitamente que falta uma entrada em `mapeamento_projeto_logico` — este e o comportamento negativo esperado, tambem valido como aprovacao do cenario quando testado dessa forma.

### Cenario 5 — Resolucao Automatica Da Sprint Ativa

**Objetivo:** confirmar que o Bug (e a Task filha) recebem a sprint ativa real quando o Item De Trabalho relacionado nao tiver uma Iteration especifica definida.

**Entrada:** o mesmo pedido do Cenario 1, usando como Item De Trabalho Relacionado uma Feature cuja Iteration esteja na raiz do projeto (sem sprint especifica).

**Comportamento Esperado:** o agente detecta que a Iteration herdada da Feature nao e uma sprint especifica, consulta a sprint ativa do time, e usa esse valor como Iteration do Bug; a Task filha herda essa mesma Iteration do Bug.

**Criterios De Aprovacao:**
* A Iteration do Bug criado nao e a raiz do projeto quando existe uma sprint ativa real para o time.
* A Iteration do Bug corresponde a sprint ativa retornada pelo Azure DevOps naquele momento.
* A Iteration da Task filha (Cenario 3) e identica a do Bug.
* `Sprint ativa` aparece preenchida no relatorio final.

### Cenario 6 — Preenchimento Completo Da Descricao Do Bug

**Objetivo:** confirmar que o Bug tem uma descricao narrativa e padronizada, separada dos passos de reproducao, em vez de todo o conteudo concentrado em um unico campo.

**Entrada:** o mesmo pedido do Cenario 1, com cenario testado, pre-condicoes, passos para reproducao, resultado atual, resultado esperado e impacto todos informados.

**Comportamento Esperado:** o agente distribui o conteudo entre os campos reais do Bug — descricao do item com o resumo do problema/impacto/risco, e campo de passos de reproducao com cenario/pre-condicoes/passos/resultado atual/resultado esperado.

**Criterios De Aprovacao:**
* O campo de descricao do item do Bug criado nao esta vazio.
* O conteudo do campo de descricao e distinto do conteudo do campo de passos de reproducao (nao e uma copia).
* O campo de passos de reproducao contem cenario testado, pre-condicoes, passos, resultado atual e resultado esperado.

### Cenario 7 — Preenchimento Dos Campos Do Processo Quando Houver Informacao Suficiente

**Objetivo:** confirmar que campos do processo da equipe (obrigatorios ou nao) sao preenchidos quando ha informacao suficiente, e permanecem vazios — nunca inventados — quando nao ha.

**Entrada:** o mesmo pedido do Cenario 1, informando explicitamente Causa do problema e Impacto, mas sem informar dados de estimativa/priorizacao.

**Comportamento Esperado:** o agente consulta a lista completa de campos do tipo de Work Item, preenche Causa do problema (normalizada contra o Profile) e demais campos com base suficiente, e deixa em branco qualquer campo (ex. estimativa, priorizacao) para o qual nao havia informacao no pedido nem no contexto.

**Criterios De Aprovacao:**
* Causa do problema esta preenchida no Bug criado, com um valor aceito pelo Profile ativo.
* Nenhum campo sem base informativa no pedido recebeu um valor inventado.
* Todo campo do processo para o qual havia informacao suficiente no pedido esta preenchido no Bug criado.

### Cenario 8 — Anexacao Automatica De Evidencias

**Objetivo:** confirmar que evidencias fornecidas pelo usuario sao anexadas automaticamente ao Bug, sem pedido explicito de "anexar".

**Entrada:** o mesmo pedido do Cenario 1, com ao menos um artefato de evidencia (print, imagem, video, arquivo ou log) fornecido junto ao pedido.

**Comportamento Esperado:** o agente usa a Capacidade Anexar Evidencias como parte do proprio fluxo de criacao; artefatos HAR/log sao sanitizados antes do anexo; se o MCP nao suportar anexo para aquele tipo/tamanho, o agente informa isso explicitamente no relatorio final sem bloquear a criacao do Bug.

**Criterios De Aprovacao:**
* Se o MCP suportar o tipo de artefato: o Bug criado tem ao menos um anexo correspondente a evidencia fornecida, sem que o usuario tenha pedido isso separadamente.
* Se o MCP nao suportar: o relatorio final declara explicitamente que o anexo nao foi possivel, e a criacao do Bug nao foi bloqueada por isso.
* Rodar o mesmo cenario sem nenhuma evidencia fornecida deve produzir `Evidencias: Nao informado` no relatorio, sem bloquear a criacao — este e o caso de controle deste cenario.

### Cenario 9 — Vinculacao Correta A Feature

**Objetivo:** confirmar que o Bug e criado com o parent hierarquico correto quando um Item De Trabalho relacionado e informado.

**Entrada:** o mesmo pedido do Cenario 1, com Item De Trabalho Relacionado apontando para uma Feature valida e existente.

**Comportamento Esperado:** o agente valida a Feature no Azure DevOps, usa-a como parent hierarquico do Bug (nao apenas Related); se a criacao nao aceitar relacao no payload inicial, o agente cria o Bug primeiro e depois vincula o parent com link hierarquico.

**Criterios De Aprovacao:**
* O Bug criado tem a Feature informada como Parent (visivel em Related Work / hierarquia do Work Item).
* O relacionamento e do tipo hierarquico (parent/child), nao apenas Related.
* `Parent` aparece preenchido corretamente no relatorio final.

### Cenario 10 — Resumo Final Apresentado Ao Usuario

**Objetivo:** confirmar que o relatorio final e um resumo completo da execucao, nao apenas os dados do Bug isolado.

**Entrada:** qualquer cenario de criacao bem-sucedida desta suite (ex. Cenario 1, reaproveitando os resultados dos Cenarios 3, 5, 6, 7, 8 e 9 executados na mesma rodada).

**Comportamento Esperado:** o relatorio final segue a estrutura descrita em `agents/qa-bug-specialist.md` ("Resultado final"): bloco do Item De Trabalho Relacionado, duplicidade verificada de forma explicita, bloco completo do Bug, e Acoes Pos-Criacao com o mesmo nivel de detalhe do Bug.

**Criterios De Aprovacao:**
* O relatorio final contem, no minimo: Item De Trabalho Relacionado (ID/Titulo/URL), `Duplicidade verificada` explicito, todos os campos do bloco do Bug, e `Acoes Pos-Criacao` detalhada (nao uma linha unica de status) quando aplicavel.
* Nenhum bloco esperado ficou implicito ou omitido.
* Todas as URLs relevantes (Feature, Bug, Task) estao presentes no relatorio.

### Cenario 11 — Analise Enriquecida Antes Da Criacao

**Objetivo:** confirmar que a Analise Enriquecida (ver `agents/qa-bug-specialist.md`, "Analise Enriquecida Antes Da Criacao", DEC-0012) so aparece quando um Bug novo e criado, cada item reflete apenas evidencia real, `Bugs Semelhantes` e sempre reportado mesmo sem resultado, `Validacoes Recomendadas` nunca vira BDD/Gherkin, e `Confiabilidade Da Analise` nunca e um numero.

**Entrada:** dois pedidos na mesma rodada, ambos no formato de `docs/BUG_AGENT_TEMPLATE.md`, para o mesmo modulo/Feature:
1. Um pedido de Bug novo (Cenario 1) para um defeito com evidencia rica — Recorrencia informada, Impacto descrito, e ao menos um Bug ja existente e semelhante (mesmo modulo, titulo diferente) no Azure DevOps.
2. Um segundo pedido de Bug novo, para um defeito com evidencia minima (apenas os campos obrigatorios, sem Recorrencia/Impacto, sem nenhum Bug semelhante no Azure DevOps).

**Comportamento Esperado:** no pedido 1, o agente reporta `Analise Enriquecida` com a maioria dos itens preenchidos com base em evidencia real, localiza o Bug semelhante via `Buscar Defeito` (mesmo com titulo diferente), e classifica `Confiabilidade Da Analise` como `Alta` ou `Media` conforme a regra objetiva. No pedido 2, o agente reporta `Bugs Semelhantes: Nenhum Bug semelhante encontrado` de forma explicita, omite os demais itens sem evidencia (nunca inventa), e classifica `Confiabilidade Da Analise` como `Baixa`.

**Criterios De Aprovacao:**
* `Analise Enriquecida` nao aparece no resultado de um Bug localizado por duplicidade (reexecutar o Cenario 2 confirma isso).
* No pedido 1, `Bugs Semelhantes` lista o Bug equivalente encontrado, mesmo com titulo diferente do Bug sendo criado.
* No pedido 2, `Bugs Semelhantes` contem exatamente `Nenhum Bug semelhante encontrado`, nunca omitido nem em branco.
* Nenhum item da Analise Enriquecida contem valor inventado sem base no pedido ou no Azure DevOps — itens sem evidencia suficiente estao ausentes do relatorio, nunca preenchidos com suposicao.
* `Validacoes Recomendadas`, quando presente, e uma lista em linguagem natural — nunca formato Gherkin (`Dado`/`Quando`/`Entao`) nem qualquer estrutura de Cenario BDD.
* `Confiabilidade Da Analise` usa exatamente `Alta`, `Media` ou `Baixa` — nunca um numero, percentual ou probabilidade — e vem sempre acompanhada de `Base Da Confiabilidade` explicando a classificacao.
* A busca por Bugs Semelhantes no pedido 2 nao percorre Bugs de modulos/Features fora do contexto ja resolvido para aquele Bug (sem varredura ampla do projeto).

## Relacao Com Outros Documentos

* `docs/VALIDATION.md` continua sendo o guia geral de validacao do framework (setup, por cliente, fluxo `<Projeto> <WorkItemID>`); a secao "Validacao Do Agente De Bug" la referencia este documento como a suite de regressao especifica do `qa-bug-specialist`.
* `docs/BUG_AGENT_TEMPLATE.md` descreve a forma de entrada recomendada, usada em todos os cenarios acima.
* `docs/MAINTENANCE.md` referencia esta suite no fluxo de manutencao de agente com fonte canonica.
