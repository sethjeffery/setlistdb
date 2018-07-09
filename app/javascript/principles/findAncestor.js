import matches from './matches';

// Javascript native version of $.fn.closest(selector)
export default function findAncestor(el, selector) {
  while ((el = el.parentElement) && !matches(el, selector)) {}
  return el;
}
