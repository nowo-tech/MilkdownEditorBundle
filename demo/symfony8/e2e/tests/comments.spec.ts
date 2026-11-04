import { expect, test, type Page } from '@playwright/test';
import { seriousViolations, violations, watch } from './helpers';

async function openComments(page: Page, theme: 'light' | 'dark'): Promise<void> {
  await page.goto(`/comments?devtools=0${theme === 'dark' ? '&theme=dark' : ''}`);
  await expect(page.locator('.nowo-milkdown .ProseMirror')).toHaveCount(2);
  await expect(page.getByRole('complementary', { name: 'Comments' })).toBeVisible();
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

test.describe('comments, version view and diff (1.6)', () => {
  for (const theme of ['light', 'dark'] as const) {
    test(`comment from the keyboard, thread, axe and CSP (${theme})`, async ({ page }) => {
      const log = await watch(page);
      // Which element an inline-style CSP violation comes from (diagnostics only).
      await page.addInitScript(() => {
        (window as unknown as { __styles: string[] }).__styles = [];
        new MutationObserver((records) => {
          for (const r of records) r.addedNodes.forEach((n) => {
            if (n instanceof HTMLStyleElement) (window as unknown as { __styles: string[] }).__styles.push(`${Math.round(performance.now())}ms ${n.parentElement?.tagName}>${n.outerHTML.slice(0, 80)} nonce=${n.nonce}`);
            if (n instanceof HTMLScriptElement || n instanceof HTMLLinkElement) (window as unknown as { __styles: string[] }).__styles.push(`${Math.round(performance.now())}ms ${n.outerHTML.slice(0, 200)}`);
          });
        }).observe(document, { childList: true, subtree: true });
      });
      await openComments(page, theme);
      const editorRoot = page.locator('.nowo-milkdown').first();
      await editorRoot.locator('.ProseMirror p', { hasText: 'production' }).getByText('production').dblclick();
      // The selection reaches the editor state (the selection toolbar shows it) before the shortcut.
      await expect(page.locator('.milkdown-toolbar[data-show="true"]')).toHaveCount(1);
      await expect(page.getByRole('textbox', { name: 'New comment' })).toBeHidden();
      await page.keyboard.press('Control+Alt+m');
      const composer = page.getByRole('textbox', { name: 'New comment' });
      await expect(composer).toBeFocused();
      await composer.fill('Why production?');
      await page.keyboard.press('Control+Enter');
      const highlight = editorRoot.locator('.nowo-milkdown-comment');
      await expect(highlight).toHaveCount(1);
      await expect(highlight).toHaveText('production');
      const thread = page.getByRole('region', { name: 'Comment thread' });
      await expect(thread).toBeVisible();
      await expect(thread.locator('.nowo-milkdown-comments__body')).toHaveText('Why production?');
      expect(await seriousViolations(page)).toEqual([]);

      // Escape closes the thread; next comment selects and announces it; Enter reopens it.
      await thread.press('Escape');
      await expect(thread).toBeHidden();
      // Escape put the caret back on the commented text: move it to the start (the toolbar hides) and go to the next comment.
      await page.keyboard.press('Control+Home');
      await page.keyboard.press('Control+Alt+PageDown');
      await expect(editorRoot.locator('.nowo-milkdown-comment--active')).toHaveCount(1);
      await expect(editorRoot.locator('.nowo-milkdown__status')).toHaveText('Comment 1 of 1');
      await page.keyboard.press('Enter');
      await expect(thread).toBeVisible();

      // Reply, resolve (hidden), show resolved.
      await thread.getByRole('textbox', { name: 'Reply' }).fill('Because staging passed.');
      await thread.getByRole('button', { name: 'Send' }).click();
      await expect(thread.locator('.nowo-milkdown-comments__comment')).toHaveCount(2);
      await thread.getByRole('button', { name: 'Resolve' }).click();
      await expect(highlight).toHaveCount(0);
      await page.getByRole('checkbox', { name: 'Show resolved' }).check();
      await expect(highlight).toHaveCount(1);
      expect(await seriousViolations(page)).toEqual([]);

      // Clean up for the next run (threads live in the session).
      await page.getByRole('button', { name: /production/ }).click();
      for (let i = 0; i < 2; i++) await page.getByRole('region', { name: 'Comment thread' }).getByRole('button', { name: 'Delete' }).first().click();
      await expect(highlight).toHaveCount(0);

      const found = await violations(page);
      if (found.length) {
        console.log('inline styles', await page.evaluate(() => (window as unknown as { __styles: string[] }).__styles));
        console.log('page', await page.evaluate(() => [location.href, document.querySelector('.sf-toolbar') !== null, performance.getEntriesByType('navigation').length, Math.round(performance.now()), [...document.querySelectorAll('script')].map((s) => s.src || `inline:${s.textContent?.slice(0, 80)}`)]));
      }
      expect(found).toEqual([]);
      expect(log.errors).toEqual([]);
    });

    test(`version banner and diff navigation (${theme})`, async ({ page }) => {
      const log = await watch(page);
      await openComments(page, theme);
      const banner = page.getByRole('region', { name: 'Version', exact: true });
      await expect(banner).toContainText('Viewing the version of 2 November 2026, 10:04');
      await expect(banner.getByRole('button', { name: 'Restore this version' })).toBeVisible();
      await expect(banner.getByRole('button', { name: 'Copy to a new page' })).toHaveCount(0);
      await expect(page.locator('.nowo-milkdown').nth(1).locator('.ProseMirror')).toHaveAttribute('contenteditable', 'false');
      const restored = page.evaluate(() => new Promise<boolean>((r) => document.addEventListener('nowo-milkdown:version-restore', () => r(true), { once: true })));
      await banner.getByRole('button', { name: 'Restore this version' }).click();
      expect(await restored).toBe(true);

      const diff = page.locator('[data-nowo-milkdown-diff]');
      await expect(diff.locator('.nowo-md-diff-summary')).toHaveText('2 changes');
      await diff.getByRole('button', { name: 'Next change' }).click();
      await expect(diff.locator('.nowo-md-diff-block').first()).toBeFocused();
      await expect(diff.getByRole('status')).toHaveText('Change 1 of 2');
      await page.keyboard.press('n');
      await expect(diff.locator('.nowo-md-diff-block').nth(1)).toBeFocused();
      await expect(diff.locator('ins.nowo-md-diff-ins').first()).toContainText('production');
      expect(await seriousViolations(page)).toEqual([]);
      expect(await violations(page)).toEqual([]);
      expect(log.errors).toEqual([]);
    });
  }
});
