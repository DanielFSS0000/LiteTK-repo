import { expect, type Locator, type Page } from '@playwright/test';

export class RegistroPage {
  private readonly page: Page;
  private readonly nameInput: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly registerButton: Locator;
  private readonly statusBox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByLabel('Nombre');
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.locator('#password');
    this.registerButton = page.getByRole('button', { name: 'Registrar' });
    this.statusBox = page.locator('#status-box');
  }

  async goto() {
    await this.page.goto('/');
  }

  async fillForm(user: { name: string; email: string; password: string }) {
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
