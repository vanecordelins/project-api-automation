import { Given, When, Then } from '@cucumber/cucumber';
import { faker } from '@faker-js/faker';
import pactum from 'pactum';
import assert from 'assert';
import { gerarToken } from '../../utils/auth.js';
import { usuarioValido, usuarioValidoNaoAdministrador } from '../../utils/dataFactory.js';
import { gerarIdAleatorio } from '../../utils/dataUtils.js';
import '../../utils/pactumSetup.js';

let spec;
let payload;
let idUsuario = gerarIdAleatorio(10);
let token;


Given('que eu tenho um payload válido de usuário', function () {
  this.payload = usuarioValido();
});

Given('que eu tenho um payload válido de usuário com administrador false', function () {
  this.payload = usuarioValidoNaoAdministrador();
});

Given('o usuário já existe no sistema', async function () {
  const specCreate = pactum.spec();
  await specCreate
    .post('/usuarios')
    .withBody(this.payload)
    .expectStatus(201)
    .toss();
});

Given('que eu tenho um payload inválido de usuário', function () {
  this.payload = {
    nome: '',
    email: 'email-invalido',
    password: '',
    administrador: 'sem_admin'
  };
});

When('eu envio uma requisição POST para o endpoint usuarios', async function () {
  //console.log('Payload enviado:', this.payload);
  this.spec = pactum.spec();

  const response = await this.spec
    .post('/usuarios')
    .withBody(this.payload)
    .toss();

  this.response = response;

  if (response.statusCode === 201 && response.body && response.body._id) {
    this.idUsuario = response.body._id;
  }

  //console.log('Status:', response.statusCode);
  //console.log('Body:', JSON.stringify(response.body, null, 2));
});

Then('a resposta deve ter status {int}', async function (statusCode) {
  const res = this.spec._response;
  //console.log('Status retornado:', res?.statusCode);
  assert.strictEqual(res.statusCode, statusCode, `Esperado status ${statusCode}, mas foi ${res?.statusCode}`);
});

Then('a resposta deve conter o campo "_id"', function () {
  assert.ok(this.response.body._id, 'Campo _id não encontrado na resposta');
});

Then('a mensagem de erro deve ser {string}', function (mensagemEsperada) {
  const body = this.response.body;

  assert.strictEqual(
    body.message,
    mensagemEsperada,
    `Esperava a mensagem "${mensagemEsperada}" mas recebeu "${body.message}"`
  );
});

Then('as mensagens de erro devem ser:', function (dataTable) {
  const errosEsperados = dataTable.rowsHash();
  const body = this.response.body;

  for (const campo in errosEsperados) {
    assert.strictEqual(
      body[campo],
      errosEsperados[campo],
      `Esperava mensagem de erro no campo '${campo}': "${errosEsperados[campo]}" mas recebeu "${body[campo]}"`
    );
  }
});