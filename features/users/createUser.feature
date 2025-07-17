Feature: Criar usuário

  Scenario: Criar usuário com dados válidos
    Given que eu tenho um payload válido de usuário
    When eu envio uma requisição POST para o endpoint usuarios
    Then a resposta deve ter status 201
    And a resposta deve conter o campo "_id"

  Scenario: Criar usuário duplicado
    Given que eu tenho um payload válido de usuário
    And o usuário já existe no sistema
    When eu envio uma requisição POST para o endpoint usuarios
    Then a resposta deve ter status 400
