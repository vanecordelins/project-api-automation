Feature: Atualizar usuário

  Scenario: Atualizar usuário existente
    Given que eu criei um novo usuário
    And eu estou autenticado com um usuário válido
    When eu envio uma requisição PUT para o endpoint usuarios com dados atualizados
    And a resposta deve ter status 200
    Then a resposta deve refletir as atualizações

  Scenario: Atualizar usuário com dados inválidos
    Given eu estou autenticado com um usuário válido
    And eu tenho um id de usuário inexistente
    When eu envio uma requisição PUT para o endpoint com dados inválidos
    Then a resposta deve ter status 400
