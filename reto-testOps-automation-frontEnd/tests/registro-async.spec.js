const { test } = require('@playwright/test');
const { RegistroPage } = require('../pages/RegistroPage');
const { buildUser } = require('../data/registro.data');

test.describe('Lite Bank - registro de usuario asincrono', () => {
  test('debe registrar un usuario esperando el estado final sin sleeps fijos', async ({ page }) => {
    const registroPage = new RegistroPage(page);
    const user = buildUser();

    await registroPage.goto();
    await registroPage.fillForm(user);
    await registroPage.submit();
    await registroPage.expectProcessingStatus();
    await registroPage.expectSuccessfulRegistration();
  });
});
