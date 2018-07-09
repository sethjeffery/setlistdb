/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import Turbolinks from 'turbolinks';
import RailsUjs from 'rails-ujs';
import 'events-polyfill';

import 'principles/bootstrap';
import 'basics/typography';
import 'basics/datalists';
import 'basics/form';
import 'basics/icons';
import 'basics/avatars';
import 'components/importer';
import 'components/song';
import 'components/version';
import 'components/header';
import 'components/intro';
import 'components/toolbar';
import 'templates/layout';
import 'templates/header';
import 'templates/footer';

import 'principles/print';

RailsUjs.start();
Turbolinks.start();
