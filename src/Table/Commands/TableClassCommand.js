 import { getSelectionAffectedTable } from '../../utils/helpers';
import TablePropertyCommand from './BaseTablePropertyCommand'

 export default class TableClassCommand extends TablePropertyCommand {
   constructor(editor, values) {
     super(editor, 'class');
     this.values = values || []
   }

    refresh () {
      const model = this.editor.model
      const table = getSelectionAffectedTable(model.document.selection)
      const attr = this._getAttribute(table) || ''

      this.isEnabled = true
      this.value = this._findValue(attr)
    }

    _findValue (attr = '') {
      if (typeof this.values === 'string') {
        return attr.includes(this.values) ? this.values : ''
      } else {
        const splitAttributes = attr.split(' ')
        const found = this.values.find(({ value }) => splitAttributes.includes(value))
        if (found) return found.value
        else return
      }
    }
 }
 