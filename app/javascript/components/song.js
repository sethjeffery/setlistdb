import './song.scss';

const CHORD_REGEX = /\[([\w#+-\/]+)\]/g;
const TITLE_REGEX = /^:*(?:\d(st|nd|rd|th)\s)?(?:V|VERSE|CHORUS|PRE|PRE-?CHORUS|BRIDGE|CODA|INTRO|OUTRO|TAG)\s*\d*:*$/i;
const KEY_REGEX = /^[A|B|C|D|E|F|G](b|#)?m?$/

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

function setContentHtml(el, content, key) {
  let html = '';

  const tempEl = document.createElement('div');
  tempEl.style.position = 'absolute';
  tempEl.style.overflow = 'hidden';
  el.appendChild(tempEl);

  if(!KEY_REGEX.test(key) && CHORD_REGEX.test(content)) {
    el.innerHTML = "<div class='alert alert-warning'>Please specify a correct key for the song</div>";
    return false;
  }

  const sections = content.split(/\r?\n(?:\r?\n)+/);

  sections.filter(s => s).forEach(section => {
    const hasChords = section.match(CHORD_REGEX);
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

    lines.forEach(line => {
      const sanitized = escapeHtml(line).replace(CHORD_REGEX, '<span class="chord">$1</span>');
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

function observeContentChanges() {
  const content = document.querySelector('textarea[name="version[content]"]');
  const title = document.querySelector('input[name="version[title]"]');
  const author = document.querySelector('input[name="version[author_name]"]');
  const key = document.querySelector('input[name="version[key]"]');

  const observeChange = function() {
    updatePreview({ content, title, author, key });
  };

  if(content) {
    content.addEventListener('input', observeChange, { passive: true });
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
