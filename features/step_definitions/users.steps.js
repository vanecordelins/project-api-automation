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


Given('que eu criei um novo usuário', async function () {
  this.spec = pactum.spec();
  const payload = usuarioValido();

  const response = await this.spec
    .post('https://serverest.dev/usuarios')
    .withBody(payload)
    .expectStatus(201)
    .toss();

  console.log('Resposta da criação do usuário:', JSON.stringify(response.body, null, 2));

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



Given('eu tenho um id de usuário inexistente', function () {
  this.idUsuario = '000000000000000000000000002344354532432424000000';
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
  //console.log('Corpo da resposta:', JSON.stringify(res?.body, null, 2));

  assert.strictEqual(res.statusCode, statusCode, `Esperado status ${statusCode}, mas foi ${res?.statusCode}`);
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



Then('a resposta deve conter o campo "_id"', () => {
  const body = spec.response().json;
  assert.ok(body._id);
});

Then('a lista de usuários deve ser retornada', async function () {
  const body = this.spec._response.body;
 // console.log('Corpo da resposta GET:', JSON.stringify(body, null, 2));
  assert.ok(Array.isArray(body.usuarios), 'usuarios não é um array');
  assert.ok(body.usuarios.length > 0, 'lista de usuários está vazia');
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

  // Validar se o usuário está dentro do array usuarios
  const usuarioEncontrado = this.responseGet.usuarios.find(u => u._id === this.idUsuario);
  if (!usuarioEncontrado) {
    throw new Error('Usuário criado não foi encontrado na resposta');
  }
});


Then('a resposta deve refletir as atualizações', async function () {
  const spec = pactum.spec();

  const res = await spec
    .get(`https://serverest.dev/usuarios/${this.idUsuario}`)
    .expectStatus(200)
    .toss();

  const usuarioAtualizado = res.body;

  console.log('Usuário atualizado (GET após PUT):', JSON.stringify(usuarioAtualizado, null, 2));
  console.log('Payload esperado:', JSON.stringify(this.usuarioAtualizadoPayload, null, 2));

  // Verificação dos campos atualizados
  assert.strictEqual(usuarioAtualizado.nome, this.usuarioAtualizadoPayload.nome, 'Nome não foi atualizado corretamente');
  assert.strictEqual(usuarioAtualizado.email, this.usuarioAtualizadoPayload.email, 'Email não foi atualizado corretamente');
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


When('eu envio uma requisição GET para o endpoint usuarios com o ID do usuário criado', async function () {
  this.spec = pactum.spec();
  const response = await this.spec
    .get(`https://serverest.dev/usuarios?_id=${this.idUsuario}`)
    .expectStatus(200)
    .toss();

  this.responseGet = response.body; 
  console.log('Corpo da resposta GET:', JSON.stringify(this.responseGet, null, 2));
});


When('eu envio uma requisição GET para o endpoint usuarios sem parametros', async function () {
  this.spec = pactum.spec();
  const response = await this.spec
    .get('https://serverest.dev/usuarios')  // sem query params
    .expectStatus(200)
    .toss();

  this.responseGet = response.body;
});




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




When('eu envio uma requisição DELETE para o endpoint usuarios', async () => {
  spec = pactum.spec();
  spec.delete(`https://serverest.dev/usuarios/${global.idUsuario}`)
    .withHeaders("Authorization", global.token)
    .expectStatus(200);
  await spec.toss();
});
