import './song.scss';
import addSelectorEventListener from '../principles/addSelectorEventListener';
import {transpose as transposeChord, transposeKey} from "../principles/transposer";
import {renderKey} from "../principles/renderer";

const CHORD_REGEX = /[A-G](?:[b#])?(?:m|M|maj|MAJ|mM)?(?:sus)?(?:[0-9]{0,2})(?:[b#+-][0-9])?(?:\/[A-G](?:[b#])?)?/g;
const CHORDPRO_REGEX = new RegExp(`\\[(${CHORD_REGEX.source})]`, 'g');
const CHORDSIMPLE_REGEX = new RegExp(`^\\s*\\[?(${CHORD_REGEX.source})\\]?(?:\\s*\\[?(${CHORD_REGEX.source})\\]?)*\\s*$`, 'gm');
const TITLE_REGEX = /^:*(?:\d(st|nd|rd|th)\s)?(?:V|VERSE|CHORUS|PRE|PRE-?CHORUS|BRIDGE|CODA|INTRO|OUTRO|TAG|ENDING|END)\s*\d*:*$/i;

function tag({ tag = 'div', className = '', content = '' }) {
  return `<${tag} class="${className}">${content}</${tag}>`;
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function addSpacing(el) {
  if(el && !el.querySelector('.spacer')) {
    el.querySelectorAll('.song-line').forEach(line => {
      let lastChord = null;
      line.querySelectorAll('.chord').forEach(chord => {
        if (lastChord) {
          const offset = chord.offsetLeft - lastChord.offsetLeft - lastChord.clientWidth;
          if (offset < 10 && chord.offsetTop === lastChord.offsetTop) {
            const spacer = document.createElement('span');
            spacer.className = 'spacer';
            spacer.style.width = parseInt(lastChord.offsetLeft + lastChord.clientWidth - chord.offsetLeft) / 16 + .25 + 'em';
            chord.parentNode.insertBefore(spacer, chord);
          }
        }
        lastChord = chord;
      });
    });
  }
}

function convertToChordPro(lines) {
  const output = [];
  let match = null;
  lines.forEach((line, index) => {
    if(index < lines.length - 1 && line.match(CHORDSIMPLE_REGEX) && !lines[index+1].match(CHORDSIMPLE_REGEX)) {
      let offset = 0;
      while(match = CHORD_REGEX.exec(line)) {
        const before = lines[index+1].slice(0, match.index + offset);
        const after = lines[index+1].slice(match.index + offset, lines[index+1].length);
        lines[index+1] = `${before}[${match[0]}]${after}`;
        offset += match[0].length + 2;
      }
    } else {
      output.push(line);
    }
  });
  return output;
}

function setContentHtml(el, { content, transpose, key, notes }) {
  let html = '';

  if(notes) {
    html += tag({ className: 'comment', content: notes });
  }

  const sections = content.split(/\r?\n(?:\r?\n)+/);

  sections.filter(s => s).forEach(section => {
    const hasChords = section.match(CHORDPRO_REGEX) || section.match(CHORDSIMPLE_REGEX);
    let sectionHtml = '';
    let lines = section.split(/\r?\n/);

    if(lines[0].match(TITLE_REGEX)) {
      const title = lines[0]
        .replace(/:/g, '')
        .replace(/^c(?:horus)?( ?\d?)$/i, 'Chorus $1')
        .replace(/^v(?:erse)?( ?\d?)$/i, 'Verse $1')
        .replace(/^b(?:ridge)?( ?\d?)$/i, 'Bridge $1')
        .toUpperCase();

      sectionHtml += tag({ tag: 'h3', content: title, className: 'song-section-title' });
      lines = lines.slice(1, lines.length)
    }

    convertToChordPro(lines).filter(s => s).forEach(line => {
      const sanitized = escapeHtml(line).replace(CHORDPRO_REGEX, function(_m, chord) {
        if(transpose) {
          const note = chord.match(/[A-G][b#]?/)[0];
          const newKey = transposeKey({ key, by: transpose });
          const newNote = transposeChord({ from: key, to: newKey, note: chord });
          chord = chord.replace(note, newNote);
        }
        return `<span class="chord">${renderKey(chord)}</span>`;
      });
      sectionHtml += tag({ content: sanitized, className: 'song-line' });
    });

    html += tag({ className: `song-section ${hasChords ? 'song-section--chorded' : ''}`, content: sectionHtml })
  });

  el.innerHTML = html;
  addSpacing(el);
}

function updatePreview({ content, title, author, key, notes, transpose }) {
  const contentEl = document.querySelector('.song-page--preview .song-content');
  const titleEl = document.querySelector('.song-page--preview .song-title');
  const subtitleEl = document.querySelector('.song-page--preview .song-subtitle');

  setContentHtml(contentEl, {
    content: content && content.value,
    transpose: transpose && parseInt(transpose.value),
    key: key && key.value,
    notes: notes && notes.value
  });

  titleEl.innerHTML = title.value;
  subtitleEl.innerHTML = author.value;
}

function observeContentChanges() {
  const content = document.querySelector('[name*="[content]"]');
  const notes = document.querySelector('[name*="[notes]"]');
  const title = document.querySelector('[name*="[title]"]');
  const author = document.querySelector('[name*="[artist_names]"]');
  const key = document.querySelector('[name*="[key]"]');
  const transpose = document.querySelector('[name*="[transpose]"]');

  const observeChange = function() {
    updatePreview({ content, title, author, key, notes, transpose });
  };

  if(content) {
    content && content.addEventListener('input', observeChange, { passive: true });
    content && content.addEventListener('change', observeChange, { passive: true });
    title && title.addEventListener('input', observeChange, { passive: true });
    author && author.addEventListener('input', observeChange, { passive: true });
    key && key.addEventListener('input', observeChange, { passive: true });
    notes && notes.addEventListener('input', observeChange, { passive: true });
    transpose && transpose.addEventListener('change', observeChange, { passive: true });
  }

  document.querySelectorAll('.song-content').forEach(addSpacing);
}

observeContentChanges();
document.addEventListener('turbolinks:load', observeContentChanges);

addSelectorEventListener('.js-toggle-chords', 'click', function(e) {
  const preview = document.querySelector('.song-page');

  if(this.classList.contains('js-toggle-chords')) {
    if(this.classList.contains('text-muted')) {
      this.classList.remove('text-muted');
      this.innerHTML = `<i class='fas fa-check-square mr-1'></i> ${this.innerText}`;
      preview.classList.remove('song-page--hide-chords');
    } else {
      this.classList.add('text-muted');
      this.innerHTML = `<i class='far fa-square mr-1'></i> ${this.innerText}`;
      preview.classList.add('song-page--hide-chords');
    }
  }
});

addSelectorEventListener('.js-toggle-chords', 'change', function(e) {

  if(this.classList.contains('js-toggle-chords')) {
    if(this.checked) {
      document.querySelectorAll('.song-page').forEach(function(preview) {
        preview.classList.remove('song-page--hide-chords');
      });
    } else {
      document.querySelectorAll('.song-page').forEach(function(preview) {
        preview.classList.add('song-page--hide-chords');
      });
    }
  }
});
