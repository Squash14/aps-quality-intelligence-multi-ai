# Template Para Bug

Use este modelo sempre que chamar o `qa-bug-specialist`. Ele reflete o template estruturado adotado em `docs/DECISIONS.md` (DEC-0004): campos de decisao de negocio sao informados explicitamente pelo QA, e o agente descobre automaticamente tudo o que puder obter do Azure DevOps.

## Prompt Recomendado

```text
Use o agente qa-bug-specialist para criar um bug.

Projeto:
Item De Trabalho Relacionado:
Ambiente:
Tipo De Teste:
Tipo Do Defeito:
Observacoes:

Erro encontrado:

Passos para reproducao:
1.
2.
3.

Resultado atual:

Resultado esperado:

Causa do problema:

Direcionar para:

Recorrencia:

Impacto:

Evidencias:
<anexar prints, videos ou arquivos aqui>
```

## O Que Informar

### Campos de decisao de negocio — sempre informados pelo QA, nunca inferidos pelo agente

* `Projeto`: projeto do Azure DevOps, por exemplo `Arquitetura`.
* `Item De Trabalho Relacionado`: ID da Feature, User Story ou Task. A partir dela o agente busca e herda automaticamente Area Path, Iteration/Sprint e Parent — nao informe esses três manualmente.
* `Ambiente`: por exemplo `DEV`, `Homologacao`, `Producao`. E uma decisao do processo interno, nao algo que o agente deve deduzir do restante do texto.
* `Tipo De Teste`: por exemplo `Regressivo`, `Funcional`, `Exploratorio`.
* `Tipo Do Work Item`: o tipo real do Azure DevOps a ser criado, por exemplo `BUG EM PRODUÇÃO` ou `Bug`. Esta e uma regra de negocio da equipe (que tipo de defeito entra corretamente no Board da Sprint, por exemplo), nao uma regra do Azure DevOps — por isso o agente nunca deve inferir ou alterar esse valor a partir do ambiente, da causa ou de qualquer outro sinal. O agente normaliza apenas grafia/acentuacao/caixa contra os valores aceitos declarados no Profile ativo do workspace (`profiles/apsen-arquitetura/profile.json`). Se voce nao informar este campo, o agente usa o tipo padrao declarado no Profile.

### Demais campos — conteudo do defeito

* `Erro encontrado`: comportamento errado observado durante o teste.
* `Passos para reproducao`, `Resultado atual`, `Resultado esperado`: conteudo funcional do defeito.
* `Causa do problema`: informe quando souber (ex.: `Erros de Codificação`); o agente normaliza contra o Profile ativo. Campo obrigatorio para alguns tipos de defeito, conforme o Profile.
* `Direcionar para`: informe somente o nome da pessoa; o agente localiza a identidade no Azure DevOps e preenche `Assigned To`.
* `Recorrencia`, `Impacto`: contexto adicional recomendado.
* `Evidencias`: cole ou anexe prints, videos e arquivos no prompt. Se nao anexar nada, o Bug e criado com `Evidencias: Nao informado`, sem bloquear a criacao.

## Regras Do Agente

O agente deve:

* usar exatamente o `Tipo Do Work Item` informado (normalizado pelo Profile ativo), sem inferir esse valor a partir de contexto;
* consultar o Azure DevOps antes de criar;
* verificar duplicidade por titulo, mensagem, funcionalidade, massa de teste e Item De Trabalho Relacionado;
* buscar o Item De Trabalho Relacionado e herdar automaticamente Area Path e Iteration dele; usar a sprint ativa do time apenas como fallback quando esse item nao tiver Iteration definida;
* validar o Item De Trabalho Relacionado e usa-lo como parent quando adequado; se a criacao nao aceitar relacao no payload inicial, criar o Bug primeiro e depois vincular o parent com link hierarquico;
* preencher `Assigned To` quando `Direcionar para` for informado; se a busca direta de identidade nao retornar resultado, buscar Work Items recentes atribuidos/criados por esse nome e reutilizar a identidade quando houver correspondencia unica;
* ler o Profile ativo (`profiles/<nome>/profile.json`) antes de normalizar Tipo Do Work Item, Causa do problema ou nomes de campo customizado;
* se a criacao falhar por valor fora da lista permitida, corrigir o label conforme o Profile e tentar novamente;
* anexar evidencias quando o MCP suportar;
* criar o Bug sem pedir confirmacao se nao houver duplicidade e todos os campos obrigatorios estiverem definidos;
* nao perguntar novamente Projeto, Item De Trabalho Relacionado, Ambiente ou Tipo Do Work Item quando ja informados;
* apos criar um Bug novo nesta execucao (nunca quando um Bug existente e localizado por duplicidade), executar as acoes declaradas em `acoes_por_evento.apos_criar_defeito` no Profile ativo e reportar cada uma no resultado final.

