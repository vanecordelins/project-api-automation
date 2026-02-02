import { Given, When, Then } from '@cucumber/cucumber';
import { faker } from '@faker-js/faker';
import pactum from 'pactum';
import assert from 'assert';
import { gerarToken } from '../../utils/auth.js';
import { usuarioValido } from '../../utils/dataFactory.js';
import { gerarIdAleatorio } from '../../utils/dataUtils.js';
import '../../utils/pactumSetup.js';

let spec;
let payload;
let idUsuario = gerarIdAleatorio(10);
let token;


When('eu envio uma requisição GET para o endpoint usuarios sem parametros', async function () {
  this.spec = pactum.spec();
  const response = await this.spec
    .get('/usuarios')
    .expectStatus(200)
    .toss();

  this.responseGet = response.body;
});

Then('a lista de usuários deve ser retornada', async function () {
  const body = this.spec._response.body;
  assert.ok(Array.isArray(body.usuarios), 'usuarios não é um array');
  assert.ok(body.usuarios.length > 0, 'lista de usuários está vazia');
});