Feature: Criar usuário

  Scenario: Criar usuário com dados válidos
    Given que eu tenho um payload válido de usuário
    When eu envio uma requisição POST para o endpoint usuarios
    Then a resposta deve ter status 201
    And a resposta deve conter o campo "_id"

  Scenario: Criar usuário com administrador "false"
    Given que eu tenho um payload válido de usuário com administrador false
    When eu envio uma requisição POST para o endpoint usuarios
    Then a resposta deve ter status 201
    And a resposta deve conter o campo "_id"

  Scenario: Criar usuário duplicado
    Given que eu tenho um payload válido de usuário
    And o usuário já existe no sistema
    When eu envio uma requisição POST para o endpoint usuarios
    Then a resposta deve ter status 400
    And a mensagem de erro deve ser "Este email já está sendo usado"

  Scenario: Criar usuário inválido
    Given que eu tenho um payload inválido de usuário
    When eu envio uma requisição POST para o endpoint usuarios
    Then a resposta deve ter status 400
    And as mensagens de erro devem ser:
      | nome          | nome não pode ficar em branco            |
      | email         | email deve ser um email válido           |
      | password      | password não pode ficar em branco        |
      | administrador | administrador deve ser 'true' ou 'false' |
