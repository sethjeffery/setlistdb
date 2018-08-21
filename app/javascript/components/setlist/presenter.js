import addSelectorEventListener from "../../principles/addSelectorEventListener";
import display from './display';
import './presenter.scss';

function requestFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
  }
}

class Presenter {
  enabled() {
    const d = document;
    return d.fullscreenEnabled || d.mozFullScreenEnabled || d.documentElement.webkitRequestFullScreen;
  }

  isFullscreen() {
    const d = document;
    const fullscreenElement = d.fullscreenElement || d.mozFullScreenElement || d.webkitFullscreenElement;
    return d.webkitIsFullScreen || d.mozFullScreen || fullscreenElement !== null;
  }

  moveToSongIndex(index) {

  }

  present(el) {
    if (this.enabled()) {
      requestFullscreen(el);
      el.querySelectorAll('.presentation-slide').forEach((slide, index) => {
        if(index === 0) {
          slide.classList.add('show');
        } else {
          slide.classList.remove('show');
        }
      });
    }
  }

  addFullscreenListener(listener) {
    const onFullscreenChange = e => {
      if (this.isFullscreen()) {
        listener(e, true);
      } else {
        listener(e, false);
      }
    };

    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    document.addEventListener('mozfullscreenchange', onFullscreenChange);
    document.addEventListener('MSFullscreenChange', onFullscreenChange);
    document.addEventListener('fullscreenchange', onFullscreenChange);
  }
}

const presenter = new Presenter;
export default presenter;

addSelectorEventListener('[data-present]', 'click', function() {
  const target = this.dataset.target,
    el = target ? document.getElementById(target) : document.documentElement;
  presenter.present(el)
});

presenter.addFullscreenListener(function(e, fullscreen) {
  if(fullscreen) {
    display.destroy();
  } else {
    display.create();
  }
});
