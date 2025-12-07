import { test, expect } from '@playwright/test';

const THEME_PREF_ATTR = 'data-theme-preference';
const APPLIED_THEME_ATTR = 'data-theme';
const STORAGE_KEY = 'ott-theme-preference';

test.describe('Theme selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem(STORAGE_KEY);
    });
  });

  test('defaults to system on desktop and follows system preference', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');

    const html = page.locator('html');
    await expect(html).toHaveAttribute(THEME_PREF_ATTR, 'system');
    await expect(html).toHaveAttribute(APPLIED_THEME_ATTR, 'light');
  });

  test.describe('Mobile default', () => {
    test.use({
      viewport: { width: 393, height: 786 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
    });

    test('defaults to dark on mobile when no preference is saved', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto('/');

      const html = page.locator('html');
      await expect(html).toHaveAttribute(THEME_PREF_ATTR, 'dark');
      await expect(html).toHaveAttribute(APPLIED_THEME_ATTR, 'dark');
    });
  });

  test('allows selecting and persisting theme preference', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');

    const html = page.locator('html');
    const light = page.getByTestId('theme-option-light');
    const dark = page.getByTestId('theme-option-dark');
    const system = page.getByTestId('theme-option-system');

    await dark.click();
    await expect(html).toHaveAttribute(THEME_PREF_ATTR, 'dark');
    await expect(html).toHaveAttribute(APPLIED_THEME_ATTR, 'dark');
    const storedDark = await page.evaluate(() => localStorage.getItem(STORAGE_KEY));
    expect(storedDark).toBe('dark');

    await light.click();
    await expect(html).toHaveAttribute(THEME_PREF_ATTR, 'light');
    await expect(html).toHaveAttribute(APPLIED_THEME_ATTR, 'light');

    await page.reload();
    await expect(html).toHaveAttribute(THEME_PREF_ATTR, 'light');
    await expect(html).toHaveAttribute(APPLIED_THEME_ATTR, 'light');

    await system.click();
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(50);
    await expect(html).toHaveAttribute(THEME_PREF_ATTR, 'system');
    await expect(html).toHaveAttribute(APPLIED_THEME_ATTR, 'dark');
  });
});
