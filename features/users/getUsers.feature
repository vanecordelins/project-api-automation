Feature: Listar usuários

  Scenario: Obter lista de usuários
    When eu envio uma requisição GET para o endpoint "/usuarios"
    Then a resposta deve ter status 200
    And a lista de usuários deve ser retornada
