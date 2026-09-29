// Locks page scroll for overlays. Padding stands in for the removed scrollbar
// so the page doesn't shift and full-width overlays cover the whole window.
export function lockScroll() {
  const root = document.documentElement;
  const scrollbar = window.innerWidth - root.clientWidth;
  root.style.overflow = "hidden";
  if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;
}

export function unlockScroll() {
  const root = document.documentElement;
  root.style.overflow = "";
  root.style.paddingRight = "";
}
