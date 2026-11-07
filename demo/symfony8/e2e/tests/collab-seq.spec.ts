import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { violations, watch } from './helpers';

/**
 * 1.11: a session save tells the host which sequence number its text includes. A peer's update stored while that save is in
 * flight is not in its text; counting it as saved would let a later save outside the session drop it for good.
 *
 * Real race: the save and the peer's update are separate requests to separate workers of a real server, on one log under a
 * lock (`CollabLogDemoController`). `SEQ_REPEAT` repeats the forced order; `SEQ_ROUNDS` is the unforced race. The peer's
 * updates are not relayed to the saving editor, as in the moment before the hub delivers them.
 */
const REPEAT = Number(process.env.SEQ_REPEAT || 3);
const ROUNDS = Number(process.env.SEQ_ROUNDS || 15);
/** A real Yjs update: a paragraph with the text PEER. */
const PEER = 'AQPFh8WNDwAHAQtwcm9zZW1pcnJvcgMJcGFyYWdyYXBoBwDFh8WNDwAGBADFh8WNDwEEUEVFUgA=';
const OWN = 'Own text';

type Info = { seq: number; saved: number; updates: { s: number; d: string }[]; revisions: string[]; body: string };

const info = async (request: APIRequestContext, doc: string): Promise<Info> => (await (await request.get(`/collab/log/${doc}/info`)).json()) as Info;
let counter = 0;
const newDoc = (): string => `t${Date.now().toString(36)}-${(counter++).toString(36)}`;

async function fakeHub(page: Page): Promise<void> {
  await page.addInitScript(() => {
    class FakeEventSource {
      onopen: ((e: unknown) => void) | null = null;
      onerror: ((e: unknown) => void) | null = null;
      onmessage: ((e: unknown) => void) | null = null;
      constructor() {
        setTimeout(() => this.onopen?.({}), 0);
      }
      close(): void {}
      addEventListener(): void {}
    }
    (window as unknown as { EventSource: unknown }).EventSource = FakeEventSource;
  });
}

/** Bound, its own text typed and stored. */
async function editing(page: Page, request: APIRequestContext, doc: string, query = ''): Promise<void> {
  await fakeHub(page);
  await page.goto(`/collab/log/${doc}?devtools=0${query}`);
  await expect(page.locator('.nowo-milkdown')).toHaveAttribute('data-collab', 'online', { timeout: 15000 });
  await expect.poll(async () => (await info(request, doc)).seq, { timeout: 10000 }).toBeGreaterThan(0);
  await page.locator('.nowo-milkdown .ProseMirror').click();
  await page.keyboard.press('ControlOrMeta+End');
  const before = (await info(request, doc)).seq;
  await page.keyboard.type(OWN);
  await expect.poll(async () => (await info(request, doc)).seq, { timeout: 10000 }).toBeGreaterThan(before);
  await page.waitForTimeout(350);
}

const peerPost = (request: APIRequestContext, doc: string, legacy = '') =>
  request.post(`/collab/log/${doc}/api/${legacy}update`, { data: { c: 999, d: PEER } });

async function saveAndWait(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByTestId('save-result')).toHaveText('saved', { timeout: 20000 });
}

/** Someone else, with the hub gone, saves outside the session: what the host answers. */
async function saveOutside(browser: import('@playwright/test').Browser, doc: string, query = ''): Promise<number> {
  const context = await browser.newContext({ baseURL: test.info().project.use.baseURL });
  const page = await context.newPage();
  await page.route('**/collab/hub**', (route) => route.abort());
  await page.goto(`/collab/log/${doc}?devtools=0&connect_timeout=200${query}`);
  await expect(page.locator('.nowo-milkdown')).toHaveAttribute('data-collab', 'standalone', { timeout: 10000 });
  const answer = page.waitForResponse((r) => r.request().method() === 'POST' && r.url().includes(`/collab/log/${doc}`) && !r.url().includes('/api/'));
  await page.getByRole('button', { name: 'Save' }).click();
  const status = (await answer).status();
  await context.close();
  return status;
}

test.describe.configure({ timeout: 90000 });

for (let run = 1; run <= REPEAT; run++) {
  test(`run ${run}/${REPEAT}: an update stored while the save is in flight survives a later save outside the session`, async ({ page, request, browser }) => {
    await watch(page);
    const doc = newDoc();
    await editing(page, request, doc, '&save_delay=300');
    const saving = saveAndWait(page);
    await page.waitForTimeout(80);
    expect((await peerPost(request, doc)).ok()).toBe(true);
    await saving;
    const after = await info(request, doc);
    expect(after.revisions.at(-1)).toContain(OWN);
    expect(after.saved, 'the update counted as saved').toBeLessThan(after.seq);
    expect(await violations(page)).toEqual([]);
    expect(await saveOutside(browser, doc), 'the save outside the session dropped it').toBe(409);
    expect((await info(request, doc)).updates.map((u) => u.d)).toContain(PEER);
  });
}

test('unforced race: however the two requests land, the peer\'s update is never dropped silently', async ({ page, request, browser }) => {
  test.setTimeout(ROUNDS * 12000 + 30000);
  let lost = 0;
  for (let round = 0; round < ROUNDS; round++) {
    const doc = newDoc();
    await editing(page, request, doc);
    const saving = saveAndWait(page);
    await page.waitForTimeout(round * 2);
    expect((await peerPost(request, doc)).ok()).toBe(true);
    await saving;
    const status = await saveOutside(browser, doc);
    if (status !== 409) lost++;
  }
  console.log(`SEQ race: ${lost} of ${ROUNDS} rounds lost the peer's update`);
  expect(lost).toBe(0);
});

test('nothing unsaved: the text holds all its own updates, so no false conflict', async ({ page, request, browser }) => {
  const doc = newDoc();
  await editing(page, request, doc);
  await saveAndWait(page);
  const after = await info(request, doc);
  expect(after.saved).toBe(after.seq);
  expect(await saveOutside(browser, doc)).toBe(200);
  expect((await info(request, doc)).revisions.length).toBeGreaterThan(after.revisions.length);
});

test('a host that knows nothing of the numbers works as before', async ({ page, request, browser }) => {
  const doc = newDoc();
  await editing(page, request, doc, '&legacy=1');
  await saveAndWait(page);
  const after = await info(request, doc);
  expect(after.saved).toBe(after.seq);
  expect(await saveOutside(browser, doc, '&legacy=1')).toBe(200);
});

test('a client that does not send the number gets what it got before', async ({ page, request }) => {
  const doc = newDoc();
  await editing(page, request, doc);
  await peerPost(request, doc);
  await page.evaluate(() => {
    document.querySelector('form')!.addEventListener('formdata', (e) => e.formData.delete('_nowo_milkdown_collab_seq'));
  });
  await saveAndWait(page);
  const after = await info(request, doc);
  expect(after.saved).toBe(after.seq);
});
