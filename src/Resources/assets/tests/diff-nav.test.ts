import { afterEach, describe, expect, it } from 'vitest';
import { bindDiff, bindDiffs } from '../src/diff-nav';
import { bindDiffNavigation } from '../src/index';

afterEach(() => document.body.replaceChildren());

const diff = (attrs = '') =>
  `<div class="nowo-md nowo-md-diff" data-nowo-milkdown-diff ${attrs}><h2 class="nowo-md-diff-summary">2 changes</h2><p>same</p>` +
  '<div class="nowo-md-diff-block" data-change="added"><ins class="nowo-md-diff-ins"><p>a</p></ins></div>' +
  '<div class="nowo-md-diff-block" data-change="removed"><del class="nowo-md-diff-del"><p>b</p></del></div><input></div>';

describe('diff navigation (1.6)', () => {
  it('adds buttons and n / p keys that focus and announce changes', async () => {
    document.body.innerHTML = diff('data-next="Siguiente" data-position="Cambio {index} de {count}"');
    expect(await bindDiffNavigation()).toBe(1);
    const wrapper = document.querySelector<HTMLElement>('[data-nowo-milkdown-diff]')!;
    const [prev, next] = [...wrapper.querySelectorAll<HTMLButtonElement>('.nowo-md-diff-nav button')];
    expect(prev!.textContent).toBe('Previous change');
    expect(next!.textContent).toBe('Siguiente');
    const blocks = wrapper.querySelectorAll<HTMLElement>('.nowo-md-diff-block');
    next!.click();
    expect(document.activeElement).toBe(blocks[0]);
    expect(wrapper.querySelector('[role="status"]')!.textContent).toBe('Cambio 1 de 2');
    blocks[0]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'n', bubbles: true }));
    expect(document.activeElement).toBe(blocks[1]);
    blocks[1]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'p', bubbles: true }));
    expect(document.activeElement).toBe(blocks[0]);
    blocks[0]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'n', ctrlKey: true, bubbles: true }));
    wrapper.querySelector('input')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'n', bubbles: true }));
    blocks[0]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'x', bubbles: true }));
    expect(document.activeElement).toBe(blocks[0]);
    expect(bindDiff(wrapper)).toBe(false);
  });

  it('starts from the end with previous, skips diffs without changes and pages without diffs', async () => {
    document.body.innerHTML = diff();
    expect(bindDiffs()).toBe(1);
    const wrapper = document.querySelector<HTMLElement>('[data-nowo-milkdown-diff]')!;
    wrapper.querySelector<HTMLButtonElement>('.nowo-md-diff-previous')!.click();
    expect(wrapper.querySelector('[role="status"]')!.textContent).toBe('Change 2 of 2');
    document.body.innerHTML = '<div data-nowo-milkdown-diff><h2 class="nowo-md-diff-summary">No changes</h2></div>';
    expect(bindDiffs()).toBe(0);
    document.body.innerHTML = '<p>x</p>';
    expect(await bindDiffNavigation()).toBe(0);
  });
});
