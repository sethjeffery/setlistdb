import './setlist.scss';
import addSelectorEventListener from '../principles/addSelectorEventListener';
import Glide from '@glidejs/glide';
import findClosest from '../principles/findClosest';

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

function setupGlide() {
  const glide = new Glide('.glide', {
    type: 'carousel',
    gap: 0,
  });
  glide.mount().on('run', function({ direction }) {
    const activeItem = document.querySelector('.setlist-version .active');
    activeItem.classList.remove('active');
    const parent = activeItem.parentNode.parentNode;
    parent.getElementsByTagName('a')[glide.index].classList.add('active');
  });
}

document.addEventListener('turbolinks:load', setupGlide);
setupGlide();
