import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { openDemo } from './helpers';

const dir = process.env.SCREENSHOT_DIR || join(__dirname, '..', 'screenshots');

test.beforeAll(() => mkdirSync(dir, { recursive: true }));

test('overview (light, selection toolbar open)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await openDemo(page);
  await page.locator('.nowo-milkdown-directive__content p', { hasText: 'Freeze' }).click();
  await page.waitForTimeout(150);
  await page.keyboard.press('End');
  await page.keyboard.press('Shift+Home');
  await expect(page.locator('.milkdown-toolbar[data-show="true"]')).toHaveCount(1);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(dir, 'overview.png') });
});

test('suggestions (dark)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await openDemo(page, '?theme=dark');
  const comment = page.getByRole('textbox', { name: 'Comment' });
  await comment.click();
  await page.keyboard.press('End');
  await page.keyboard.type(' and @');
  await expect(page.getByRole('listbox', { name: 'People' })).toBeVisible();
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(dir, 'suggestions.png') });
});
