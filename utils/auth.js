import pactum from 'pactum';
import './pactumSetup.js';

export async function gerarToken(email, senha) {
  const response = await pactum
    .spec()
    .post('/login')
    .withBody({ email, password: senha })
    .expectStatus(200)
    .toss();

  return response.body.authorization;
}
