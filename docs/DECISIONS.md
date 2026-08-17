# Decisoes Do Framework

Este documento e o unico registro oficial de decisoes arquiteturais, tecnologicas e de processo do framework, ate que exista necessidade real de evoluir para um modelo de ADR completo (pasta, template, numeracao por arquivo).

Ele existe para que decisoes relevantes fiquem registradas de forma verificavel, em vez de dependerem de memoria individual, mensagem de chat ou arqueologia de `git log`. Ver `docs/PRINCIPLES.md`, Principio 7 (Sustentabilidade De Longo Prazo).

## Objetivo Deste Documento

* Preservar o "porque" por tras de decisoes que moldam o framework, para que um mantenedor futuro nao precise redescobrir ou re-debater o que ja foi decidido.
* Dar suporte concreto ao Principio Da Evidencia: toda decisao relevante registrada aqui expoe sua justificativa e, quando aplicavel, a evidencia que a sustenta.
* Funcionar como log unico e append-only enquanto o volume de decisoes nao justificar um modelo mais elaborado.

## Quando Registrar Uma Decisao

Registre uma decisao quando ela:

* alterar o contrato funcional publico do framework (entrada, saidas esperadas, comportamento observavel pelo usuario);
* adotar, rejeitar ou substituir uma tecnologia, dependencia ou arquitetura no nucleo do framework;
* afetar agnosticismo de IA ou de ALM (Principios 3 e 4) — por exemplo, adicionar suporte a um novo cliente de IA ou a um novo ALM;
* mudar processo de trabalho de forma duradoura (estrategia de branch, versionamento, forma de aprovar mudanca);
* alterar, substituir ou obsoletar uma decisao existente;
* alterar o proprio `docs/PRINCIPLES.md`.

Regra simples: se um mantenedor daqui a um ano precisaria saber "por que fizemos assim e nao de outro jeito" para nao desfazer a decisao por engano, ela deveria estar aqui.

## Quando NAO Registrar Uma Decisao

Nao registre decisao para:

* correcao de bug, erro de digitacao, ajuste de redacao ou formatacao em qualquer documento;
* mudanca de script ou agente que nao altera o contrato funcional nem o comportamento observado pelo usuario;
* escolha operacional do dia a dia, reversivel sem custo (ordem de passos, nome de variavel local, detalhe de log);
* experimento ou PoC ainda em avaliacao — pelo Principio Da Evidencia, ele so vira decisao quando for adotado ou explicitamente descartado com uma razao que valha preservar;
* qualquer coisa ja coberta, sem ambiguidade, por um principio em `docs/PRINCIPLES.md`.

Na duvida, prefira nao registrar. Este documento tambem esta sujeito ao Principio 1 (Simplicidade Antes De Tudo) — um log inflado de decisoes triviais e tao ruim quanto a ausencia de log.

## Formato Padrao De Uma Decisao

Toda decisao usa o modelo abaixo, com este conjunto minimo de campos:

```text
### DEC-000N - Titulo curto da decisao

* Data: AAAA-MM-DD
* Status: Ativa | Substituida por DEC-000X | Obsoleta

Contexto:
O que estava acontecendo, ou qual problema/necessidade motivou a decisao.

Decisao:
O que foi decidido, de forma direta e verificavel.

Justificativa / Evidencia:
Por que essa opcao foi escolhida. Quando existir PoC, teste comparativo ou dado
observavel (Principio Da Evidencia), descreva-o aqui. Quando a decisao for de
processo/organizacional e nao houver PoC aplicavel, declare isso explicitamente
em vez de omitir o campo.

Alternativas consideradas:
Opcoes descartadas e o motivo, quando relevante.

Consequencias:
O que essa decisao implica na pratica, daqui para frente.

Principios relacionados:
Quais principios de docs/PRINCIPLES.md essa decisao aplica, testa ou depende.
```

IDs sao sequenciais (`DEC-0001`, `DEC-0002`, ...) e nunca sao reaproveitados, mesmo que uma decisao seja substituida ou marcada obsoleta.

## Criterios Minimos Para Aprovar Uma Decisao

Quem mantem o framework aprova o registro de uma decisao, na mesma linha descrita em `docs/PRINCIPLES.md` ("Como Este Documento Evolui").

Uma decisao so entra neste documento se atender a todos os criterios abaixo:

* tem contexto claro — quem ler daqui a um ano entende por que a questao surgiu;
* tem justificativa tecnica explicita, nao apenas preferencia pessoal ou tendencia (Principio Da Evidencia);
* declara evidencia observavel quando ela existir ou for viavel produzir (PoC, teste comparativo, dado de uso real); quando nao for viavel, declara isso em vez de deixar o campo implicito;
* nao contradiz nenhum principio ativo em `docs/PRINCIPLES.md`, a menos que a propria decisao seja uma proposta explicita de alterar aquele principio;
* e redigida com o resultado ja decidido — este documento registra decisoes tomadas, nao propostas em aberto.

## Como Alterar Uma Decisao Existente

Uma decisao registrada nao e reescrita para parecer que sempre disse outra coisa. Correcoes sao permitidas apenas para:

* corrigir erro factual pontual (data errada, link quebrado, typo);
* adicionar uma nota de esclarecimento, sem mudar o sentido da decisao original.

Nesses casos, adicione uma linha `Atualizado em: AAAA-MM-DD` logo abaixo do `Status`, com uma frase curta explicando o ajuste. O conteudo de Contexto/Decisao original permanece legivel.

Qualquer mudanca que altere o sentido, o escopo ou o resultado da decisao original nao e uma alteracao — e uma substituicao (veja abaixo).

## Como Substituir Uma Decisao

Quando uma decisao anterior deixa de valer porque uma nova decisao a superou:

1. Crie uma nova entrada com o proximo ID sequencial, seguindo o formato padrao.
2. No campo `Consequencias` ou `Contexto` da nova entrada, referencie explicitamente qual decisao ela substitui (`Substitui DEC-000X`).
3. Volte a entrada antiga e mude apenas o campo `Status` para `Substituida por DEC-000Y`. O restante da entrada antiga permanece inalterado, como registro historico.

Decisoes antigas nunca sao apagadas. O valor deste documento esta em preservar o historico completo, nao em manter apenas o estado atual.

## Como Marcar Uma Decisao Como Obsoleta

Quando uma decisao deixa de fazer sentido (por exemplo, porque o componente a que ela se referia foi removido) sem que uma nova decisao a tenha substituido diretamente:

1. Mude o campo `Status` da entrada para `Obsoleta`.
2. Adicione uma linha curta explicando por que ela deixou de se aplicar.
3. Nao remova a entrada do documento.

## Relacao Com PRINCIPLES.md

`docs/PRINCIPLES.md` tem autoridade maxima; este documento nunca a contradiz. A relacao e:

* toda decisao aqui deve ser compativel com os principios ativos no momento em que foi tomada;
* uma decisao que proponha mudar um principio e valida somente como parte do processo descrito em `docs/PRINCIPLES.md` ("Como Este Documento Evolui"), e essa mudanca tambem gera uma entrada aqui;
* se uma decisao registrada aqui e um principio entrarem em conflito no futuro, o principio prevalece, e a decisao correspondente deve ser revisada ou marcada obsoleta.

## Relacao Futura Com Um Possivel ADR

Este arquivo unico e deliberadamente mais simples que um modelo de ADR completo (pasta `decisions/`, template proprio, um arquivo por decisao). Ele deve evoluir para esse modelo somente quando isso resolver um problema real ja sentido — por exemplo, o arquivo ficar longo demais para navegar, ou decisoes precisarem de status/relacionamento mais rico do que uma tabela markdown suporta.

Essa propria evolucao, quando acontecer, segue o Principio Da Evidencia: exige justificativa tecnica e e registrada como uma nova decisao aqui antes de ser executada. Ate la, manter um unico arquivo e a opcao mais simples que sustenta a necessidade atual (Principio 1).

## Decisoes Registradas

### DEC-0001 - Criacao da branch `next` e adocao de evolucao incremental do framework

* Data: 2026-07-16
* Status: Ativa

Contexto:
O framework precisa evoluir para sua proxima geracao — fundacao documental, arquitetura, governanca, agnosticismo de IA e de ALM — sem colocar em risco quem ja depende da versao atual em uso diario.

Decisao:
Criar a branch `next`, dedicada a essa evolucao. A branch `main` permanece a versao estavel do framework, recebendo apenas manutencao normal. Toda evolucao estrutural — documentacao, arquitetura, contrato funcional — acontece de forma incremental dentro de `next`, seguindo os principios registrados em `docs/PRINCIPLES.md`, e so e incorporada a `main` quando estiver pronta e validada.

Justificativa / Evidencia:
Decisao de processo e organizacional, nao tecnologica; nao ha PoC aplicavel. A justificativa e de risco: manter `main` estavel preserva quem usa o framework hoje sem interrupcao, enquanto `next` permite experimentar e evoluir a estrutura com liberdade, podendo ser pausada, ajustada ou revertida sem impacto em `main`.

