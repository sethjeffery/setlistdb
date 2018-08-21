import findClosest from "../../principles/findClosest";
import addSelectorEventListener from "../../principles/addSelectorEventListener";
import NoSleep from "nosleep.js";
import './toolbar.scss';

const noSleep = new NoSleep;

addSelectorEventListener('#chords', 'click', function(e) {
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

addSelectorEventListener('#no_sleep', 'change', function() {
  this.checked ? noSleep.enable() : noSleep.disable();
});

document.addEventListener('turbolinks:load', noSleep.disable.bind(noSleep));
