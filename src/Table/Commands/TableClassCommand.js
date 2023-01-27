 import TablePropertyCommand from './BaseTablePropertyCommand'

 export default class TableClassCommand extends TablePropertyCommand {
   constructor(editor, defaultValue) {
     super(editor, 'class', defaultValue);
   }
 }
 