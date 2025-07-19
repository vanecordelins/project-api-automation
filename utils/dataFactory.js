import { gerarIdAleatorio } from './dataUtils.js';

export function usuarioValido() {
  return {
    nome: "Teste " + gerarIdAleatorio(5),
    email: `usuario${gerarIdAleatorio(5)}@teste.com`,
    password: "123456",
    administrador: "true"
  };
}
