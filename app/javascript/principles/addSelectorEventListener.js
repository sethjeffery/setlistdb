import matches from './matches';
import findClosest from './findClosest';

// Binds an event listener to the document that listens for events bubbling up
// from elements with the given selector. Therefore this event listener
// will always be present even if the DOM changes.
export default function addSelectorEventListener(selector, type, callback) {
  document.addEventListener(type, event => {
    const el = findClosest(event.target, selector);
    if(el) {
      callback.call(el, event);
    }
  })
}
