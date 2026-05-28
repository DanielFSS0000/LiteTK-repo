export function buildUserData() {
  const timestamp = Date.now();

  return {
    name: `Usuario QA ${timestamp}`,
    email: `usuario.qa.${timestamp}@litebank.test`,
    password: 'LiteBank123!'
  };
}
