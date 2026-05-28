import { test } from '@playwright/test';
import { buildUserData } from '../data/registro.data';
import { RegistroPage } from '../pages/RegistroPage';

test.describe('Frontend oficial - registro de usuario', () => {
  test('registra un usuario y espera el estado final sin sleeps fijos', async ({ page }) => {
    const registroPage = new RegistroPage(page);
    const user = buildUserData();

    await registroPage.goto();
    await registroPage.fillForm(user);
    await registroPage.submit();

    await registroPage.expectProcessingStatus();
    await registroPage.expectSuccessfulRegistration();
  });
});
