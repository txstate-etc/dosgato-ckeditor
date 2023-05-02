import { Plugin } from 'ckeditor5/src/core'
import { ImageTextAlternativeEditing } from '@ckeditor/ckeditor5-image'
import { ImageTextAlternativeUI } from './ImageTextAlternativeUI'

export default class ImageTextAlternative extends Plugin {
	static get requires() {
		return [ ImageTextAlternativeEditing, ImageTextAlternativeUI ]
	}

	static get pluginName() {
		return 'ImageTxtAlternative'
	}
}
