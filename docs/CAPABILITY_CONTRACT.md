# Contrato De Capacidades

Este documento define o conjunto fechado de Capacidades — verbos abstratos do dominio de QA — que um Agente pode invocar, e que um Provider deve implementar para um Sistema ALM real.

Ele tem autoridade abaixo de `docs/DOMAIN_CONTRACT.md` (que define os substantivos do dominio — Item De Trabalho, Documento, Defeito, Evidencia etc.) e acima de qualquer implementacao concreta de Provider. Uma Capacidade nunca redefine um conceito de `docs/DOMAIN_CONTRACT.md`; ela apenas descreve uma operacao sobre um conceito ja existente ali.

Este documento nasceu de RFC-0001 (Arquitetura Multi-Provider E Multi-Workspace, Fase 2) e foi formalizado por `docs/DECISIONS.md`, DEC-0003.

## Como Usar Este Documento

* Um Agente so pode citar, no seu proprio texto, conceitos de `docs/DOMAIN_CONTRACT.md` e Capacidades listadas aqui — nunca o nome de um ALM, de uma tool MCP, de um mecanismo de transporte ou de um campo de sistema real.
* Toda ocorrencia de "Projeto" na "Entrada Minima" de uma Capacidade abaixo significa Projeto (Logico), conforme `docs/DOMAIN_CONTRACT.md` — o identificador agnostico de ALM informado pelo usuario, nunca o identificador fisico de projeto/container de um Sistema ALM especifico. Resolver o Projeto (Logico) para esse identificador fisico e responsabilidade interna do Provider que implementa a Capacidade; nenhuma Capacidade expõe essa resolucao ao Agente.
* Um Provider implementa Capacidades; `docs/MAINTENANCE.md` ("Provider") descreve o procedimento e a estrutura de arquivos esperada quando um Provider for de fato criado.
* Adicionar uma Capacidade nova e uma mudanca deliberada, mas nao tao rara quanto mudar `docs/DOMAIN_CONTRACT.md` — ela so deve acontecer quando um agente real precisar de uma operacao que nenhuma Capacidade existente cobre (Principio 1 de `docs/PRINCIPLES.md` — nao adicionar por antecipacao especulativa).
* Remover ou alterar o contrato de uma Capacidade existente e uma mudanca de contrato funcional e deve ser registrada em `docs/DECISIONS.md`, no mesmo espirito de qualquer mudanca de contrato descrita em `docs/DOMAIN_CONTRACT.md`.

## Capacidades

### Buscar Item De Trabalho

**Objetivo:** localizar um Item De Trabalho especifico e seu contexto minimo.

**Entrada Minima:** Projeto + identificador do Item De Trabalho.

**Saida Esperada:** titulo, descricao, criterio de aceite, estado, tipo e relacoes diretas relevantes do Item De Trabalho.

**Obrigatoriedade:** Obrigatoria — nenhum Provider e valido sem esta Capacidade. E o minimo necessario para o Contrato De Entrada de `docs/DOMAIN_CONTRACT.md` (`<Projeto> <WorkItemID>`) ser cumprido.

**Invariante herdado:** o escopo de busca e sempre focado no item identificado e em suas relacoes diretas, nunca em um conjunto amplo, salvo fallback controlado e explicito.

### Sincronizar Item De Trabalho

**Objetivo:** criar ou atualizar um Item De Trabalho estrutural (por exemplo, Task ou User Story) vinculado como filho de um Item De Trabalho pai ja identificado — distinto de Criar Defeito, que registra um Defeito verificado, nunca um item estrutural de processo. Diferente de um primitivo de criacao pura, esta Capacidade cobre o ciclo completo de sincronizacao: localizar, reutilizar sem alteracao, criar quando ausente, ou atualizar quando o conteudo controlado enviado divergir do existente — nunca apenas "criar se faltar".

**Entrada Minima:** Projeto + Item De Trabalho pai + tipo do Item De Trabalho a sincronizar + titulo +, quando aplicavel, conteudo controlado a manter sincronizado (delimitado por um marcador explicito).

**Saida Esperada:** Item De Trabalho criado ou atualizado, com identificador e URL navegavel, vinculado hierarquicamente ao pai informado.

**Obrigatoriedade:** Opcional, mas emparelhada com Buscar Item De Trabalho (ver "Regras De Emparelhamento") — nenhum Item De Trabalho estrutural e criado ou atualizado sem antes buscar, entre os itens filhos diretos do pai informado, se um equivalente ja existe.

