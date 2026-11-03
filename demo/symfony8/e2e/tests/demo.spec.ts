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

  test('axe waits for the code-block buttons to finish fading in', async ({ page }) => {
    await openDemo(page);
    // Crepe fades the buttons in over 200 ms on hover; slowed down here so axe would start mid-fade.
    await page.addStyleTag({ content: '.nowo-milkdown .milkdown-code-block .tools button { transition-duration: 1s !important }' });
    await page.locator('.nowo-milkdown .milkdown-code-block').first().hover();
    const copy = page.locator('.nowo-milkdown .milkdown-code-block .copy-button').first();
    await expect.poll(() => copy.evaluate((b) => Number(getComputedStyle(b).opacity))).toBeGreaterThan(0);
    expect(await copy.evaluate((b) => Number(getComputedStyle(b).opacity))).toBeLessThan(1);
    expect(await seriousViolations(page)).toEqual([]);
    expect(await copy.evaluate((b) => getComputedStyle(b).opacity)).toBe('1');
  });

  for (const motion of ['no-preference', 'reduce'] as const) {
    test(`keyboard: code-block buttons are visible and focus-ringed when tabbed to (motion ${motion})`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: motion });
      await openDemo(page);
      await page.mouse.move(0, 0); // no hover: only the keyboard focus may reveal the buttons
      const tool = page.locator('.nowo-milkdown .milkdown-code-block .tools button').first();
      await expect(tool).toHaveCSS('opacity', '0');
      await page.locator('body').click({ position: { x: 1, y: 1 } });
      for (let i = 0; i < 40 && !(await tool.evaluate((b) => b === document.activeElement)); i++) {
        await page.keyboard.press('Tab');
      }
      await expect(tool).toBeFocused();
      expect(await tool.evaluate((b) => b.matches(':focus-visible'))).toBe(true);
      if (motion === 'reduce') {
        expect(await tool.evaluate((b) => getComputedStyle(b).opacity)).toBe('1'); // no fade
      }
      await expect(tool).toHaveCSS('opacity', '1');
      await expect(page.locator('.nowo-milkdown .milkdown-code-block .tools-button-group > button').first()).toHaveCSS('opacity', '1');
      await expect(tool).toHaveCSS('outline-style', 'solid');
      await expect(tool).toHaveCSS('outline-width', '2px');
      expect(await seriousViolations(page)).toEqual([]);
      await expect(tool).toBeFocused();
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

  test('context menu: right click, axe with the menu and a submenu open, keyboard turn into, Escape', async ({ page }) => {
    const log = await watch(page);
    await openDemo(page, '?devtools=0');
    const paragraph = page.locator('.nowo-milkdown .ProseMirror p', { hasText: 'Euler:' });
    await paragraph.click({ button: 'right', position: { x: 5, y: 5 } });
    const menu = page.getByRole('menu', { name: 'Editor actions' });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: 'Copy' })).toBeVisible();
    expect(await seriousViolations(page)).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(editable(page)).toBeFocused();
    // Keyboard only: Shift+F10, type-ahead to "Turn into", Right opens the submenu, pick Heading 2.
    await page.keyboard.press('Shift+F10');
    await expect(menu).toBeVisible();
    await page.keyboard.press('t');
    await expect(menu.getByRole('menuitem', { name: 'Turn into' })).toBeFocused();
    await page.keyboard.press('ArrowRight');
    const sub = page.getByRole('menu', { name: 'Turn into' });
    await expect(sub).toBeVisible();
    expect(await seriousViolations(page)).toEqual([]);
    await sub.getByRole('menuitem', { name: 'Heading 2' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.nowo-milkdown .ProseMirror h2', { hasText: 'Euler:' })).toBeVisible();
    await expect(editable(page)).toBeFocused();
    // Shift + right click keeps the browser menu (no custom menu).
    await paragraph.or(page.locator('.nowo-milkdown .ProseMirror h2', { hasText: 'Euler:' })).first().click({ button: 'right', modifiers: ['Shift'] });
    await expect(menu).toBeHidden();
    expect(await violations(page)).toEqual([]);
    expect(log.errors).toEqual([]);
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
    await expect(page.locator('[data-preview] .nowo-md-footnotes li[id^="nowo-md-fn-"][id$="-euler"]')).toContainText("Euler's identity.");
    const ref = page.locator('[data-preview] sup[id^="nowo-md-fnref-"][id$="-euler"] a');
    const target = await page.locator('[data-preview] .nowo-md-footnotes li[id$="-euler"]').getAttribute('id');
    await expect(ref).toHaveAttribute('href', `#${target}`);
    // 1.3.1: the PHP render passes axe too (named task checkboxes, distinguishable footnote links).
    expect(await seriousViolations(page, '[data-preview]')).toEqual([]);
    await page.getByRole('button', { name: 'Save' }).click();
    expect(await page.locator('.demo-source').textContent()).toBe(first);
  });
});
