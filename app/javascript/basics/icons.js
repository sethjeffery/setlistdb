import { library, dom } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

import { faCheckSquare } from '@fortawesome/free-solid-svg-icons/faCheckSquare';
import { faSquare } from '@fortawesome/free-regular-svg-icons/faSquare';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import { faFile } from '@fortawesome/free-regular-svg-icons/faFile';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import { faPrint } from '@fortawesome/free-solid-svg-icons/faPrint'
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons/faFacebookSquare'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt'

import './icons.scss';

library.add(
  faCheckSquare, faSquare, faPen, faFile, faPlusCircle, faPrint, faSearch,
  faFacebookSquare, faSignOutAlt
);

dom.watch();
document.addEventListener('turbolinks:load', dom.watch);
