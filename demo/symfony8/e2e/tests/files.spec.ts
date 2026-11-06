import { expect, test, type Page } from '@playwright/test';
import { editable, openDemo, seriousViolations, violations, watch } from './helpers';

/**
 * 1.8 (ME-3): Notion / Outline style drop of several files. Three files (PNG, PDF, CSV) dropped at once land in order
 * as one image and two file cards; the Markdown survives a save and reload; the PHP renderer draws the cards.
 */

/** A 1x1 PNG, a minimal PDF and a CSV: the demo endpoint sniffs the bytes, so they must be real. */
const PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const PDF = '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[]/Count 0>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n';
const CSV = 'name,owner\nRelease,ada\nTag,grace\n';

async function dropFiles(page: Page): Promise<void> {
  await editable(page).evaluate(
    (el, { png, pdf, csv }) => {
      const bytes = Uint8Array.from(atob(png), (c) => c.charCodeAt(0));
      const data = new DataTransfer();
      data.items.add(new File([bytes], 'pixel.png', { type: 'image/png' }));
      data.items.add(new File([pdf], 'Q3 report.pdf', { type: 'application/pdf' }));
      data.items.add(new File([csv], 'owners.csv', { type: 'text/csv' }));
      const target = [...el.querySelectorAll('p')].find((p) => p.textContent?.startsWith('Euler'))!;
      const r = target.getBoundingClientRect();
      for (const type of ['dragenter', 'dragover', 'drop']) {
        target.dispatchEvent(new DragEvent(type, { dataTransfer: data, clientX: r.left + 2, clientY: r.top + r.height / 2, bubbles: true, cancelable: true }));
      }
    },
    { png: PNG, pdf: PDF, csv: CSV },
  );
}

test.describe('file drop (1.8, ME-3)', () => {
  test('drop 3 files: one image and two file cards in order; save, reload and the read side keep them', async ({ page }) => {
    const log = await watch(page);
    await openDemo(page, '?devtools=0');
    await dropFiles(page);
    const surface = page.locator('.nowo-milkdown').first();
    await expect(surface.locator('.nowo-milkdown-file')).toHaveCount(2, { timeout: 15000 });
    await expect(surface.locator('.nowo-milkdown-upload')).toHaveCount(0);
    await expect(surface.locator('.ProseMirror img[src^="/uploads/"]')).toHaveCount(1);
    const cards = surface.locator('.nowo-milkdown-file');
    await expect(cards.nth(0)).toContainText('Q3 report.pdf');
    await expect(cards.nth(0).locator('.nowo-milkdown-file__badge')).toHaveText('PDF');
    await expect(cards.nth(1)).toContainText('owners.csv');
    await expect(cards.nth(1)).toHaveClass(/nowo-milkdown-file--sheet/);
    // In order: the image, then the PDF card, then the CSV card.
    const order = await surface.locator('.ProseMirror').evaluate((pm) =>
      [...pm.querySelectorAll('img[src^="/uploads/"], .nowo-milkdown-file')].map((n) => (n.tagName === 'IMG' ? 'img' : n.textContent?.includes('.pdf') ? 'pdf' : 'csv')),
    );
    expect(order).toEqual(['img', 'pdf', 'csv']);
    expect(await seriousViolations(page)).toEqual([]);

    await page.getByRole('button', { name: 'Save' }).click();
    const source = (await page.locator('.demo-source').textContent()) ?? '';
    expect(source).toMatch(/!\[pixel\]\(\/uploads\/[0-9a-f]{16}\.png\)/);
    expect(source).toMatch(/::file\[Q3 report\.pdf\]\{href="\/uploads\/[0-9a-f]{16}\.pdf" size="\d+" type="application\/pdf"\}/);
    // libmagic reads a small CSV as text/plain: the server's type is kept, the card is still a sheet (extension).
    expect(source).toMatch(/::file\[owners\.csv\]\{href="\/uploads\/[0-9a-f]{16}\.(?:csv|txt)" size="\d+" type="text\/(?:csv|plain)"\}/);
    // Reload (the saved Markdown back in the editor) shows the same cards.
    await expect(page.locator('.nowo-milkdown').first().locator('.nowo-milkdown-file')).toHaveCount(2);
    // The read side (PHP renderer) draws the cards as links.
    const read = page.locator('[data-preview] .nowo-md-file');
    await expect(read).toHaveCount(2);
    await expect(read.nth(0).locator('a.nowo-md-file__link')).toHaveAttribute('href', /^\/uploads\/[0-9a-f]{16}\.pdf$/);
    await expect(read.nth(0).locator('a.nowo-md-file__link')).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(read.nth(1)).toContainText('owners.csv');
    await expect(page.locator('[data-preview] img[src^="/uploads/"]')).toHaveCount(1);
    expect(await seriousViolations(page, '[data-preview]')).toEqual([]);
    expect(await violations(page)).toEqual([]);
    expect(log.errors).toEqual([]);
  });

  test('a type the server refuses leaves a dismissible notice; /file is the keyboard path', async ({ page }) => {
    await openDemo(page, '?devtools=0');
    await editable(page).evaluate((el) => {
      const data = new DataTransfer();
      // Allowed by the field (.txt), refused by the server: an HTML file renamed .txt is still sniffed as text/html.
      data.items.add(new File(['<!doctype html><html><script>alert(1)</script></html>'], 'page.txt', { type: 'text/plain' }));
      const target = el.querySelector('p')!;
      const r = target.getBoundingClientRect();
      target.dispatchEvent(new DragEvent('drop', { dataTransfer: data, clientX: r.left + 2, clientY: r.top + 4, bubbles: true, cancelable: true }));
    });
    const notice = page.locator('.nowo-milkdown-upload--error');
    await expect(notice).toContainText('page.txt is not an allowed file type');
    await notice.getByRole('button', { name: 'Dismiss' }).click();
    await expect(notice).toHaveCount(0);
    // Keyboard alternative to dragging (WCAG 2.5.7): `/file` opens the file picker.
    await editable(page).press('Control+End');
    await page.keyboard.press('Enter');
    const chooser = page.waitForEvent('filechooser');
    await page.keyboard.type('/file');
    await expect(page.getByRole('option', { name: 'Image or file…' })).toBeVisible();
    await page.keyboard.press('Enter');
    expect((await chooser).isMultiple()).toBe(true);
  });
});
