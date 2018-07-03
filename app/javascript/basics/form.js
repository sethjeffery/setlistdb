import './form.scss';
import './choices/cross.svg';
import './choices/cross-inverse.svg';
import Choices from 'choices.js';

function toFirstLetterUppercase(str) {
  return str && `${str[0].toUpperCase()}${str.slice(1, str.length)}`;
}

const convertSelects = function() {
  document.querySelectorAll('select').forEach(function(s) {
    new Choices(s, {
      shouldSort: false,
      itemSelectText: '',
      callbackOnCreateTemplates: function (template) {
        const el = this;
        const classNames = this.config.classNames;
        const iconName = this.element.dataset.icon === true ? 'icon' : this.element.dataset.icon;
        return {
          item: (data) => {
            const className = `${classNames.item} ${data.highlighted ? classNames.highlightedState : classNames.itemSelectable}`;
            const icon = iconName ? `<i class="${iconName}-${data.value}"></i>` : '';
            const selected = data.active ? 'aria-selected="true"' : '';
            const disabled = data.disabled ? 'aria-disabled="true"' : '';

            return template(`
              <div class="${className}" data-item data-id="${data.id}" data-value="${data.value}" ${selected} ${disabled}>
                ${icon} ${data.label}
              </div>
            `);
          },
          choice: data => {
            data.selectText = el.config.itemSelectText;
            data.choice = data.disabled ? 'data-choice data-choice-disabled aria-disabled="true"' : 'data-choice data-choice-selectable';
            const className = `${classNames.item} ${classNames.itemChoice} ${data.disabled ? classNames.itemDisabled : classNames.itemSelectable}`;
            const role = data.groupId > 0 ? 'treeitem' : 'option';
            const icon = iconName ? `<i class="${iconName}-${data.value}"></i>` : '';
            const description = el.element.dataset[`description${toFirstLetterUppercase(data.value)}`];
            return template(`
              <div class="${className}" data-select-text="${data.selectText}" ${data.choice} data-id="${data.id}" data-value="${data.value}" role="${role}">
                ${icon} ${data.label} ${description ? '<div class="description">' + description + '</div>' : ''}
              </div>
            `);
          },
        };
      }
    });

  });
};

document.addEventListener('turbolinks:load', convertSelects);
convertSelects();
