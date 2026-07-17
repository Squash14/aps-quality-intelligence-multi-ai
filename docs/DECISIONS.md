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
