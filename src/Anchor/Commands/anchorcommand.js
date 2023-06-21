import { Command } from '@ckeditor/ckeditor5-core';
import { toMap, first } from '@ckeditor/ckeditor5-utils';

function isAnchorableElement( element, schema ) {
	if ( !element ) return false
	return schema.checkAttribute( element.name, 'anchorId' );
}

export default class LinkCommand extends Command {
	constructor( editor ) {
		super( editor );
	}

	refresh() {
		const model = this.editor.model;
		const selection = model.document.selection;
		const selectedElement = selection.getSelectedElement() || first( selection.getSelectedBlocks() )

		if ( isAnchorableElement( selectedElement, model.schema ) ) {
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
			if (href !== '') {
				const attributes = toMap( selection.getAttributes() );
				
				attributes.set( 'anchorId', href );
				attributes.set( 'id', href );
				
				const imageElement = writer.createElement( 'anchorId', attributes );
				
				const { end: positionAfter } = model.insertObject(imageElement)
				writer.setSelection( positionAfter );
			}
		})
	}
}
