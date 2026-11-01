# Conferência da entrega

Atualizado em 01/11/2026.

## Funcionalidades e documentação

- [x] Plano de design registrado antes da implementação: [design-plan.md](design-plan.md).
- [x] Cadastro e consulta de pessoas, com os quatro campos obrigatórios e tratamento de CPF duplicado.
- [x] Edição e exclusão de pessoas.
- [x] Consulta e inclusão de envolvidos dentro da edição do relato, com os quatro papéis do PRD.
- [x] Tratamento de vínculo duplicado.
- [x] Indicação de anonimato obtida da API.
- [x] Remoção de envolvimento com confirmação.
- [x] Testes manuais e capturas de Pessoas: [people-validation.md](people-validation.md).
- [x] Testes manuais e capturas de Envolvimentos: [involvement-validation.md](involvement-validation.md).
- [x] Implementação restrita ao diretório `client/`.

## Comandos de verificação

Executar a partir da raiz do projeto, com os containers ativos:

```powershell
docker compose exec frontend pnpm run build
docker compose exec frontend pnpm test
docker compose exec frontend pnpm exec eslint . --max-warnings 0
```

Resultado desta rodada: build concluído, sete testes passando e ESLint sem erros ou avisos. O Vite informa que o bundle ultrapassa 500 kB, sem bloquear a geração.

## Limitação conhecida

A API retorna 500 quando uma pessoa removida de um relato é vinculada novamente ao mesmo relato. O registro usa exclusão lógica, mas o índice único do banco continua considerando a combinação de relato e pessoa. O cenário e o resultado estão registrados nas evidências de Envolvimentos. A correção depende do back-end, que não pode ser alterado nesta etapa.

Os documentos de evidências também listam os cenários que não foram simulados.

## Etapas para depois

- [ ] Revisar as alterações, comitar e atualizar o repositório no GitHub. Essa etapa será feita pelo candidato.
- [ ] Preencher o formulário obrigatório de encerramento indicado no README. O candidato decidiu deixar essa etapa para depois.
- [ ] Conferir as instruções de envio e avisar a recrutadora da conclusão.
