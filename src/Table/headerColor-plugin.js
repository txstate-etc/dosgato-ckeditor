import Plugin from '@ckeditor/ckeditor5-core/src/plugin'

import {
  addListToDropdown,
  createDropdown
} from '@ckeditor/ckeditor5-ui/src/dropdown/utils'

import Collection from '@ckeditor/ckeditor5-utils/src/collection'
import Model from '@ckeditor/ckeditor5-ui/src/model'

class HeaderColorUI extends Plugin {
  init () {
    const editor = this.editor
    const t = editor.t

    // const headerColors = editor.config.get('colors')
    const headerColors = [
      { label: 'None', value: 'header-color-none' },
      { label: 'Default (Gold)', value: 'header-color-gold' },
      { label: 'Maroon', value: 'header-color-maroon' },
      { label: 'Charcoal', value: 'header-color-charcoal' },
      { label: 'Deep Blue', value: 'header-color-blue' },
      { label: 'River', value: 'header-color-river' },
      { label: 'Sandstone', value: 'header-color-sandstone' },
      { label: 'Old Gold', value: 'header-color-oldgold' }
    ]

    const attrs = headerColors.reduce((acc, curr) => {
      acc[curr.value] = {
        name: 'figure',
        key: 'class',
        value: ['table', curr.value]
      }
      return acc
    }, {})

    editor.model.schema.extend('table', {
      allowAttributes: 'class'
    })

    editor.conversion.attributeToAttribute({
      model: {
        name: 'table',
        key: 'class',
        values: headerColors.map(({ value }) => value)
      },
      view: attrs
    })

    // The "headerColor" dropdown must be registered among the UI components of the editor
    // to be displayed in the toolbar.
    editor.ui.componentFactory.add('headerColor', locale => {
      const dropdownView = createDropdown(locale)

      // Populate the list in the dropdown with items.
      addListToDropdown(
        dropdownView,
        getDropdownItemsDefinitions(headerColors)
      )

      dropdownView.buttonView.set({
        // The t() function helps localize the editor. All strings enclosed in t() can be
        // translated and change when the language of the editor changes.
        label: t('Header Color'),
        withText: true
      })

      // Execute the command when the dropdown item is clicked (executed).
      this.listenTo(dropdownView, 'execute', (evt, data) => {
        const selection = getSelectionAffectedTable(editor.model.document.selection)
        editor.model.change(writer => writer.setAttribute('class', evt.source.commandParam, selection))
      })

      return dropdownView
    })
  }
}

function getDropdownItemsDefinitions (headerColors) {
  const itemDefinitions = new Collection()

  for (const { label, value } of headerColors) {
    const definition = {
      type: 'button',
      model: new Model({
        commandParam: value,
        label,
        withText: true
      })
    }

    // Add the item definition to the collection.
    itemDefinitions.add(definition)
  }

  return itemDefinitions
}

/**
 * Depending on the position of the selection we either return the table under cursor or look for the table higher in the hierarchy.
 *
 * @param {module:engine/model/position~Position} position
 * @returns {module:engine/model/element~Element}
 */
function getSelectionAffectedTable (selection) {
  const selectedElement = selection.getSelectedElement()

  // Is the command triggered from the `tableToolbar`?
  if (selectedElement && selectedElement.is('element', 'table')) {
    return selectedElement
  }

  return selection.getFirstPosition().findAncestor('table')
}

export default class HeaderColor extends Plugin {
  static get requires () {
    return [
      HeaderColorUI
    ]
  }
}
