# Principios Do Framework

Este documento e a constituicao do framework. Ele tem autoridade maxima sobre qualquer outro documento, agente, script ou configuracao neste repositorio.

Se qualquer outro documento, agente ou codigo entrar em conflito com um principio aqui descrito, o conflito e resolvido a favor deste documento — o outro artefato esta errado e deve ser corrigido, nao o contrario.

Este documento nasceu de uma correcao de rota real: a primeira proposta de fundacao documental para a proxima geracao do framework chegou a 39 documentos antes de ser revisada com YAGNI. Os principios abaixo existem para que essa correcao nao precise se repetir.

## Como Usar Este Documento

* Antes de criar um documento, pasta, agente, script ou camada de abstracao nova, verifique se ela se sustenta contra os principios abaixo. Se nao se sustenta, ela nao deveria existir ainda.
* `docs/DOMAIN_CONTRACT.md` traduz os principios de agnosticismo em contrato funcional concreto. `docs/DECISIONS.md` registra decisoes que aplicam, testam ou alteram esses principios ao longo do tempo.
* Toda documentacao operacional (`SETUP.md`, `USAGE.md`, `MAINTENANCE.md`, `VALIDATION.md`, `TROUBLESHOOTING.md`, `AGENT_PARITY.md`, `BUG_AGENT_TEMPLATE.md`) deve ser consistente com este documento. Divergencia encontrada e bug de documentacao, nao excecao valida.
* Mudar este documento e um evento raro e deliberado, nao uma edicao casual. Veja "Como Este Documento Evolui".

## Principios

### 1. Simplicidade Antes De Tudo (YAGNI)

**Regra:** nao crie estrutura, documento, camada de abstracao ou configuracao para uma necessidade hipotetica. Crie apenas para uma necessidade real e presente.

**Por que:** complexidade antecipada e divida que ninguem pediu. Ela custa a mesma manutencao que complexidade necessaria, mas nao paga nenhum beneficio ate o dia em que a necessidade hipotetica se torna real — se algum dia se tornar.

**Na pratica:** prefira 3 documentos que sustentam o framework hoje a 30 que antecipam um futuro incerto. Um arquivo vazio esperando conteudo futuro e um sinal de alerta, nao de planejamento.

### 2. Evolucao Incremental

**Regra:** o framework cresce em resposta a necessidade real observada, nao a um plano de longo prazo especulativo.

**Por que:** decisoes tomadas cedo demais, com pouca informacao, tendem a estar erradas. Um roadmap detalhado de anos fica obsoleto mais rapido do que o framework evolui.

**Na pratica:** mudancas pequenas e revisaveis, um passo de cada vez. Estrutura documental e arquitetural cresce por camada conforme a camada anterior se prova insuficiente, nunca todas as camadas de uma vez "para nao precisar mexer depois".

### 3. Agnosticismo De IA

**Regra:** nenhuma regra funcional do framework pode depender de um cliente de IA especifico (Claude, Codex, Copilot ou qualquer cliente futuro).

**Por que:** o valor do framework e o fluxo de documentacao QA — busca de Item De Trabalho, geracao de Especificacao e Cenario BDD, Publicacao no Repositorio De Documentacao. O cliente de IA que executa esse fluxo e um detalhe de integracao substituivel, nao o produto.

**Na pratica:** regra funcional vive no contrato de dominio (`docs/DOMAIN_CONTRACT.md`), nunca apenas no arquivo de agente de um unico cliente. Paridade entre clientes e validada (`docs/AGENT_PARITY.md`, `scripts/check.sh`). Um cliente novo e suportado implementando o contrato existente, nao reescrevendo o nucleo do framework.

### 4. Agnosticismo De ALM

**Regra:** nenhuma regra funcional pode depender irrevogavelmente de um sistema de ALM especifico. Azure DevOps e a implementacao atual, nao a definicao do conceito.

**Por que:** mesma razao do agnosticismo de IA. "Item de trabalho", "publicacao de documentacao" e "registro de defeito" sao conceitos abstratos antes de serem campos do Azure DevOps.

**Na pratica:** conceitos abstratos sao definidos no contrato de dominio antes de qualquer campo, endpoint ou particularidade do Azure DevOps. Um ALM novo e suportado como um adaptador contra esse contrato, sem alterar o fluxo que os outros clientes e ALMs ja usam.

### 5. Contrato Estavel, Implementacao Substituivel

**Regra:** o contrato funcional publico do framework — entrada Projeto e Item De Trabalho, saidas esperadas (Especificacao, Cenario BDD, Risco, Lacuna, Publicacao) — muda com muito mais cautela do que qualquer implementacao por tras dele.

**Por que:** e o que permite trocar cliente de IA, ALM, script ou agente sem quebrar quem depende do framework. Sem essa estabilidade, agnosticismo de IA e de ALM sao apenas palavras.

