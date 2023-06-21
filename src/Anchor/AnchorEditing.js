import { Plugin } from '@ckeditor/ckeditor5-core'
import AnchorCommand from './Commands/anchorcommand'
import { Widget, toWidget } from '@ckeditor/ckeditor5-widget'
export default class AnchorEditing extends Plugin {
  /**
   * @inheritDoc
   */
  static get pluginName () {
    return 'AnchorEditing'
  }

  /**
   * @inheritDoc
   */
  static get requires () {
    // Clipboard is required for handling cut and paste events while typing over the link.
    return [Widget]
  }

  /**
   * @inheritDoc
   */
  constructor (editor) {
    super(editor)

    editor.config.define('anchor')
  }

  /**
   * @inheritDoc
   */
  init () {
    const editor = this.editor
    const schema = editor.model.schema

    const anchorImage = editor.config.get('anchor.imageUrl')

    // Allow link attribute on all inline nodes.
    editor.model.schema.extend('$text', { allowAttributes: 'anchorId' })

    schema.register( 'anchorId', {
			inheritAllFrom: '$inlineObject',
			allowAttributes: [ 'id', 'name' ]
		} );


    editor.conversion.for('dataDowncast').elementToElement({
      model: 'anchorId',
      view: (element, { writer }) => {
        const id = element.getAttribute('id')
        const linkElement = writer.createEmptyElement('a', { id, name: id }, { priority: 5 })
        writer.setCustomProperty('anchor', true, linkElement)
        return linkElement
      }
    })

    editor.conversion.for('editingDowncast').elementToElement({
      model: 'anchorId',
      view: (element, { writer }) => {
        const id = element.getAttribute('id')
        const placeholderView = writer.createContainerElement( 'span')

        const linkElement = writer.createEmptyElement('img', { 
          id, 
          name: id, 
          src: anchorImage || 'anchor.png',
          style: 'width: 20px; margin-bottom: -6px;'
        }, { priority: 5 })

        writer.setCustomProperty('anchor', true, placeholderView)
        writer.insert(writer.createPositionAt( placeholderView, 0 ), linkElement)
        return toWidget(placeholderView, writer)
      }
    })

    editor.conversion.for('upcast').elementToElement({
      view: {
        name: 'a',
        attributes: ['id', 'name']
      },
      model: ( viewElement, { writer } ) => {
        const name = viewElement.getAttribute('name')
        const element = writer.createElement( 'anchorId', { id: name, name } );
        writer.setAttribute('anchorId', name, element)
        return element
      }
    })

    // Create linking commands.
    editor.commands.add('anchor', new AnchorCommand(editor))
  }
}
