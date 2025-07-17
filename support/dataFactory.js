const { faker } = require('@faker-js/faker');

function usuarioValido() {
  return {
    nome: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: 'Teste123!',
    administrador: 'true'
  };
}

module.exports = { usuarioValido };
