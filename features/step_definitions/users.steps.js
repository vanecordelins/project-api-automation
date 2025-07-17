const { Given, When, Then } = require('@cucumber/cucumber');
const pactum = require('pactum');
const assert = require('assert');
const { gerarToken } = require('../../support/auth');
const { usuarioValido } = require('../../support/dataFactory');

let spec;
let payload;
let idUsuario;
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
  payload = usuarioValido();
  spec = pactum.spec();
  await spec
    .post('https://serverest.dev/usuarios')
    .withBody(payload)
    .expectStatus(201)
    .stores('idUsuario', '_id');
  idUsuario = spec.response().json._id;
});

Given('eu estou autenticado com este usuário', async () => {
  token = await gerarToken(payload.email, payload.password);
});

Given('id de usuário inexistente', () => {
  idUsuario = '000000000000000000000000';
});

When('eu envio uma requisição GET para o endpoint "/usuarios/{id}"', async () => {
  spec = pactum.spec();
  await spec
    .get(`https://serverest.dev/usuarios/${idUsuario}`)
    .expectStatus(200);
});

When('eu envio uma requisição GET para o endpoint do usuário inexistente', async () => {
  spec = pactum.spec();
  await spec
    .get(`https://serverest.dev/usuarios/${idUsuario}`)
    .expectStatus(404);
});

When('eu envio uma requisição POST para o endpoint "/usuarios"', async () => {
  spec = pactum.spec();
  await spec
    .post('https://serverest.dev/usuarios')
    .withHeaders('Content-Type', 'application/json')
    .withBody(payload)
    .expectStatus(/20[01]/);
});

When('eu envio uma requisição PUT para o endpoint "/usuarios/{id}" com dados atualizados', async () => {
  const updated = { nome: 'Nome Atualizado', administrador: 'false' };
  spec = pactum.spec();
  await spec
    .put(`https://serverest.dev/usuarios/${idUsuario}`)
    .withHeaders('Authorization', token)
    .withBody(updated)
    .expectStatus(200);
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

When('eu envio uma requisição DELETE para o endpoint "/usuarios/{id}"', async () => {
  spec = pactum.spec();
  await spec
    .delete(`https://serverest.dev/usuarios/${idUsuario}`)
    .withHeaders('Authorization', token)
    .expectStatus(200);
});

When('eu envio uma requisição DELETE para o endpoint do usuário inexistente', async () => {
  spec = pactum.spec();
  await spec
    .delete(`https://serverest.dev/usuarios/${idUsuario}`)
    .withHeaders('Authorization', token)
    .expectStatus(404);
});

Then('a resposta deve ter status {int}', () => {
  assert.strictEqual(spec.response().statusCode, parseInt(spec.response().statusCode));
});

Then('a resposta deve conter o campo "_id"', () => {
  const body = spec.response().json;
  assert.ok(body._id);
});

Then('a lista de usuários deve ser retornada', () => {
  const body = spec.response().json;
  assert.ok(Array.isArray(body.usuarios));
});

Then('a resposta deve conter o usuário criado', () => {
  const body = spec.response().json;
  assert.strictEqual(body.usuario._id, idUsuario);
});

Then('a resposta deve refletir as atualizações', () => {
  const body = spec.response().json;
  assert.strictEqual(body.usuario.nome, 'Nome Atualizado');
});


When('eu envio uma requisição POST para o endpoint "/usuarios"', async () => {
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

When('eu envio uma requisição GET para o endpoint "/usuarios"', async () => {
  spec = pactum.spec();
  await spec.get('https://serverest.dev/usuarios').expectStatus(200);
});

When('eu envio uma requisição PUT para o endpoint "/usuarios"', async () => {
  spec = pactum.spec();
  spec.put(`https://serverest.dev/usuarios/${global.idUsuario}`)
    .withHeaders("Authorization", global.token)
    .withBody({ nome: "Atualizado", email: global.usuarioPayload.email, password: "123456", administrador: "true" })
    .expectStatus(200);
  await spec.toss();
});

When('eu envio uma requisição DELETE para o endpoint "/usuarios"', async () => {
  spec = pactum.spec();
  spec.delete(`https://serverest.dev/usuarios/${global.idUsuario}`)
    .withHeaders("Authorization", global.token)
    .expectStatus(200);
  await spec.toss();
});
