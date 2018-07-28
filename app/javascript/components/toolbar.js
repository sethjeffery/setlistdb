import './toolbar.scss';
import {chordsOf} from 'principles/transposer';
import trigger from 'principles/trigger';
import addSelectorEventListener from '../principles/addSelectorEventListener';
import {renderKey} from "../principles/renderer";

function updateChords() {
  const btnGroupChords = document.getElementById('btn-group-chords');
  const chords = chordsOf(this.value ? this.value : 'G');
  btnGroupChords.innerHTML = chords.map(chord => {
    if(/m$/.test(chord)) {
      return `<div class="btn btn-sm btn-secondary js-add-chord">${renderKey(chord)}</div>`;
    } else {
      return `<div class="btn btn-sm btn-info js-add-chord">${renderKey(chord)}</div>`;
    }
  }).join('');
}

function insertAtCursor(el, value) {
  // MODERN support
  if (document.queryCommandSupported('insertText')) {
    el.focus();
    document.execCommand('insertText', false, value);
    el.focus();
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

function observeKeyChanges() {
  const el = document.getElementById('version_key');
  el && el.addEventListener('input', updateChords);
}

observeKeyChanges();
document.addEventListener('turbolinks:load', observeKeyChanges);

addSelectorEventListener('.js-add-chord', 'mouseup', function(e) {
  const textarea = document.getElementById('version_content');
  const val = this.innerText.replace(/\s/, '');
  insertAtCursor(textarea, '[' + val + ']');
});
