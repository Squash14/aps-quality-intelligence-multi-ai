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
