import './importer.scss';
import addSelectorEventListener from 'principles/addSelectorEventListener';
import findClosest from 'principles/findClosest';

addSelectorEventListener('#version_import', 'change', function(e) {
  const form = findClosest(this, 'form');
  form.submit();
});
