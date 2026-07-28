# Contrato De Dominio

Este documento e o coracao tecnico do framework. Ele define o dominio do framework de forma totalmente agnostica — nenhum conceito aqui depende de um sistema de ALM especifico, de um cliente de IA especifico, ou de qualquer detalhe de implementacao.

Qualquer implementacao futura (qualquer sistema de ALM, qualquer cliente de IA) deve conseguir cumprir os contratos descritos aqui sem alterar um unico conceito deste documento. Se uma implementacao futura nao conseguir se encaixar aqui, o problema esta na implementacao, nao neste documento.

## Como Usar Este Documento

* Este documento tem autoridade logo abaixo de `docs/PRINCIPLES.md`. Ele operacionaliza, em especial, os Principios 3 (Agnosticismo De IA), 4 (Agnosticismo De ALM) e 5 (Contrato Estavel, Implementacao Substituivel).
* Qualquer adaptador, agente ou integracao futura mapeia seus detalhes concretos sobre os conceitos definidos aqui — nunca o contrario.
* Mudar este documento e um evento raro e deliberado. Toda mudanca e registrada em `docs/DECISIONS.md` antes de entrar em vigor.

## Conceitos De Dominio

### Projeto (Logico)

**Objetivo:** delimitar o contexto organizacional dentro do qual um Item De Trabalho existe, a partir do identificador informado pelo usuario — nunca do identificador interno de um Sistema ALM especifico.

**Responsabilidades:** definir a fronteira de busca e a fronteira de publicacao de um Documento.

**O que nao faz:** nao define regras funcionais dos Documentos gerados dentro dele; nao pressupoe que seu identificador e igual ao identificador do projeto ou container fisico usado por um Sistema ALM concreto (ex.: nome de projeto no Azure DevOps, projeto ou site no Jira) — essa coincidencia pode existir na pratica, mas nunca e assumida por este contrato.

**Relacoes:** contem um ou mais Item De Trabalho; delimita onde a Publicacao ocorre dentro do Repositorio De Documentacao; e resolvido para o projeto ou container fisico correspondente dentro de um Sistema ALM por uma implementacao concreta (Provider/Profile, ver `docs/CAPABILITY_CONTRACT.md` e `docs/MAINTENANCE.md`, secao "Profile") — a resolucao em si nao e responsabilidade deste conceito nem deste documento.

### Item De Trabalho

**Objetivo:** representar a unidade de necessidade, requisito ou defeito que motiva a documentacao de QA.

**Responsabilidades:** fornecer o contexto funcional minimo — titulo, descricao, criterio de aceite, estado e relacoes diretas relevantes — a partir do qual um Documento e gerado.

**O que nao faz:** nao gera documentacao por si so; nao garante que a informacao disponivel seja suficiente para uma Especificacao completa.

**Relacoes:** pertence a um Projeto; e a origem de um Documento; pode se relacionar a outros Item De Trabalho e a um Defeito.

### Sistema ALM (Conceito Abstrato)

**Objetivo:** representar a fonte de verdade externa onde um Item De Trabalho existe, onde um Documento pode ser publicado e onde um Defeito pode ser registrado.

**Responsabilidades:** prover acesso a um Item De Trabalho por identificador dentro de um Projeto; prover um Repositorio De Documentacao para Publicacao; prover um mecanismo de registro de Defeito.

Um Projeto (Logico) e realizado, dentro de um Sistema ALM, por um projeto ou container fisico especifico daquele sistema — o qual armazena seus Item De Trabalho e seu Repositorio De Documentacao. Essa realizacao concreta e resolvida pela implementacao (Provider/Profile), nunca assumida como identica ao identificador logico informado pelo usuario.

**O que nao faz:** nao participa da geracao de Especificacao, Cenario BDD, Risco ou Lacuna — isso e responsabilidade do processamento, nao da fonte de dados.

**Relacoes:** contem Item De Trabalho e Repositorio De Documentacao; e acessado em nome de um Agente.

