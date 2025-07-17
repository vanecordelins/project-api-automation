import { Given, When, Then } from '@cucumber/cucumber';
import pactum from 'pactum';
import assert from 'assert';
import { gerarToken } from '../../support/auth.js';
import { usuarioValido } from '../../support/dataFactory.js';
import { gerarIdAleatorio } from '../../utils/dataUtils.js';

let spec;
let payload;
let idUsuario = gerarIdAleatorio(10);
let token;

Given('que eu tenho um payload válido de usuário', () => {
  payload = usuarioValido();
});

Given('o usuário já existe no sistema', async () => {
  const specCreate = pactum.spec();
  await specCreate
    .post('https://serverest.dev/usuarios')
    .withBody(payload)
    .expectStatus(201);
});

Given('que eu criei um novo usuário', async () => {
  payload = usuarioValido(); // gera os dados do usuário
  spec = pactum.spec();

  await spec
    .post('https://serverest.dev/usuarios')
    .withBody(payload)
    .expectStatus(201)
    .stores('idUsuario', '_id'); // armazena o _id do usuário criado

  // Armazena os dados em variáveis globais para uso em outros steps
  global.idUsuario = spec._stash.getDataStore().idUsuario;
  global.usuarioPayload = payload; // armazena o payload para reuso
});


Given('eu estou autenticado com este usuário', async () => {
  assert.ok(payload, 'Payload do usuário está indefinido!');
  token = await gerarToken(payload.email, payload.password);
  global.token = token;
});


Given('id de usuário inexistente', () => {
  idUsuario = '000000000000000000000000';
});


When('eu envio uma requisição GET para o endpoint do usuário inexistente', async () => {
  spec = pactum.spec();
  await spec
    .get(`https://serverest.dev/usuarios?_id=${idUsuario}`)
    .expectStatus(404);
});



When('eu envio uma requisição PUT para o endpoint do usuário inexistente com dados atualizados', async () => {
  const updated = { nome: 'Teste', administrador: 'true' };
  spec = pactum.spec();
  await spec
    .put(`https://serverest.dev/usuarios/${idUsuario}`)
    .withHeaders('Authorization', token)
    .withBody(updated)
    .expectStatus(404);
});


When('eu envio uma requisição DELETE para o endpoint do usuário inexistente', async () => {
  spec = pactum.spec();
  await spec
    .delete(`https://serverest.dev/usuarios/${idUsuario}`)
    .withHeaders('Authorization', token)
    .expectStatus(404);
});


Then('a resposta deve ter status {int}', async function (statusCode) {
  const res = this.spec._response;
  console.log('Status retornado:', res?.statusCode);
  assert.strictEqual(res.statusCode, statusCode, `Esperado status ${statusCode}, mas foi ${res?.statusCode}`);
});



Then('a resposta deve conter o campo "_id"', () => {
  const body = spec.response().json;
  assert.ok(body._id);
});

Then('a lista de usuários deve ser retornada', async function () {
  const body = this.spec._response.body;
  assert.ok(Array.isArray(body.usuarios), 'usuarios não é um array');
  assert.ok(body.usuarios.length > 0, 'lista de usuários está vazia');
});

Then('a resposta deve conter o usuário criado', () => {
  const body = spec.response().json;
  assert.strictEqual(body.usuario._id, idUsuario);
});

Then('a resposta deve refletir as atualizações', () => {
  const body = spec.response().json;
  assert.strictEqual(body.usuario.nome, 'Nome Atualizado');
});


When('eu envio uma requisição POST para o endpoint usuarios', async () =>  {
  spec = pactum.spec();
  spec.post('https://serverest.dev/usuarios')
    .withBody(global.usuarioPayload)
    .expectStatus(201);
  const response = await spec.toss();
  if (response.statusCode === 201 && response.body && response.body._id) {
    global.idUsuario = response.body._id;
  } else {
    throw new Error('Falha ao criar usuário: ID não encontrado');
  }
});


When('eu envio uma requisição GET para o endpoint usuarios', async function () {
  this.spec = pactum.spec();
  this.spec.get('https://serverest.dev/usuarios');
  await this.spec.toss();
});



When('eu envio uma requisição PUT para o endpoint usuarios com dados atualizados', async () => {
  spec = pactum.spec();
  await spec
    .put(`https://serverest.dev/usuarios/${global.idUsuario}`)
    .withHeaders("Authorization", global.token)
    .withBody({
      nome: "Atualizado",
      email: global.usuarioPayload.email,
      password: "123456",
      administrador: "true"
    })
    .expectStatus(200);
});



When('eu envio uma requisição DELETE para o endpoint usuarios', async () => {
  spec = pactum.spec();
  spec.delete(`https://serverest.dev/usuarios/${global.idUsuario}`)
    .withHeaders("Authorization", global.token)
    .expectStatus(200);
  await spec.toss();
});
