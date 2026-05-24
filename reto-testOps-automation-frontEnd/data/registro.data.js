function buildUser() {
  const uniqueId = Date.now();

  return {
    name: `Usuario Reto ${uniqueId}`,
    email: `usuario.reto.${uniqueId}@litebank.test`,
    password: 'LiteBank123!'
  };
}

module.exports = { buildUser };