### Cliente De IA (Conceito Abstrato)

**Objetivo:** representar a capacidade de interpretar instrucoes e executar o papel de um ou mais Agentes.

**Responsabilidades:** fornecer a capacidade de raciocinio e execucao necessaria para cumprir o Contrato De Processamento; manter equivalencia funcional com qualquer outro Cliente De IA que implemente o mesmo contrato.

**O que nao faz:** nao define nem redefine conceito de dominio; nao possui regra de negocio propria fora do que este documento estabelece.

**Relacoes:** executa um ou mais Agentes; interage com um Sistema ALM em nome de um Agente.

### Agente (Conceito De Dominio)

**Objetivo:** representar um papel funcional dentro do fluxo de documentacao de QA — nao uma ferramenta, e sim uma responsabilidade definida (orientar busca, gerar Especificacao, decidir Publicacao, tratar Defeito).

**Responsabilidades:** cumprir um papel especifico dentro do Contrato De Processamento, respeitando a fronteira de responsabilidade entre papeis.

**O que nao faz:** nao cria regra de negocio nova por conta propria; nao substitui nem contradiz este Contrato De Dominio.

**Relacoes:** atua sobre um Item De Trabalho dentro de um Projeto; produz ou manipula Documento; pode solicitar Publicacao; pode registrar Defeito; e executado por um Cliente De IA.

### Documento

**Objetivo:** representar o artefato de documentacao de QA gerado a partir de um Item De Trabalho.

**Responsabilidades:** consolidar Especificacao e, quando aplicavel, Cenario BDD, Risco e Lacuna, referentes a um unico Item De Trabalho.

**O que nao faz:** nao existe sem um Item De Trabalho de origem; nao substitui Validacao.

**Relacoes:** gerado a partir de um Item De Trabalho; contem Especificacao, Cenario BDD, Risco e Lacuna; passa pelo estado de Rascunho antes de, quando aplicavel, ser alvo de Publicacao.

### Rascunho

**Objetivo:** representar o estado intermediario de um Documento antes de sua Publicacao ser confirmada.

**Responsabilidades:** preservar o Documento de forma segura enquanto a Publicacao nao for bem-sucedida; permitir reuso quando o mesmo Item De Trabalho for processado novamente.

**O que nao faz:** nao e a versao final nem duravel do Documento; nao substitui o Repositorio De Documentacao.

**Relacoes:** precede a Publicacao de um Documento; e resolvido — arquivado ou preservado — conforme o resultado da Publicacao.

### Especificacao

**Objetivo:** descrever o entendimento funcional de um Item De Trabalho de forma estruturada e revisavel.

**Responsabilidades:** traduzir descricao, criterio de aceite e contexto do Item De Trabalho em entendimento funcional.

**O que nao faz:** nao substitui Cenario BDD nem Validacao; nao inventa comportamento sem base no Item De Trabalho.

**Relacoes:** e parte de um Documento; e a base para Cenario BDD, Risco e Lacuna.

### Cenario BDD

**Objetivo:** descrever comportamento esperado em formato estruturado (contexto, acao, resultado esperado).

**Responsabilidades:** derivar-se da Especificacao de forma rastreavel ate o Item De Trabalho de origem.

**O que nao faz:** nao executa nem automatiza teste — descreve comportamento esperado, nao o comprova.

**Relacoes:** deriva de uma Especificacao; e parte de um Documento; pode servir de base para uma Validacao futura.

### Risco

**Objetivo:** identificar uma condicao que pode comprometer a qualidade caso nao seja tratada.

**Responsabilidades:** existir apenas quando houver evidencia ou base concreta no Item De Trabalho ou no contexto disponivel.

**O que nao faz:** nao e suposicao sem base; nao e um Defeito — e uma condicao potencial, nao um problema confirmado.

**Relacoes:** e parte de um Documento; pode motivar a identificacao futura de um Defeito.