## Analise Enriquecida No Resultado

Quando o agente cria um Bug novo (nunca quando localiza um Bug existente por duplicidade), o resultado final inclui tambem uma analise informativa — nenhum campo de entrada novo, apenas achados derivados do que ja foi informado e do que o agente ja consulta no Azure DevOps: `Indicios De Regressao`, `Possivel Impacto Funcional`, `Modulo Ou Componente Afetado`, `Riscos QA Relacionados`, `Bugs Semelhantes` (mesmo com titulo diferente do Bug criado — sempre presente, com `Nenhum Bug semelhante encontrado` quando aplicavel), `Dependencias Funcionais Afetadas` e `Validacoes Recomendadas` (lista curta em linguagem natural, nunca formato Gherkin/BDD). Cada item aparece apenas quando houver evidencia suficiente — nunca por suposicao. Um bloco `Confiabilidade Da Analise` (`Alta`, `Media` ou `Baixa`, nunca um numero) fecha a analise, refletindo apenas a quantidade e qualidade da evidencia usada. Ver `agents/qa-bug-specialist.md` ("Analise Enriquecida Antes Da Criacao") e `docs/DECISIONS.md` (DEC-0012) para a especificacao completa.

## Profile Do Workspace Apsen/Arquitetura

Os valores e aliases especificos deste workspace (tipos de defeito aceitos, causas aceitas, nomes de campo customizado, politica de responsavel e de evidencias) vivem em `profiles/apsen-arquitetura/profile.json` — nao mais no texto do agente. Consulte esse arquivo como fonte de verdade; ele e a referencia usada pelo agente para normalizar os campos de decisao de negocio.

Este workspace tambem declara uma acao pos-criacao (`acoes_por_evento.apos_criar_defeito`): apos criar um Bug novo, o agente cria automaticamente uma Task filha "Executar os testes", vinculada ao Bug, com Area e Iteration herdadas dele. `atribuir_para` esta configurado como `usuario_atual`, entao a Task e atribuida automaticamente a identidade da sessao que executou o fluxo (o QA que rodou o agente com seu proprio PAT), nunca a um nome fixo — cada QA que usar este mesmo Profile recebe a Task em seu proprio nome. Essa acao roda apenas quando um Bug novo e criado nesta execucao, nunca quando um Bug existente e localizado por duplicidade.

## Exemplo

```text
Use o agente qa-bug-specialist para criar um bug.

Projeto: Arquitetura
Item De Trabalho Relacionado: 8227
Ambiente: Producao
Tipo De Teste: Regressivo
Tipo Do Work Item: Bug em produção
Observacoes:

Erro encontrado:
Ao buscar um produto pelo EAN, o sistema informa que nenhum registro foi encontrado, mas o produto existe e e localizado por outros dados.

Passos para reproducao:
1. Acessar Parametros > Politica de Desconto.
2. Localizar um produto existente e copiar o EAN.
3. Informar o EAN no campo de pesquisa.
4. Executar a consulta.

Resultado atual:
A consulta retorna Nenhum registro foi encontrado.

Resultado esperado:
O sistema deve localizar e exibir o produto correspondente ao EAN informado.

Causa do problema: Erros de Codificação

Direcionar para: Gustavo

Recorrencia:
Ocorre sempre.

Impacto:
Impede selecionar produto por EAN na edicao de descontos por condicao comercial.

Evidencias:
<prints anexados>
```
