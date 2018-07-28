import './setlist.scss';
import addSelectorEventListener from '../principles/addSelectorEventListener';
import findClosest from '../principles/findClosest';
import Glide from '@glidejs/glide';
import sortable from 'html5sortable/dist/html5sortable.cjs';
import {post} from "../principles/ajax";
import NoSleep from 'nosleep.js';

let glide;
const noSleep = new NoSleep;

addSelectorEventListener('.js-toggle-songs', 'click', function(e) {
  const setlist = findClosest(this, '.setlist');

  if(this.classList.contains('js-toggle-songs')) {
    if(this.classList.contains('text-muted')) {
      this.classList.remove('text-muted');
      setlist.classList.add('setlist--show-songs');
    } else {
      this.classList.add('text-muted');
      setlist.classList.remove('setlist--show-songs');
    }
  }
});

function createGlide({ startAt = 0 } = {}) {
  const glide = new Glide('.glide', {
    type: 'carousel',
    gap: 0,
    startAt
  });

  return glide
    .mount()
    .on('run', function() {
      const activeListItem = document.querySelector('.setlist-version .active');
      activeListItem.classList.remove('active');

      const listItems = document.getElementById('setlist-versions');
      const newListItem = listItems.getElementsByTagName('a')[glide.index];
      newListItem.classList.add('active');

      const editSongLink = document.getElementById('edit_song_link');
      if(editSongLink) {
        editSongLink.href = editSongLink.href.replace(/[^\/]+\/edit$/, newListItem.dataset.id + '/edit');
      }
    });
}

function onSortUpdate() {
  glide.destroy();
  const versions = Array.prototype.slice.call(document.getElementById('setlist-versions').childNodes).filter(v => v.tagName === 'LI');
  const slides = document.getElementById('setlist-slides').childNodes;
  let activeIndex = 0;
  let orderedIds = [];

  versions.forEach((version, index) => {
    orderedIds.push(version.dataset.id);
    const slide = Array.prototype.slice.call(slides).find(s => s.dataset && s.dataset.id === version.dataset.id);
    slide.parentNode.appendChild(slide);
    if(version.getElementsByTagName('a')[0].classList.contains('active')) {
      activeIndex = index;
    }
  });

  post(reorderSetlistPath(), { setlist_versions: orderedIds.join(',') });
  glide = createGlide({ startAt: activeIndex });
}

function setupSetlists() {
  if(document.querySelector('.glide')) {
    glide = createGlide();
  }

  const sortableVersions = sortable('#setlist-versions.sortable', {
    items: '.card-list-item',
    forcePlaceholderSize: true
  })[0];

  if(sortableVersions) {
    sortableVersions.addEventListener('sortupdate', onSortUpdate);
  }

  document.querySelectorAll('.setlist .card-list-link').forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const parent = item.parentNode.parentNode;
      const index = Array.prototype.slice.call(parent.getElementsByTagName('a')).indexOf(item);
      glide.go("=" + index);
    });
  });

}

function currentSetlistId() {
  return location.pathname.match(/\/setlists\/(\w+)/)[1];
}

function reorderSetlistPath(id = currentSetlistId()) {
  return `/setlists/${id}/reorder`;
}

document.addEventListener('turbolinks:load', setupSetlists);
document.addEventListener('turbolinks:load', noSleep.disable.bind(noSleep));
setupSetlists();

addSelectorEventListener('#no_sleep', 'change', function() {
  this.checked ? noSleep.enable() : noSleep.disable();
});
