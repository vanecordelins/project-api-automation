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

Given('que eu tenho um payload válido de usuário', function () {
  this.payload = usuarioValido();
});


Given('o usuário já existe no sistema', async function () {
  const specCreate = pactum.spec();
  await specCreate
    .post('https://serverest.dev/usuarios')
    .withBody(this.payload)  // usa o payload criado no step anterior
    .expectStatus(201)
    .toss();
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

Given('eu tenho um id de usuário fake', function () {
  this.idUsuario = faker.string.alphanumeric(24);
});


When('eu verifico se o ID realmente não existe', async function () {
  const specCheck = pactum.spec();
  const res = await specCheck
    .get(`https://serverest.dev/usuarios/${this.idUsuario}`)
    .expectStatus(400);
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




When('eu envio uma requisição DELETE para o endpoint do usuário inexistente', async function () {
  this.spec = pactum.spec();
  await this.spec
    .delete(`https://serverest.dev/usuarios/${this.idUsuario}`)
    .withHeaders('Authorization', global.token)
    .expectStatus(200) // mudar para 400 se a API realmente tratar assim
    .toss();
});

Then('a resposta deve indicar que o usuário não existe', function () {
  //esse endpoint retorna 200 com uma mensagem de confirmação que o usuário
  //foi deletado ou não

  const res = this.spec._response;
  const body = res.body;

  // Validação do status
  assert.strictEqual(res.statusCode, 200, `Esperado status 200, mas foi ${res.statusCode}`);

  // Log do corpo da resposta
  console.log('Body:', JSON.stringify(body, null, 2));

  // Validação da mensagem
  assert.ok(
    body.message.includes('Nenhum registro excluído'),
    'Mensagem não indica exclusão inexistente')
});



Then('a resposta deve ter status {int}', async function (statusCode) {
  const res = this.spec._response;
  console.log('Status retornado:', res?.statusCode);
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



Then('a resposta deve conter o campo "_id"', function () {
  assert.ok(this.response.body._id, 'Campo _id não encontrado na resposta');
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


Given('que eu tenho um payload inválido de usuário', function () {
  this.payload = {
    nome: '',         
    email: 'email-invalido', 
    password: '',     
    administrador: 'sem_admin' 
  };
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




When('eu envio uma requisição DELETE para o endpoint usuarios', async function () {
  this.spec = pactum.spec();

  const response = await this.spec
    .delete(`https://serverest.dev/usuarios/${this.idUsuario}`)
    .withHeaders('Authorization', global.token)
    .expectStatus(200)
    .toss();

  // Prints para depuração
  console.log('Status da resposta:', response.statusCode);
  console.log('Corpo da resposta:', JSON.stringify(response.body, null, 2));
});



When('eu envio uma requisição POST para o endpoint usuarios', async function () {
  console.log('Payload enviado:', this.payload); 
  this.spec = pactum.spec();

  const response = await this.spec
    .post('https://serverest.dev/usuarios')
    .withBody(this.payload)
    .toss();

  this.response = response;

  if (response.statusCode === 201 && response.body && response.body._id) {
    this.idUsuario = response.body._id;
  }

  console.log('Status:', response.statusCode);
  console.log('Body:', JSON.stringify(response.body, null, 2));
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