Alternativas consideradas:
* Evoluir diretamente em `main` — descartado: exporia quem usa o framework hoje a mudancas estruturais ainda nao validadas.
* Criar um repositorio novo para a proxima geracao — descartado: fragmentaria o historico e duplicaria manutencao de scripts, agentes e configuracao MCP ja existentes.

Consequencias:
* `main` continua recebendo apenas correcoes e manutencao pontual.
* Toda mudanca estrutural relevante (novos documentos de fundacao, contrato de dominio, arquitetura, governanca) acontece em `next`.
* Incorporar `next` em `main` exige validacao explicita antes de acontecer, nao e automatico.

Principios relacionados:
Principio 2 (Evolucao Incremental), Principio 7 (Sustentabilidade De Longo Prazo), Principio 9 (Principio Da Evidencia).

### DEC-0002 - Adocao de GitHub Actions para rodar `scripts/check.sh` e `scripts/check.ps1` automaticamente

* Data: 2026-07-20
* Status: Ativa

Contexto:
Uma revisao arquitetural do framework identificou que `./scripts/check.sh` (sintaxe dos scripts, renderizacao MCP, paridade de agentes) so era executado manualmente, quando um mantenedor lembrava de rodar. Isso permitiu que dois agentes (`qa-orchestrator` e `qa-bdd-specialist`, ainda mantidos manualmente nos tres formatos por nao terem fonte canonica em `agents/`) divergissem de forma real e ja observavel entre Copilot e os demais clientes, sem que nenhuma validacao acusasse o problema — o check existente so cobre os agentes que ja tem fonte canonica. Nao havia, ate esta decisao, nenhum workflow em `.github/workflows/`.

Decisao:
Adicionar `.github/workflows/check.yml`, rodando em `push` e `pull_request`, com dois jobs: um em `ubuntu-latest` executando `./scripts/check.sh`, outro em `windows-latest` executando `.\scripts\check.ps1`. Nenhum dos dois scripts depende de `.env` ou de segredo, entao o workflow roda sem configurar PAT ou Azure DevOps.

Justificativa / Evidencia:
Decisao de processo/ferramental, nao ha PoC aplicavel alem do proprio funcionamento do workflow. A motivacao e risco observado: a paridade entre clientes (Principio 3) so estava sendo validada quando um humano lembrava de rodar o check localmente, e apenas para os agentes ja migrados para fonte canonica. Automatizar a execucao em CI aplica o Principio 6 (Documentacao Viva: "validacao automatizada e preferida a confianca manual sempre que for viavel") ao proprio processo de manutencao dos agentes, sem alterar o contrato funcional do framework nem o comportamento observado pelo usuario final.

Alternativas consideradas:
* Manter o check apenas manual/local — descartado: e exatamente a lacuna que permitiu a divergencia ja observada entre clientes passar despercebida.
* Rodar `check.ps1` tambem via emulacao em `ubuntu-latest` — descartado: `windows-latest` ja esta disponivel nativamente no GitHub Actions e valida o comportamento real do PowerShell, sem necessidade de camada de compatibilidade.

Consequencias:
* Toda mudanca em agentes, scripts ou templates MCP passa a ser validada automaticamente em `push` e `pull_request`, nos dois sistemas operacionais suportados.
* Isso nao substitui validacao com Work Item real (`docs/VALIDATION.md`) quando houver mudanca de comportamento.
* Fechar a divergencia ja existente entre `qa-orchestrator`/`qa-bdd-specialist` nos tres clientes continua pendente como melhoria separada (ver `docs/AGENT_PARITY.md`), pois exige decidir qual comportamento e o correto antes de regenerar os arquivos — nao e coberto por esta decisao.

Principios relacionados:
Principio 3 (Agnosticismo De IA), Principio 6 (Documentacao Viva), Principio 7 (Sustentabilidade De Longo Prazo).

### DEC-0003 - Adocao da arquitetura multi-provider e multi-workspace (Fase 2) e criacao do Contrato De Capacidades

* Data: 2026-07-21
* Status: Ativa

Contexto:
`docs/DOMAIN_CONTRACT.md` ja declara Sistema ALM e Cliente De IA como conceitos abstratos (Principios 3 e 4), mas nao existia nenhum mecanismo concreto que tornasse esse agnosticismo operacional: todo vocabulario, mapeamento de campo e regra de plataforma estao hoje hardcoded em Azure DevOps/Apsen dentro dos agentes (`agents/qa-bug-specialist.md` contem literalmente `Custom.Causadoproblema`, `"Bug em producao"` e `"Erros de Codificacao"`, especificos do projeto `Arquitetura` da Apsen). `docs/AGENT_PARITY.md` ja registra divergencia real entre clientes para dois dos quatro agentes. A Fase 2 (branch `feature/phase-2-generalization`) propos uma arquitetura para resolver isso, discutida e refinada em tres rodadas de revisao na RFC-0001 antes de chegar a este registro.

Decisao:
Adotar a arquitetura descrita em RFC-0001 (v3) como direcao da Fase 2:

* Agentes passam a depender apenas de conceitos de `docs/DOMAIN_CONTRACT.md` e de um Contrato De Capacidades novo (`docs/CAPABILITY_CONTRACT.md`) — um conjunto fechado de oito verbos abstratos (Buscar Item De Trabalho, Buscar Documento, Publicar Documento, Criar Defeito, Buscar Defeito, Obter Sprint, Obter Usuario, Anexar Evidencias), com regras de obrigatoriedade, emparelhamento e degradacao graciosa.
* Um Provider implementa Capacidades para um tipo de Sistema ALM real, sem embutir mecanismo de comunicacao (MCP hoje) no seu texto semantico.
* Um Profile representa a configuracao concreta de um workspace/organizacao especifico sobre um Provider.
* Nenhum conceito novo e adicionado a `docs/DOMAIN_CONTRACT.md` nesta fase — "Workspace" foi avaliado e descartado por duplicar o que Sistema ALM ja cobre no nivel de instancia.
* Nenhuma camada arquitetural nova e criada para mecanismo de comunicacao ("Conector") — o desacoplamento pedido e alcancado por convencao de arquivo dentro da pasta do Provider, nao por uma camada propria.
* `docs/CAPABILITY_CONTRACT.md` e o unico documento de contrato novo; os procedimentos de "como adicionar um Provider" e "como adicionar um Profile" vivem como novas secoes em `docs/MAINTENANCE.md`, nao como contratos separados.

Esta decisao cobre apenas a Etapa 1 do plano de migracao (registro da decisao + criacao dos contratos, sem migrar agentes, sem alterar renderizacao, sem alterar comportamento existente). Migracao de agentes, extracao de Azure DevOps/Apsen para `providers/` e `profiles/`, extensao de renderizacao e implementacao de um segundo Provider permanecem pendentes, cada uma exigindo validacao propria antes de avancar (ver RFC-0001, plano de migracao).

Justificativa / Evidencia:
RFC-0001 passou por tres rodadas de revisao antes desta aprovacao. A primeira rodada estabeleceu a direcao geral (Provider/Profile). A segunda decompos Provider entre mecanismo e adaptador e formalizou Capacidades, Evidencias e atribuicao automatica de responsavel como responsabilidades proprias. A terceira rodada foi uma revisao critica dedicada: verificou sobreposicao de responsabilidade entre as camadas propostas, testou o grafo de dependencia por circularidade (confirmado aciclico), e removeu duas adicoes que nao se sustentavam contra o Principio 1 (Workspace como conceito de dominio; Conector como camada arquitetural propria) — reduzindo de quatro documentos de contrato novos propostos para um. Evidencia de que a validacao atual (`scripts/render-agents.mjs --check-all`) nao pega vazamento de plataforma: `agents/qa-bug-specialist.md` ja contem campos e valores especificos da Apsen e passa no check hoje, motivando a regra de "vazamento de vocabulario" prevista para etapas futuras do plano de migracao.

Alternativas consideradas:
* Manter Workspace como conceito de dominio novo — descartado: nao introduzia nenhum invariante ou contrato proprio alem do que Sistema ALM ja cobre lido no nivel de instancia.
* Manter Conector como camada arquitetural propria com diretorio `connectors/<tipo>/` — descartado: constroi para um mecanismo hipotetico quando hoje existe apenas MCP; o custo de adiar essa camada ate um segundo mecanismo real aparecer e baixo (troca de um arquivo, nao reestruturacao).
* Tres documentos de contrato novos (Capability + Provider + Profile) — descartado a favor de um documento de contrato (Capability) mais duas secoes procedimentais em `docs/MAINTENANCE.md`, ja que os dois ultimos descreviam procedimento de manutencao, nao fundacao de dominio.

Consequencias:
* `docs/CAPABILITY_CONTRACT.md` passa a ter autoridade entre `docs/DOMAIN_CONTRACT.md` e qualquer implementacao futura de Provider.
* `docs/MAINTENANCE.md` ganha duas secoes procedimentais (Provider, Profile) marcadas como planejadas ate a extracao real acontecer (Etapa 3 do plano de migracao).
* Nenhum agente, script de renderizacao, config MCP ou comportamento observavel pelo usuario muda nesta etapa — o fluxo `<Projeto> <WorkItemID>` permanece identico.
* `docs/AGENT_PARITY.md` continua registrando a divergencia existente ate a Etapa 2 do plano de migracao (fechar a fonte canonica de `qa-orchestrator`/`qa-bdd-specialist`) ser executada.

