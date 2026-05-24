const { expect } = require('@playwright/test');

class RegistroPage {
  constructor(page) {
    this.page = page;
    this.nameInput = page.getByLabel('Nombre');
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByTestId('user-password');
    this.registerButton = page.getByRole('button', { name: 'Registrar' });
    this.statusBox = page.getByTestId('registration-status');
  }

  async goto() {
    await this.page.goto('/');
  }

  async fillForm(user) {
    await this.nameInput.fill(user.name);
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
  }

  async submit() {
    await this.registerButton.click();
  }

  async expectProcessingStatus() {
    await expect(this.statusBox).toContainText('Procesando');
  }

  async expectSuccessfulRegistration() {
    await expect(this.statusBox).toContainText('Usuario Creado Exitosamente', {
      timeout: 10_000
    });
  }
}

module.exports = { RegistroPage };
