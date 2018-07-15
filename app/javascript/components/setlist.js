import './setlist.scss';
import addSelectorEventListener from '../principles/addSelectorEventListener';
import findClosest from '../principles/findClosest';
import Glide from '@glidejs/glide';
import sortable from 'html5sortable/dist/html5sortable.cjs';

addSelectorEventListener('.js-toggle-songs', 'click', function(e) {
  const setlist = findClosest(this, '.setlist');

  if(this.classList.contains('js-toggle-songs')) {
    if(this.classList.contains('btn-info')) {
      this.classList.remove('btn-info');
      this.classList.add('btn-outline-secondary');
      setlist.classList.remove('setlist--show-songs');
    } else {
      this.classList.remove('btn-outline-secondary');
      this.classList.add('btn-info');
      setlist.classList.add('setlist--show-songs');
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
    .on('run', function({ direction }) {
      const activeItem = document.querySelector('.setlist-version .active');
      activeItem.classList.remove('active');
      const parent = activeItem.parentNode.parentNode;
      parent.getElementsByTagName('a')[glide.index].classList.add('active');
    });
}

function setupSetlists() {
  let glide = createGlide();

  const sortables = sortable('#setlist-versions', {
    forcePlaceholderSize: true
  });

  sortables[0].addEventListener('sortupdate', function(e) {
    glide.destroy();
    const versions = Array.prototype.slice.call(document.getElementById('setlist-versions').childNodes).filter(v => v.tagName === 'LI');
    const slides = document.getElementById('setlist-slides').childNodes;
    let activeIndex = 0;
    versions.forEach((version, index) => {
      if(version.dataset && version.dataset.id) {
        const slide = Array.prototype.slice.call(slides).find(s => s.dataset && s.dataset.id === version.dataset.id);
        slide.parentNode.appendChild(slide);
        if(version.getElementsByTagName('a')[0].classList.contains('active')) {
          activeIndex = index;
        }
      }
    });
    glide = createGlide({ startAt: activeIndex });
  });

  document.querySelectorAll('.setlist .card-list-item__link').forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const parent = item.parentNode.parentNode;
      const index = Array.prototype.slice.call(parent.getElementsByTagName('a')).indexOf(item);
      glide.go("=" + index);
    });
  });

}

document.addEventListener('turbolinks:load', setupSetlists);
setupSetlists();
