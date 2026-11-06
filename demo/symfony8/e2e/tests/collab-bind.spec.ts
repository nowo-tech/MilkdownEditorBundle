import { expect, test, type Page } from '@playwright/test';
import { violations, watch } from './helpers';

/**
 * 1.9.1: nothing is lost around the moment the Yjs document is bound, whatever the hub does. The four scenarios measured
 * on WikiBundle (6 tries each) and the hub that never opens repeat `COLLAB_REPEAT` times.
 *
 * The demo's hub answers 404. `fakeHub` replaces EventSource with one that opens after a delay (no messages: one client,
 * nothing to relay). A locator never asks for `contenteditable="true"` here: the point is what happens as soon as the
 * editor is on screen, before it can be edited.
 */
const REPEAT = Number(process.env.COLLAB_REPEAT || 6);
const ORIGINAL = 'Original body';
/** Letters absent from the original body, so what was typed can be told from it. */
const MARKER = 'ZQXJKVZQXJKVZQXJKVZQ';
const HUB_OPENS_AFTER = 300;

const surface = (page: Page) => page.locator('.nowo-milkdown .ProseMirror');
const widget = (page: Page) => page.locator('.nowo-milkdown');
const save = (page: Page) => page.getByRole('button', { name: 'Save' });
const saved = (page: Page) => page.getByTestId('saved');
const typedIn = (text: string): number => [...text].filter((c) => MARKER.includes(c)).length;

async function open(page: Page, query = ''): Promise<void> {
  await page.goto(`/collab?devtools=0${query}`);
  await expect(surface(page)).toBeVisible();
}

/** `null`: never opens. */
async function fakeHub(page: Page, opensAfter: number | null): Promise<void> {
  await page.addInitScript((ms) => {
    class FakeEventSource {
      onopen: ((e: unknown) => void) | null = null;
      onerror: ((e: unknown) => void) | null = null;
      onmessage: ((e: unknown) => void) | null = null;
      constructor() {
        const w = window as unknown as { __hub: unknown; __hubDown?: boolean };
        w.__hub = this;
        if (w.__hubDown) setTimeout(() => this.onerror?.({}), 0);
        else if (ms !== null) setTimeout(() => this.onopen?.({}), ms);
      }
      close(): void {}
      addEventListener(): void {}
    }
    (window as unknown as { EventSource: unknown }).EventSource = FakeEventSource;
  }, opensAfter);
}

async function savedText(page: Page): Promise<string> {
  await save(page).click();
  await expect(saved(page)).toBeVisible({ timeout: 15000 });
  return (await saved(page).innerText()).trim();
}

/** Beacon's writeInEditor: click, select all, delete, type. */
async function write(page: Page, text: string): Promise<void> {
  await surface(page).click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.press('Delete');
  await page.keyboard.type(text);
}

/** Records the most typed characters the editor has ever shown (a typed character that vanishes is a silent loss). */
async function sampleTyped(page: Page): Promise<void> {
  await page.evaluate((marker) => {
    const w = window as unknown as { __most: number };
    w.__most = 0;
    setInterval(() => {
      const shown = [...(document.querySelector('.nowo-milkdown .ProseMirror')?.textContent ?? '')].filter((c) => marker.includes(c)).length;
      w.__most = Math.max(w.__most, shown);
    }, 5);
  }, MARKER);
}
const mostTyped = (page: Page): Promise<number> => page.evaluate(() => (window as unknown as { __most: number }).__most);

/** The connection drops after it was online; from here on the hub is down. */
async function dropHub(page: Page): Promise<void> {
  await page.evaluate(() => {
    const w = window as unknown as { __hub: { onerror: ((e: unknown) => void) | null }; __hubDown: boolean };
    w.__hubDown = true;
    w.__hub.onerror?.({});
  });
  await expect(widget(page)).toHaveAttribute('data-collab', /offline|connecting/);
}

test.describe.configure({ timeout: 45000 });

