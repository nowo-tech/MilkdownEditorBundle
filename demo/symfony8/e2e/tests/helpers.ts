import { expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export type Violation = { directive: string; blockedURI: string; sample: string };

/** Records CSP violations and page errors from the first script on. */
export async function watch(page: Page): Promise<{ errors: string[] }> {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.addInitScript(() => {
    (window as unknown as { __csp: unknown[] }).__csp = [];
    document.addEventListener('securitypolicyviolation', (e) => {
      (window as unknown as { __csp: unknown[] }).__csp.push({ directive: e.effectiveDirective, blockedURI: e.blockedURI, sample: e.sample });
    });
  });
  return { errors };
}

export const violations = (page: Page): Promise<Violation[]> => page.evaluate(() => (window as unknown as { __csp: Violation[] }).__csp);

/**
 * Opens the demo and waits until both editors are mounted and the layout is final: the editor's Mermaid preview is
 * lazy-loaded and, on a cold first load, lands after the first click. It then grows its code block by ~70px and moves
 * the block under the pointer, which starts Crepe's 200 ms fade-in of the code-block buttons.
 */
export async function openDemo(page: Page, query = ''): Promise<void> {
  await page.goto(`/${query}`);
  await expect(page.locator('.nowo-milkdown .ProseMirror')).toHaveCount(2);
  await page.waitForFunction(() => document.querySelectorAll('.nowo-milkdown .cm-editor').length > 0);
  await expect(page.locator('.nowo-milkdown .milkdown-code-block .preview svg')).toBeVisible({ timeout: 15000 });
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

/**
 * Waits until no finite CSS transition or animation is running. axe blends a half-faded element's colours with its
 * background: the code-block buttons fading in on hover (opacity 0 → 1 over 200 ms) read below 4.5:1 for most of the
 * fade, although they reach about 7:1 at rest in both themes.
 */
export async function settled(page: Page): Promise<void> {
  await page.waitForFunction(() =>
    document.getAnimations().every((a) => a.playState !== 'running' || a.effect?.getTiming().iterations === Infinity),
  );
}

export const editable = (page: Page) => page.getByRole('textbox', { name: 'Page content' });

/** axe with WCAG 2.1 A/AA; returns serious and critical violations only. */
export async function seriousViolations(page: Page, include = 'main'): Promise<{ id: string; impact: string | null | undefined; targets: string[] }[]> {
  await settled(page);
  const result = await new AxeBuilder({ page }).include(include).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  return result.violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => ({ id: v.id, impact: v.impact, targets: v.nodes.slice(0, 5).map((n) => n.target.join(' ')) }));
}

/** Puts the caret at the end of the wiki editor's last paragraph ("Euler: …"). */
export async function caretAtEnd(page: Page): Promise<void> {
  const euler = page.locator('.nowo-milkdown .ProseMirror p', { hasText: 'Euler:' });
  // The inline math of the paragraph renders from a lazy chunk; a click before it lands would be undone.
  await expect(euler.locator('.katex').first()).toBeVisible({ timeout: 15000 });
  await euler.click({ position: { x: 5, y: 5 } });
  await page.keyboard.press('End');
}

/** Types a new paragraph at the end and selects it with the keyboard: Crepe's selection toolbar opens. */
export async function openToolbar(page: Page): Promise<void> {
  await caretAtEnd(page);
  await page.keyboard.press('Enter');
  await page.keyboard.type('Plain words here');
  await page.keyboard.press('Shift+Home');
  await expect(page.locator('.milkdown-toolbar[data-show="true"]')).toHaveCount(1);
}
