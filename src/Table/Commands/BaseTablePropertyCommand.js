import { Command } from 'ckeditor5/src/core'
import { getSelectionAffectedTable } from '../../utils/helpers'

export default class TablePropertyCommand extends Command {
  constructor(editor, attributeName) {
    super(editor)

    this.attributeName = attributeName
  }

  execute( options = {} ) {
    const { value, batch, oldValue } = options
    const model = this.editor.model
    const table = getSelectionAffectedTable(model.document.selection)

    const attributes = table.getAttribute(this.attributeName) ? table.getAttribute(this.attributeName).split(' ') : []
    
    const oldIndex = attributes.indexOf(oldValue)
    
    if (oldIndex > -1) attributes.splice(oldIndex, 1)

    model.enqueueChange( batch, writer => {
        writer.setAttribute(this.attributeName, [...attributes, value].join(' '), table)
    })
  }
}
