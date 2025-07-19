Feature: Deletar usuário

  Scenario: Excluir um usuário existente autenticado
    Given que eu criei um novo usuário
    And eu estou autenticado com um usuário válido
    When eu envio uma requisição DELETE para o endpoint usuarios
    Then a resposta deve ter status 200

  Scenario: Excluir usuário inexistente autenticado
    Given eu estou autenticado com um usuário válido
    And eu tenho um id de usuário fake
    And eu verifico se o ID realmente não existe
    When eu envio uma requisição DELETE para o endpoint do usuário inexistente
    Then a resposta deve indicar que o usuário não existe