for (let run = 1; run <= REPEAT; run++) {
  test.describe(`run ${run}/${REPEAT}`, () => {
    test('wait for online, write, save: saved', async ({ page }) => {
      await watch(page);
      await fakeHub(page, HUB_OPENS_AFTER);
      await open(page);
      await expect(widget(page)).toHaveAttribute('data-collab', 'online', { timeout: 10000 });
      await expect(page.locator('.nowo-milkdown .ProseMirror[contenteditable="true"]')).toBeVisible();
      await write(page, MARKER);
      expect(await savedText(page)).toBe(MARKER);
      expect(await violations(page)).toEqual([]);
    });

    test('type across the bind: what appeared is never taken away', async ({ page }) => {
      await watch(page);
      await fakeHub(page, HUB_OPENS_AFTER);
      await open(page);
      await surface(page).click();
      let most = 0;
      for (const key of MARKER) {
        await page.keyboard.type(key);
        await page.waitForTimeout(40);
        const count = typedIn(await surface(page).innerText());
        expect(count, 'a typed character disappeared').toBeGreaterThanOrEqual(most);
        most = count;
      }
      await expect(widget(page)).toHaveAttribute('data-collab', 'online', { timeout: 10000 });
      const shown = (await surface(page).innerText()).trim();
      expect(typedIn(shown), 'nothing typed after the bind arrived').toBeGreaterThan(0);
      expect(await savedText(page)).toBe(shown);
    });

    test('write as soon as visible, then save: what appeared is saved', async ({ page }) => {
      await watch(page);
      // The bind lands while the keys go in, as the measured 4 of 6 on WikiBundle.
      await fakeHub(page, 100);
      await open(page);
      await sampleTyped(page);
      await surface(page).click();
      await page.keyboard.press('ControlOrMeta+A');
      await page.keyboard.press('Delete');
      await page.keyboard.type(MARKER, { delay: 10 });
      const shown = (await surface(page).innerText()).trim();
      const most = await mostTyped(page);
      const text = await savedText(page);
      // Keys sent before the bind are refused and never appear. What did appear must reach the save.
      expect(typedIn(text), 'a typed character that appeared was not saved').toBeGreaterThanOrEqual(most);
      expect(text).toBe(shown);
      expect(text).not.toBe('');
    });

    test('save as soon as visible, no typing: the body stays', async ({ page }) => {
      await watch(page);
      await fakeHub(page, HUB_OPENS_AFTER);
      await open(page);
      expect(await savedText(page)).toBe(ORIGINAL);
      expect(await violations(page)).toEqual([]);
    });

    test('hub never opens, save without typing: the body stays', async ({ page }) => {
      await watch(page);
      await fakeHub(page, null);
      await open(page, '&connect_timeout=1500');
      expect(await savedText(page)).toBe(ORIGINAL);
    });
  });
}

/**
 * Each line measured on Beacon's isolated stack (real Mercure hub, an existing wiki page), against the demo. Figures in the
 * names are what 1.9.0 lost there. `BEACON_REPEAT` (default 1) repeats them.
 */