**Invariante herdado:** nenhum invariante de dominio dedicado hoje; decorrem desta Capacidade, pelo mesmo principio geral de nao-duplicidade ja aplicado a Publicacao e a Criar Defeito em `docs/DOMAIN_CONTRACT.md`: (1) nunca criar um Item De Trabalho estrutural equivalente (mesmo tipo e mesmo titulo normalizado, sob o mesmo pai) quando um ja existir — atualiza-lo em vez disso; (2) quando o Item De Trabalho ja existir e carregar conteudo fora do marcador de conteudo controlado, esse conteudo nunca e sobrescrito — apenas o conteudo dentro do marcador e substituido, e quando o marcador ainda nao existir, o conteudo controlado e inserido preservando integralmente o conteudo anterior. O que constitui "conteudo controlado" para cada uso desta Capacidade e definido pelo Agente que a invoca (hoje, `qa-orchestrator`), nunca pela Capacidade em si.

### Buscar Documento

**Objetivo:** localizar um Documento ja existente no Repositorio De Documentacao, ou confirmar sua ausencia.

**Entrada Minima:** Projeto + referencia (Item De Trabalho, titulo ou caminho).

**Saida Esperada:** Documento existente localizado, ou ausencia confirmada de forma explicita.

**Obrigatoriedade:** Opcional, mas emparelhada com Publicar Documento (ver "Regras De Emparelhamento").

**Invariante herdado:** Publicacao nunca duplica um registro existente para o mesmo Item De Trabalho — esta Capacidade e o que sustenta essa checagem previa.

### Publicar Documento

**Objetivo:** tornar um Documento em Rascunho parte do Repositorio De Documentacao.

**Entrada Minima:** Documento em Rascunho + destino resolvido.

**Saida Esperada:** Documento criado ou atualizado, mais uma referencia ao registro correspondente (ex.: URL).

**Obrigatoriedade:** Opcional, mas emparelhada com Buscar Documento.

**Invariante herdado:** cria ou atualiza, nunca duplica; o resultado (sucesso, falha ou pendencia) e sempre explicito, nunca implicito.

### Criar Defeito

**Objetivo:** registrar um Defeito verificado no Sistema ALM.

**Entrada Minima:** descricao minima do Defeito (cenario testado, resultado atual, resultado esperado) + Projeto.

**Saida Esperada:** Defeito criado, com referencia ao Item De Trabalho relacionado quando houver.

**Obrigatoriedade:** Opcional, mas emparelhada com Buscar Defeito.

**Invariante herdado:** um Defeito nunca e criado sem checagem de duplicidade previa.

### Buscar Defeito

**Objetivo:** localizar Defeito(s) equivalente(s) a um criterio de busca, para checagem de duplicidade ou consulta direta.

**Entrada Minima:** criterio de busca (titulo, termo do erro, Item De Trabalho relacionado, massa de teste).

**Saida Esperada:** Defeito(s) equivalente(s) encontrado(s), ou ausencia confirmada.

**Obrigatoriedade:** Opcional, mas emparelhada com Criar Defeito.

**Invariante herdado:** sustenta a checagem de duplicidade exigida antes de Criar Defeito.

### Obter Sprint

**Objetivo:** identificar a iteracao/sprint ativa no momento da chamada, quando o ALM tiver esse conceito.

**Entrada Minima:** Projeto + time/equipe, quando aplicavel.

**Saida Esperada:** iteracao/sprint ativa.

**Obrigatoriedade:** Opcional e independente. Um Provider pode declarar que o ALM que ele adapta nao tem conceito de iteracao — nesse caso, agentes que dependeriam dela (ex.: preencher Iteration automaticamente ao criar um Defeito) tratam a ausencia de forma explicita, nunca inventando um valor.

**Invariante herdado:** nenhum especifico — apoia o preenchimento automatico descrito em `agents/qa-bug-specialist.md` hoje, sem ser, por si so, parte de um invariante de `docs/DOMAIN_CONTRACT.md`.

### Obter Usuario

**Objetivo:** resolver um nome, identificador ou criterio de busca para uma identidade concreta no ALM.

**Entrada Minima:** nome, identificador ou criterio de busca.

**Saida Esperada:** identidade resolvida de forma unica, ou ambiguidade explicita (nunca uma escolha silenciosa entre candidatos).

**Obrigatoriedade:** Opcional e independente. Suporta tanto a atribuicao automatica de responsavel (ver `docs/MAINTENANCE.md`, secao "Profile") quanto qualquer Validacao que dependa de identidade.

**Invariante herdado:** nenhum invariante de dominio dedicado; a regra de "perguntar antes de criar" em caso de ambiguidade, hoje descrita em `agents/qa-bug-specialist.md`, decorre desta Capacidade.

