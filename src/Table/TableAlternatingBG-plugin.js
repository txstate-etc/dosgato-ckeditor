import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'
import { getSelectionAffectedTable } from '../utils/helpers'

class TableAlternatingUI extends Plugin {
	init() {
		const editor = this.editor
		const t = editor.t

    editor.conversion.attributeToAttribute({
      model: {
        name: 'table',
        key: 'class',
        values: ['altBG']
      },
      view: {
        altBG: {
          name: 'figure',
          key: 'class',
          value: ['alternating-row-color']
        }
      }
    })


		editor.ui.componentFactory.add( 'tableAlternatingBG', locale => {
			const buttonView = new ButtonView( locale )

			buttonView.set( {
				label: t( 'Alt BG' ),
				// icon: ,
				tooltip: true,
        withText: true,
				isToggleable: true
			} )

			// Execute command.
			this.listenTo( buttonView, 'execute', () => {
        const selection = getSelectionAffectedTable(editor.model.document.selection)

        editor.model.change(writer => {
          const attributes = selection.getAttribute('class')
          console.log(attributes)
          if (attributes && attributes.includes('altBG')) {
            writer.removeAttribute('class', selection)
            buttonView.isOn = false
          } else {
            writer.setAttribute('class', 'altBG', selection)
            buttonView.isOn = true
          }
        })
			} )

			return buttonView
		} )
	}
}

export default class TableAlternatingBG extends Plugin {
  static get requires () {
    return [
      TableAlternatingUI
    ]
  }
}