const BEACON_REPEAT = Number(process.env.BEACON_REPEAT || 1);
/** "No delay" on a real hub still takes a round trip or two; the demo answers in no time. */
const REAL_HUB = 100;
for (let run = 1; run <= BEACON_REPEAT; run++) {
  test.describe(`Beacon lines, run ${run}/${BEACON_REPEAT}`, () => {
    test('Beacon: edit and save at once, no delay (10/10 lost)', async ({ page }) => {
      await fakeHub(page, REAL_HUB);
      await open(page);
      expect(await savedText(page)).toBe(ORIGINAL);
    });

    test('Beacon: hub delayed 3 s, no typing, save in connecting (6/6 lost)', async ({ page }) => {
      await fakeHub(page, 3000);
      await open(page);
      await expect(widget(page)).toHaveAttribute('data-collab', 'connecting');
      expect(await savedText(page)).toBe(ORIGINAL);
    });

    test('Beacon: hub delayed 3 s, type, save in connecting (original lost 6/6)', async ({ page }) => {
      await fakeHub(page, 3000);
      await open(page);
      await sampleTyped(page);
      await surface(page).click();
      await page.keyboard.type(MARKER);
      await expect(widget(page)).toHaveAttribute('data-collab', 'connecting');
      expect(await mostTyped(page), 'the editor took keys while connecting').toBe(0);
      expect(await savedText(page)).toBe(ORIGINAL);
    });

    test('Beacon: hub delayed 3 s, type, wait for online, save (typed text replaced 6/6, no warning)', async ({ page }) => {
      await fakeHub(page, 3000);
      await open(page);
      await sampleTyped(page);
      await surface(page).click();
      await page.keyboard.type(MARKER);
      await expect(widget(page)).toHaveAttribute('data-collab', 'online', { timeout: 10000 });
      // Nothing was replaced because nothing was accepted: the keys never appeared, and the person sees that.
      expect(await mostTyped(page), 'the editor took keys while connecting').toBe(0);
      await expect(surface(page)).toHaveText(ORIGINAL);
      expect(await savedText(page)).toBe(ORIGINAL);
    });

    test('Beacon: type right after Edit, no delay (typed text lost 9/10)', async ({ page }) => {
      await fakeHub(page, REAL_HUB);
      await open(page);
      await sampleTyped(page);
      await surface(page).click();
      await page.keyboard.type(MARKER, { delay: 10 });
      const shown = (await surface(page).innerText()).trim();
      const most = await mostTyped(page);
      const text = await savedText(page);
      expect(typedIn(text), 'a typed character that appeared was not saved').toBeGreaterThanOrEqual(most);
      expect(text).toBe(shown);
      expect(text).toContain(ORIGINAL);
    });

    test('Beacon: hub aborted, wait 3 s, no typing, save (3/3 lost, stuck on connecting)', async ({ page }) => {
      const errors = await watch(page);
      await page.route('**/collab/hub**', (route) => route.abort());
      await open(page);
      await page.waitForTimeout(3000);
      expect(await savedText(page)).toBe(ORIGINAL);
      expect(errors.errors.filter((e) => e.includes('nowo-milkdown'))).toEqual([]);
    });

    test('Beacon: hub aborted: it does not stay on connecting, and the content can be edited', async ({ page }) => {
      await page.route('**/collab/hub**', (route) => route.abort());
      await open(page);
      await expect(widget(page)).toHaveAttribute('data-collab', 'standalone', { timeout: 8000 });
      await expect(page.locator('.nowo-milkdown__alert')).toContainText('without live co-editing');
      await surface(page).click();
      await page.keyboard.press('ControlOrMeta+End');
      await page.keyboard.type(MARKER);
      expect(await savedText(page)).toBe(`${ORIGINAL}${MARKER}`);
    });

    test('Beacon: control, no delay, wait for online, save without typing (0/6 lost)', async ({ page }) => {
      await fakeHub(page, 0);
      await open(page);
      await expect(widget(page)).toHaveAttribute('data-collab', 'online', { timeout: 10000 });
      expect(await savedText(page)).toBe(ORIGINAL);
    });

    test('Beacon: control: wait for online, type, save (original 0/5, typed 0/5 lost, must stay so)', async ({ page }) => {
      await fakeHub(page, 0);
      await open(page);
      await expect(widget(page)).toHaveAttribute('data-collab', 'online', { timeout: 10000 });
      await surface(page).click();
      await page.keyboard.press('ControlOrMeta+End');
      await page.keyboard.type(MARKER);
      expect(await savedText(page)).toBe(`${ORIGINAL}${MARKER}`);
    });

    test('reconnect: the connection fails after being online, no typing, save', async ({ page }) => {
      await fakeHub(page, 0);
      await open(page);
      await expect(widget(page)).toHaveAttribute('data-collab', 'online', { timeout: 10000 });
      await dropHub(page);
      await expect(surface(page)).toHaveText(ORIGINAL);
      expect(await savedText(page)).toBe(ORIGINAL);
    });

    test('reconnect: the connection fails after being online, type, save', async ({ page }) => {
      await fakeHub(page, 0);
      await open(page);
      await expect(widget(page)).toHaveAttribute('data-collab', 'online', { timeout: 10000 });
      await dropHub(page);
      await page.route('**/collab/api/token', (route) => route.fulfill({ status: 401, body: '' }));
      await surface(page).click();
      await page.keyboard.press('ControlOrMeta+End');
      await page.keyboard.type(MARKER);
      await page.waitForTimeout(700);
      await expect(page.locator('.nowo-milkdown .ProseMirror[contenteditable="true"]')).toBeVisible();
      expect((await surface(page).innerText()).trim()).toBe(`${ORIGINAL}${MARKER}`);
      expect(await savedText(page)).toBe(`${ORIGINAL}${MARKER}`);
    });
  });
}

