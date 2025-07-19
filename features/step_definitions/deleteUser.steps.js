import { Given, When, Then } from '@cucumber/cucumber';
import { faker } from '@faker-js/faker';
import pactum from 'pactum';
import assert from 'assert';
import { gerarToken } from '../../utils/auth.js';
import { usuarioValido } from '../../utils/dataFactory.js';
import { gerarIdAleatorio } from '../../utils/dataUtils.js';

let spec;
let payload;
let idUsuario = gerarIdAleatorio(10);
let token;


Given('que eu criei um novo usuário', async function () {
  this.spec = pactum.spec();
  const payload = usuarioValido();

  const response = await this.spec
    .post('https://serverest.dev/usuarios')
    .withBody(payload)
    .expectStatus(201)
    .toss();

  //console.log('Resposta da criação do usuário:', JSON.stringify(response.body, null, 2));

  this.idUsuario = response.body._id;
  this.usuarioPayload = payload;

  if (!this.idUsuario) {
    throw new Error('ID do usuário não encontrado na resposta');
  }
});

Given('eu estou autenticado com um usuário válido', async function () {
  if (!this.usuarioPayload) {
    // Criar usuário apenas para autenticação
    this.usuarioPayload = usuarioValido();

    const specCreate = pactum.spec();
    const response = await specCreate
      .post('https://serverest.dev/usuarios')
      .withBody(this.usuarioPayload)
      .expectStatus(201)
      .toss();

    if (!response.body._id) {
      throw new Error('Falha ao criar usuário para autenticação');
    }
  }

  const tokenGerado = await gerarToken(this.usuarioPayload.email, this.usuarioPayload.password);
  global.token = tokenGerado;
});

Given('eu tenho um id de usuário fake', function () {
  this.idUsuario = faker.string.alphanumeric(24);
});

Given('eu verifico se o ID realmente não existe', async function () {
  const specCheck = pactum.spec();
  await specCheck
    .get(`https://serverest.dev/usuarios/${this.idUsuario}`)
    .expectStatus(400)
    .toss();
});

When('eu envio uma requisição DELETE para o endpoint usuarios', async function () {
  this.spec = pactum.spec();

  const response = await this.spec
    .delete(`https://serverest.dev/usuarios/${this.idUsuario}`)
    .withHeaders('Authorization', global.token)
    .expectStatus(200)
    .toss();

  //console.log('Status da resposta:', response.statusCode);
  //console.log('Corpo da resposta:', JSON.stringify(response.body, null, 2));
});

When('eu envio uma requisição DELETE para o endpoint do usuário inexistente', async function () {
  this.spec = pactum.spec();
  await this.spec
    .delete(`https://serverest.dev/usuarios/${this.idUsuario}`)
    .withHeaders('Authorization', global.token)
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