Principios relacionados:
Principio 1 (Simplicidade Antes De Tudo), Principio 2 (Evolucao Incremental), Principio 3 (Agnosticismo De IA), Principio 4 (Agnosticismo De ALM), Principio 5 (Contrato Estavel, Implementacao Substituivel), Principio 9 (Principio Da Evidencia).

### DEC-0004 - Template estruturado de entrada e primeiro Profile real (`profiles/apsen-arquitetura/profile.json`) para `qa-bug-specialist`

* Data: 2026-07-21
* Status: Ativa

Contexto:
Uma execucao real do `qa-bug-specialist` criou um Bug do tipo `Bug` em vez de `Bug em produção`, sem herdar a Iteration da Feature relacionada, divergindo de execucoes anteriores que produziram corretamente os Bugs `14312` e `14313`. Investigacao no historico de `agents/qa-bug-specialist.md` (e do arquivo equivalente antes de existir fonte canonica) mostrou que o texto que rege as duas decisoes — que tipo de Work Item usar e de onde herdar a Iteration — nao mudou desde o commit `b4e785e` (2026-06-30): nao houve regressao de codigo. A causa raiz e que ambas as decisoes sempre foram inferencia condicional do modelo a partir de contexto ("usar `Bug em produção` quando o defeito for de producao"; "usar a sprint ativa do time"), e nao entrada explicita — uma fonte estrutural de nao-determinismo entre execucoes. `docs/DECISIONS.md` (DEC-0003) e `docs/MAINTENANCE.md` ja apontavam esses valores (`Custom.Causadoproblema`, `"Bug em produção"`, `"Erros de Codificação"`) como vazamento de vocabulario especifico da Apsen dentro de um agente que deveria ser generico, com a extracao para Profile prevista para a Etapa 3 do plano de migracao, mas ainda sem instancia real nem mecanismo de carregamento definido.

Decisao:
* Adotar um template de entrada estruturado para `qa-bug-specialist` (Projeto, Item De Trabalho Relacionado, Ambiente, Tipo De Teste, Tipo Do Defeito, Observacoes), onde `Tipo Do Defeito` e `Ambiente` sao sempre fornecidos explicitamente pelo QA. O agente normaliza esses valores (grafia/acentuacao/caixa) mas nunca os infere a partir de contexto.
* Herdar Area e Iteration automaticamente do Item De Trabalho relacionado informado, usando a sprint ativa do time apenas como fallback quando esse item nao tiver Iteration definida — eliminando a ambiguidade anterior entre "herdar da Feature" e "usar sprint ativa do time".
* Criar o primeiro Profile real do framework, `profiles/apsen-arquitetura/profile.json`, com os valores e aliases antes hardcoded em `agents/qa-bug-specialist.md` (tipos de defeito aceitos, causas aceitas, nomes de campo customizado, politica de responsavel, politica de evidencias).
* O mecanismo de carregamento e leitura em runtime: o proprio texto do agente instrui a ler o Profile ativo no inicio da execucao. `scripts/render-agents.mjs` nao muda e nao passa a conhecer Profile — o agente renderizado permanece identico independentemente de qual Profile esta ativo.
* `providers/` continua nao existindo nesta etapa; o Profile referencia o Provider apenas por identificador textual (`"provider": "azure-devops"`). Esta e uma extracao parcial da Etapa 3 de DEC-0003, escopada ao necessario para `qa-bug-specialist` hoje — Provider formal e um segundo Profile/workspace continuam pendentes.

Justificativa / Evidencia:
Evidencia observavel real: comparacao entre as execucoes que produziram corretamente os Bugs 14312/14313 e a execucao subsequente incorreta, mais a auditoria linha a linha do historico de `agents/qa-bug-specialist.md` desde 2026-06-30, que descartou mudanca de prompt/renderizacao como causa (Principio 9). Mover as duas decisoes de negocio para entrada explicita remove a inferencia em vez de tentar torna-la mais confiavel — a correcao ataca a causa estrutural (inferencia de regra de negocio a partir de contexto), nao um sintoma pontual.

Alternativas consideradas:
* Reforcar o texto de inferencia (ex.: "preferir `Bug em produção` salvo evidencia contraria") — descartado: inverteria o problema (falsos positivos) e manteria o vazamento de vocabulario ja registrado em DEC-0003.
* Mesclar o Profile em tempo de renderizacao, estendendo `render-agents.mjs` — descartado por ora: com um unico Profile em uso, leitura em runtime e mais simples (Principio 1) e nao exige builds por combinacao agente x cliente x Profile; revisitar quando houver necessidade real de multiplos Profiles simultaneos.
* Executar a Etapa 3 completa de DEC-0003 (Provider formal + Profile) de uma vez — descartado por ora: escopo maior que o necessario para resolver o problema observado; Provider formal fica pendente ate haver necessidade real de um segundo ALM ou de validar esse contrato com uso real.

Consequencias:
* `agents/qa-bug-specialist.md` nao contem mais os literais `Bug em produção`, `Erros de Codificação` ou `Custom.Causadoproblema` — passam a viver em `profiles/apsen-arquitetura/profile.json`.
* `scripts/validate-agent-assets.mjs` foi atualizado: os requisitos semanticos de `qa-bug-specialist` passam a exigir os conceitos genericos (`Tipo Do Defeito`, `Profile ativo`, `Item De Trabalho Relacionado`) em vez dos literais especificos da Apsen.
* `docs/BUG_AGENT_TEMPLATE.md` foi atualizado para o novo template estruturado.
* `docs/MAINTENANCE.md` deixa de descrever Profile como puramente "planejado" e passa a documentar o primeiro Profile real, incluindo o mecanismo de carregamento em runtime.
* Providers formais e um segundo Profile/workspace continuam pendentes, sem data definida.

Principios relacionados:
Principio 1 (Simplicidade Antes De Tudo), Principio 2 (Evolucao Incremental), Principio 3 (Agnosticismo De IA), Principio 4 (Agnosticismo De ALM), Principio 9 (Principio Da Evidencia).

### DEC-0005 - Formalizacao do Contexto De Execucao no Contrato De Entrada (`docs/DOMAIN_CONTRACT.md`)

* Data: 2026-07-21
* Status: Ativa

Contexto:
DEC-0004 resolveu, apenas para `qa-bug-specialist`, a mistura entre decisoes de processo do workspace (ex.: qual tipo de Work Item usar) e dados auto-descobriveis via Azure DevOps (Area, Iteration, Parent), separando-os em template estruturado + Profile. A validacao real confirmou que essa separacao elimina a inferencia condicional que causava resultado nao-deterministico. Foi proposto generalizar esse padrao para os demais especialistas do framework (BDD, Wiki, e futuros agentes como Automacao ou Performance), sob um nome unico — "Contexto De Execucao".

Decisao:
* Formalizar "Contexto De Execucao" em `docs/DOMAIN_CONTRACT.md`, como uma nova subsecao de `## Contratos Do Framework` (nao como um Conceito De Dominio novo com Objetivo/Responsabilidades/Relacoes proprios): quando um Agente registra ou cria um recurso no Sistema ALM, sua entrada se divide em decisoes de processo do workspace (sempre explicitas, nunca inferidas) e dados auto-descobertos via Capacidade (sempre resolvidos automaticamente, nunca solicitados de novo).
* O contrato define a fronteira entre as duas categorias, nao uma lista fixa de campos — cada Agente e Profile declara seu proprio conjunto concreto, como `qa-bug-specialist` ja faz desde DEC-0004.
* Nao retroaplicar esta regra a `qa-bdd-specialist` ou `qa-wiki-specialist` nesta decisao: nenhum dos dois tem hoje evidencia real de sofrer a mesma ambiguidade (nenhum incidente observado, ao contrario do que motivou DEC-0004). `qa-bug-specialist` permanece como unica implementacao de referencia ate que necessidade real apareca nos demais agentes.
* Nao criar estrutura, pasta ou schema para agentes que ainda nao existem (Automacao, Performance) — o contrato se aplica a qualquer Agente futuro por construcao, sem exigir trabalho antecipado.

Justificativa / Evidencia:
Evidencia real: a mudanca em `qa-bug-specialist` (DEC-0004) ja validou, em ambiente real, que separar decisao de processo de dado auto-descoberto elimina a fonte de nao-determinismo identificada na investigacao da regressao. Formalizar a regra no Contrato De Entrada (em vez de deixa-la implicita apenas no texto de um agente) atende ao Principio 5 (Contrato Estavel) e evita que o mesmo problema se repita em cada agente novo por falta de um contrato explicito a seguir. Escolher refinamento do Contrato De Entrada em vez de um Conceito De Dominio novo segue o precedente ja estabelecido em DEC-0003 (que descartou "Workspace" como conceito novo por nao introduzir invariante alem do que os conceitos existentes ja cobriam): "Contexto De Execucao" e uma regra sobre a forma da entrada, nao uma entidade com ciclo de vida propria. Nao retroaplicar a BDD/Wiki nem antecipar Automacao/Performance segue o Principio 9 (evidencia antes de generalizar) e os Nao-Objetivos de `docs/PRINCIPLES.md` ("nunca... antecipando escala que ainda nao existe").

