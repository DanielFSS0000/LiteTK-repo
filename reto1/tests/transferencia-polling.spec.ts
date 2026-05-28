import { test } from '@playwright/test';
import { buildTransferData } from '../data/transferencia.data';
import { TransferPage } from '../pages/TransferPage';
import { forceFastTransferProcessing } from '../support/fastTransfer';

test.describe('Lite Bank - transferencias asincronas', () => {
  test('aprueba una transferencia usando polling sin esperas fijas', async ({ page }) => {
    const transferPage = new TransferPage(page);
    const transfer = buildTransferData();

    await forceFastTransferProcessing(page);
    await transferPage.goto();
    await transferPage.fillTransfer(transfer.target, transfer.amount);
    await transferPage.submitTransfer();

    await transferPage.expectPendingStatus();
    await transferPage.expectApprovedStatus();
  });
});
