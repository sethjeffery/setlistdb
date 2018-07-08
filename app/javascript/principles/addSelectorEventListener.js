// Binds an event listener to the document that listens for events bubbling up
// from elements with the given selector. Therefore this event listener
// will always be present even if the DOM changes.
export default function addSelectorEventListener(selector, type, callback) {
  document.addEventListener(type, event => {
    const el = event.target;
    console.log(el, event);
    if((el.matches && el.matches(selector)) ||
      (el.msMatchesSelector && el.msMatchesSelector(selector)) ||
      (el.webkitMatchesSelector && el.webkitMatchesSelector(selector)) ||
      (el.mozMatchesSelector && el.mozMatchesSelector(selector))) {
      callback.call(el, event);
    }
  })
}