### Lacuna

**Objetivo:** identificar informacao ausente ou insuficiente no Item De Trabalho para uma documentacao completa.

**Responsabilidades:** apontar exatamente o que falta, sem preencher a ausencia com suposicao.

**O que nao faz:** nao inventa informacao ausente; nao e resolvida por adivinhacao.

**Relacoes:** e parte de um Documento; pode bloquear a completude de uma Especificacao ou de um Cenario BDD.

### Evidencia

**Objetivo:** representar material objetivo que sustenta uma Validacao ou um Defeito.

**Responsabilidades:** comprovar uma afirmacao com base em comportamento observado ou registro concreto.

**O que nao faz:** nao e opiniao nem suposicao. Esta Evidencia e um conceito de dominio, distinto do Principio Da Evidencia em `docs/PRINCIPLES.md`, que rege decisoes arquiteturais do proprio framework, nao itens de QA.

**Relacoes:** sustenta Defeito e Validacao; pode estar associada a um Item De Trabalho.

### Defeito

**Objetivo:** representar um comportamento observado que diverge do esperado.

**Responsabilidades:** existir apenas apos verificacao de duplicidade; carregar Evidencia quando disponivel.

**O que nao faz:** nao e criado sem checagem de duplicidade previa; nao e uma opiniao sobre qualidade — e um desvio verificavel.

**Relacoes:** e relacionado a um Item De Trabalho; pode originar um novo Item De Trabalho no Sistema ALM; e sustentado por Evidencia.

### Repositorio De Documentacao

**Objetivo:** representar o local duravel onde um Documento publicado passa a existir como fonte de consulta.

**Responsabilidades:** armazenar um Documento publicado de forma unica, sem duplicidade para o mesmo Item De Trabalho.

**O que nao faz:** nao gera conteudo — apenas armazena e organiza o que foi publicado.

**Relacoes:** recebe a Publicacao de um Documento; existe dentro do escopo de um Projeto; e mantido por um Sistema ALM.

### Publicacao

**Objetivo:** representar o ato de tornar um Documento parte do Repositorio De Documentacao.

**Responsabilidades:** criar ou atualizar — nunca duplicar — o registro correspondente a um Item De Trabalho.

**O que nao faz:** nao acontece sem antes verificar se ja existe um registro correspondente.

**Relacoes:** consome um Documento em estado de Rascunho; resulta em atualizacao do Repositorio De Documentacao; seu resultado determina o destino do Rascunho.

### Validacao

**Objetivo:** representar a confirmacao de que um resultado — Documento, Publicacao ou Defeito — corresponde a realidade observavel.

**Responsabilidades:** basear-se em Evidencia, nunca em suposicao (Principio Da Evidencia).

**O que nao faz:** nao e assumida por padrao — precisa ser verificada explicitamente.

**Relacoes:** aplica-se a Documento, Publicacao e Defeito; depende de Evidencia.

## Contratos Do Framework

### Contrato De Entrada

* Todo processamento comeca a partir da identificacao explicita de um Projeto e de um Item De Trabalho dentro dele.
* Nenhum processamento comeca sem essa dupla identificacao.
* A entrada nunca pressupoe escopo amplo — multiplos projetos, todos os itens de um Projeto, ou todo o ciclo de trabalho corrente. O escopo padrao e sempre o Item De Trabalho identificado e suas relacoes diretas.
* O Projeto desta entrada e sempre o Projeto (Logico): o identificador que o usuario informa, agnostico de Sistema ALM. Resolver esse identificador para o projeto ou container fisico correspondente dentro do Sistema ALM concreto em uso (ex.: nome de projeto no Azure DevOps, projeto ou site no Jira) e responsabilidade da implementacao (Provider/Profile) que cumpre este contrato — nunca uma equivalencia literal assumida por este documento ou por um Agente.

### Contexto De Execução

