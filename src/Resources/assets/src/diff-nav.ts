/**
 * Keyboard navigation of rendered diffs (`nowo_milkdown_diff()`, 1.6; progressive enhancement): *Previous change* /
 * *Next change* buttons and the `p` / `n` keys inside the diff move focus between changed blocks and announce the
 * position. Labels come from the wrapper's `data-*` attributes (translated by PHP), set with `textContent`.
 */
const BOUND = 'nowoMilkdownDiffBound';

/**
 * Adds the navigation to one diff wrapper (once).
 *
 * @param wrapper - `[data-nowo-milkdown-diff]`
 * @returns False when already bound or without changes
 */
export function bindDiff(wrapper: HTMLElement): boolean {
  if (wrapper.dataset[BOUND]) return false;
  wrapper.dataset[BOUND] = '1';
  const changes = [...wrapper.querySelectorAll<HTMLElement>('.nowo-md-diff-block')];
  if (!changes.length) return false;
  const label = (name: string, fallback: string): string => wrapper.dataset[name] || fallback;
  const nav = document.createElement('div');
  nav.className = 'nowo-md-diff-nav';
  const status = document.createElement('p');
  status.className = 'nowo-md-diff-status';
  status.setAttribute('role', 'status');
  let current = -1;
  const go = (step: 1 | -1): void => {
    current = current === -1 ? (step === 1 ? 0 : changes.length - 1) : (current + step + changes.length) % changes.length;
    const block = changes[current]!;
    block.tabIndex = -1;
    block.focus();
    block.scrollIntoView({ block: 'center' });
    status.textContent = label('position', 'Change {index} of {count}').replace('{index}', String(current + 1)).replace('{count}', String(changes.length));
  };
  for (const [name, step, fallback] of [['previous', -1, 'Previous change'], ['next', 1, 'Next change']] as const) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `nowo-md-diff-${name}`;
    button.textContent = label(name, fallback);
    button.addEventListener('click', () => go(step));
    nav.append(button);
  }
  nav.append(status);
  wrapper.querySelector('.nowo-md-diff-summary')?.after(nav);
  wrapper.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey || (event.target as HTMLElement).closest('input, textarea, select, [contenteditable="true"]')) return;
    if (event.key === 'n' || event.key === 'p') {
      event.preventDefault();
      go(event.key === 'n' ? 1 : -1);
    }
  });
  return true;
}

/**
 * Binds every diff under `scope`.
 *
 * @param scope - Where to look
 * @returns How many were bound
 */
export function bindDiffs(scope: ParentNode = document): number {
  return [...scope.querySelectorAll<HTMLElement>('[data-nowo-milkdown-diff]')].filter(bindDiff).length;
}
