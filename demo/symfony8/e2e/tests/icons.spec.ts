import { expect, test, type Page } from '@playwright/test';
import { caretAtEnd, editable, openDemo, seriousViolations, violations, watch } from './helpers';

/**
 * 1.7 icons: decorative glyphs in menus, the icon picker from every entry point (each one inserts inline at the caret,
 * in the same paragraph), callout icons (Tabler and emoji), axe, keyboard and CSP.
 */

/** A new paragraph "Alpha Omega" at the end, caret between "Alpha " and "Omega". */
async function alphaOmega(page: Page): Promise<void> {
  await caretAtEnd(page);
  await page.keyboard.press('Enter');
  await page.keyboard.type('Alpha Omega');
  // No wait: the editor reads the caret the browser just moved before acting on the next key (1.7).
  for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowLeft');
}

/** The children of the paragraph holding `text`: text as is, icons as [name]. */
const paragraphOf = (page: Page, text: string): Promise<string[]> =>
  page.evaluate((t) => {
    const paragraphs = [...document.querySelectorAll('.nowo-milkdown .ProseMirror p')].filter((p) => p.textContent?.includes(t));
    return paragraphs.map((p) =>
      [...p.childNodes]
        .map((n) => (n.nodeType === Node.TEXT_NODE ? n.textContent : (n as HTMLElement).dataset?.tabler ? `[${(n as HTMLElement).dataset.tabler}]` : ''))
        .join(''),
    );
  }, text);

const dialog = (page: Page) => page.getByRole('dialog', { name: 'Choose an icon' });
const searchField = (page: Page) => dialog(page).getByRole('combobox', { name: 'Search icons' });

async function pick(page: Page, query: string, name: string): Promise<void> {
  await expect(searchField(page)).toBeFocused();
  await page.keyboard.type(query);
  await expect(dialog(page).getByRole('option', { name, exact: true })).toBeVisible();
  // Keyboard only: move to the option, Enter.
  for (let i = 0; i < 60 && (await dialog(page).getByRole('option', { name, exact: true }).getAttribute('aria-selected')) !== 'true'; i++) {
    await page.keyboard.press('ArrowDown');
  }
  await page.keyboard.press('Enter');
  await expect(dialog(page)).toBeHidden();
  await expect(editable(page)).toBeFocused();
}

