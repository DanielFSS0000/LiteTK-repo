import { expect, type Locator, type Page } from '@playwright/test';

export class TransferPage {
  private readonly page: Page;
  private readonly targetInput: Locator;
  private readonly amountInput: Locator;
  private readonly submitButton: Locator;
  private readonly statusBox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.targetInput = page.getByPlaceholder('Cuenta Destino (Ej: 98765)');
    this.amountInput = page.getByPlaceholder('Monto ($)');
    this.submitButton = page.getByRole('button', { name: 'Enviar Transferencia' });
    this.statusBox = page.locator('#status-box');
  }

  async goto() {
    await this.page.goto('/');
  }

  async fillTransfer(target: string, amount: string) {
    await this.targetInput.fill(target);
    await this.amountInput.fill(amount);
  }

  async submitTransfer() {
    await this.submitButton.click();
  }

  async expectPendingStatus() {
    await expect(this.statusBox).toContainText('PENDIENTE');
  }

  async expectApprovedStatus() {
    await expect(this.statusBox).toContainText('APROBADO', {
      timeout: 10_000
    });
  }
}
