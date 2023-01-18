import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import { ContextualBalloon, ButtonView, clickOutsideHandler } from '@ckeditor/ckeditor5-ui'
import { getTableWidgetAncestor } from '@ckeditor/ckeditor5-table/src/utils/ui/widget'
import { repositionContextualBalloon, getBalloonCellPositionData } from '@ckeditor/ckeditor5-table/src/utils/ui/contextualballoon'
import TablePropertiesView from './TablePropertiesView'

class TablePropertiesUI extends Plugin {
  static get requires () {
    return [ContextualBalloon]
  }

  init () {
    const editor = this.editor
    const t = editor.t

    this._balloon = editor.plugins.get( ContextualBalloon );

    this.view = null

    this._undoStepBatch = null;

    editor.ui.componentFactory.add('tableProperties', locale => {
      const view = new ButtonView(locale)

      view.set({
        label: t('Table Properties'),
        withText: true
      })

      this.listenTo(view, 'execute', () => {
        console.log('EXECUTING')
        this._showView()
      })

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
    
    const view = new TablePropertiesView(editor.locale, {})

    // const t = editor.t

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

    return view
  }

  _showView () {
    const editor = this.editor

    if (!this.view) this.view = this._createViewProperties()

    this.listenTo(editor.ui, 'update', () => { this._updateView() })

    // update view with the model values
    // this._fillViewFormFromCommandValues()

    this._balloon.add({
      view: this.view,
      position: getBalloonCellPositionData(editor)
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

}

export default class TableProperties extends Plugin {
  static get requires () {
    return [
      TablePropertiesUI
    ]
  }
}
