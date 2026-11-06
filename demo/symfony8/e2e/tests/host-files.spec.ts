import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { seriousViolations, violations, watch } from './helpers';

/**
 * 1.9 (ME-5, ME-6): images and files stored as host references (`demo-file:<id>`): images preview in the editor and on
 * the read side, a file switches view (link, icon, card, preview) from a menu, and the preview is a sandboxed frame.
 */

const CSV = 'name,owner\nRelease,<b>ada</b>\n';

const editable = (page: Page) => page.locator('.nowo-milkdown .ProseMirror');

async function open(page: Page): Promise<void> {
  await page.goto('/files?devtools=0');
  await expect(editable(page)).toHaveCount(1);
}

async function dropFiles(page: Page): Promise<void> {
  await editable(page).evaluate(
    (el, { csv }) => {
      const canvas = document.createElement('canvas');
      canvas.width = 120;
      canvas.height = 80;
      const bytes = Uint8Array.from(atob(canvas.toDataURL('image/png').split(',')[1]!), (c) => c.charCodeAt(0));
      const data = new DataTransfer();
      data.items.add(new File([bytes], 'pixel.png', { type: 'image/png' }));
      data.items.add(new File([csv], 'owners.csv', { type: 'text/csv' }));
      const target = el.querySelector('p')!;
      const r = target.getBoundingClientRect();
      for (const type of ['dragenter', 'dragover', 'drop']) {
        target.dispatchEvent(new DragEvent(type, { dataTransfer: data, clientX: r.left + 2, clientY: r.top + r.height / 2, bubbles: true, cancelable: true }));
      }
    },
    { csv: CSV },
  );
}

