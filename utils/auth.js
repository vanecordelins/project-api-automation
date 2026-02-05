import pactum from 'pactum';
import { BASE_URL } from './config.js';

export async function gerarToken(email, senha) {
  const response = await pactum
    .spec()
    .post(`${BASE_URL}/login`)
    .withBody({ email, password: senha })
    .expectStatus(200)
    .toss();

  return response.body.authorization;
}
