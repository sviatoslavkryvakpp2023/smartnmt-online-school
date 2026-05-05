import { test, expect } from '@playwright/test';

test('user can open home page and go to courses', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('SmartNMT').first()).toBeVisible();

  await page.getByRole('link', { name: /курс/i }).first().click();

  await expect(page.url()).toContain('/courses');
});

test('courses page displays NMT courses', async ({ page }) => {
  await page.goto('/courses');

  await expect(page.getByText(/НМТ/i).first()).toBeVisible();
});