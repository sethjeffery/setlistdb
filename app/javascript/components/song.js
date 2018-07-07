import './song.scss';
import {chordsOf} from '../principles/transposer';

const CHORD_REGEX = /[A-G](?:[b#])?(?:m|M|maj|MAJ|mM)?(?:[0-9]{0,2})(?:[b#+-][0-9])?(?:\/[A-G](?:[b#])?)?/g;
const CHORDPRO_REGEX = new RegExp(`\\[(${CHORD_REGEX.source})]`, 'g');
const CHORDSIMPLE_REGEX = new RegExp(`^\\s*(${CHORD_REGEX.source})(?:\\s+(${CHORD_REGEX.source}))*\\s*$`, 'gm');
const TITLE_REGEX = /^:*(?:\d(st|nd|rd|th)\s)?(?:V|VERSE|CHORUS|PRE|PRE-?CHORUS|BRIDGE|CODA|INTRO|OUTRO|TAG)\s*\d*:*$/i;
const KEY_REGEX = /^[A-G][b#]?m?$/;

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
          if (offset < 10) {
            const spacer = document.createElement('span');
            spacer.className = 'spacer';
            spacer.style.width = lastChord.offsetLeft + lastChord.clientWidth - chord.offsetLeft + 10 + 'px';
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
  let index = 0, match = null;
  lines.forEach(line => {
    if(line.match(CHORDSIMPLE_REGEX) && index < lines.length && !lines[index+1].match(CHORDSIMPLE_REGEX)) {
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
    index++;
  });
  return output;
}

function setContentHtml(el, content) {
  let html = '';

  const tempEl = document.createElement('div');
  tempEl.style.position = 'absolute';
  tempEl.style.overflow = 'hidden';
  el.appendChild(tempEl);

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

    convertToChordPro(lines).forEach(line => {
      const sanitized = escapeHtml(line).replace(CHORDPRO_REGEX, '<span class="chord">$1</span>');
      sectionHtml += tag({ content: sanitized, className: 'song-line' });
    });

    html += tag({ className: `song-section ${hasChords ? 'song-section--chorded' : ''}`, content: sectionHtml })
  });

  tempEl.innerHTML = html;
  addSpacing(tempEl);

  el.innerHTML = tempEl.innerHTML;
  tempEl.remove();
}

function updatePreview({ content, title, author, key }) {
  const contentEl = document.querySelector('.song-page--preview .song-content');
  const titleEl = document.querySelector('.song-page--preview .song-title');
  const subtitleEl = document.querySelector('.song-page--preview .song-subtitle');

  setContentHtml(contentEl, content.value, key.value);
  titleEl.innerHTML = title.value;
  subtitleEl.innerHTML = author.value;
}

function updateChords({ key }) {
  const btnGroupChords = document.getElementById('btn-group-chords');
  const chords = chordsOf(key.value ? key.value : 'G');
  btnGroupChords.innerHTML = chords.map(chord => {
    if(/m$/.test(chord)) {
      return `<div class="btn btn-sm btn-secondary js-add-chord">${chord}</div>`;
    } else {
      return `<div class="btn btn-sm btn-info js-add-chord">${chord}</div>`;
    }
  }).join('');
}

function observeContentChanges() {
  const content = document.querySelector('textarea[name="version[content]"]');
  const title = document.querySelector('input[name="version[title]"]');
  const author = document.querySelector('input[name="version[author_name]"]');
  const key = document.querySelector('input[name="version[key]"]');

  const observeChange = function() {
    updatePreview({ content, title, author, key });
    updateChords({ key });
  };

  if(content) {
    content.addEventListener('input', observeChange, { passive: true });
    content.addEventListener('change', observeChange, { passive: true });
    title.addEventListener('input', observeChange, { passive: true });
    author.addEventListener('input', observeChange, { passive: true });
    key.addEventListener('input', observeChange, { passive: true });
  }

  addSpacing(document.querySelector('.song-content'));
}

observeContentChanges();
document.addEventListener('turbolinks:load', observeContentChanges);

document.addEventListener('click', e => {
  const el = e.target;
  const preview = document.querySelector('.song-page');

  if(el.classList.contains('js-toggle-chords')) {
    if(el.classList.contains('btn-info')) {
      el.classList.remove('btn-info');
      el.classList.add('btn-outline-secondary');
      el.innerHTML = `<i class='far fa-square mr-1'></i> ${el.innerText}`;
      preview.classList.add('song-page--hide-chords');
    } else {
      el.classList.remove('btn-outline-secondary');
      el.classList.add('btn-info');
      el.innerHTML = `<i class='fas fa-check-square mr-1'></i> ${el.innerText}`;
      preview.classList.remove('song-page--hide-chords');
    }
  }
});
