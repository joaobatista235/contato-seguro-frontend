## Entendimento do problema

A empresa possui um sistema para gerenciar empresas e relatos, mas ainda não é possível identificar qual o envolvimento de cada pessoa nas situações relatadas.
Atuamos como o membro de comitê, que recebe, registra e investiga os relatos de uma empresa.
Precisamos vincular as pessoas aos relatos com um tipo de envolvimento definido: relatante, testemunha, vítima ou denunciado.
O sistema não conta com o cadastro de pessoas na interface, então precisamos primeiro permitir cadastrar e consultar essas pessoas para conseguir fazer o vínculo aos relatos.
As pessoas pertencem ao sistema, sem vínculo com uma empresa específica. Uma pessoa pode participar de vários relatos com papéis diferentes, mas não aparecer mais de uma vez em um mesmo relato.

## O que será desenvolvido

- Uma tela de Pessoas, acessível pelo menu, para gerenciar pessoas.
- Um formulário de cadastro com nome completo, CPF, e-mail e data de nascimento.
- Uma opção na tela de relatos para consultar os envolvidos.
- Uma seção de envolvidos na edição do relato, para consultar as pessoas vinculadas e adicionar novos envolvidos.
- Uma indicação clara de relato anônimo ou identificado.

## Regras que precisam ser respeitadas

- Todos os campos do cadastro de pessoa são obrigatórios.
- O CPF deve conter 11 dígitos e ser único no sistema.
- Uma pessoa pode aparecer apenas uma vez em cada relato.
- Um relato sem envolvido do tipo relatante é considerado anônimo, mesmo que tenha outros envolvidos.
- A informação de anonimato será consultada na API.
- Toda implementação será feita no front-end, dentro de `client/`, sem alterar o back-end.

## Decisões e pontos de atenção

Vamos seguir a organização do código e os componentes já usados nas telas de empresas e relatos.
O cadastro de pessoas será feito em uma tela própria. Nos detalhes do relato, vamos selecionar uma pessoa já cadastrada e definir seu envolvimento.
Precisamos tratar os estados de carregamento, listas vazias e falhas nas operações. Quando houver CPF duplicado ou uma pessoa já estiver vinculada ao relato, a interface deverá informar o motivo da falha.
A API já está pronta e define os contratos disponíveis. Precisamos conferir esses contratos antes da implementação para evitar diferenças entre os dados enviados pela interface e os dados esperados pelo servidor.

## Fluxo de trabalho

- Preparar o ambiente.
- Testar o que o sistema atual possui: navegação, telas e lógica de inclusão, edição e exclusão.
- Conhecer a arquitetura do projeto e a organização dos arquivos para seguir o mesmo padrão de desenvolvimento.
- Conferir os contratos da API de pessoas e envolvimentos.
- Implementar o cadastro e a consulta de pessoas.
- Validar o cadastro, a listagem, os campos obrigatórios e a tentativa de cadastrar um CPF já existente.
- Aplicar melhorias na tela de relatos para abrir os detalhes e consultar os envolvidos.
- Implementar o vínculo de pessoas aos relatos com o tipo de envolvimento.
- Exibir a identificação de relato anônimo ou identificado.
- Validar os vínculos, a tentativa de incluir a mesma pessoa duas vezes e a identificação de anonimato.
- Revisar os fluxos completos e documentar os testes manuais com resultado esperado e resultado obtido.

## Quando considerar concluído

O membro de comitê deverá conseguir cadastrar e consultar pessoas, vincular essas pessoas aos relatos e consultar o papel de cada uma.
Também deverá conseguir identificar se o relato é anônimo, e receber uma mensagem clara quando uma operação não puder ser concluída.