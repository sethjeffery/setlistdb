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
import { faFileUpload } from '@fortawesome/free-solid-svg-icons/faFileUpload'
import { faCloudDownloadAlt } from '@fortawesome/free-solid-svg-icons/faCloudDownloadAlt'
import { faFileAlt } from '@fortawesome/free-solid-svg-icons/faFileAlt'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons/faUserCircle'
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub'
import { faOnsong } from './icons/faOnsong';
import { faChordpro } from './icons/faChordpro';

import './icons.scss';

library.add(
  faCheckSquare, faSquare, faPen, faFile, faPlusCircle, faPrint, faSearch,
  faFacebookSquare, faSignOutAlt, faCloudDownloadAlt, faFileUpload, faFileAlt,
  faUserCircle, faGithub, faOnsong, faChordpro
);

dom.watch();
document.addEventListener('turbolinks:load', dom.watch);
