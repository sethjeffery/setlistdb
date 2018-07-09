// Shim for el.matches(selector)
export default function matches(el, selector) {
  return ((el.matches && el.matches(selector)) ||
    (el.matchesSelector && el.matchesSelector(selector)) ||
    (el.msMatchesSelector && el.msMatchesSelector(selector)) ||
    (el.webkitMatchesSelector && el.webkitMatchesSelector(selector)) ||
    (el.mozMatchesSelector && el.mozMatchesSelector(selector)));
}