Alternativas consideradas:
* Modelar como Conceito De Dominio novo em `## Conceitos De Dominio` — descartado: nao tem ciclo de vida proprio nem introduz invariante que o Contrato De Entrada refinado nao cubra; seria peso conceitual sem necessidade (Principio 1).
* Retroaplicar imediatamente a `qa-bdd-specialist` e `qa-wiki-specialist` — descartado por ora: nenhuma evidencia real de que esses agentes sofrem a mesma ambiguidade hoje; mudar sem incidente observado violaria o Principio 9.
* Criar `providers/`/`profiles/` scaffolding para Automacao e Performance agora, ja que serao mencionados como beneficiarios futuros — descartado: esses agentes nao existem no framework hoje; construir estrutura para eles seria exatamente o que os Nao-Objetivos de `docs/PRINCIPLES.md` proibem.

Consequencias:
* `docs/DOMAIN_CONTRACT.md` ganha a subsecao "Contexto De Execucao" dentro de `## Contratos Do Framework`.
* `qa-bug-specialist` (DEC-0004) passa a ser citado como a implementacao de referencia deste contrato.
* Qualquer agente futuro que registre ou crie um recurso no Sistema ALM deve seguir esta fronteira desde a primeira versao, sem precisar reabrir este contrato.
* `qa-bdd-specialist` e `qa-wiki-specialist` nao mudam nesta decisao.

Principios relacionados:
Principio 1 (Simplicidade Antes De Tudo), Principio 5 (Contrato Estavel, Implementacao Substituivel), Principio 9 (Principio Da Evidencia).

### DEC-0006 - Formalizacao do Gate De Preparacao De Ambiente como Contrato Do Framework

* Data: 2026-07-27
* Status: Ativa

Contexto:
Uma execucao real via Codex confirmou que o usuario iria usar aquele cliente, o `qa-bug-specialist` foi executado, leu documentacao de apoio, analisou o Bug e preparou toda a execucao — e somente ao final descobriu que o MCP Azure DevOps nao estava configurado para aquele cliente/workspace. Processamento e tempo foram gastos para falhar em algo detectavel antes de qualquer analise. Auditoria do texto atual dos agentes mostrou que ja existia uma checagem equivalente, mas fraca: uma linha isolada e reescrita de forma ligeiramente diferente em `qa-orchestrator`, `qa-bug-specialist` e `qa-bdd-specialist` ("confirme que as ferramentas necessarias... estao disponiveis"), ausente em `qa-wiki-specialist`, verificando apenas disponibilidade de ferramenta MCP — nunca Cliente De IA, nunca Profile — e posicionada de forma inconsistente no fluxo de cada agente, o que permitiu que o especialista avancasse para leitura de documentacao e analise antes da checagem surtir efeito. `docs/USAGE.md` confirma que `qa-bdd-specialist`, `qa-wiki-specialist` e `qa-bug-specialist` sao pontos de entrada validos por si só, chamaveis diretamente pelo usuario sem passar por `qa-orchestrator` — logo, um gate implementado apenas dentro do Orchestrator nao fecharia a lacuna quando um especialista e chamado diretamente.

Decisao:
* Formalizar "Gate De Preparacao De Ambiente" em `docs/DOMAIN_CONTRACT.md`, como nova subsecao de `## Contratos Do Framework`: antes de qualquer outro passo, todo Agente valida Cliente De IA identificado, Profile carregado (quando aplicavel), Capacidades obrigatorias disponiveis (usando a tabela "Regra De Degradacao Graciosa" de `docs/CAPABILITY_CONTRACT.md`) e as ferramentas concretas que implementam essas Capacidades respondendo na sessao atual. Falha em qualquer item interrompe a execucao imediatamente, antes de ler documentacao adicional, consultar o Item De Trabalho, iniciar analise ou delegar — com mensagem explicita do que falta.
* O Gate tem uma unica especificacao (a secao criada em `docs/DOMAIN_CONTRACT.md`). Todo Agente — `qa-orchestrator`, `qa-bdd-specialist`, `qa-wiki-specialist`, `qa-bug-specialist`, nos tres clientes — passa a referenciar essa secao por uma instrucao curta e identica, em vez de manter uma versao propria ou parafraseada da checagem. Isso substitui as quatro variantes ad hoc anteriores por uma unica fonte de verdade.
* O Gate roda no inicio do proprio fluxo de cada Agente, inclusive quando o Agente e ativado diretamente, sem passar por `qa-orchestrator`. Quando `qa-orchestrator` delega para um especialista, ele pode validar antecipadamente os requisitos desse especialista antes de delegar, mas isso nao dispensa a validacao que o proprio especialista executa ao iniciar.
* Nenhuma Capacidade nova e adicionada a `docs/CAPABILITY_CONTRACT.md` e nenhum Conceito De Dominio novo e adicionado a `docs/DOMAIN_CONTRACT.md` — o Gate compoe conceitos e a tabela ja existentes (Cliente De IA, Profile, Capacidade), seguindo o precedente de DEC-0005 (refinamento de contrato, nao entidade nova).

Justificativa / Evidencia:
Evidencia real do incidente relatado (execucao via Codex, falha tardia por MCP nao configurado) mais auditoria do texto atual dos quatro agentes, que confirmou checagem ja existente, porem fraca, inconsistente entre agentes e insuficiente para o cenario observado (Principio 9). Unificar a especificacao em `docs/DOMAIN_CONTRACT.md` e fazer cada Agente apenas referencia-la, em vez de reescreve-la, aplica o mesmo mecanismo de leitura em runtime ja validado por DEC-0004 (Profile) e ataca diretamente o risco de divergencia ja documentado em `docs/AGENT_PARITY.md` para `qa-orchestrator`/`qa-bdd-specialist` (agentes sem fonte canonica, historicamente mantidos a mao nos tres clientes e ja divergentes entre si).

Alternativas consideradas:
* Gate apenas dentro de `qa-orchestrator`, antes de delegar para um especialista — descartado: `docs/USAGE.md` documenta e permite chamar qualquer especialista diretamente, sem Orchestrator; um gate so no Orchestrator deixaria esse caminho, que foi exatamente o caminho do incidente relatado, sem protecao.
* Reescrever a mesma checagem, com o mesmo texto, dentro de cada um dos quatro agentes nos tres clientes — descartado: mantem exatamente o padrao que ja causou divergencia real entre `qa-orchestrator`/`qa-bdd-specialist` em `docs/AGENT_PARITY.md`; qualquer ajuste futuro no Gate exigiria editar ate 12 arquivos manualmente, sem checagem de equivalencia para os dois agentes sem fonte canonica.
* Criar uma Capacidade nova dedicada a "verificar ambiente" em `docs/CAPABILITY_CONTRACT.md` — descartado: o Gate nao e uma operacao sobre o Sistema ALM, e uma pre-condicao sobre Cliente De IA, Profile e as Capacidades ja existentes; nao ha operacao nova a modelar.

Consequencias:
* `docs/DOMAIN_CONTRACT.md` ganha a subsecao "Gate De Preparacao De Ambiente" em `## Contratos Do Framework`.
* `docs/CAPABILITY_CONTRACT.md` ganha uma linha de referencia cruzada na "Regra De Degradacao Graciosa", sem alterar nenhuma Capacidade existente.
* As quatro variantes ad hoc anteriores da checagem de ferramentas (em `qa-orchestrator`, `qa-bug-specialist`, `qa-bdd-specialist`, e a ausencia em `qa-wiki-specialist`) sao substituidas pela mesma instrucao curta de referencia ao Gate, nos tres clientes.
* `scripts/validate-agent-assets.mjs` passa a exigir a presenca da referencia ao Gate nos quatro agentes.
* `qa-orchestrator` e `qa-bdd-specialist` continuam sem fonte canonica (`docs/AGENT_PARITY.md`); esta decisao nao resolve essa divergencia estrutural, apenas evita que o Gate especificamente vire uma nova fonte de divergencia entre eles.

Principios relacionados:
Principio 1 (Simplicidade Antes De Tudo), Principio 3 (Agnosticismo De IA), Principio 4 (Agnosticismo De ALM), Principio 5 (Contrato Estavel, Implementacao Substituivel), Principio 9 (Principio Da Evidencia).

### DEC-0007 - Diagnostico acionavel no Gate De Preparacao De Ambiente

* Data: 2026-07-27
* Status: Ativa

Contexto:
DEC-0006 formalizou o Gate De Preparacao De Ambiente e resolveu o problema de processamento desperdicado (falha tardia apos analise ja iniciada). Uma revisao subsequente identificou que o Gate, como especificado ali, cumpria apenas metade do proposito: ele interrompia a execucao e informava "o que falta", mas nao ajudava o usuario a resolver — o texto da falha nao identificava a causa raiz, nao dizia qual Cliente De IA estava em uso nem quais comandos concretos preparariam o ambiente para aquele Cliente especifico, deixando o usuario sem saber o proximo passo apesar de o framework ja documentar esses passos em `docs/SETUP.md` e `docs/TROUBLESHOOTING.md`. A especificacao anterior do Gate proibia explicitamente a leitura de qualquer documentacao adicional apos a falha ("nao le documentacao adicional"), o que impedia por construcao que o Agente consultasse esses dois documentos para montar uma orientacao concreta.

