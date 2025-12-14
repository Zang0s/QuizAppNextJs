const { test, expect } = require('@playwright/test');

test('has link do login page', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: /Zaloguj/i }).first().click();

  await expect(page).toHaveURL(/.*\/public\/user\/signin/);

  await expect(page.getByRole('heading', { name: /Zaloguj się/i })).toBeVisible();
});

