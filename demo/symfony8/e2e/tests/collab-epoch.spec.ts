import { expect, test, type APIRequestContext, type Browser, type Page } from '@playwright/test';

/**
 * 1.12: a client that was away when the log was replaced must not post its old document into the new log (audit HV-M1), and
 * its person's text must not vanish. A real server and real requests (`CollabLogDemoController`); the hub is faked, as the
 * demo has none. WikiBundle with a real hub is proved separately.
 */
type Info = { seq: number; saved: number; updates: { s: number; d: string }[]; revisions: string[]; body: string; epoch: string };
const OWN = 'Own words';
const OFFLINE = 'Written offline';
const NEW = 'New text';
const info = async (request: APIRequestContext, doc: string): Promise<Info> => (await (await request.get(`/collab/log/${doc}/info`)).json()) as Info;
let counter = 0;
const newDoc = (): string => `e${Date.now().toString(36)}-${(counter++).toString(36)}`;
const widget = (page: Page) => page.locator('.nowo-milkdown');
const surface = (page: Page) => page.locator('.nowo-milkdown .ProseMirror');

async function fakeHub(page: Page): Promise<void> {
  await page.addInitScript(() => {
    class FakeEventSource {
      onopen: ((e: unknown) => void) | null = null;
      onerror: ((e: unknown) => void) | null = null;
      onmessage: ((e: unknown) => void) | null = null;
      constructor(url: string | URL) {
        if (String(url).includes('/collab/hub')) (window as unknown as { __hub: unknown }).__hub = this;
        setTimeout(() => this.onopen?.({}), 0);
      }
      close(): void {}
      addEventListener(): void {}
    }
    (window as unknown as { EventSource: unknown }).EventSource = FakeEventSource;
  });
}

async function online(page: Page, doc: string, query = ''): Promise<void> {
  await fakeHub(page);
  await page.goto(`/collab/log/${doc}?devtools=0${query}`);
  await expect(widget(page)).toHaveAttribute('data-collab', 'online', { timeout: 15000 });
  await page.waitForTimeout(400);
}

async function type(page: Page, text: string): Promise<void> {
  await surface(page).click();
  await page.keyboard.press('ControlOrMeta+End');
  await page.keyboard.type(text);
}

/** Somebody else replaces the page, with the hub gone for them. The reset reaches nobody. */
async function replace(browser: Browser, doc: string, query = ''): Promise<void> {
  const context = await browser.newContext({ baseURL: test.info().project.use.baseURL });
  const page = await context.newPage();
  await page.route('**/collab/hub**', (route) => route.abort());
  await page.goto(`/collab/log/${doc}?devtools=0&connect_timeout=200&replace=1${query}`);
  await expect(widget(page)).toHaveAttribute('data-collab', 'standalone', { timeout: 10000 });
  await surface(page).click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.type(NEW);
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByTestId('save-result')).toHaveText('saved', { timeout: 15000 });
  await context.close();
}

const posts = (page: Page): string[] => {
  const seen: string[] = [];
  page.on('request', (r) => {
    if (r.method() === 'POST' && r.url().endsWith('/update')) seen.push(r.url());
  });
  return seen;
};
const dropHub = (page: Page) => page.evaluate(() => (window as unknown as { __hub: { onerror: (e: unknown) => void } }).__hub.onerror({}));

test.describe.configure({ timeout: 60000 });

test('offline, not typing, the log replaced: posts nothing, and the tab reloads onto the new text', async ({ page, request, browser, context }) => {
  const doc = newDoc();
  await online(page, doc);
  await context.setOffline(true);
  await page.waitForTimeout(300);
  await replace(browser, doc);
  const reloaded = page.waitForEvent('load', { timeout: 20000 });
  await context.setOffline(false);
  await reloaded;
  await expect(surface(page)).toContainText(NEW, { timeout: 15000 });
  // It does not hold the seed against itself: it joins at once, not at the next recheck.
  await expect(widget(page)).toHaveAttribute('data-collab', 'online', { timeout: 4000 });
  const after = await info(request, doc);
  expect(after.body).toBe(NEW);
  await expect(surface(page)).not.toContainText('Original');
});

test('offline, typing, the log replaced: nothing posted, the text stays, the person is told, and a save asks', async ({ page, request, browser, context }) => {
  const doc = newDoc();
  await online(page, doc);
  await context.setOffline(true);
  await page.waitForTimeout(300);
  await replace(browser, doc);
  await type(page, OFFLINE);
  const before = await info(request, doc);
  const sent = posts(page);
  await context.setOffline(false);
  await expect(widget(page)).toHaveAttribute('data-collab', 'standalone', { timeout: 15000 });
  await expect(page.locator('.nowo-milkdown__notice')).toContainText('replaced while you were away');
  await expect(page.locator('.nowo-milkdown__reload')).toBeVisible();
  await expect(surface(page)).toContainText(OFFLINE);
  await page.waitForTimeout(1800);
  await expect(surface(page)).toContainText(OFFLINE);
  expect(sent).toEqual([]);
  expect((await info(request, doc)).seq).toBe(before.seq);
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByTestId('save-result')).toHaveText('conflict', { timeout: 15000 });
  await expect(page.locator('textarea, .ProseMirror').first()).toContainText(OFFLINE);
  expect((await info(request, doc)).body).toBe(NEW);
});