* Quando um Agente registra ou cria um recurso no Sistema ALM em nome do usuario (por exemplo, um Defeito), a entrada desse Agente se divide em duas categorias que nunca se misturam:
  * **Decisoes de processo do workspace** — regras de negocio da equipe, nunca do ALM em si (ex.: qual tipo de Work Item usar para um determinado cenario). Sao sempre fornecidas explicitamente pelo usuario antes do processamento comecar; o Agente nunca as infere a partir de contexto.
  * **Dados obtidos automaticamente** — tudo que for resolvivel via Capacidade sobre o Item De Trabalho relacionado (Area, Iteration, Parent e demais metadados). O Agente busca isso automaticamente e nunca solicita ao usuario algo ja resolvivel dessa forma.
* Um Agente nunca inverte essa fronteira: nao infere uma decisao de processo, nem solicita de novo um dado auto-descobrivel.
* O conjunto concreto de campos de cada categoria e especifico de cada Agente e de cada Profile — este contrato define a fronteira, nao uma lista fixa de campos.

### Gate De Preparação De Ambiente

* Antes de qualquer outro passo — antes de ler documentação adicional, consultar um Item De Trabalho, gerar Documento ou delegar para outro Agente — todo Agente executa este Gate como primeiro passo do seu proprio fluxo, independentemente de ter sido ativado diretamente pelo usuario ou por delegacao de outro Agente.
* O Gate valida, no minimo:
  * o Cliente De IA em uso esta identificado;
  * um Profile valido esta carregado, para qualquer Agente cujo comportamento dependa de Profile — ou sua ausencia e confirmada de forma explicita, nunca presumida;
  * as Capacidades obrigatorias para a operacao solicitada a este Agente estao disponiveis nesta sessao (ver `docs/CAPABILITY_CONTRACT.md`, "Regra De Degradacao Graciosa", na linha correspondente a este Agente);
  * as ferramentas concretas que implementam essas Capacidades respondem nesta sessao.
* Se qualquer item falhar, o Agente interrompe imediatamente: nao consulta o Item De Trabalho, nao inicia analise, nao gera Documento e nao delega para outro Agente. A unica excecao e o proprio diagnostico da falha, descrito abaixo — o Agente pode consultar `docs/SETUP.md` e `docs/TROUBLESHOOTING.md` deste framework exclusivamente para montar esse diagnostico, nunca para prosseguir com o pedido original.
* O diagnostico de falha nunca e uma falha generica nem uma tentativa silenciosa seguida de fallback — ele identifica a causa e orienta ativamente a correcao. No minimo, ele:
  1. identifica exatamente qual item do Gate falhou e a causa, nao apenas o sintoma, e confirma explicitamente que nenhum passo do pedido original foi executado por causa dessa falha;
  2. identifica qual Cliente De IA esta em uso nesta sessao — o proprio primeiro item do Gate ja exige essa identificacao — e direciona o restante do diagnostico especificamente para esse Cliente, nunca uma lista generica cobrindo todos os Clientes suportados;
  3. traduz a causa em passos ou comandos concretos, para esse Cliente, que preparam o item faltante, com base em `docs/SETUP.md` e `docs/TROUBLESHOOTING.md` — nunca inventados nem genericos;
  4. explica como confirmar, dentro da propria sessao do Cliente, que a preparacao funcionou;
  5. orienta explicitamente a repetir exatamente o mesmo pedido original assim que o ambiente estiver preparado, sem exigir que o usuario descubra sozinho os proximos passos.
