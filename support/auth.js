const pactum = require('pactum');

async function gerarToken(email, password) {
  const spec = pactum.spec();
  await spec
    .post('https://serverest.dev/login')
    .withHeaders('Content-Type', 'application/json')
    .withBody({ email, password })
    .expectStatus(200);
  return spec.response().json.authorization;
}

module.exports = { gerarToken };
