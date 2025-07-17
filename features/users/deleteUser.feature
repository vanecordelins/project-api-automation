Feature: Deletar usuário

  Scenario: Excluir um usuário existente autenticado
    Given que eu criei um novo usuário
    And eu estou autenticado com este usuário
    When eu envio uma requisição DELETE para o endpoint do usuário
    Then a resposta deve ter status 200

  Scenario: Excluir usuário inexistente autenticado
    Given eu estou autenticado com este usuário
    And id de usuário inexistente
    When eu envio uma requisição DELETE para o endpoint do usuário inexistente
    Then a resposta deve ter status 400