Decisao:
* Enriquecer a subsecao "Gate De Preparacao De Ambiente" de `docs/DOMAIN_CONTRACT.md`: ao falhar, o Agente monta um diagnostico estruturado e acionavel — identifica a causa (nao so o sintoma), identifica o Cliente De IA em uso e direciona a orientacao especificamente para esse Cliente, traduz a causa em passos/comandos concretos com base em `docs/SETUP.md` e `docs/TROUBLESHOOTING.md`, explica como validar que a preparacao funcionou, e orienta a repetir exatamente o mesmo pedido original.
* Abrir uma excecao explicita e estreita a proibicao de leitura de documentacao apos a falha: o Agente pode consultar `docs/SETUP.md` e `docs/TROUBLESHOOTING.md` exclusivamente para montar esse diagnostico, nunca para prosseguir com o pedido original (Item De Trabalho, Documento, Defeito continuam bloqueados).
* Quando o Cliente De IA em uso nao puder ser identificado com confianca suficiente, o diagnostico declara essa ambiguidade e pergunta qual Cliente esta em uso, em vez de listar os tres de forma generica ou adivinhar.
* A unica especificacao do formato do diagnostico continua vivendo em `docs/DOMAIN_CONTRACT.md`; nenhum agente recebe logica reescrita ou parafraseada — o mesmo mecanismo de referencia curta de DEC-0006 se aplica sem alteracao nos quatro agentes, nos tres clientes.

Justificativa / Evidencia:
Revisao funcional apontou um cenario observavel: um usuario recebendo apenas "MCP nao encontrado" sem saber se esta no Codex, Copilot ou Claude, nem qual comando resolve, precisa abrir `docs/SETUP.md` ou `docs/TROUBLESHOOTING.md` manualmente para descobrir o que o proprio framework ja sabe. Isso contraria o Principio 6 (Documentacao Viva) na pratica — a documentacao existe, mas o Gate nao a usava para ajudar o usuario. Manter a especificacao do diagnostico centralizada em `docs/DOMAIN_CONTRACT.md` (em vez de reescreve-la em cada agente) segue o mesmo precedente e a mesma justificativa ja registrada em DEC-0006.

Alternativas consideradas:
* Deixar cada agente decidir, por conta propria, o nivel de detalhe da mensagem de falha — descartado: repete exatamente o padrao de divergencia ad hoc que DEC-0006 ja eliminou para a deteccao da falha, agora deslocado para o texto da mensagem.
* Embutir os comandos concretos por Cliente diretamente em `docs/DOMAIN_CONTRACT.md` — descartado: violaria o proprio objetivo do documento (agnostico de Cliente De IA e de Sistema ALM, ver cabecalho de `docs/DOMAIN_CONTRACT.md`); os comandos concretos ja vivem em `docs/SETUP.md`/`docs/TROUBLESHOOTING.md`, o Gate apenas aponta para eles.

Consequencias:
* `docs/DOMAIN_CONTRACT.md` ganha a especificacao do diagnostico de falha dentro da subsecao "Gate De Preparacao De Ambiente" existente (sem criar Conceito De Dominio ou Capacidade nova).
* `docs/TROUBLESHOOTING.md` e `docs/USAGE.md` sao atualizados para refletir que o diagnostico agora e especifico por Cliente e acionavel, nao apenas "informa o que falta".
* Nenhum dos quatro agentes, nos tres clientes, precisa de edicao — eles ja referenciam a secao do Gate em `docs/DOMAIN_CONTRACT.md` por instrucao curta, herdando o novo comportamento automaticamente.

Principios relacionados:
Principio 1 (Simplicidade Antes De Tudo), Principio 3 (Agnosticismo De IA), Principio 4 (Agnosticismo De ALM), Principio 5 (Contrato Estavel, Implementacao Substituivel), Principio 6 (Documentacao Viva), Principio 9 (Principio Da Evidencia).

### DEC-0008 - Sincronizacao Incremental no `qa-orchestrator` e fonte canonica para `qa-bdd-specialist` (Etapa 2 parcial do plano de migracao)

* Data: 2026-07-28
* Status: Ativa

Contexto:
O `qa-orchestrator` decidia manter, atualizar ou regenerar o SPEC de um Work Item apenas verificando a existencia previa de um arquivo em `output/` ou de uma pagina na Wiki — sem comparar o conteudo atual do Item De Trabalho contra o que ja fora documentado. Isso viola, na pratica, o Contrato De Processamento de `docs/DOMAIN_CONTRACT.md` ("o processamento verifica a existencia de um registro correspondente... antes de decidir entre criar ou atualizar"): existencia nao e o mesmo que equivalencia de conteudo. Durante a validacao dessa mudanca nos tres clientes, uma auditoria linha a linha (nao apenas o check de conceitos-chave de `scripts/validate-agent-assets.mjs`) confirmou divergencia real ja registrada em `docs/AGENT_PARITY.md`: o `qa-orchestrator` tinha uma regra de desempate para multiplos arquivos compativeis em `output/` presente apenas no Copilot; e o `qa-bdd-specialist` tinha, apenas no Copilot, formato Gherkin explicito, um gate de validacao de suficiencia de evidencia, cobertura de cenario estendida, taxonomia de riscos/gaps e um checklist de validacao final — ausentes por completo nas versoes Claude/Codex.

Decisao:
* Adicionar "Sincronizacao Incremental" ao `qa-orchestrator`, nos tres clientes: antes de manter, atualizar parcialmente ou regenerar um SPEC, comparar o Item De Trabalho atual (descricao, criterios de aceite, comentarios relevantes, Epic/Feature/User Stories/Tasks/Bugs relacionados) contra o documento local e a pagina Wiki existentes, classificando cada diferenca como Sem Impacto Documental, Atualizacao Incremental ou Regeneracao Completa. A decisao segue a classificacao mais severa encontrada. A saida `# RESULTADO` ganha o campo `Decisao SPEC:` para tornar essa decisao sempre explicita (Contrato De Saida: "o resultado e sempre explicito").
* Corrigir, nos tres clientes do `qa-orchestrator`, a divergencia pre-existente da regra de desempate de multiplos arquivos em `output/`, replicando o comportamento ja existente no Copilot para Claude e Codex.
* Executar a Etapa 2 do plano de migracao (DEC-0003) para `qa-bdd-specialist`: criar `agents/qa-bdd-specialist.md` como fonte canonica, consolidando o comportamento mais completo e aderente a `docs/DOMAIN_CONTRACT.md`/`docs/CAPABILITY_CONTRACT.md` entre as tres variantes anteriores (nao uma copia automatica de nenhuma delas) — mantendo o formato Gherkin explicito, o gate de suficiencia, a cobertura de cenario estendida, a taxonomia de riscos/gaps e o checklist final antes vistos apenas no Copilot, e acrescentando uma instrucao nova para consumir a classificacao da Sincronizacao Incremental recebida do `qa-orchestrator`. `.claude/agents/`, `.codex/agents/` e `.github/agents/` passam a ser gerados por `scripts/render-agents.mjs`, nunca editados a mao.
* `qa-orchestrator` permanece sem fonte canonica — a Etapa 2 fecha apenas a metade referente a `qa-bdd-specialist`; `qa-orchestrator` continua exigindo disciplina manual nos tres clientes ate ser migrado.

Justificativa / Evidencia:
Auditoria linha a linha dos tres arquivos de `qa-orchestrator` e de `qa-bdd-specialist` (nao apenas `scripts/validate-agent-assets.mjs`, que so verifica presenca de conceito-chave e nao pega essas diferencas) confirmou, com evidencia concreta de contagem de linhas e grep por trecho, exatamente as divergencias que `docs/AGENT_PARITY.md` ja antecipava. `scripts/render-agents.mjs --check-all` confirma equivalencia byte-a-byte entre a nova fonte canonica e os tres arquivos gerados apos a migracao (Principio 9).

Alternativas consideradas:
* Copiar a versao Copilot do `qa-bdd-specialist` diretamente para Claude/Codex sem revisao — descartado a pedido explicito: nao valida se todo o conteudo do Copilot e de fato o comportamento correto, apenas o mais completo; a consolidacao caso a caso evita herdar redundancia ou texto especifico de um cliente sem necessidade.
* Manter `qa-bdd-specialist` sem fonte canonica e apenas alinhar manualmente os tres arquivos uma vez — descartado: repete o padrao de disciplina manual que ja causou a divergencia original; a proxima mudanca divergiria de novo sem checagem automatica.
* Adiar a correcao da regra de desempate do `qa-orchestrator` por ser "pre-existente e nao relacionada" ao pedido original — descartado: o pedido de validacao de paridade e explicito em incluir qualquer divergencia encontrada, e a correcao e mecanica (copiar um paragrafo ja existente no Copilot), sem ambiguidade de comportamento a decidir.

