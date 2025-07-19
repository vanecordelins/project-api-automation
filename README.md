[![Run API Tests](https://github.com/vanecordelins/project-api-automation/actions/workflows/tests.yml/badge.svg)](https://github.com/vanecordelins/project-api-automation/actions/workflows/tests.yml)

[![Badge ServeRest](https://img.shields.io/badge/API-ServeRest-green)](https://github.com/ServeRest/ServeRest/)

# Testes Automatizados da API Serverest

Este projeto realiza testes automatizados para a API [https://serverest.dev](https://serverest.dev) utilizando:

- JavaScript
- Cucumber.js (BDD)
- Pactum.js (requisições)
- GitHub Actions (CI/CD)
- Cucumber HTML Reporter

## Como Executar Localmente - Execução padrão básica

```bash
git clone git@github.com:vanecordelins/project-api-automation.git
cd project-api-automation-serverest
npm install
npm test              # executa os testes usando o comando padrão (configurado no package.json)
npm run report        # gera o relatório HTML interativo em cucumber_report.html
```

## Estrutura dos Testes - Execução com mais detalhes dos testes

```bash
git clone git@github.com:vanecordelins/project-api-automation.git
cd project-api-automation-serverest
npm install
npx cucumber-js --format @cucumber/pretty-formatter --format json:cucumber_report.json    # executa os testes com maior detalhamento das features e dos steps
npm run report   # gera o relatório HTML em cucumber_report.html
```

## Estrutura dos Testes

- `features/users/`: arquivos `.feature` organizados por endpoint (GET, POST, PUT, DELETE)
- `step_definitions/`: implementação dos steps em JavaScript com Pactum.js
- `utils/`: geração de token JWT e criação de funções geradoras de dados

## Pipeline GitHub Actions

Cada `push` ou `pull_request` na branch `main` executa automaticamente:

1. Instalação de dependências
2. Execução dos testes
3. Geração de relatório
4. Upload do `cucumber_report.html` como artefato

## Autor
- Vanessa Lins
- Desafio de Automação de Testes para Serverest API
