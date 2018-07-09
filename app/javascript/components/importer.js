import './importer.scss';
import addSelectorEventListener from 'principles/addSelectorEventListener';
import findAncestor from 'principles/findAncestor';

addSelectorEventListener('#version_import', 'change', function(e) {
  const form = findAncestor(this, 'form');
  form.submit();
});
