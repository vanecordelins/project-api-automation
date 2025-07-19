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


Given('eu tenho um id de usuário inexistente', function () {
  this.idUsuario = '000000000000000000000000002344354532432424000000';
});

When('eu envio uma requisição GET para o endpoint usuarios com o ID do usuário criado', async function () {
  this.spec = pactum.spec();
  const response = await this.spec
    .get(`https://serverest.dev/usuarios?_id=${this.idUsuario}`)
    .expectStatus(200)
    .toss();

  this.responseGet = response.body;
  console.log('Corpo da resposta GET:', JSON.stringify(this.responseGet, null, 2));
});

When('eu envio uma requisição GET para o endpoint do usuário inexistente', async function () {
  this.spec = pactum.spec();

  const url = `https://serverest.dev/usuarios?_id=${this.idUsuario}`;
  console.log('URL da requisição GET:', url);

  this.responseGet = await this.spec
    .get(url)
    .expectStatus(200)
    .returns('res.body')
    .toss();

  console.log('Resposta da requisição GET:');
  console.log(JSON.stringify(this.responseGet, null, 2));
});

Then('a resposta deve conter o usuário criado', function () {
  console.log('Response GET:', JSON.stringify(this.responseGet, null, 2));

  if (!this.responseGet) throw new Error('Resposta GET está undefined');

  if (this.responseGet.quantidade === undefined) {
    throw new Error('Campo quantidade não encontrado na resposta');
  }

  if (this.responseGet.quantidade !== 1) {
    throw new Error(`Quantidade esperada 1, mas recebida ${this.responseGet.quantidade}`);
  }

  const usuarioEncontrado = this.responseGet.usuarios.find(u => u._id === this.idUsuario);
  if (!usuarioEncontrado) {
    throw new Error('Usuário criado não foi encontrado na resposta');
  }
});

Then('a resposta deve retornar uma lista vazia', function () {
  if (!this.responseGet) {
    throw new Error('Resposta GET está undefined');
  }

  const { quantidade, usuarios } = this.responseGet;

  if (quantidade !== 0) {
    throw new Error(`Esperava quantidade 0, mas recebeu ${quantidade}`);
  }

  if (!Array.isArray(usuarios) || usuarios.length !== 0) {
    throw new Error('Esperava lista de usuários vazia, mas encontrou usuários');
  }
});

