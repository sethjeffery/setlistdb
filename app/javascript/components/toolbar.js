import './toolbar.scss';

function trigger(el, eventName, detail={}) {
  let event;
  if (window.CustomEvent) {
    event = new CustomEvent(eventName);
  } else {
    event = document.createEvent('CustomEvent', { detail });
    event.initCustomEvent(eventName, true, true, detail);
  }

  el.dispatchEvent(event);
}

function insertAtCursor(el, value) {
  // MODERN support
  if (document.queryCommandSupported('insertText')) {
    el.focus();
    document.execCommand('insertText', false, value);
  }
  // IE support
  else if (document.selection) {
    el.focus();
    sel = document.selection.createRange();
    sel.text = value;
  }
  // Others
  else if (el.selectionStart) {
    const startPos = el.selectionStart;
    const endPos = el.selectionEnd;
    el.value = el.value.substring(0, startPos)
      + value
      + el.value.substring(endPos, el.value.length);

    el.focus();
    el.selectionEnd = endPos + value.length;
    trigger(el, 'input');

    el.dispatchEvent(event);

  } else {
    el.value += value;
  }
}

document.addEventListener('mousedown', e => {
  const el = e.target;

  if(el.classList.contains('js-add-chord')) {
    const textarea = document.getElementById('version_content');
    const val = el.innerText.replace(/\s/, '');
    insertAtCursor(textarea, '[' + val + ']');
  }

});