test.describe('icons (1.7)', () => {
  test('menus show decorative glyphs; names stay the labels', async ({ page }) => {
    const log = await watch(page);
    await openDemo(page, '?devtools=0');
    const paragraph = page.locator('.nowo-milkdown .ProseMirror p', { hasText: 'Euler:' });
    await paragraph.click({ button: 'right', position: { x: 5, y: 5 } });
    const menu = page.locator('.nowo-milkdown-menu[role="menu"]').first();
    await expect(menu).toBeVisible();
    await expect(menu).toHaveClass(/nowo-milkdown-menu--icons/);
    await expect(page.getByRole('menuitem', { name: 'Copy', exact: true })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Copy', exact: true }).locator('svg.nowo-milkdown-glyph[aria-hidden="true"]')).toHaveCount(1);
    // Every glyph on the page is hidden from assistive technology and has no inline style.
    expect(await page.evaluate(() => [...document.querySelectorAll('.nowo-milkdown-glyph')].filter((g) => g.getAttribute('aria-hidden') !== 'true' || g.hasAttribute('style')).length)).toBe(0);
    expect(await seriousViolations(page)).toEqual([]);
    await page.keyboard.press('Escape');
    expect(await violations(page)).toEqual([]);
    expect(log.errors).toEqual([]);
  });

  test('Insert → Icon… (keyboard) inserts at the caret, inline; axe with the picker open', async ({ page }) => {
    const log = await watch(page);
    await openDemo(page, '?devtools=0');
    await alphaOmega(page);
    await page.keyboard.press('Shift+F10');
    const menu = page.getByRole('menu', { name: 'Editor actions' });
    await menu.getByRole('menuitem', { name: 'Insert' }).focus();
    await page.keyboard.press('ArrowRight');
    const insert = page.getByRole('menu', { name: 'Insert' });
    await insert.getByRole('menuitem', { name: 'Icon…' }).focus();
    await page.keyboard.press('Enter');
    await expect(dialog(page)).toBeVisible();
    await expect(searchField(page)).toBeFocused();
    await page.keyboard.type('rocket');
    await expect(dialog(page).getByRole('listbox')).toBeVisible();
    // Combobox pattern: the active option follows the arrow keys through aria-activedescendant.
    const first = await searchField(page).getAttribute('aria-activedescendant');
    await page.keyboard.press('ArrowDown');
    expect(await searchField(page).getAttribute('aria-activedescendant')).not.toBe(first);
    await page.keyboard.press('ArrowUp');
    expect(await seriousViolations(page)).toEqual([]);
    await page.keyboard.press('Enter');
    await expect(dialog(page)).toBeHidden();
    expect(await paragraphOf(page, 'Alpha')).toEqual(['Alpha [rocket] Omega']);
    expect(await violations(page)).toEqual([]);
    expect(log.errors).toEqual([]);
  });

  test('End then Shift+F10 with no delay: the menu acts at the new caret', async ({ page }) => {
    const log = await watch(page);
    await openDemo(page, '?devtools=0');
    await caretAtEnd(page);
    await page.keyboard.press('Enter');
    await page.keyboard.type('Delta Epsilon');
    await page.keyboard.press('Home');
    await page.keyboard.press('End');
    await page.keyboard.press('Shift+F10');
    const menu = page.getByRole('menu', { name: 'Editor actions' });
    await menu.getByRole('menuitem', { name: 'Insert' }).focus();
    await page.keyboard.press('ArrowRight');
    await page.getByRole('menu', { name: 'Insert' }).getByRole('menuitem', { name: 'Icon…' }).focus();
    await page.keyboard.press('Enter');
    await pick(page, 'flame', 'flame');
    expect(await paragraphOf(page, 'Delta')).toEqual(['Delta Epsilon[flame] ']);
    expect(await violations(page)).toEqual([]);
    expect(log.errors).toEqual([]);
  });

  test('/icon, the action bar button and Browse all icons… insert inline at the caret', async ({ page }) => {
    const log = await watch(page);
    await openDemo(page, '?devtools=0');
    // Slash menu: the block menu only opens at the start of an empty paragraph; the icon lands in it.
    await caretAtEnd(page);
    await page.keyboard.press('Enter');
    await page.keyboard.type('/icon');
    await expect(page.getByRole('listbox', { name: 'Blocks' }).getByRole('option', { name: 'Icon…', exact: true })).toBeVisible();
    await page.keyboard.press('Enter');
    await pick(page, 'bug', 'bug');
    await page.keyboard.type('after');
    expect(await paragraphOf(page, 'after')).toEqual(['[bug] after']);
    // Action bar: the caret stays where it was while the button has the focus.
    await alphaOmega(page);
    await page.getByRole('button', { name: 'Insert icon' }).first().click();
    await pick(page, 'flame', 'flame');
    expect(await paragraphOf(page, 'Alpha')).toEqual(['Alpha [flame] Omega']);
    // ":" suggestions → Browse all icons… with the typed query.
    await page.keyboard.press('End');
    await page.keyboard.press('Enter');
    await page.keyboard.type('Gamma :sparkl');
    const list = page.getByRole('listbox', { name: 'Icons and emoji' });
    await expect(list.getByRole('option', { name: 'Browse all icons…' })).toBeVisible();
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('Enter');
    await expect(searchField(page)).toHaveValue('sparkl');
    await page.keyboard.press('Enter');
    await expect(dialog(page)).toBeHidden();
    expect(await paragraphOf(page, 'Gamma')).toEqual(['Gamma [sparkles] ']);
    // Escape closes without inserting; focus returns to the editor.
    await page.getByRole('button', { name: 'Insert icon' }).first().click();
    await expect(searchField(page)).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog(page)).toBeHidden();
    await expect(editable(page)).toBeFocused();
    expect(await violations(page)).toEqual([]);
    expect(log.errors).toEqual([]);
  });

  test('callout icon: Tabler or emoji with tabs, stored in the Markdown, decorative on the read side', async ({ page }) => {
    const log = await watch(page);
    await openDemo(page, '?devtools=0');
    const button = page.getByRole('button', { name: 'Callout icon: alert-triangle' });
    await expect(button).toBeVisible();
    await expect(button.locator('svg')).toHaveAttribute('aria-hidden', 'true');
    await button.click();
    await expect(dialog(page)).toBeVisible();
    const tabs = dialog(page).getByRole('tablist');
    await expect(tabs.getByRole('tab', { name: 'Icons' })).toHaveAttribute('aria-selected', 'true');
    expect(await seriousViolations(page)).toEqual([]);
    // Keyboard: Shift+Tab to the tabs, Right to Emoji, Tab back to the search field.
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('ArrowRight');
    await expect(tabs.getByRole('tab', { name: 'Emoji' })).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('Tab');
    await page.keyboard.type('bulb');
    await page.keyboard.press('ArrowDown'); // past "No icon"
    await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: 'Callout icon: 💡' })).toBeFocused();
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('.demo-source')).toContainText(':::callout{icon="💡" type="warning"}');
    const callout = page.locator('[data-preview] .nowo-md-callout--warning.nowo-md-callout--icon');
    await expect(callout.locator('> .nowo-md-callout__emoji[data-emoji="💡"][aria-hidden="true"]')).toHaveCount(1);
    // The emoji is drawn by CSS: the callout's text is only its body.
    expect(await callout.evaluate((el) => el.textContent?.includes('💡'))).toBe(false);
    await expect(callout.locator('.nowo-md-callout__body')).toContainText('Freeze merges on Friday.');
    expect(await seriousViolations(page, '[data-preview]')).toEqual([]);
    expect(await violations(page)).toEqual([]);
    expect(log.errors).toEqual([]);
  });
});
