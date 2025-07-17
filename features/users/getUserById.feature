Feature: Obter usuário por ID

  Scenario: Buscar usuário existente
    Given que eu criei um novo usuário
    When eu envio uma requisição GET para o endpoint usuarios com o ID do usuário criado
    Then a resposta deve ter status 200
    And a resposta deve conter o usuário criado

  Scenario: Buscar usuário inexistente
    Given eu tenho um id de usuário inexistente
    When eu envio uma requisição GET para o endpoint do usuário inexistente
    Then a resposta deve retornar uma lista vazia
