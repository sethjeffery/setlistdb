import matches from './matches';

// Binds an event listener to the document that listens for events bubbling up
// from elements with the given selector. Therefore this event listener
// will always be present even if the DOM changes.
export default function addSelectorEventListener(selector, type, callback) {
  document.addEventListener(type, event => {
    const el = event.target;
    if(matches(el, selector)) {
      callback.call(el, event);
    }
  })
}