**Na pratica:** mudanca de contrato e um evento raro, deliberado e registrado em `docs/DECISIONS.md`. Mudanca de implementacao (script, agente, adaptador, prompt) e rotina e nao exige o mesmo nivel de cerimonia.

### 6. Documentacao Viva

**Regra:** documentacao que nao reflete o comportamento real do framework e pior do que nenhuma documentacao.

**Por que:** documentacao desatualizada engana quem confia nela e cria uma falsa sensacao de entendimento — o pior tipo de divida, porque e invisivel ate alguem agir sobre ela.

**Na pratica:** mudanca de contrato ou comportamento atualiza o documento correspondente no mesmo commit ou PR, nao depois. Validacao automatizada (`scripts/check.sh`) e preferida a confianca manual sempre que for viavel. Um documento sem responsavel claro pela atualizacao e um documento que vai apodrecer.

### 7. Sustentabilidade De Longo Prazo

**Regra:** o framework e construido para durar anos e sobreviver a saida de qualquer mantenedor individual.

**Por que:** uma ferramenta que vira dependencia critica do processo de QA nao pode depender do conhecimento tacito de uma unica pessoa.

**Na pratica:** decisoes relevantes sao registradas em `docs/DECISIONS.md`, nao apenas lembradas ou combinadas verbalmente. Configuracao e segredo nunca ficam acoplados a uma maquina ou pessoa especifica.

### 8. Seguranca Por Padrao

**Regra:** PAT do Azure DevOps, `.env`, `.mcp.json` e configuracoes MCP geradas nunca sao expostos, commitados ou compartilhados, sob nenhuma justificativa operacional.

**Por que:** e a unica regra deste documento sem excecao aceitavel — vazamento de credencial e um incidente, nao um trade-off de simplicidade ou velocidade.

**Na pratica:** essa regra nunca e relaxada em nome de outro principio, nem mesmo simplicidade ou velocidade de entrega.

### 9. Principio Da Evidencia

**Regra:** nenhuma mudanca arquitetural, tecnologica ou de processo relevante entra no nucleo do framework apenas por parecer uma boa ideia ou por seguir uma tendencia. Toda mudanca relevante exige justificativa tecnica explicita e, sempre que possivel, uma PoC ou validacao pratica antes de ser adotada.

**Por que:** opiniao e tendencia mudam de mantenedor para mantenedor e de ano para ano; um framework pensado para durar anos nao pode ter o nucleo redesenhado a cada preferencia individual ou moda tecnica. Resultado observavel e o unico criterio que sobrevive a troca de quem decide.

**Na pratica:** mudanca relevante exige justificativa tecnica registrada em `docs/DECISIONS.md`, apoiada em resultado observavel (PoC, teste comparativo, dado de uso real) sempre que for viavel produzir um. Ate existir essa evidencia, a mudanca permanece como experimento isolado, fora do nucleo do framework, e nunca vira contrato ou regra oficial.

## Nao-Objetivos

O framework nunca deve virar:

* uma plataforma de execucao ou automacao de testes — ele documenta QA (SPEC, BDD, riscos, gaps), nao executa testes;
* um substituto de ALM — ele orquestra em torno do Azure DevOps ou de um ALM futuro, nunca reimplementa suas funcoes;
* uma plataforma de agentes de proposito geral — o escopo permanece o fluxo de documentacao QA de ponta a ponta;
* uma estrutura com camadas, documentos ou configuracao antecipando escala que ainda nao existe.

## Relacao Com Outros Documentos

| Documento | Relacao com este documento |
| --- | --- |
| `docs/DOMAIN_CONTRACT.md` | Traduz os principios 3, 4 e 5 em contrato funcional concreto e verificavel. |
| `docs/DECISIONS.md` | Registra decisoes que aplicam, testam ou alteram um principio ao longo do tempo. |
| `docs/MAINTENANCE.md`, `docs/VALIDATION.md`, `docs/AGENT_PARITY.md` | Operacionalizam o principio 6 (documentacao viva) e o principio 3 (agnosticismo de IA). |
| `README.md`, `CLAUDE.md`, `AGENTS.md` | Devem permanecer consistentes com este documento; em caso de divergencia, este documento prevalece. |

## Como Este Documento Evolui

* Qualquer pessoa pode propor uma mudanca; quem mantem o framework aprova.
* Toda mudanca de principio, adicao ou remocao e registrada como uma entrada em `docs/DECISIONS.md`, com a razao da mudanca.
* Este processo e deliberadamente leve porque ainda nao existe governanca formal com multiplos mantenedores. Formalizar esse processo antes de existir mais de um mantenedor seria, ironicamente, uma violacao do Principio 1.
