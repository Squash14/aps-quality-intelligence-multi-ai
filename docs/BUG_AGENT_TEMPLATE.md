# Template Para Bug

Use este modelo sempre que chamar o `qa-bug-specialist`. Ele foi montado a partir do padrao observado no Bug `13788` do projeto `Arquitetura`.

## Prompt Recomendado

```text
Use o agente qa-bug-specialist para criar um bug.

Projeto:
Tipo de bug: Bug em produção | Bug
Feature/User Story/Task relacionada:
Cenario testado:
Ambiente:
Perfil/usuario usado:
Massa de teste:
Causa do problema:
Direcionar para:

Erro encontrado:

Passos para reproducao:
1.
2.
3.

Resultado atual:

Resultado esperado:

Recorrencia:

Impacto:

Evidencias:
<anexar prints, videos ou arquivos aqui>
```

## O Que Informar

Campos mais importantes:

* `Projeto`: projeto do Azure DevOps, por exemplo `Arquitetura`.
* `Tipo de bug`: use `Bug em produção` quando o defeito foi encontrado em producao; caso contrario use `Bug` ou deixe o agente inferir pelo projeto. Se escrever `Bug em producao`, o agente deve normalizar para `Bug em produção`.
* `Feature/User Story/Task relacionada`: informe o ID quando souber. O agente deve validar no Azure DevOps e usar como parent hierarquico quando fizer sentido.
* `Cenario testado`: fluxo QA que estava sendo executado.
* `Erro encontrado`: comportamento errado observado durante o teste.
* `Resultado atual`: o que o sistema fez.
* `Resultado esperado`: o que deveria acontecer.
* `Causa do problema`: campo obrigatorio para `Bug em produção`. Informe quando souber. Exemplo observado aceito pelo Azure DevOps: `Erros de Codificação`. Se escrever `Erros de Codificacao`, o agente deve normalizar para `Erros de Codificação`.
* `Direcionar para`: informe somente o nome da pessoa. O agente deve localizar a identidade no Azure DevOps e preencher `Assigned To`.
* `Evidencias`: cole ou anexe prints, videos e arquivos no prompt. Se nao anexar nada, o Bug sera criado com `Evidencias: Nao informado`.

Campos recomendados para evitar triagem incompleta:

* ambiente exato, como producao, homologacao, navegador, versao, build ou release;
* massa de teste objetiva, como EAN, codigo de produto, cliente, pedido ou usuario;
* perfil/permissao usado;
* recorrencia, por exemplo `ocorre sempre` ou `intermitente`;
* impacto operacional.

## Regras Do Agente

O agente deve:

* consultar o Azure DevOps antes de criar;
* verificar duplicidade por titulo, mensagem, funcionalidade, massa de teste e Work Item relacionado;
* descobrir Area e Iteration a partir do Work Item relacionado ou padrao do projeto;
* verificar a sprint ativa e preencher a Iteration correta quando o usuario nao informar;
* validar Feature/User Story/Task informada e usar como parent quando adequado; se a criacao nao aceitar relacao no payload inicial, criar o Bug primeiro e depois vincular o parent com link hierarquico;
* preencher `Assigned To` quando `Direcionar para` for informado; se a busca direta de identidade nao retornar resultado, buscar Work Items recentes atribuidos/criados por esse nome e reutilizar a identidade quando houver correspondencia unica;
* preencher `Custom.Causadoproblema` para `Bug em produção`;
* normalizar valores conhecidos do projeto `Arquitetura`, como `Bug em produção` e `Erros de Codificação`;
* se a criacao falhar por valor fora da lista permitida, corrigir o label e tentar novamente;
* anexar evidencias quando o MCP suportar;
* criar o Bug sem pedir confirmacao se nao houver duplicidade e todos os campos obrigatorios estiverem definidos.

## Campos Obrigatorios Conhecidos Para Bug Em Produção

Consulta feita no Azure DevOps para o tipo `Bug em produção` indicou estes campos obrigatorios:

| Campo | Reference name | Observacao |
| --- | --- | --- |
| Titulo | `System.Title` | Obrigatorio. |
| Area | `System.AreaPath` / `System.AreaId` | Obrigatorio. |
| Iteration | `System.IterationPath` / `System.IterationId` | Obrigatorio; usar sprint ativa quando aplicavel. |
| State | `System.State` | Usar `New` na criacao. |
| Causa do problema | `Custom.Causadoproblema` | Obrigatorio. |
| Demanda aprovada | `Custom.Demandaaprovada` | Usar `false`, salvo evidencia contraria. |

Valor de `Custom.Causadoproblema` validado no projeto `Arquitetura`: `Erros de Codificação`. Se o usuario nao informar a causa e o agente nao conseguir inferir com seguranca a partir de metadados ou padroes do projeto, ele deve perguntar antes de criar.

## Exemplo

```text
Use o agente qa-bug-specialist para criar um bug.

Projeto: Arquitetura
Tipo de bug: Bug em produção
Feature/User Story/Task relacionada: 8227
Cenario testado: Consulta de produto por EAN na Politica de Desconto
Ambiente: Producao
Perfil/usuario usado: usuario comercial com permissao de edicao
Massa de teste: EAN 7890000000000, produto Produto Exemplo
Causa do problema: Erros de Codificação
Direcionar para: Gustavo

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

Recorrencia:
Ocorre sempre.

Impacto:
Impede selecionar produto por EAN na edicao de descontos por condicao comercial.

Evidencias:
<prints anexados>
```
