import { Given, When, Then } from '@cucumber/cucumber';
import { faker } from '@faker-js/faker';
import pactum from 'pactum';
import assert from 'assert';
import { gerarToken } from '../../support/auth.js';
import { usuarioValido } from '../../support/dataFactory.js';
import { gerarIdAleatorio } from '../../utils/dataUtils.js';

let spec;
let payload;
let idUsuario = gerarIdAleatorio(10);
let token;


When('eu envio uma requisição PUT para o endpoint usuarios com dados atualizados', async function () {
  const payloadAtualizado = {
    nome: 'Nome Atualizado ' + Date.now(),
    email: `atualizado${Date.now()}@teste.com`,
    password: '123456',
    administrador: 'true'
  };

  this.usuarioAtualizadoPayload = payloadAtualizado;

  this.spec = pactum.spec();
  await this.spec
    .put(`https://serverest.dev/usuarios/${this.idUsuario}`)
    .withBody(payloadAtualizado)
    .expectStatus(200)
    .toss();
});

When('eu envio uma requisição PUT para o endpoint com dados inválidos', async function () {
  this.spec = pactum.spec();
  await this.spec
    .put(`https://serverest.dev/usuarios/${this.idUsuario}`)
    .withHeaders("Authorization", global.token)
    .withBody({
      nome: "",
      email: "emailinvalido",
      password: "",
      administrador: "maybe"
    })
    .expectStatus(400)
    .toss();
});

Then('a resposta deve refletir as atualizações', async function () {
  const spec = pactum.spec();

  const res = await spec
    .get(`https://serverest.dev/usuarios/${this.idUsuario}`)
    .expectStatus(200)
    .toss();

  const usuarioAtualizado = res.body;

  //console.log('Usuário atualizado (GET após PUT):', JSON.stringify(usuarioAtualizado, null, 2));
  //console.log('Payload esperado:', JSON.stringify(this.usuarioAtualizadoPayload, null, 2));

  assert.strictEqual(usuarioAtualizado.nome, this.usuarioAtualizadoPayload.nome, 'Nome não foi atualizado corretamente');
  assert.strictEqual(usuarioAtualizado.email, this.usuarioAtualizadoPayload.email, 'Email não foi atualizado corretamente');
});