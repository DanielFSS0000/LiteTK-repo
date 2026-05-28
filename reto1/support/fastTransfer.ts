import type { Page, Route } from '@playwright/test';

export async function forceFastTransferProcessing(page: Page) {
  await page.route('**/api/transfer', async (route: Route) => {
    const request = route.request();
    const originalBody = JSON.parse(request.postData() || '{}');

    await route.continue({
      headers: {
        ...request.headers(),
        'content-type': 'application/json'
      },
      postData: JSON.stringify({
        ...originalBody,
        simulationProfile: 'FAST_5',
        speedFactor: 0.1
      })
    });
  });
}
