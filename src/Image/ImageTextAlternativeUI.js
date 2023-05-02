import { ImageTextAlternativeUI as ImgAltUI } from '@ckeditor/ckeditor5-image'
import { ButtonView } from '@ckeditor/ckeditor5-ui'

export class ImageTextAlternativeUI extends ImgAltUI {
  static get pluginName() {
		return 'CustomImageTextAlternativeUI';
	}

  _createButton() {
		const editor = this.editor;
		const t = editor.t;

		editor.ui.componentFactory.add( 'imageTxtAlternative', locale => {
			const command = editor.commands.get( 'imageTextAlternative' );
			const view = new ButtonView( locale );

			view.set( {
				label: t( 'ALT' ),
        withText: true
			} );

			view.bind( 'isEnabled' ).to( command, 'isEnabled' );
			view.bind( 'isOn' ).to( command, 'value', value => !!value );

			this.listenTo( view, 'execute', () => {
				this._showForm();
			} );

			return view;
		} );
	}
}