test.describe('hub that fails', () => {
  test('hub never opens: after the wait the content can be edited and saved, and the person is told', async ({ page }) => {
    await watch(page);
    await fakeHub(page, null);
    await open(page, '&connect_timeout=1500');
    await expect(widget(page)).toHaveAttribute('data-collab', 'connecting');
    await expect(page.locator('.nowo-milkdown .ProseMirror[contenteditable="false"]')).toBeVisible();
    await expect(widget(page)).toHaveAttribute('aria-busy', 'true');
    await expect(surface(page)).toContainText(ORIGINAL);
    await expect(widget(page)).toHaveAttribute('data-collab', 'standalone', { timeout: 8000 });
    await expect(page.locator('.nowo-milkdown__alert')).toContainText('without live co-editing');
    await expect(page.locator('.nowo-milkdown .ProseMirror[contenteditable="true"]')).toBeVisible();
    await surface(page).click();
    await page.keyboard.press('ControlOrMeta+End');
    await page.keyboard.type(MARKER);
    expect(await savedText(page)).toBe(`${ORIGINAL}${MARKER}`);
    expect(await violations(page)).toEqual([]);
  });

  test('the demo hub answers 404: falls back, nothing lost', async ({ page }) => {
    await watch(page);
    await open(page, '&connect_timeout=1500');
    await expect(widget(page)).toHaveAttribute('data-collab', 'standalone', { timeout: 8000 });
    await expect(surface(page)).toContainText(ORIGINAL);
    expect(await savedText(page)).toBe(ORIGINAL);
  });

  test('the token is refused: falls back at once', async ({ page }) => {
    await page.route('**/collab/api/token', (route) => route.fulfill({ status: 404, body: '' }));
    await open(page, '&connect_timeout=30000');
    await expect(widget(page)).toHaveAttribute('data-collab', 'standalone', { timeout: 3000 });
    expect(await savedText(page)).toBe(ORIGINAL);
  });

  test('the state answers 429 JSON: never an empty document', async ({ page }) => {
    await fakeHub(page, 0);
    await page.route('**/collab/api/state', (route) => route.fulfill({ status: 429, contentType: 'application/json', body: '{"error":"rate_limited"}' }));
    await open(page, '&connect_timeout=30000');
    await expect(widget(page)).toHaveAttribute('data-collab', 'standalone', { timeout: 3000 });
    await expect(surface(page)).toContainText(ORIGINAL);
    expect(await savedText(page)).toBe(ORIGINAL);
  });

  test('another client holds the seed and an empty state comes back: this client never saves it', async ({ page }) => {
    await fakeHub(page, 0);
    await page.route('**/collab/api/state', (route) => route.fulfill({ contentType: 'application/json', body: '{"state":"AAA=","seed":false}' }));
    await open(page, '&connect_timeout=1500');
    await expect(surface(page)).toContainText(ORIGINAL);
    await expect(widget(page)).toHaveAttribute('data-collab', 'standalone', { timeout: 8000 });
    expect(await savedText(page)).toBe(ORIGINAL);
  });

  test('the hub opens late, after typing: the text stays and nothing is sent', async ({ page }) => {
    const updates: string[] = [];
    page.on('request', (r) => {
      if (r.url().endsWith('/collab/api/update')) updates.push(r.url());
    });
    await fakeHub(page, 2500);
    await open(page, '&connect_timeout=800');
    await expect(widget(page)).toHaveAttribute('data-collab', 'standalone', { timeout: 8000 });
    await surface(page).click();
    await page.keyboard.press('ControlOrMeta+End');
    await page.keyboard.type(MARKER);
    await page.waitForTimeout(3000);
    await expect(widget(page)).toHaveAttribute('data-collab', 'standalone');
    expect((await surface(page).innerText()).trim()).toBe(`${ORIGINAL}${MARKER}`);
    expect(updates).toEqual([]);
    expect(await savedText(page)).toBe(`${ORIGINAL}${MARKER}`);
  });

  test('the hub opens late, nothing typed: the editor joins the session', async ({ page }) => {
    await fakeHub(page, 2500);
    await open(page, '&connect_timeout=800');
    await expect(widget(page)).toHaveAttribute('data-collab', 'standalone', { timeout: 8000 });
    await expect(widget(page)).toHaveAttribute('data-collab', 'online', { timeout: 8000 });
    await expect(page.locator('.nowo-milkdown__alert')).toBeEmpty();
    await expect(surface(page)).toContainText(ORIGINAL);
    await surface(page).click();
    await page.keyboard.press('ControlOrMeta+End');
    await page.keyboard.type(MARKER);
    expect(await savedText(page)).toBe(`${ORIGINAL}${MARKER}`);
  });
});
