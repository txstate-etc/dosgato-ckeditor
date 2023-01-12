import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'
import { getSelectionAffectedTable } from '../utils/helpers'

class TableBorderUI extends Plugin {
	init() {
		const editor = this.editor
		const t = editor.t

    editor.conversion.attributeToAttribute({
      model: {
        name: 'table',
        key: 'border',
        values: ['border']
      },
      view: {
        border: {
          name: 'figure',
          key: 'border',
          value: ['1']
        }
      }
    })


		editor.ui.componentFactory.add( 'tableBorder', locale => {
			const buttonView = new ButtonView( locale )

			buttonView.set( {
				label: t( 'Border' ),
				// icon: ,
				tooltip: true,
        withText: true,
				isToggleable: true
			} )

			// Execute command.
			this.listenTo( buttonView, 'execute', () => {
        const selection = getSelectionAffectedTable(editor.model.document.selection)

        console.log(selection)

        editor.model.change(writer => {
          if (selection.getAttribute('border')) {
            writer.removeAttribute('border', selection)
          } else writer.setAttribute('border', 'border', selection)
        })
			} )

			return buttonView
		} )
	}
}

export default class TableBorder extends Plugin {
  static get requires () {
    return [
      TableBorderUI
    ]
  }
}
