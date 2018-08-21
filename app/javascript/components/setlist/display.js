import {currentSongIndex} from "./list";
import Glide from "@glidejs/glide/dist/glide";
import '@glidejs/glide/src/assets/sass/glide.core';

class Display {
  instance = null;

  destroy() {
    this.instance && this.instance.destroy();
    this.instance = null;
  }

  moveTo(index = 0) {
    this.instance && this.instance.go('=' + index);
  }
  create() {
    this.destroy();

    this.instance = new Glide('.glide', {
      type: 'carousel',
      gap: 0,
      startAt: currentSongIndex()
    });

    return this.instance
      .mount()
      .on('run', () => {
        const activeListItem = document.querySelector('.setlist-version .active');
        activeListItem.classList.remove('active');

        const listItems = document.getElementById('setlist-versions');
        const newListItem = listItems.getElementsByTagName('a')[this.instance.index];
        newListItem.classList.add('active');

        const editSongLink = document.getElementById('edit_song_link');
        if (editSongLink) {
          editSongLink.href = editSongLink.href.replace(/[^\/]+\/edit$/, newListItem.dataset.id + '/edit');
        }
      });
  }
}

const display = new Display;

function setup() {
  if(document.querySelector('.glide')) {
    display.create();
  } else {
    display.destroy();
  }
}

document.addEventListener('turbolinks:load', setup);
setup();

export default display;