Consequencias:
* `agents/qa-bdd-specialist.md` passa a existir; `scripts/render-agents.mjs --check-all` agora valida 3 fontes (antes 2).
* `docs/AGENT_PARITY.md` e `docs/MAINTENANCE.md` precisam ser atualizados para mover `qa-bdd-specialist` da lista "sem fonte canonica" para "com fonte canonica", e `docs/AGENT_PARITY.md` deve deixar de listar `qa-bdd-specialist` como divergente.
* `qa-orchestrator` continua no fluxo manual de manutencao (`docs/MAINTENANCE.md`, "Agente ainda sem fonte canonica"); qualquer mudanca futura nele deve repetir a auditoria linha a linha, nao apenas o check de conceitos-chave.
* README.md ganha o campo `Decisao SPEC:` no formato de resultado documentado do `qa-orchestrator`.

Principios relacionados:
Principio 1 (Simplicidade Antes De Tudo), Principio 2 (Evolucao Incremental), Principio 3 (Agnosticismo De IA), Principio 5 (Contrato Estavel, Implementacao Substituivel), Principio 9 (Principio Da Evidencia).

### DEC-0009 - Estrutura QA Minima Da Feature no `qa-orchestrator` e nova Capacidade `Sincronizar Item De Trabalho`

* Data: 2026-08-11
* Status: Ativa
* Atualizado em: 2026-08-11 — o bloco de conteudo controlado da Task "Planejar os testes" tambem registra `Ultima sincronizacao` (data/hora UTC da ultima vez que o conteudo determinante do bloco foi criado ou alterado), para permitir auditoria sem consultar historico externo. Nao e uma Capacidade nova nem muda o que "conteudo controlado" significa — apenas um campo adicional dentro do bloco ja previsto, cujo conteudo continua sendo definido pelo Agente (ver texto de `qa-orchestrator` nos tres clientes).

Contexto:
O framework documenta SPEC, BDD e publica na Wiki, mas nao garante que a Feature relacionada ao Work Item tenha a estrutura minima de acompanhamento de QA no Azure DevOps (uma User Story de QA com as Tasks de processo "Planejar os testes", "Executar os testes" e "Equalizar o ambiente"). Hoje essa estrutura, quando existe, e criada e mantida manualmente pelo QA, sem relacao automatica com a documentacao ja publicada — a Task "Planejar os testes" nao referencia a Wiki/SPEC gerada pelo `qa-orchestrator`, e nada impede que a mesma estrutura seja recriada de forma divergente entre execucoes, nem que a descricao fique desatualizada quando a Feature ou a Wiki mudam. Revisao da arquitetura (`docs/DOMAIN_CONTRACT.md`, `docs/CAPABILITY_CONTRACT.md`, `docs/AGENT_PARITY.md`) confirmou que essa responsabilidade nao pertence a nenhum especialista existente: `qa-bdd-specialist` gera Documento, `qa-wiki-specialist` publica Documento, `qa-bug-specialist` opera sobre Defeito (Bug) — nenhum dos tres opera sobre Item De Trabalho estrutural (User Story, Task) nem tem, em seu contexto, a URL da Wiki ja publicada. `qa-orchestrator` e o unico Agente que ja consolida Epic/Feature/User Story/Task relacionados (passo existente do seu fluxo) e que so tem a URL final da Wiki disponivel apos seu proprio passo de publicacao — logo, esta responsabilidade so pode ser cumprida ao final do fluxo do Orchestrator, nunca por um especialista isolado. A revisao tambem confirmou uma lacuna real em `docs/CAPABILITY_CONTRACT.md`: nenhuma Capacidade existente cobre criar **ou atualizar** um Item De Trabalho estrutural (nao-Defeito) vinculado a um pai — `Criar Defeito` e especifica do conceito de dominio Defeito e nao cobre atualizacao, e `Buscar Item De Trabalho` e somente leitura.

Uma primeira versao desta decisao propos a Capacidade `Criar Item De Trabalho`, criacao-apenas. Revisao adicional identificou dois problemas: (1) o nome nao deixava clara a fronteira do que a Capacidade faz — parecia autorizar criar qualquer Work Item, sem o vinculo obrigatorio a um pai nem a checagem de duplicidade; (2) faltava semantica de atualizacao, necessaria porque a estrutura minima de QA nao pode ser "criar se faltar" — precisa detectar quando uma Task ja existe mas esta desatualizada (ex.: a Task "Planejar os testes" foi criada antes da Feature ou da Wiki mudarem) e sincronizar apenas o que o framework controla, sem apagar conteudo que o QA tenha escrito manualmente na mesma descricao.

Decisao:
* Adicionar `qa-orchestrator`, nos tres clientes (`.claude/agents/qa-orchestrator.md`, `.github/agents/qa-orchestrator.agent.md`, `.codex/agents/qa-orchestrator.toml`), um novo passo final — "Estrutura QA Minima Da Feature" — executado apos a Sincronizacao Incremental e a publicacao/atualizacao Wiki, inclusive quando a Sincronizacao Incremental decidir manter o SPEC sem alteracao:
  1. Localizar a Feature relacionada ao Work Item, ja consolidada no contexto coletado.
  2. Localizar, entre as User Stories filhas diretas dessa Feature, a User Story De QA (titulo normalizado contendo "QA" como palavra distinta, ou Tag "QA"). Zero candidatas: registrar "Nao encontrada" no resultado final e nao criar a User Story automaticamente nesta versao. Mais de uma candidata: reportar ambiguidade explicita, sem escolher nenhuma. Exatamente uma: prosseguir.
  3. Para cada uma das tres Tasks fixas — "Planejar os testes", "Executar os testes", "Equalizar o ambiente" — localizar entre as Tasks filhas diretas da User Story De QA uma com titulo normalizado identico. Ausente: criar (vinculada por `parent`, herdando Area/Iteration da User Story De QA). Existente e com o conteudo controlado (quando aplicavel) igual ao atual: reutilizar sem alteracao. Existente mas com o conteudo controlado desatualizado ou ausente: atualizar somente esse conteudo — nunca apenas "criar se faltar". Esta busca previa e obrigatoria a cada execucao, o que torna o passo idempotente por construcao.
  4. A Task "Planejar os testes" carrega conteudo controlado pelo framework em sua descricao: link da Feature, link da documentacao QA (Wiki/SPEC) e a informacao de que foi gerada automaticamente pelo `qa-orchestrator`, delimitados por um marcador explicito (`[qa-orchestrator:inicio]` / `[qa-orchestrator:fim]`). Ao criar ou atualizar, apenas o conteudo entre os marcadores e escrito; conteudo fora deles (incluindo texto manual do QA) e sempre preservado — se os marcadores ainda nao existirem em uma descricao ja escrita manualmente, o bloco controlado e inserido no topo, preservando integralmente o conteudo anterior abaixo. Se a URL da Wiki nao estiver disponivel nesta execucao mas ja havia um link valido de uma sincronizacao anterior, o link anterior e preservado; "publicacao pendente" so aparece quando nenhum link valido ainda existe. `Executar os testes` e `Equalizar o ambiente` nao tem conteudo controlado definido nesta versao — para elas, o unico desfecho possivel hoje e `Existente` ou `Criada`.
  5. Incluir no resultado final uma nova secao "Estrutura QA" (User Story De QA encontrada, ausente ou ambigua; para cada Task, existente, criada ou atualizada, com ID; links das Tasks criadas nesta execucao), sempre, mesmo quando a User Story De QA nao for encontrada.
* Adicionar a Capacidade `Sincronizar Item De Trabalho` a `docs/CAPABILITY_CONTRACT.md` — nao `Criar Item De Trabalho` (descartado, ver "Alternativas consideradas") nem uma Capacidade nomeada por conceito de QA como `Garantir Estrutura QA` (tambem descartado): opcional, emparelhada com `Buscar Item De Trabalho` (mesma regra de emparelhamento ja aplicada a `Buscar Documento`/`Publicar Documento` e `Buscar Defeito`/`Criar Defeito`), entrada minima Projeto + Item De Trabalho pai + tipo + titulo + conteudo controlado opcional delimitado por marcador, saida "Item De Trabalho criado ou atualizado" (espelhando a semantica ja usada por `Publicar Documento`), com o invariante de nunca duplicar um item estrutural equivalente e nunca sobrescrever conteudo fora do marcador. Atualizar a tabela "Regra De Degradacao Graciosa" para refletir que `qa-orchestrator` depende desse par apenas quando a Estrutura QA Minima Da Feature for aplicavel, e separar sua linha da de `qa-bdd-specialist` (que nao ganha essa dependencia).
* Atualizar `docs/MAINTENANCE.md` (secao "Provider") para citar `Sincronizar Item De Trabalho` junto das demais Capacidades que recebem Projeto como entrada e seguem a Implementacao Provisoria De Resolucao De Projeto ja em vigor para as demais.
* `qa-bug-specialist`, `qa-bdd-specialist` e `qa-wiki-specialist` nao mudam nesta decisao — nenhum dos tres tem, hoje, evidencia de precisar desta Capacidade.