* Quando o Cliente De IA em uso nao puder ser identificado com confianca suficiente para os itens 2 a 4 acima, o proprio diagnostico declara essa ambiguidade de forma explicita e pergunta qual Cliente esta em uso, em vez de adivinhar ou listar todos os Clientes de forma generica.
* Este Gate tem uma unica especificacao, a descrita nesta secao — incluindo o formato do diagnostico de falha acima. Cada Agente referencia este Gate por meio de uma instrucao curta e identica no seu proprio texto, apontando para esta secao como fonte de verdade — nunca reescrevendo ou parafraseando a lista de validacoes ou o formato do diagnostico acima. Uma mudanca no Gate exige editar apenas este documento, nunca cada Agente individualmente.
* Quando `qa-orchestrator` delega para um especialista, validar antecipadamente os requisitos desse especialista antes de delegar e uma otimizacao permitida, mas nunca dispensa a execucao deste mesmo Gate pelo proprio especialista ao iniciar — cada Agente valida o que a sua propria operacao exige, mesmo quando outro Agente ja validou antes.

### Contrato De Processamento

* A partir do Item De Trabalho identificado, o processamento reune o contexto minimo necessario — descricao, criterio de aceite, relacoes diretas relevantes — dentro do Projeto informado.
* O processamento produz um Documento contendo Especificacao e, quando o contexto sustentar, Cenario BDD, Risco e Lacuna.
* O Documento produzido passa pelo estado de Rascunho.
* Quando o fluxo exigir tornar o Documento duravel, o processamento verifica a existencia de um registro correspondente no Repositorio De Documentacao antes de decidir entre criar ou atualizar.
* Quando o processamento envolver um Defeito, a existencia de duplicidade e verificada antes do registro.

### Contrato De Saida

* Um Documento correspondente ao Item De Trabalho informado.
* Quando aplicavel, o resultado da Publicacao — criada, atualizada ou com falha — e uma referencia ao registro correspondente no Repositorio De Documentacao.
* O estado final do Rascunho: preservado se a Publicacao nao ocorreu ou falhou; resolvido somente apos Publicacao bem-sucedida.
* Quando aplicavel, um Defeito criado ou localizado, com referencia ao Item De Trabalho relacionado.
* O resultado e sempre explicito — sucesso, falha ou pendencia nunca ficam implicitos.

### Restricoes

* O escopo de busca e sempre focado no Item De Trabalho identificado e em suas relacoes diretas, nunca em um conjunto amplo de itens, salvo fallback controlado e explicito.
* Um Item De Trabalho corresponde a, no maximo, um Documento ativo por vez.
* Publicacao nunca cria um segundo registro para o mesmo Item De Trabalho quando um ja existe.
* Nenhuma informacao sensivel — credencial ou segredo de acesso — e exposta em Documento, Publicacao ou Evidencia.

### Invariantes

* Um Documento sempre tem exatamente um Item De Trabalho de origem.
* Um Rascunho nunca e descartado antes da Publicacao ser confirmada como bem-sucedida.
* Um Defeito nunca e registrado sem checagem de duplicidade previa.
* Risco e Lacuna so existem quando ha evidencia ou base concreta no Item De Trabalho — nunca por suposicao.
* Validacao sempre depende de Evidencia, nunca de opiniao isolada.

### Regras Que Nunca Podem Ser Quebradas

* Nenhum dado sensivel e exposto, sob nenhuma justificativa (espelha o Principio 8 — Seguranca Por Padrao — de `docs/PRINCIPLES.md`).
* Nenhuma Publicacao duplica um registro existente para o mesmo Item De Trabalho.
* Nenhum resultado de processamento e silencioso — sucesso, falha ou pendencia sao sempre reportados de forma explicita.
* Nenhum Cliente De IA ou Sistema ALM especifico e pressuposto por este contrato — qualquer implementacao futura deve conseguir cumpri-lo sem alterar os conceitos aqui definidos.

## Relacao Com Outros Documentos

* `docs/PRINCIPLES.md` tem autoridade maxima sobre este documento; este documento operacionaliza, em concreto, os Principios 3, 4 e 5.
* Mudanca neste documento e registrada em `docs/DECISIONS.md` antes de entrar em vigor.
* Qualquer documento operacional ou adaptador futuro (de Cliente De IA ou de Sistema ALM) deve satisfazer este contrato, nunca redefini-lo.