test.describe('host files (1.9, ME-5, ME-6)', () => {
  test('images preview, a file changes view, the preview is sandboxed, and the read side draws the same', async ({ page }) => {
    const log = await watch(page);
    await open(page);
    // A reference that cannot be resolved: a placeholder, never a request.
    await expect(page.locator('.nowo-milkdown-image__hidden')).toHaveText('Image not available');

    await dropFiles(page);
    const card = page.locator('.nowo-milkdown-file');
    await expect(card).toHaveCount(1, { timeout: 15000 });
    const image = page.locator('.nowo-milkdown-image img[src^="/uploads/"]');
    await expect(image).toHaveCount(1);
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBe(120);

    // The view switch is a menu of radio items.
    await card.click({ button: 'right', position: { x: 4, y: 4 } });
    await page.getByRole('menuitem', { name: 'View', exact: true }).click();
    await expect(page.getByRole('menuitemradio', { name: /^Card/ })).toHaveAttribute('aria-checked', 'true');
    await page.getByRole('menuitemradio', { name: 'Preview', exact: true }).click();
    const frame = page.locator('.nowo-milkdown-file__frame');
    await expect(frame).toHaveCount(1);
    await expect(frame).toHaveAttribute('sandbox', '');
    await expect(frame).toHaveAttribute('referrerpolicy', 'no-referrer');
    await expect(frame).toHaveAttribute('title', 'owners.csv');
    await expect(frame).toHaveAttribute('src', /^\/uploads\/[0-9a-f]{16}\.(?:csv|txt)\/preview$/);
    await expect(page.frameLocator('.nowo-milkdown-file__frame').locator('pre')).toContainText('<b>ada</b>');

    await page.getByRole('button', { name: 'Save' }).click();
    const source = (await page.locator('.demo-source').textContent()) ?? '';
    expect(source).toMatch(/!\[pixel\]\(demo-file:[0-9a-f]{16}\.png\)/);
    expect(source).toMatch(/::file\[owners\.csv\]\{href="demo-file:[0-9a-f]{16}\.(?:csv|txt)" size="\d+" type="text\/(?:csv|plain)" view="preview"\}/);

    const read = page.locator('[data-preview]');
    await expect(read.locator('img[src^="/uploads/"]')).toHaveCount(1);
    await expect(read.locator('figure.nowo-md-figure img')).toHaveCount(1);
    await expect(read.locator('.nowo-md-ref--hidden')).toHaveCount(1);
    const readFrame = read.locator('iframe.nowo-md-file__frame');
    await expect(readFrame).toHaveAttribute('sandbox', '');
    await expect(readFrame).toHaveAttribute('title', 'owners.csv');
    await expect(read.locator('.nowo-md-file__open')).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(read.locator('.nowo-md-file__download')).toHaveAttribute('download', '');
    await expect(page.frameLocator('iframe.nowo-md-file__frame').locator('pre')).toContainText('<b>ada</b>');
    // Playwright's own probes of the frame are refused by its sandbox ("Blocked script execution"): that is the point.
    expect(log.errors.filter((e) => !e.startsWith('Blocked script execution'))).toEqual([]);
    expect(await violations(page)).toEqual([]);
    // A sandboxed frame without scripts cannot run axe: the frame itself is checked above (title, sandbox).
    const axe = await new AxeBuilder({ page }).setLegacyMode().include('[data-preview]').options({ iframes: false }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(axe.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => v.id)).toEqual([]);
  });

  test('the image toolbar writes caption, alt, width and alignment; the read side draws a figure', async ({ page }) => {
    await open(page);
    await dropFiles(page);
    const image = page.locator('.nowo-milkdown-image img[src^="/uploads/"]');
    await expect(image).toHaveCount(1, { timeout: 15000 });
    await image.click();
    const bar = page.locator('.nowo-milkdown-image__toolbar');
    await expect(bar).toBeVisible();
    await bar.getByLabel('Alternative text').fill('A pixel');
    await bar.getByLabel('Caption').fill('The caption');
    await bar.getByLabel('Caption').press('Enter');
    await bar.getByRole('group', { name: 'Width' }).getByRole('button', { name: '50%' }).click();
    await bar.getByRole('group', { name: 'Alignment' }).getByRole('button', { name: 'Center' }).click();
    await expect(page.locator('.nowo-milkdown-image__caption')).toHaveText('The caption');
    expect(await seriousViolations(page, '.nowo-milkdown-image__toolbar')).toEqual([]);

    await page.getByRole('button', { name: 'Save' }).click();
    const source = (await page.locator('.demo-source').textContent()) ?? '';
    expect(source).toMatch(/!\[A pixel\]\(demo-file:[0-9a-f]{16}\.png "The caption"\)\{width=50% align=center\}/);
    const figure = page.locator('[data-preview] figure.nowo-md-figure--center.nowo-md-figure--w50');
    await expect(figure.locator('figcaption')).toHaveText('The caption');
    await expect(figure.locator('img')).toHaveAttribute('alt', 'A pixel');
  });

  test('previews load near the viewport only (audit GX-L1); a planted widget gets no frame (GX-L2)', async ({ page }) => {
    const requested: string[] = [];
    page.on('request', (r) => {
      if (/\/preview$/.test(r.url()) || r.url().includes('attacker.test')) requested.push(r.url());
    });
    await open(page);
    await page.evaluate(async () => {
      const w = window as unknown as { NowoMilkdownEditor: { instance: (root: Element) => Promise<{ setMarkdown: (m: string) => void }> } };
      const handle = await w.NowoMilkdownEditor.instance(document.querySelector('.nowo-milkdown')!);
      handle.setMarkdown(Array.from({ length: 300 }, (_, i) => `::file[f${i}.csv]{href="demo-file:0000000000000000.csv" view="preview" height="1200"}`.replace('0000000000000000', i.toString(16).padStart(16, '0'))).join('\n\n'));
    });
    await expect(page.locator('.nowo-milkdown-file__frame')).toHaveCount(300, { timeout: 20000 });
    await page.waitForTimeout(1500);
    expect(requested.length).toBeGreaterThan(0);
    expect(requested.length).toBeLessThan(10);

    // HTML let through by a sanitizer that keeps data-* and textarea.
    await page.evaluate(() => {
      const planted = document.createElement('div');
      planted.dataset.nowoMilkdownOptions = JSON.stringify({ features: ['file_cards'], readonly: true, previewSandbox: 'allow-scripts', hostSchemes: { x: { file: 'https://attacker.test/f/{id}', preview: 'https://attacker.test/{id}/embed' } } });
      planted.id = 'planted';
      const area = document.createElement('textarea');
      area.value = '::file[Open me]{href="x:abc" view="preview"}';
      planted.append(area);
      document.body.append(planted);
    });
    await expect(page.locator('#planted .nowo-milkdown-file')).toHaveCount(1);
    await expect(page.locator('#planted iframe')).toHaveCount(0);
    await expect(page.locator('#planted a')).toHaveCount(0);
    expect(requested.filter((u) => u.includes('attacker.test'))).toEqual([]);
  });

  test('keyboard path: Edit image from the context menu focuses the toolbar, Escape returns to the text', async ({ page }) => {
    await open(page);
    await dropFiles(page);
    const image = page.locator('.nowo-milkdown-image img[src^="/uploads/"]');
    await expect(image).toHaveCount(1, { timeout: 15000 });
    await image.click();
    await page.keyboard.press('Shift+F10');
    await page.getByRole('menuitem', { name: 'Edit image…' }).click();
    const alt = page.locator('.nowo-milkdown-image__toolbar').getByLabel('Alternative text');
    await expect(alt).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(editable(page)).toBeFocused();
  });

  test('the "+" button opens the / menu on an empty line; /file variants pick a file in another view', async ({ page }) => {
    await open(page);
    await editable(page).click();
    await page.keyboard.press('Control+End');
    await page.keyboard.press('Enter');
    const plus = page.getByRole('button', { name: 'Insert a block' });
    await expect(plus).toBeVisible();
    const chooser = page.waitForEvent('filechooser');
    await plus.click();
    await expect(page.getByRole('listbox', { name: 'Blocks' })).toBeVisible();
    await page.keyboard.type('preview');
    await expect(page.getByRole('option', { name: 'File with preview…' })).toBeVisible();
    await page.keyboard.press('Enter');
    await (await chooser).setFiles({ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') });
    await expect(page.locator('.nowo-milkdown-file__frame')).toHaveCount(1, { timeout: 15000 });
    // Not an element of the tab order (keyboard users type /).
    await expect(page.locator('.nowo-milkdown-insert-button')).toHaveAttribute('tabindex', '-1');
  });
});
