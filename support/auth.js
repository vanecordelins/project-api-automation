import pactum from 'pactum';

export async function gerarToken(email, senha) {
  const response = await pactum
    .spec()
    .post('https://serverest.dev/login')
    .withBody({ email, password: senha })
    .expectStatus(200)
    .toss();

  return response.body.authorization;
}
