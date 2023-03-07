import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import { ContextualBalloon, ButtonView, clickOutsideHandler } from '@ckeditor/ckeditor5-ui'
import { getTableWidgetAncestor } from '@ckeditor/ckeditor5-table/src/utils/ui/widget'
import { repositionContextualBalloon, getBalloonTablePositionData } from '@ckeditor/ckeditor5-table/src/utils/ui/contextualballoon'
import { DataFilter } from '@ckeditor/ckeditor5-html-support'
import TablePropertiesView from './TablePropertiesView'
import TableHeaderCommand from './Commands/TableHeadersCommand'
import TableClassCommand from './Commands/TableClassCommand'
import TableBorderCommand from './Commands/TableBorderCommand'


const propertyToCommandMap = {
  tableHeaders: 'tableHeaders',
  tableHeaderColors: 'tableHeaderColors',
  tableWidth: 'tableWidth',
  tableBorder: 'tableBorder',
  tableAltBGColor: 'tableAltBGColor'
};

class TablePropertiesUI extends Plugin {
  static get requires () {
    return [ContextualBalloon, DataFilter]
  }

  init () {
    const editor = this.editor
    const t = editor.t

		const dataFilter = editor.plugins.get(DataFilter)

    this._balloon = editor.plugins.get(ContextualBalloon)

    this.view = null

    this._undoStepBatch = null

    this.tableProperties = editor.config.get('table.tableProperties') || {}

    this._defaultTableProperties = {
      ...getDefaultProperties(this.tableProperties),
      tableBorder: '1'
    }

    editor.commands.add('tableHeaders', new TableHeaderCommand(editor))
    editor.commands.add('tableHeaderColors', new TableClassCommand(editor, this.tableProperties['tableHeaderColors']))
    editor.commands.add('tableWidth', new TableClassCommand(editor, this.tableProperties['tableWidth']))
    editor.commands.add('tableBorder', new TableBorderCommand(editor))
    editor.commands.add('tableAltBGColor', new TableClassCommand(editor, 'alternate-row-color'))

    editor.model.schema.extend('table', {
      allowAttributes: 'class'
    })
  
    editor.conversion.attributeToAttribute({
      model: {
        name: 'table',
        key: 'class'
      },
      view: c => ({
          key: 'class',
          value: c
      })
    })

    editor.conversion.attributeToAttribute({
      model: {
        name: 'table',
        key: 'border'
      },
      view: border => ({
        key: 'border',
        value: border
      })
    })

    editor.conversion.for( 'upcast' ).add(dispatcher => {
      dispatcher.on('element:figure', ( evt, data, conversionApi ) => {
        const viewTableElement = data.viewItem
        const viewAttributes = dataFilter.processViewAttributes(viewTableElement, conversionApi)
        if (viewAttributes.classes) conversionApi.writer.setAttribute('class', viewAttributes.classes.join(' ').trim(), data.modelRange)
        if (viewAttributes.attributes) Object.entries(viewAttributes.attributes).forEach(([key, value]) => conversionApi.writer.setAttribute(key, String(value), data.modelRange))
      })
    })

    editor.ui.componentFactory.add('tableProperties', locale => {
      const view = new ButtonView(locale)

      view.set({
        label: t('Table Properties'),
        withText: true
      })

      this.listenTo(view, 'execute', () => { this._showView() })

      return view
    })
  }

  get _isViewVisible () {
    return !!this.view && this._balloon.visibleView === this.view
  }

  get _isViewInBallon () {
    return !!this.view && this._balloon.hasView(this.view)
  }

  _createViewProperties () {
    const editor = this.editor
    const view = new TablePropertiesView(editor.locale, this.tableProperties)

    view.render()

    this.listenTo(view, 'submit', () => { this._hideView() })

    this.listenTo(view, 'cancel', () => {
      if (this._undoStepBatch.operations.length) editor.execute('undo', this._undoStepBatch)
      this._hideView()
    })

    view.keystrokes.set('Esc', (data, cancel) => {
      this._hideView()
      cancel()
    })

    clickOutsideHandler({
      emitter: view,
      activator: () => this._isViewInBallon,
      contextElements: [this._balloon.view.element],
      callback: () => this._hideView()
    })

    view.on('change:tableHeaders', this._getPropertyChangeCallback('tableHeaders', this._defaultTableProperties))
    view.on('change:tableHeaderColors', this._getPropertyChangeCallback('tableHeaderColors', this._defaultTableProperties))
    view.on('change:tableWidth', this._getPropertyChangeCallback('tableWidth', this._defaultTableProperties))
    view.on('change:tableBorder', this._getPropertyChangeCallback('tableBorder', this._defaultTableProperties))
    view.on('change:tableAltBGColor', this._getPropertyChangeCallback('tableAltBGColor', this._defaultTableProperties))

    return view
  }

  _showView () {
    const editor = this.editor

    if (!this.view) this.view = this._createViewProperties()

    this.listenTo(editor.ui, 'update', () => { this._updateView() })

    // update view with the model values
    this._fillViewFormFromCommandValues()

    const position = getBalloonTablePositionData(editor)

    this._balloon.add({
      view: this.view,
      position
    })

    this._undoStepBatch = editor.model.createBatch()

    this.view.focus()
  }

  _updateView () {
    const editor = this.editor
    const viewDocument = editor.editing.view.document

    if (!getTableWidgetAncestor(viewDocument.selection)) this._hideView()
    else if (this._isViewVisible) repositionContextualBalloon(editor, 'cell')
  }

  _hideView () {
    const editor = this.editor

    this.stopListening(editor.ui, 'update')

    this.view.saveButtonView.focus()

    this._balloon.remove(this.view)

    this.editor.editing.view.focus()
  }

  destroy () {
    super.destroy()
    if (this.view) this.view.destroy()
  }

  _getPropertyChangeCallback( commandName, values ) {
    return ( evt, propertyName, newValue, oldValue ) => {
      const iftrue = ['tableHeaderColors',
        'tableWidth',
        'tableAltBGColor'].includes(commandName)
      if (iftrue) console.log(newValue, oldValue)
      const defaultValue = values[commandName]
			if ( !oldValue && defaultValue === newValue ) return
			this.editor.execute( commandName, {
				value: newValue,
        oldValue,
				batch: this._undoStepBatch
			})
		}
	}

  _fillViewFormFromCommandValues() {
		const commands = this.editor.commands;

		Object.values(propertyToCommandMap)
			.map( (property) => {
				const defaultValue = this._defaultTableProperties[ property ] || ''
        const command = commands.get(property)

				return [property, command.value || defaultValue]
			} )
			.forEach(([ property, value]) => {
				this.view.set( property, value )
			})
	}

}

function getDefaultProperties (options) {
  return Object.entries(options).reduce((acc, [key, value]) => {
    acc[key] = value[0].value
    return acc
  }, {})
}

export default class TableProperties extends Plugin {
  static get requires () {
    return [
      TablePropertiesUI
    ]
  }
}
