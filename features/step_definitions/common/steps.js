import { Given, Then } from '@cucumber/cucumber';
import pactum from 'pactum';
import assert from 'assert';
import { gerarToken } from '../../../utils/auth.js';
import { usuarioValido } from '../../../utils/dataFactory.js';
import '../../../utils/pactumSetup.js';

Given('que eu criei um novo usuário', async function () {
  this.spec = pactum.spec();
  const payload = usuarioValido();

  const response = await this.spec
    .post('/usuarios')
    .withBody(payload)
    .expectStatus(201)
    .toss();

  this.idUsuario = response.body._id;
  this.usuarioPayload = payload;

  if (!this.idUsuario) {
    throw new Error('ID do usuário não encontrado na resposta');
  }
});

Given('eu estou autenticado com um usuário válido', async function () {
  if (!this.usuarioPayload) {
    this.usuarioPayload = usuarioValido();

    const specCreate = pactum.spec();
    const response = await specCreate
      .post('/usuarios')
      .withBody(this.usuarioPayload)
      .expectStatus(201)
      .toss();

    if (!response.body._id) {
      throw new Error('Falha ao criar usuário para autenticação');
    }
  }

  const tokenGerado = await gerarToken(this.usuarioPayload.email, this.usuarioPayload.password);
  this.token = tokenGerado;
});

Then('a resposta deve ter status {int}', async function (statusCode) {
  const res = this.spec._response;
  assert.strictEqual(res.statusCode, statusCode, `Esperado status ${statusCode}, mas foi ${res?.statusCode}`);
});
