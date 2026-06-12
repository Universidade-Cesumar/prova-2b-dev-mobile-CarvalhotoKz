export function validarRetirada(estoque, quantidade) {
  return Number(estoque) >= Number(quantidade) && Number(quantidade) > 0;
}
