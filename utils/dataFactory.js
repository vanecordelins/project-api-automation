import { gerarIdAleatorio } from './dataUtils.js';

function baseUsuarioValido() {
  return {
    nome: "Teste " + gerarIdAleatorio(5),
    email: `usuario${gerarIdAleatorio(5)}@teste.com`,
    password: "123456",
    administrador: "true"
  };
}

export function usuarioValido() {
  return baseUsuarioValido();
}

export function usuarioValidoNaoAdministrador() {
  return {
    ...usuarioValido(),
    administrador: "false"
  };
}
