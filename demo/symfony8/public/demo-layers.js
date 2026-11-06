// Demo of the 1.8 top-layer menus: opens and closes the modal dialog (no inline handlers: strict CSP).
document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const dialog = document.querySelector('dialog.demo-dialog');
  if (!dialog || !target) return;
  if (target.closest('[data-demo-open-dialog]')) dialog.showModal();
  if (target.closest('[data-demo-close-dialog]')) dialog.close();
});
