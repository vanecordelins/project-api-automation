Feature: Atualizar usuário

  Scenario: Atualizar usuário existente
    Given que eu criei um novo usuário
    And eu estou autenticado com este usuário
    When eu envio uma requisição PUT para o endpoint do usuário com dados atualizados
    Then a resposta deve ter status 200
    And a resposta deve refletir as atualizações

  Scenario: Atualizar usuário inexistente
    Given eu estou autenticado com este usuário
    And id de usuário inexistente
    When eu envio uma requisição PUT para o endpoint do usuário inexistente com dados atualizados
    Then a resposta deve ter status 400