### Anexar Evidencias

**Objetivo:** associar um ou mais artefatos de Evidencia a um Defeito ou Documento de destino.

**Entrada Minima:** Defeito ou Documento de destino + artefato(s), com `tipo` conhecido (imagem, video, HAR, log, JSON ou texto).

**Saida Esperada:** Evidencia associada ao destino, ou "nao suportado" de forma explicita quando o Provider nao implementar esta Capacidade ou nao suportar aquele tipo/tamanho de artefato.

**Obrigatoriedade:** Opcional e independente.

**Invariante herdado:** nenhuma informacao sensivel e exposta em Documento, Publicacao ou Evidencia, sob nenhuma justificativa (Principio 8 de `docs/PRINCIPLES.md`; ver "Regra De Sanitizacao De Evidencias" abaixo).

## Regras De Emparelhamento

`Buscar Documento`/`Publicar Documento`, `Buscar Defeito`/`Criar Defeito` e `Buscar Item De Trabalho`/`Sincronizar Item De Trabalho` nao podem ser implementadas isoladamente. Os invariantes correspondentes em `docs/DOMAIN_CONTRACT.md` ja exigem a checagem previa ("Publicacao nunca duplica um registro existente", "um Defeito nunca e registrado sem checagem de duplicidade previa") — um Provider que implementasse apenas a metade "criar/publicar" de um par estaria, por construcao, violando esse invariante. O mesmo principio se aplica a `Sincronizar Item De Trabalho`: nenhum Item De Trabalho estrutural e criado ou atualizado sem antes buscar, entre os filhos diretos do pai informado, se um equivalente ja existe. A validacao de um Provider (ver `docs/MAINTENANCE.md`, secao "Provider") trata cada par como uma unica unidade indivisivel: ou as duas Capacidades do par existem, ou nenhuma existe.

## Regra De Degradacao Graciosa

Um Provider que implementa apenas a Capacidade obrigatoria (`Buscar Item De Trabalho`) e um Provider valido — ele simplesmente habilita menos agentes. Esta tabela e tambem a referencia usada pelo Gate De Preparacao De Ambiente (`docs/DOMAIN_CONTRACT.md`) para decidir, por Agente, quais Capacidades sao obrigatorias antes de qualquer outro passo. Tabela de dependencia por agente, no escopo atual conhecido:

| Agente | Capacidades Necessarias |
| --- | --- |
| `qa-bdd-specialist` | Buscar Item De Trabalho |
| `qa-orchestrator` | Buscar Item De Trabalho (a Publicacao, quando pedida no fluxo, depende adicionalmente do par de Documento; a Estrutura QA Minima Da Feature, quando aplicavel, depende adicionalmente do par Buscar Item De Trabalho/Sincronizar Item De Trabalho) |
| `qa-wiki-specialist` | Buscar Item De Trabalho + par Buscar Documento/Publicar Documento |
| `qa-bug-specialist` | Buscar Item De Trabalho + par Buscar Defeito/Criar Defeito; beneficia-se de Obter Sprint, Obter Usuario e Anexar Evidencias sem exigi-los |

Quando um agente for solicitado sobre um Provider que nao implementa a Capacidade necessaria, a resposta esperada e explicita ("este Provider nao implementa Criar Defeito/Buscar Defeito"), nunca uma tentativa silenciosa ou um erro generico.

## Regra De Sanitizacao De Evidencias

HAR e arquivos de log frequentemente carregam tokens de sessao, cookies de autenticacao ou headers sensiveis. Por isso, todo Provider que implementar `Anexar Evidencias` deve sanitizar artefatos dos tipos `HAR` e `log` antes de anexa-los — esta e uma pre-condicao do contrato da Capacidade, nao uma opcao de implementacao. Um Provider que nao consiga garantir essa sanitizacao deve declarar `Anexar Evidencias` como nao suportada para esses tipos, em vez de anexar sem tratamento.

## Relacao Com Outros Documentos

* `docs/PRINCIPLES.md` tem autoridade maxima; este documento opera, em particular, dentro dos Principios 1, 3, 4, 8 e 9.
* `docs/DOMAIN_CONTRACT.md` tem autoridade sobre este documento — toda Capacidade aqui descrita opera sobre um conceito ja definido la, nunca o contrario.
* `docs/MAINTENANCE.md` descreve, nas secoes "Provider" e "Profile", como uma Capacidade e de fato implementada e configurada.
* Mudanca neste documento e registrada em `docs/DECISIONS.md`.
