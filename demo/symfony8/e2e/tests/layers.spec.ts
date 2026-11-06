import { expect, test, type Locator, type Page } from '@playwright/test';
import { seriousViolations, violations, watch } from './helpers';

/**
 * 1.8 (ME-1): the editor's menus render in the top layer. On /layers the same editor sits inside a transformed
 * ancestor (a containing block for fixed elements), under a sticky header with z-index 100 and in a modal dialog;
 * the right-click menu and its submenu must be fully visible, on top, at the pointer, with keyboard and focus
 * unchanged, axe serious = 0 and no CSP violation.
 */

const menu = (page: Page) => page.getByRole('menu', { name: 'Editor actions' });

async function openLayers(page: Page): Promise<void> {
  await page.goto('/layers?devtools=0');
  await expect(page.locator('.nowo-milkdown .ProseMirror')).toHaveCount(3);
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

/** The box is inside the viewport and the element at its centre (and near its corners) belongs to it. */
async function expectOnTop(page: Page, target: Locator): Promise<void> {
  const box = (await target.boundingBox())!;
  const viewport = page.viewportSize()!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
  const hits = await target.evaluate((el) => {
    const r = el.getBoundingClientRect();
    const points = [
      [r.left + r.width / 2, r.top + r.height / 2],
      [r.left + 6, r.top + 6],
      [r.right - 6, r.bottom - 6],
    ];
    return points.map(([x, y]) => el.contains(document.elementFromPoint(x!, y!)));
  });
  expect(hits).toEqual([true, true, true]);
  // Top layer, no inline style attribute beyond the CSSOM position (left / top).
  expect(await target.evaluate((el) => el.matches(':popover-open'))).toBe(true);
  expect(await target.evaluate((el) => [...el.style].sort())).toEqual(['left', 'top']);
}

async function rightClickAndCheck(page: Page, paragraph: Locator, editable: Locator): Promise<void> {
  const box = (await paragraph.boundingBox())!;
  const at = { x: box.x + 8, y: box.y + box.height / 2 };
  await page.mouse.click(at.x, at.y, { button: 'right' });
  await expect(menu(page)).toBeVisible();
  const m = (await menu(page).boundingBox())!;
  // At the pointer: its top-left corner, or moved up just enough to stay inside the viewport (a tall menu).
  const viewport = page.viewportSize()!;
  expect(Math.abs(m.x - at.x)).toBeLessThanOrEqual(2);
  expect(m.y).toBeLessThanOrEqual(at.y + 2);
  if (Math.abs(m.y - at.y) > 2) expect(m.y + m.height).toBeGreaterThanOrEqual(viewport.height - 6);
  await expectOnTop(page, menu(page));
  // Keyboard: the first item has focus; the submenu opens with the Right arrow and is on top too.
  await expect(menu(page).getByRole('menuitem').first()).toBeFocused();
  await menu(page).getByRole('menuitem', { name: 'Turn into' }).focus();
  await page.keyboard.press('ArrowRight');
  const sub = page.getByRole('menu', { name: 'Turn into' });
  await expect(sub.getByRole('menuitem').first()).toBeFocused();
  await expectOnTop(page, sub);
  expect(await seriousViolations(page)).toEqual([]);
  // Left back to the item, Escape closes and gives the focus back to the editor.
  await page.keyboard.press('ArrowLeft');
  await expect(sub).toBeHidden();
  await page.keyboard.press('Escape');
  await expect(menu(page)).toBeHidden();
  await expect(editable).toBeFocused();
}

test.describe('menus in the top layer (1.8, ME-1)', () => {
  test('inside a transformed ancestor', async ({ page }) => {
    const log = await watch(page);
    await openLayers(page);
    const section = page.getByTestId('transformed');
    await rightClickAndCheck(page, section.locator('.ProseMirror p').first(), section.getByRole('textbox'));
    expect(await violations(page)).toEqual([]);
    expect(log.errors).toEqual([]);
  });

  test('under a sticky header with z-index 100', async ({ page }) => {
    const log = await watch(page);
    await openLayers(page);
    const section = page.getByTestId('under-sticky');
    const paragraph = section.locator('.ProseMirror p').first();
    // Scroll the paragraph right under the sticky header: the menu opens over the header's area.
    const header = (await page.getByTestId('sticky-header').boundingBox())!;
    await paragraph.evaluate((el, top) => window.scrollBy(0, el.getBoundingClientRect().top - top - 4), header.height);
    const box = (await paragraph.boundingBox())!;
    expect(box.y).toBeLessThan(header.height + 40);
    await page.mouse.click(box.x + 8, box.y + box.height / 2, { button: 'right' });
    await expect(menu(page)).toBeVisible();
    await expectOnTop(page, menu(page));
    await page.keyboard.press('Escape');
    await rightClickAndCheck(page, paragraph, section.getByRole('textbox'));
    expect(await violations(page)).toEqual([]);
    expect(log.errors).toEqual([]);
  });

  test('inside a modal dialog: the menu is above the dialog and Escape closes only the menu', async ({ page }) => {
    const log = await watch(page);
    await openLayers(page);
    await page.getByRole('button', { name: 'Open the dialog' }).click();
    const dialog = page.getByRole('dialog', { name: 'Edit in a dialog' });
    await expect(dialog).toBeVisible();
    await rightClickAndCheck(page, dialog.locator('.ProseMirror p').first(), dialog.getByRole('textbox'));
    await expect(dialog).toBeVisible();
    // The `/` list is in the top layer too (above the dialog).
    await dialog.getByRole('textbox').press('End');
    await page.keyboard.press('Enter');
    await page.keyboard.type('/he');
    const list = page.getByRole('listbox', { name: 'Blocks' });
    await expect(list).toBeVisible();
    await expectOnTop(page, list);
    await page.keyboard.press('Escape');
    await expect(list).toBeHidden();
    await expect(dialog).toBeVisible();
    expect(await violations(page)).toEqual([]);
    expect(log.errors).toEqual([]);
  });

  test('action_bar_insert: [] hides the Insert file / Insert icon buttons (ME-2)', async ({ page }) => {
    await openLayers(page);
    await expect(page.locator('.nowo-milkdown__actions')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Insert file' })).toHaveCount(0);
  });
});
