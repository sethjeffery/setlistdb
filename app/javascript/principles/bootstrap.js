import {
  Affix, Alert, Button, Carousel, Collapse, Dropdown, Modal, Popover, ScrollSpy, Tab, Tooltip
} from 'bootstrap.native/dist/bootstrap-native-v4';
import './bootstrap.scss';

document.addEventListener('turbolinks:load', function(){
  const container = document.documentElement;
  Array.prototype.forEach.call(container.querySelectorAll('[data-spy="affix"]'), function(element){ new Affix(element) });
  Array.prototype.forEach.call(container.querySelectorAll('[data-dismiss="alert"]'), function(element){ new Alert(element) });
  Array.prototype.forEach.call(container.querySelectorAll('[data-toggle="buttons"]'), function(element){ new Button(element) });
  Array.prototype.forEach.call(container.querySelectorAll('[data-ride="carousel"]'), function(element){ new Carousel(element) });
  Array.prototype.forEach.call(container.querySelectorAll('[data-toggle="collapse"]'), function(element){ new Collapse(element) });
  Array.prototype.forEach.call(container.querySelectorAll('[data-toggle="dropdown"]'), function(element){ new Dropdown(element) });
  Array.prototype.forEach.call(container.querySelectorAll('[data-toggle="modal"]'), function(element){ new Modal(element) });
  Array.prototype.forEach.call(container.querySelectorAll('[data-toggle="popover"]'), function(element){ new Popover(element) });
  Array.prototype.forEach.call(container.querySelectorAll('[data-spy="scroll"]'), function(element){ new ScrollSpy(element) });
  Array.prototype.forEach.call(container.querySelectorAll('[data-toggle="tab"]'), function(element){ new Tab(element) });
  Array.prototype.forEach.call(container.querySelectorAll('[data-toggle="tooltip"]'), function(element){ new Tooltip(element) });
  Array.prototype.forEach.call(container.querySelectorAll('[data-tooltip]'), function(element){ new Tooltip(element) });
},false);

Array.prototype.forEach.call(document.querySelectorAll('[data-tooltip]'), function(element){ new Tooltip(element) });
