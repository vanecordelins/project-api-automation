import { Given, When, Then } from '@cucumber/cucumber';
import { faker } from '@faker-js/faker';
import pactum from 'pactum';
import assert from 'assert';
import '../../utils/pactumSetup.js';

Given('eu tenho um id de usuário fake', function () {
  this.idUsuario = faker.string.alphanumeric(24);
});

Given('eu verifico se o ID realmente não existe', async function () {
  const specCheck = pactum.spec();
  await specCheck
    .get(`/usuarios/${this.idUsuario}`)
    .expectStatus(400)
    .toss();
});

When('eu envio uma requisição DELETE para o endpoint usuarios', async function () {
  this.spec = pactum.spec();
  const response = await this.spec
    .delete(`/usuarios/${this.idUsuario}`)
    .withHeaders('Authorization', this.token)
    .expectStatus(200)
    .toss();

  //console.log('Status da resposta:', response.statusCode);
  //console.log('Corpo da resposta:', JSON.stringify(response.body, null, 2));
});

When('eu envio uma requisição DELETE para o endpoint do usuário inexistente', async function () {
  this.spec = pactum.spec();
  await this.spec
    .delete(`/usuarios/${this.idUsuario}`)
    .withHeaders('Authorization', this.token)
    .expectStatus(200) // pode ajustar se API retornar 400
    .toss();
});

Then('a resposta deve indicar que o usuário não existe', function () {
  const res = this.spec._response;
  const body = res.body;

  assert.strictEqual(res.statusCode, 200, `Esperado status 200, mas foi ${res.statusCode}`);

  //console.log('Body:', JSON.stringify(body, null, 2));

  assert.ok(
    body.message.includes('Nenhum registro excluído'),
    'Mensagem não indica exclusão inexistente'
  );
});