Justificativa / Evidencia:
Auditoria da cadeia de responsabilidade dos quatro Agentes (`docs/DOMAIN_CONTRACT.md`, "Agente" e "Contratos Do Framework") confirmou, por eliminacao, que nenhum especialista existente tem tanto o contexto de hierarquia (Feature/User Story/Task) quanto a URL final da Wiki necessarios para este passo, e que `qa-orchestrator` ja consolida o primeiro como parte do seu fluxo existente — a mudanca estende uma responsabilidade que ja lhe pertence, em vez de criar uma nova fronteira de responsabilidade. A necessidade da Capacidade nova segue o criterio explicito de `docs/CAPABILITY_CONTRACT.md` ("Adicionar uma Capacidade nova ... so deve acontecer quando um agente real precisar de uma operacao que nenhuma Capacidade existente cobre") — `Criar Defeito` foi descartada por ser conceitualmente distinta (Defeito, nao item estrutural de processo) e por nao cobrir vinculo hierarquico a um pai nem atualizacao. O nome `Sincronizar Item De Trabalho` foi escolhido, em vez de um nome ligado a QA, porque uma Capacidade e um primitivo ALM-agnostico que um Provider implementa (`docs/CAPABILITY_CONTRACT.md`, "Como Usar Este Documento": "Um Agente so pode citar... Capacidades... nunca... vazar vocabulario especifico"); nomea-la por um conceito de processo QA obrigaria qualquer Provider futuro (Jira, GitHub Issues) a conhecer convencoes de workspace que nao lhe dizem respeito — o mesmo tipo de vazamento de vocabulario que a DEC-0004 ja corrigiu para `qa-bug-specialist`. A semantica "criado ou atualizado" segue diretamente o precedente ja existente em `Publicar Documento`, evitando duas Capacidades separadas (criar/atualizar) para o mesmo objeto. O requisito de idempotencia e satisfeito pela mesma regra de emparelhamento ja usada para `Buscar Defeito`/`Criar Defeito`; o requisito de preservacao de conteudo manual (item 3 da revisao solicitada) vira um invariante herdado da propria Capacidade, reaproveitavel por qualquer uso futuro dela, nao uma regra isolada do Agente.

Alternativas consideradas:
* Manter o nome `Criar Item De Trabalho`, criacao-apenas — descartado: nao expressava o vinculo obrigatorio a um pai nem a checagem de duplicidade, e nao cobria o requisito de atualizacao (Task existente porem desatualizada), que a estrutura minima de QA exige por definicao.
* Nomear a Capacidade por um conceito de QA, ex. `Garantir Estrutura QA` — descartado: uma Capacidade e a interface que um Provider implementa contra um ALM real, sem conhecer regra de negocio; "estrutura QA" (quais tres Tasks, qual criterio de User Story) e uma convencao deste framework, nao um conceito de ALM, e deve permanecer inteiramente no texto de `qa-orchestrator` — nunca vazar para a Capacidade, pelo mesmo motivo que `docs/CAPABILITY_CONTRACT.md` ja proibe um Agente de citar nome de ALM, tool MCP ou campo de sistema real.
* Duas Capacidades separadas, `Criar Item De Trabalho` e `Atualizar Item De Trabalho` — descartado: duplicaria a checagem de existencia (que ja precisa rodar antes de decidir entre criar e atualizar) em duas interfaces distintas, sem beneficio real; `Publicar Documento` ja estabelece o precedente de uma unica Capacidade cobrindo os dois casos.
* Reaproveitar `Criar Defeito` para criar as Tasks — descartado: `Criar Defeito` opera sobre o conceito de dominio Defeito (`docs/DOMAIN_CONTRACT.md`), que representa um comportamento observado divergente do esperado; uma Task de processo QA nao e um Defeito, e forcar essa reutilizacao misturaria dois conceitos de dominio distintos.
* Atribuir esta responsabilidade a `qa-bug-specialist`, por ja criar Work Items no Azure DevOps (incluindo `criar_item_relacionado` em `acoes_por_evento`) — descartado: `qa-bug-specialist` so cria itens relacionados a um Bug ja criado nesta execucao, nunca a partir do fluxo de documentacao SPEC/BDD/Wiki, e nao tem em seu contexto a URL da Wiki nem a hierarquia Feature/User Story consolidada pelo Orchestrator.
* Criar a User Story De QA automaticamente quando ausente — descartado a pedido explicito: decisao de processo do workspace (qual criterio usar para nomear/estruturar uma User Story de QA) ainda nao tem regra suficientemente clara para ser inferida com seguranca; apenas informar a ausencia evita criar estrutura organizacional errada por suposicao (mesmo principio ja aplicado a Risco/Lacuna em `docs/DOMAIN_CONTRACT.md`: nunca por suposicao).
* Modelar "Estrutura QA Minima" como nova subsecao de `docs/DOMAIN_CONTRACT.md` (como o Gate ou o Contexto De Execucao) — descartado por ora: e uma responsabilidade de um unico Agente (`qa-orchestrator`), no mesmo padrao ja usado para "Sincronizacao Incremental" (DEC-0008), que vive apenas no texto do Agente, nao em `docs/DOMAIN_CONTRACT.md`; extrair para um contrato cross-agent exigiria evidencia de que outro Agente precisa da mesma logica, o que nao existe hoje.
* Registrar esta mudanca como atualizacao da DEC-0008 em vez de uma decisao nova — descartado: a DEC-0008 tem escopo fechado e ja decidido (a politica de manter/atualizar/regenerar o SPEC); `docs/DECISIONS.md` e explicito que mudanca de sentido ou escopo de uma decisao existente e substituicao, nunca correcao, e "Estrutura QA Minima" opera sobre um objeto de dominio diferente (Item De Trabalho estrutural, nao Documento) — reaproveita o padrao de classificacao por analogia, mas nao e uma extensao do que a DEC-0008 decidiu.

Consequencias:
* `qa-orchestrator` ganha um passo final novo nos tres clientes, mantendo o mesmo formato de fluxo manual ja documentado em `docs/AGENT_PARITY.md` (agente ainda sem fonte canonica) — qualquer mudanca futura neste passo exige repetir a auditoria linha a linha nos tres arquivos, nao apenas o check de conceitos-chave.
* `docs/CAPABILITY_CONTRACT.md` ganha a Capacidade `Sincronizar Item De Trabalho` e a regra de emparelhamento correspondente; a tabela "Regra De Degradacao Graciosa" passa a ter uma linha propria para `qa-orchestrator`, separada de `qa-bdd-specialist`. Um Provider futuro que implemente esta Capacidade precisa suportar merge (preservar conteudo fora do marcador), nao apenas overwrite — um requisito generico, reaproveitavel por qualquer sincronizacao futura de Item De Trabalho, nao especifico de QA.
* `scripts/validate-agent-assets.mjs` ganha conceitos-chave novos para `qa-orchestrator` (User Story De QA, as tres Tasks fixas, sincronizacao/atualizacao, marcador de conteudo controlado) nos tres clientes.
* `README.md`, `docs/USAGE.md` e `docs/VALIDATION.md` sao atualizados para refletir a nova secao "Estrutura QA" no resultado final (incluindo o desfecho `Atualizada`) e novos itens de checklist de validacao (execucao repetida sem duplicidade; preservacao de conteudo manual na descricao).
* `qa-bug-specialist`, `qa-bdd-specialist` e `qa-wiki-specialist` permanecem inalterados.

Principios relacionados:
Principio 1 (Simplicidade Antes De Tudo), Principio 2 (Evolucao Incremental), Principio 3 (Agnosticismo De IA), Principio 4 (Agnosticismo De ALM), Principio 5 (Contrato Estavel, Implementacao Substituivel), Principio 9 (Principio Da Evidencia).

### DEC-0010 - Criacao do agente `qa-health-specialist` (diagnostico e auditoria QA somente leitura)

* Data: 2026-08-17
* Status: Ativa

Contexto:
O framework documenta (`qa-bdd-specialist`), publica (`qa-wiki-specialist`), registra defeito (`qa-bug-specialist`) e orquestra o fluxo ponta a ponta de um unico Work Item (`qa-orchestrator`), mas nenhum agente hoje produz um diagnostico consolidado do estado de QA de uma hierarquia inteira (Epic/Feature/User Story/Task/Bug/Wiki/Estrutura QA) sem alterar nada. Uma revisao arquitetural dedicada (RFC-0002, discutida e refinada em quatro rodadas de revisao antes deste registro) confirmou que essa responsabilidade nao cabe em nenhum dos quatro agentes existentes: `qa-orchestrator` tem, por contrato (`docs/DOMAIN_CONTRACT.md`, Restricoes), escopo sempre focado no Item De Trabalho identificado e suas relacoes diretas — o oposto do comportamento de expansao ampla de hierarquia que um diagnostico exige como fluxo primario, nao como fallback de excecao; alem disso, `qa-orchestrator` esta inerentemente acoplado a Capacidades de escrita (`Sincronizar Item De Trabalho`, `Publicar Documento`), o que tornaria impossivel a independencia total exigida (o agente deve ser executavel diretamente pelo usuario, sem nunca depender de `qa-orchestrator` para funcionar). `qa-wiki-specialist` ja audita, mas apenas a estrutura da Wiki, nunca a hierarquia Epic/Feature/User Story/Task/Bug completa.