test('a live editor on the new text is not touched when the old tab returns', async ({ page, request, browser, context }) => {
  const doc = newDoc();
  await online(page, doc);
  await context.setOffline(true);
  await page.waitForTimeout(300);
  await replace(browser, doc);
  const otherContext = await browser.newContext({ baseURL: test.info().project.use.baseURL });
  const live = await otherContext.newPage();
  await online(live, doc);
  await expect(surface(live)).toContainText(NEW);
  const seq = (await info(request, doc)).seq;
  const reloaded = page.waitForEvent('load', { timeout: 20000 });
  await context.setOffline(false);
  await reloaded;
  await live.waitForTimeout(500);
  expect((await surface(live).innerText()).trim()).toBe(NEW);
  await expect.poll(async () => (await info(request, doc)).seq).toBe(seq);
  await otherContext.close();
});

test('the hub drops without going offline: same', async ({ page, request, browser }) => {
  const doc = newDoc();
  await online(page, doc);
  await type(page, OWN);
  await page.waitForTimeout(400);
  await replace(browser, doc);
  const before = await info(request, doc);
  await dropHub(page);
  await expect(widget(page)).toHaveAttribute('data-collab', 'standalone', { timeout: 15000 });
  await expect(surface(page)).toContainText(OWN);
  expect((await info(request, doc)).seq).toBe(before.seq);
});

test('never heard the reset, still connected: its next update is refused, nothing stored', async ({ page, request, browser }) => {
  const doc = newDoc();
  await online(page, doc);
  await replace(browser, doc);
  const before = await info(request, doc);
  const refused = page.waitForResponse((r) => r.url().endsWith('/update') && r.status() === 409, { timeout: 10000 });
  await type(page, OWN);
  await refused;
  await expect(widget(page)).toHaveAttribute('data-collab', 'standalone');
  await expect(surface(page)).toContainText(OWN);
  expect((await info(request, doc)).seq).toBe(before.seq);
});

test('never heard the reset: its session save asks, and the replaced text stays current', async ({ page, request, browser }) => {
  const doc = newDoc();
  await online(page, doc);
  await replace(browser, doc);
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByTestId('save-result')).toHaveText('conflict', { timeout: 15000 });
  expect((await info(request, doc)).body).toBe(NEW);
});

test('a POST update that never answers: the tab reconnects and the text reaches the log (HV-L5)', async ({ page, request }) => {
  test.setTimeout(70000);
  const doc = newDoc();
  await online(page, doc);
  const seq = (await info(request, doc)).seq;
  let held = false;
  await page.route('**/api/update', async (route) => {
    if (held) return route.continue();
    held = true;
    // Never answered, until the page gives up.
  });
  await type(page, OWN);
  await expect.poll(() => held, { timeout: 5000 }).toBe(true);
  await expect.poll(async () => (await info(request, doc)).seq, { timeout: 40000 }).toBeGreaterThan(seq);
  await expect(widget(page)).toHaveAttribute('data-collab', 'online', { timeout: 10000 });
});

test('standalone, typed, F5: Firefox keeps the text, as it always did (HV-L6)', async ({ page, browserName }) => {
  test.skip(browserName !== 'firefox', 'only Firefox restores a textarea on reload');
  const doc = newDoc();
  await page.route('**/collab/hub**', (route) => route.abort());
  await page.goto(`/collab/log/${doc}?devtools=0&connect_timeout=200`);
  await expect(widget(page)).toHaveAttribute('data-collab', 'standalone', { timeout: 10000 });
  await type(page, OFFLINE);
  await page.waitForTimeout(500);
  await page.reload();
  await expect(widget(page)).toHaveAttribute('data-collab', 'standalone', { timeout: 10000 });
  await expect(surface(page)).toContainText(OFFLINE);
});

test('a host that names no logs: today\'s behaviour, the client posts on reconnect', async ({ page, request, browser, context }) => {
  const doc = newDoc();
  await online(page, doc, '&legacy=1');
  await context.setOffline(true);
  await page.waitForTimeout(300);
  await replace(browser, doc, '&legacy=1');
  const stored = page.waitForResponse((r) => r.url().endsWith('/update') && r.ok(), { timeout: 15000 });
  await context.setOffline(false);
  await stored;
  expect((await info(request, doc)).seq).toBeGreaterThan(0);
});

test('a client that sends no epoch: today\'s behaviour, its update is stored', async ({ request }) => {
  const doc = newDoc();
  const answer = await request.post(`/collab/log/${doc}/api/update`, { data: { c: 7, d: 'AAA=' } });
  expect(answer.ok()).toBe(true);
  expect((await answer.json()).s).toBeGreaterThan(0);
});
