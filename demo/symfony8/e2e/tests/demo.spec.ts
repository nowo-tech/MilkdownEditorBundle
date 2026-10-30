import { expect, test } from '@playwright/test';
import { caretAtEnd, editable, openDemo, openToolbar, seriousViolations, violations, watch } from './helpers';

test.describe('Milkdown editor demo', () => {
  for (const theme of ['light', 'dark'] as const) {
    test(`axe: no serious or critical violations (${theme})`, async ({ page }) => {
      await openDemo(page, theme === 'dark' ? '?theme=dark' : '');
      await openToolbar(page);
      expect(await seriousViolations(page)).toEqual([]);
    });
  }

  test('axe with the suggestion list open', async ({ page }) => {
    await openDemo(page);
    await caretAtEnd(page);
    await page.keyboard.press('Enter');
    await page.keyboard.type('@gr');
    await expect(page.getByRole('listbox', { name: 'People' })).toBeVisible();
    expect(await seriousViolations(page)).toEqual([]);
  });

  test('0 CSP violations under the strict nonce policy (CodeMirror, KaTeX, Mermaid, toolbar)', async ({ page }) => {
    const log = await watch(page);
    await openDemo(page, '?devtools=0');
    await expect(page.locator('.nowo-milkdown .nowo-md-mermaid svg')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('.nowo-milkdown .katex').first()).toBeVisible();
    await openToolbar(page);
    await caretAtEnd(page);
    await page.keyboard.press('Enter');
    await page.keyboard.type('Ask @gr');
    await expect(page.getByRole('listbox', { name: 'People' })).toBeVisible();
    expect(await violations(page)).toEqual([]);
    expect(log.errors).toEqual([]);
  });

  test('Tab leaves the editor (no keyboard trap) and nests list items', async ({ page }) => {
    await openDemo(page);
    // Wiki editor, plain paragraph: focus leaves the editable.
    await caretAtEnd(page);
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement?.getAttribute('aria-labelledby'))).not.toBe('form_body_label');
    // Comment editor: Tab reaches the Save button, Shift+Tab comes back.
    const comment = page.getByRole('textbox', { name: 'Comment' });
    await comment.click();
    await page.keyboard.press('End');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Save' })).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(comment).toBeFocused();
    // Inside a list item, Tab nests the item and keeps the focus.
    await page.locator('.nowo-milkdown-task__content p', { hasText: 'Tag' }).click();
    await expect(editable(page)).toBeFocused();
    await page.waitForTimeout(150); // let the click's selection reach the editor state
    await page.keyboard.press('Tab');
    await expect(page.locator('.nowo-milkdown .ProseMirror li li', { hasText: 'Tag' })).toHaveCount(1);
    expect(await page.evaluate(() => document.activeElement?.closest('.nowo-milkdown') !== null)).toBe(true);
  });

  test('suggestions: keyboard flow inserts a page link resolved per viewer', async ({ page }) => {
    await openDemo(page);
    await caretAtEnd(page);
    await page.keyboard.press('Enter');
    await page.keyboard.type('See [[inst');
    const list = page.getByRole('listbox', { name: 'Pages' });
    await expect(list.getByRole('option')).toHaveCount(1);
    await expect(editable(page)).toHaveAttribute('aria-activedescendant', /opt-0$/);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(list).toBeHidden();
    await expect(page.locator('.nowo-milkdown-ref', { hasText: 'Installation guide' })).toBeVisible();
    await expect(page.locator('.nowo-milkdown-ref--hidden')).toHaveText('Content not visible');
  });

  test('save: the Markdown round trip is stable and the PHP render matches the dialect', async ({ page }) => {
    await openDemo(page);
    await page.getByRole('button', { name: 'Save' }).click();
    const first = await page.locator('.demo-source').textContent();
    await expect(page.locator('[data-preview] .nowo-md-callout--warning')).toBeVisible();
    await expect(page.locator('[data-preview] .nowo-md-ref--hidden')).toHaveText('Content not visible');
    await expect(page.locator('[data-preview] a.nowo-md-ref')).toHaveText('Architecture › setup');
    await expect(page.locator('[data-preview] svg.nowo-md-icon')).toHaveCount(1);
    await page.getByRole('button', { name: 'Save' }).click();
    expect(await page.locator('.demo-source').textContent()).toBe(first);
  });
});
