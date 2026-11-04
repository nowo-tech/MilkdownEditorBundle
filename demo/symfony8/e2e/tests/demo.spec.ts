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
    await expect(menu.getByRole('menuitem', { name: 'Copy', exact: true })).toBeVisible();
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

  test('Markdown clipboard and Insert: smart paste, Paste / Copy as Markdown, Insert group (axe), read-view copy', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const log = await watch(page);
    await openDemo(page, '?devtools=0');
    // The end of the document, synced to the editor state by typing (a synthetic paste reads the state's selection).
    await editable(page).focus();
    await page.keyboard.press('Control+End');
    await page.keyboard.type('x');
    await page.keyboard.press('Backspace');
    // Smart paste: a code editor's HTML only wraps the text, which is Markdown.
    await editable(page).evaluate((el) => {
      const data = new DataTransfer();
      data.setData('text/html', '<pre><code># Pasted heading\n\n- one</code></pre>');
      data.setData('text/plain', '# Pasted heading\n\n- one');
      el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true }));
    });
    await expect(page.locator('.nowo-milkdown .ProseMirror h1', { hasText: 'Pasted heading' })).toBeVisible();
    // Paste as Markdown from the keyboard.
    await page.evaluate(() => navigator.clipboard.writeText('## From the clipboard'));
    await page.keyboard.press('Control+End');
    await page.keyboard.press('Control+Alt+V');
    await expect(page.locator('.nowo-milkdown .ProseMirror h2', { hasText: 'From the clipboard' })).toBeVisible();
    // Copy as Markdown: select the heading text and copy it.
    await page.locator('.nowo-milkdown .ProseMirror h2', { hasText: 'From the clipboard' }).click();
    await page.keyboard.press('End');
    await page.keyboard.press('Shift+Home');
    // The selection reaches the editor state (the selection toolbar shows it) before the shortcut.
    await expect(page.locator('.milkdown-toolbar[data-show="true"]')).toHaveCount(1);
    await page.keyboard.press('Control+Alt+Shift+C');
    await expect(page.locator('.nowo-milkdown__status').first()).toHaveText('Copied as Markdown');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('## From the clipboard\n');
    // 1.5.1: the confirmation is transient: the next action clears it.
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('.nowo-milkdown__status').first()).toHaveText('');
    // Insert group of the context menu: a new block after the current one.
    await page.locator('.nowo-milkdown .ProseMirror h2', { hasText: 'From the clipboard' }).click({ button: 'right' });
    const menu = page.getByRole('menu', { name: 'Editor actions' });
    await expect(menu.getByRole('menuitem', { name: 'Copy as Markdown' })).toBeVisible();
    await menu.getByRole('menuitem', { name: 'Insert' }).focus();
    await page.keyboard.press('ArrowRight');
    const insert = page.getByRole('menu', { name: 'Insert' });
    await expect(insert.getByRole('menuitem', { name: 'Image or file…' })).toBeVisible();
    expect(await seriousViolations(page)).toEqual([]);
    await insert.getByRole('menuitem', { name: 'Heading 3' }).click();
    await page.keyboard.type('Inserted');
    await expect(page.locator('.nowo-milkdown .ProseMirror h3', { hasText: 'Inserted' })).toBeVisible();
    await expect(page.locator('.nowo-milkdown .ProseMirror h2', { hasText: 'From the clipboard' })).toBeVisible();
    // The read view copies the saved source.
    await page.getByRole('button', { name: 'Save' }).click();
    // Public markup contract of nowo_milkdown_copy_markdown() (1.5.1): hosts may rely on these selectors.
    const wrappers = page.locator('span.nowo-milkdown-copy[data-nowo-milkdown-copy]');
    await expect(wrappers).toHaveCount(2);
    for (const wrapper of await wrappers.all()) {
      await expect(wrapper.locator('> button.nowo-milkdown-copy__button[type="button"][data-nowo-milkdown-copy-markdown][data-copied][data-failed]')).toHaveCount(1);
      await expect(wrapper.locator('> template')).toHaveCount(1);
      await expect(wrapper.locator('> span.nowo-milkdown-copy__status[role="status"]')).toHaveCount(1);
    }
    const copy = page.locator('[data-nowo-milkdown-copy-markdown]').first();
    await expect(copy).toHaveText('Copy as Markdown');
    await copy.click();
    const status = page.locator('.nowo-milkdown-copy__status').first();
    await expect(status).toHaveText('Copied as Markdown');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('### Inserted');
    // The confirmation clears itself (and on the next click).
    await expect(status).toHaveText('', { timeout: 6000 });
    // Icon-only: named by its visually hidden label, icon hidden from assistive technology, no inline style.
    const iconOnly = page.getByRole('button', { name: 'Copy as Markdown' }).nth(1);
    await expect(iconOnly).toHaveClass(/nowo-milkdown-copy__button--icon/);
    await expect(iconOnly.locator('svg.nowo-milkdown-copy__icon[aria-hidden="true"]')).toHaveCount(1);
    expect(await iconOnly.evaluate((b) => b.querySelectorAll('[style]').length + (b.hasAttribute('style') ? 1 : 0))).toBe(0);
    await iconOnly.click();
    await expect(page.locator('.nowo-milkdown-copy__status').nth(1)).toHaveText('Copied as Markdown');
    expect(await seriousViolations(page, '.demo-preview')).toEqual([]);
    expect(log.errors).toEqual([]);
  });

  test('a submenu at the right edge opens to the left of its menu (1.5.1)', async ({ page }) => {
    await openDemo(page, '?devtools=0');
    const width = page.viewportSize()!.width;
    const paragraph = page.locator('.nowo-milkdown .ProseMirror p', { hasText: 'Euler:' });
    await paragraph.click({ button: 'right', position: { x: 5, y: 5 } });
    const menu = page.getByRole('menu', { name: 'Editor actions' });
    await expect(menu).toBeVisible();
    // As if opened at the right edge of the viewport (the menu is kept inside it): no room for a submenu on the right.
    await menu.evaluate((el, w) => {
      el.style.left = `${w - el.getBoundingClientRect().width - 4}px`;
    }, width);
    await menu.getByRole('menuitem', { name: 'Insert' }).focus();
    await page.keyboard.press('ArrowRight');
    const insert = page.getByRole('menu', { name: 'Insert' });
    await expect(insert.getByRole('menuitem').first()).toBeFocused();
    const main = (await menu.boundingBox())!;
    const sub = (await insert.boundingBox())!;
    expect(sub.x + sub.width).toBeLessThanOrEqual(width);
    expect(sub.x + sub.width).toBeLessThanOrEqual(main.x + 1); // beside the menu, not over its shortcut column
    await page.keyboard.press('ArrowLeft');
    await expect(insert).toBeHidden();
    await expect(menu.getByRole('menuitem', { name: 'Insert' })).toBeFocused();
    expect(await seriousViolations(page)).toEqual([]);
    await page.keyboard.press('Escape');
  });

  test('block actions: handle, Ctrl+/ block menu with colours (axe), Alt+Shift+arrows, colours rendered server-side', async ({ page }) => {
    const log = await watch(page);
    await openDemo(page, '?devtools=0');
    const paragraph = page.locator('.nowo-milkdown .ProseMirror p', { hasText: 'Euler:' });
    // The caret first (the demo's first click is the one that settles the lazy previews), then the pointer.
    await caretAtEnd(page);
    await paragraph.hover();
    const handle = page.getByRole('button', { name: 'Block actions' }).first();
    await expect(handle).toBeVisible();
    await page.keyboard.press('Control+/');
    const menu = page.getByRole('menu', { name: 'Block actions' });
    await expect(menu).toBeVisible();
    await menu.getByRole('menuitem', { name: 'Color' }).focus();
    await page.keyboard.press('ArrowRight');
    const colors = page.getByRole('menu', { name: 'Color' });
    await expect(colors).toBeVisible();
    expect(await seriousViolations(page)).toEqual([]);
    await colors.getByRole('menuitemradio', { name: 'Yellow background' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.nowo-milkdown .nowo-milkdown-bg--yellow', { hasText: 'Euler:' })).toBeVisible();
    await expect(editable(page)).toBeFocused();
    // Move the coloured block up with the keyboard; the live region says so.
    await page.keyboard.press('Alt+Shift+ArrowUp');
    await expect(page.locator('.nowo-milkdown__status').first()).toHaveText('Block moved up');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('[data-preview] .nowo-md-bg--yellow')).toContainText('Euler:');
    await expect(page.locator('[data-preview] .nowo-md-bg--blue')).toContainText('Coloured block');
    await expect(page.locator('[data-preview] mark.nowo-md-text--red')).toHaveText('risky');
    // DB-L1: a text-only mark has no background on the read side (as in the editor).
    await expect(page.locator('[data-preview] mark.nowo-md-text--red')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    // The coloured blocks and marks of the PHP render (contrast in this theme).
    expect(await seriousViolations(page, '[data-preview] .nowo-md-bg--yellow, [data-preview] .nowo-md-bg--blue, [data-preview] mark')).toEqual([]);
    expect(await violations(page)).toEqual([]);
    expect(log.errors).toEqual([]);
  });

  test('0 CSP violations under the strict nonce policy (CodeMirror, KaTeX, Mermaid, toolbar)', async ({ page }) => {
    const log = await watch(page);
    await openDemo(page, '?devtools=0');
    await expect(page.locator('.nowo-milkdown .nowo-md-mermaid svg')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('.nowo-milkdown .katex').first()).toBeVisible();
    await openToolbar(page);
    // Collapse the selection first: the selection toolbar may cover the paragraph clicked next.
    await page.keyboard.press('End');
    await expect(page.locator('.milkdown-toolbar[data-show="true"]')).toHaveCount(0);
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
    // 1.7: the inline icon and the callout icon.
    await expect(page.locator('[data-preview] svg.nowo-md-icon')).toHaveCount(2);
    await expect(page.locator('[data-preview] svg.nowo-md-callout__icon[aria-hidden="true"]')).toHaveCount(1);
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