Decisao:
* Criar o agente `qa-health-specialist`, com fonte canonica em `agents/qa-health-specialist.md` desde a primeira versao (nunca mantido manualmente nos tres clientes), renderizado por `scripts/render-agents.mjs` para `.claude/agents/`, `.codex/agents/` e `.github/agents/`.
* Responsabilidade: dado um Epic, Feature, User Story ou outro Item De Trabalho e o Projeto ao qual pertence, descobrir a hierarquia relacionada e produzir um diagnostico QA consolidado — hierarquia encontrada, Fluxo QA Observado, Estrutura QA, Wiki, Bugs relacionados, cobertura QA, riscos, gaps, inconsistencias, Pendencias Encontradas, Oportunidades De Melhoria, Proximas Acoes Sugeridas e Situacao QA — em modo estritamente somente leitura. Nunca cria, atualiza, sincroniza, publica ou exclui nada no Azure DevOps, na Wiki ou em arquivos do projeto.
* Estrategia De Descoberta Por Tipo De Entrada: a responsabilidade e sempre uma so (diagnostico), mas a forma de descobrir a hierarquia muda conforme o tipo do Ponto De Entrada (Epic expande Features; Feature expande User Stories/Tasks/Bugs/Wiki; User Story usa a si mesma ou sobe ate a Feature pai quando nao for a User Story De QA; outro Item De Trabalho sobe pela relacao `parent` ate a Feature ancestral mais proxima) — todas convergem para o mesmo relatorio final.
* Escopo de Ponto De Entrada nesta versao (v1): Epic, Feature, User Story e Item De Trabalho generico. Projeto, Sprint e Backlog ficam fora do escopo — nenhuma Capacidade nova e criada nesta decisao; se esses pontos de entrada forem solicitados, o agente informa explicitamente que nao sao suportados nesta versao, em vez de adivinhar ou fazer busca ampla.
* Capacidades usadas: apenas `Buscar Item De Trabalho` (obrigatoria, usada recursivamente pelas relacoes diretas para subir e descer na hierarquia), `Buscar Documento` (existencia de Wiki) e `Buscar Defeito` (Bugs relacionados) — todas ja existentes em `docs/CAPABILITY_CONTRACT.md`. Nenhuma Capacidade nova e criada. `docs/CAPABILITY_CONTRACT.md` ganha apenas uma nova linha na tabela "Regra De Degradacao Graciosa", listando `Buscar Item De Trabalho` como obrigatoria e `Buscar Documento`/`Buscar Defeito` como benfeitoras sem exigi-las.
* Limites explicitos no texto do agente: nunca invoca `Sincronizar Item De Trabalho`, `Publicar Documento`, `Criar Defeito`, `Anexar Evidencias` ou `Obter Usuario`; a checagem de Wiki e apenas existencia (`Buscar Documento`), nunca substitui a auditoria estrutural detalhada que continua exclusiva de `qa-wiki-specialist`; a checagem de Estrutura QA (User Story De QA e as 3 Tasks fixas, mesma convencao ja usada por `qa-orchestrator` desde DEC-0009) e somente leitura, nunca cria ou sincroniza — essa escrita continua exclusiva de `qa-orchestrator`.
* Situacao QA: classificacao categorica final do diagnostico — `Estruturado`, `Parcial` ou `Insuficiente Para Avaliacao` — sempre derivada de forma auditavel das evidencias listadas em "Base Da Situacao QA", nunca de peso numerico, formula ou metrica arbitraria. Quando a evidencia for insuficiente para classificar, a classificacao e `Insuficiente Para Avaliacao`, nunca forcada.
* Relatorio deterministico: listas obtidas de uma mesma chamada (Features, User Stories, Tasks, Bugs) sao sempre ordenadas pelo identificador do Item De Trabalho, nunca pela ordem de retorno da API; "Pendencias Encontradas" segue uma ordem fixa de categorias; a classificacao de Situacao QA e uma funcao direta e repetivel das evidencias, nunca uma impressao subjetiva. Esta garantia cobre conteudo, ordem e classificacao dado o mesmo estado do Azure DevOps — nao cobre redacao identica palavra por palavra, que depende do Cliente De IA em uso.
* Nenhum Conceito De Dominio novo e adicionado a `docs/DOMAIN_CONTRACT.md` — o formato do relatorio ("Situacao QA", "Fluxo QA Observado", "Proximas Acoes Sugeridas", "Pendencias Encontradas") fica definido inteiramente no texto de `agents/qa-health-specialist.md`, seguindo o mesmo precedente ja usado para "Estrutura QA Minima Da Feature" em DEC-0009: promovido para um contrato cross-agent apenas quando um segundo agente real precisar consumir esse formato.
* `qa-orchestrator`, `qa-bdd-specialist`, `qa-wiki-specialist` e `qa-bug-specialist` nao mudam nesta decisao.

Justificativa / Evidencia:
RFC-0002 passou por quatro rodadas de revisao antes deste registro. A primeira estabeleceu que a responsabilidade nao cabe em nenhum agente existente, por conflito direto com a Restricao de escopo do `qa-orchestrator` e com o requisito de independencia total. A segunda mapeou, capacidade por capacidade, que Epic/Feature/User Story ja sao totalmente cobertos por `Buscar Item De Trabalho` usado recursivamente pelas relacoes diretas — sem exigir Capacidade nova — e que apenas Projeto/Sprint/Backlog exigiriam uma Capacidade de listagem ainda inexistente; a decisao explicita de escopo faseado (v1 sem esses tres pontos de entrada) elimina a necessidade de qualquer Capacidade nova nesta etapa, aderindo ao Principio 1 (nao adicionar por antecipacao). A terceira rodada refinou terminologia do relatorio para eliminar ambiguidade real: "QA Health" foi descartado por sugerir pontuacao/metrica quando o requisito explicito e o oposto (Principio Da Evidencia: nenhuma metrica arbitraria); "Estado QA" foi descartado depois por colidir com o conceito ja existente "estado" do Item De Trabalho (`docs/DOMAIN_CONTRACT.md`), chegando a "Situacao QA" como termo sem colisao com vocabulario ja ocupado. A quarta rodada adicionou Resumo Executivo e motivo explicito em Informacoes Nao Determinaveis, ambos reforcando o invariante ja existente "o resultado e sempre explicito" (`docs/DOMAIN_CONTRACT.md`, Contrato De Saida).

Alternativas consideradas:
* Implementar esta responsabilidade dentro de `qa-orchestrator` — descartado: violaria a Restricao de escopo focado ja em vigor e tornaria o diagnostico dependente de `qa-orchestrator`, contradizendo o requisito explicito de independencia total.
* Nomear o indicador consolidado "QA Health" ou "Estado QA" — ambos descartados (ver Justificativa acima); adotado "Situacao QA".
* Incluir Projeto/Sprint/Backlog como Ponto De Entrada ja na v1 — descartado por ora: exigiria criar uma Capacidade nova de listagem sem evidencia de uso real ainda validada; escopo faseado mantem a v1 pequena e 100% reaproveitavel, com extensao futura elegivel via nova DEC quando houver necessidade real.
* Promover a convencao "User Story De QA + 3 Tasks fixas" para `docs/DOMAIN_CONTRACT.md` nesta decisao, ja que passa a ser usada por dois agentes — descartado por ora: exigiria editar `qa-orchestrator` (fora do escopo desta decisao, que nao altera nenhum agente existente); registrado como melhoria futura elegivel quando o proximo agente ou mudanca justificar tocar `qa-orchestrator`.

Consequencias:
* `agents/qa-health-specialist.md` passa a existir como fonte canonica; `.claude/agents/qa-health-specialist.md`, `.codex/agents/qa-health-specialist.toml` e `.github/agents/qa-health-specialist.agent.md` sao gerados por `scripts/render-agents.mjs` — nunca editados a mao.
* `docs/CAPABILITY_CONTRACT.md` ganha uma nova linha na tabela "Regra De Degradacao Graciosa" para `qa-health-specialist`; nenhuma Capacidade nova e adicionada.
* `docs/MAINTENANCE.md` ganha `qa-health-specialist` na tabela "Agentes", ja na secao "Agente com fonte canonica".
* `docs/AGENT_PARITY.md` ganha uma linha para `qa-health-specialist`, com fonte canonica desde o inicio — nao contribui para a divida de paridade ja registrada para `qa-orchestrator`.
* `docs/USAGE.md` e `README.md` ganham uma secao de uso direto deste agente.
* `scripts/validate-agent-assets.mjs` ganha `qa-health-specialist` em `expectedAgents`, com seus proprios conceitos-chave obrigatorios.
* Projeto, Sprint e Backlog como Ponto De Entrada, e a eventual promocao da convencao de Estrutura QA para `docs/DOMAIN_CONTRACT.md`, permanecem pendentes, sem data definida.

Principios relacionados:
Principio 1 (Simplicidade Antes De Tudo), Principio 2 (Evolucao Incremental), Principio 3 (Agnosticismo De IA), Principio 4 (Agnosticismo De ALM), Principio 5 (Contrato Estavel, Implementacao Substituivel), Principio 8 (Seguranca Por Padrao), Principio 9 (Principio Da Evidencia).
