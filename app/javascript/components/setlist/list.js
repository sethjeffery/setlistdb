import sortable from "html5sortable/dist/html5sortable.cjs";
import {post} from "../../principles/ajax";
import display from './display';
import './list.scss';

export function currentSongIndex() {
  const versions = Array.prototype.slice.call(document.getElementById('setlist-versions').childNodes).filter(v => v.tagName === 'LI');
  let activeIndex = 0;

  versions.forEach((version, index) => {
    if(version.getElementsByTagName('a')[0].classList.contains('active')) {
      activeIndex = index;
    }
  });

  return activeIndex;
}

function onSortUpdate() {
  display.destroy();
  const versions = Array.prototype.slice.call(document.getElementById('setlist-versions').childNodes).filter(v => v.tagName === 'LI');
  const slides = document.getElementById('setlist-slides').childNodes;
  let orderedIds = [];

  versions.forEach((version, index) => {
    orderedIds.push(version.dataset.id);
    const slide = Array.prototype.slice.call(slides).find(s => s.dataset && s.dataset.id === version.dataset.id);
    slide.parentNode.appendChild(slide);
  });

  post(reorderSetlistPath(), { setlist_versions: orderedIds.join(',') });
  display.create();
}

function setup() {
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
      display.moveTo(index);
    });
  });
}

export function currentSetlistId() {
  return location.pathname.match(/\/setlists\/(\w+)/)[1];
}

export function reorderSetlistPath(id = currentSetlistId()) {
  return `/setlists/${id}/reorder`;
}

document.addEventListener('turbolinks:load', setup);
setup();
