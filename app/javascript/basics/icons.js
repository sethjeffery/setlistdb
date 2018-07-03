import { library, dom } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

import { faCheckSquare } from '@fortawesome/free-solid-svg-icons/faCheckSquare';
import { faSquare } from '@fortawesome/free-regular-svg-icons/faSquare';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import { faFile } from '@fortawesome/free-regular-svg-icons/faFile';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import { faPrint } from '@fortawesome/free-solid-svg-icons/faPrint'

import './icons.scss';

library.add(
  faCheckSquare, faSquare, faPen, faFile, faPlusCircle, faPrint
);

dom.watch();
document.addEventListener('turbolinks:load', dom.watch);
