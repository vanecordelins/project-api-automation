
# Testes Automatizados da API Serverest

Este projeto realiza testes automatizados para a API [https://serverest.dev](https://serverest.dev) utilizando:

- JavaScript
- Cucumber.js (BDD)
- Pactum.js (requisições)
- GitHub Actions (CI/CD)
- Cucumber HTML Reporter

## Como Executar Localmente

```bash
git clone <este-repositorio>
cd servertest-api-tests-full
npm install
npm test
npm run report   # gera o relatório HTML em cucumber_report.html
```

## Estrutura dos Testes

- `features/users/`: arquivos `.feature` organizados por endpoint (GET, POST, PUT, DELETE)
- `step_definitions/`: implementação dos steps em JavaScript com Pactum.js
- `support/`: geração de token JWT

## Pipeline GitHub Actions

Cada `push` ou `pull_request` na branch `main` executa automaticamente:

1. Instalação de dependências
2. Execução dos testes
3. Geração de relatório
4. Upload do `cucumber_report.html` como artefato

## Autor

Desafio de Automação de Testes para Serverest API
