import matches from './matches';

// Javascript native version of $.fn.closest(selector)
export default function findClosest(el, selector) {
  if(matches(el, selector)) { return el; }
  while ((el = el.parentElement) && !matches(el, selector)) {}
  return el;
}
