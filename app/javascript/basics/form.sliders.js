import './form.sliders.scss';
import rangeSlider from 'rangeslider-pure';
import {transposeKey} from "../principles/transposer";
import {renderKey} from "../principles/renderer";

const convertRangeSliders = function() {
  const sliders = document.querySelectorAll('input[type="range"]');
  if(sliders.length > 0) {
    const updateSlider = function () {
      const key = document.querySelector('[name*="[key]"]').value;
      const handle = this.range.getElementsByClassName('rangeSlider__handle')[0];
      let transposed = transposeKey({key, by: parseInt(this.value)});
      handle.innerHTML = renderKey(transposed);
    };

    rangeSlider.create(sliders, {
      onSlide: updateSlider,
      onInit: updateSlider
    });
  }
};

document.addEventListener('turbolinks:load', convertRangeSliders);
convertRangeSliders();
