
export default function trigger(el, eventName, detail={}) {
  let event;
  if (window.CustomEvent) {
    event = new CustomEvent(eventName);
  } else {
    event = document.createEvent('CustomEvent', { detail });
    event.initCustomEvent(eventName, true, true, detail);
  }

  el.dispatchEvent(event);
}
