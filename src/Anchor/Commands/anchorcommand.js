import { Command } from '@ckeditor/ckeditor5-core';
import { first, toMap } from '@ckeditor/ckeditor5-utils';
import { isLinkableElement } from '@ckeditor/ckeditor5-link/src/utils';

export default class LinkCommand extends Command {
	constructor( editor ) {
		super( editor );
	}

	refresh() {
		const model = this.editor.model;
		const selection = model.document.selection;
		const selectedElement = selection.getSelectedElement() || first( selection.getSelectedBlocks() );

		// A check for any integration that allows linking elements (e.g. `LinkImage`).
		// Currently the selection reads attributes from text nodes only. See #7429 and #7465.
		if ( isLinkableElement( selectedElement, model.schema ) ) {
			this.value = selectedElement.getAttribute( 'anchorId' );
			this.isEnabled = model.schema.checkAttribute( selectedElement, 'anchorId' );
		} else {
			this.value = selection.getAttribute( 'anchorId' );
			this.isEnabled = model.schema.checkAttributeInSelection( selection, 'anchorId' );
		}
	}


	execute( href ) {
		const model = this.editor.model;
		const selection = model.document.selection;
		
		model.change( writer => {
			const attributes = toMap( selection.getAttributes() );

			attributes.set( 'anchorId', href );
			attributes.set( 'id', href );

			const imageElement = writer.createElement( 'anchorId', attributes );

			
			const { end: positionAfter } = model.insertObject(imageElement)
			writer.setSelection( positionAfter );

			// Remove the `anchorId` attribute and all link decorators from the selection.
			// It stops adding a new content into the link element.
			writer.removeSelectionAttribute('anchorId')
		})
	}
}
