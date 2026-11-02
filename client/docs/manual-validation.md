# Validações manuais

Validações realizadas em 01 e 02/11/2026, no ambiente local com Docker: front-end em `https://localhost:5100` e API em `http://localhost:8080`.

Foram usados dados fictícios. Os cadastros temporários foram removidos ao concluir os testes.

## Pessoas

| O que foi testado | Como foi testado | Resultado esperado | Resultado obtido |
| --- | --- | --- | --- |
| Cadastro e consulta | Cadastrar nome, CPF, e-mail e nascimento válidos. Sair da tela e voltar. | Salvar e manter a pessoa na listagem. | A pessoa apareceu na tabela e permaneceu após navegar. |
| Campos inválidos | Enviar campos vazios; depois testar nome só com espaços, CPF curto ou com letras e e-mail inválido. | Impedir o envio e informar os erros. | Os campos exibiram as validações correspondentes. |
| CPF duplicado | Tentar usar um CPF já cadastrado, tanto no cadastro quanto na edição. | Rejeitar a operação. | Exibida a mensagem “Este CPF já está cadastrado.” |
| Edição | Abrir a pessoa cadastrada e alterar nome, e-mail e nascimento. Conferir a API. | Preencher os dados atuais e atualizar a mesma pessoa. | Os campos vieram preenchidos. As alterações foram salvas, mantendo o ID. |
| Exclusão | Cancelar a confirmação e depois repetir a operação confirmando. | Preservar ao cancelar e remover ao confirmar. | A pessoa permaneceu após cancelar. Ao confirmar, saiu da lista e a busca por ID retornou 404. |

Evidência: [cadastro na listagem](images/people-created.png).

## Relatos e envolvidos

| O que foi testado | Como foi testado | Resultado esperado | Resultado obtido |
| --- | --- | --- | --- |
| Campos obrigatórios | Adicionar envolvido sem selecionar pessoa e tipo. | Impedir o envio. | Exibidas as duas mensagens de preenchimento obrigatório. |
| Inclusão e anonimato | Abrir um relato sem envolvidos, adicionar uma testemunha e depois um relatante. | Manter anonimato até existir um relatante. | O relato começou anônimo, continuou anônimo com testemunha e passou a identificado com relatante. |
| Vínculo duplicado | Selecionar uma pessoa e criar seu vínculo pela API antes de enviar o formulário, simulando outra sessão. | Rejeitar a duplicata e atualizar os dados. | Retorno 409, mensagem em português e atualização da lista. |
| Persistência | Adicionar envolvidos, alterar o título sem salvar, fechar e reabrir. Depois salvar uma alteração de título. | Preservar os vínculos, descartar o título não salvo e salvar quando solicitado. | Os vínculos permaneceram. O título só mudou após clicar em “Salvar relato”. |
| Remoção e anonimato | Remover o relatante com confirmação. | Preservar os demais envolvidos e voltar ao anonimato. | Os outros vínculos permaneceram e o relato passou a “Anônimo”. |
| Listagem de relatos | Consultar as colunas de envolvidos. Adicionar um relatante pela edição e fechar o modal. | Mostrar cada papel e atualizar a identificação. | Os nomes apareceram nas colunas corretas. Ao fechar, a linha mostrou o novo relatante e “Identificado”. A rolagem permitiu acessar todas as colunas. |

Evidências: [envolvidos no relato](images/involvements-identified.png) e [listagem de relatos](images/records-involvements-final.png).

## Verificações e limitações

- `pnpm run build` e `pnpm exec eslint . --max-warnings 0`: passaram.
- `pnpm test`: sete testes passaram.
- O build mantém um aviso de tamanho do bundle, sem impedir a geração.
- A API retorna 500 ao reincluir uma pessoa removida do mesmo relato, pois a exclusão lógica mantém o registro considerado pelo índice único. Sugestão: na criação do vínculo, consultar também os registros excluídos. Se o vínculo estiver excluído, restaurá-lo com e atualizar seu tipo de envolvimento.
- Foi identificado N+1 nas requisições: uma para listar relatos e uma de envolvidos por relato. Sugestão: incluir os envolvidos e o anonimato em `GET /records`. No back-end, carregar os relacionamentos em lote e calcular `is_anonymous` a partir desses vínculos já carregados, sem executar outra consulta por relato. Assim, o front-end recebe esses dados em uma única resposta.
- Nenhum arquivo de `server/` foi alterado, respeitando a restrição do case.
- Não foram simuladas falhas de carregamento, ausência de pessoas cadastradas, consulta de vínculo com pessoa excluída ou paginação da listagem simplificada.
