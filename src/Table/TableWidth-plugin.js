import Plugin from '@ckeditor/ckeditor5-core/src/plugin'

import {
  addListToDropdown,
  createDropdown
} from '@ckeditor/ckeditor5-ui/src/dropdown/utils'

import Collection from '@ckeditor/ckeditor5-utils/src/collection'
import Model from '@ckeditor/ckeditor5-ui/src/model'
import { getSelectionAffectedTable } from '../utils/helpers'

class TableWidthUI extends Plugin {
  init () {
    const editor = this.editor
    const t = editor.t

    this.registerConverters()

    const widths = [
      { label: 'Auto', value: 'auto-width-hubba' },
      { label: '100%', value: 'full-width-dubba' }
    ]

    editor.model.schema.extend('table', {
      allowAttributes: 'class'
    })

    editor.conversion.attributeToAttribute({
      model: {
        name: 'table',
        key: 'class',
        values: widths.map(({ value }) => value)
        // values: ['tableWidthPlugin']
      },
      view: widths.reduce((acc, curr) => {
        acc[curr.value] = {
          name: 'figure',
          key: 'class',
          value: [curr.value]
        }
        return acc
      }, {})
    })


    // The "tableWidth" dropdown must be registered among the UI components of the editor
    // to be displayed in the toolbar.
    editor.ui.componentFactory.add('tableWidth', locale => {
      const dropdownView = createDropdown(locale)

      // Populate the list in the dropdown with items.
      addListToDropdown(
        dropdownView,
        getDropdownItemsDefinitions(widths)
      )

      dropdownView.buttonView.set({
        // The t() function helps localize the editor. All strings enclosed in t() can be
        // translated and change when the language of the editor changes.
        label: t('Table Width'),
        withText: true
      })

      // Execute the command when the dropdown item is clicked (executed).
      this.listenTo(dropdownView, 'execute', (evt, data) => {
        const param = evt.source.commandParam
        const selection = getSelectionAffectedTable(editor.model.document.selection)

        editor.model.change(writer => {
          writer.setAttribute('class', param, selection)
        })

        dropdownView.buttonView.label = evt.source.label
      })


      return dropdownView
    })
  }

  registerConverters() {
    const editor = this.editor;

    // Dedicated converter to propagate image's attribute to the img tag.
    editor.conversion.for('downcast').add((dispatcher) =>
        dispatcher.on('attribute:class:table', (evt, data, conversionApi) => {
          console.log('TABLE CLASS DOWNCAST')
          console.log(data)
        })
    );
}
}

function getDropdownItemsDefinitions (widths) {
  const itemDefinitions = new Collection()

  for (const { label, value } of widths) {
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

export default class TableWidth extends Plugin {
  static get requires () {
    return [
      TableWidthUI
    ]
  }
}
