import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import { ButtonView } from '@ckeditor/ckeditor5-ui'
import { ContextualBalloon, clickOutsideHandler } from '@ckeditor/ckeditor5-ui'
import { ClickObserver } from '@ckeditor/ckeditor5-engine'
import { isAnchorElement } from '../utils/helpers'
import AnchorView from './AnchorView'
import { WidgetToolbarRepository } from '@ckeditor/ckeditor5-widget'
import AnchorEditing from './AnchorEditing'
import AnchorIcon from '../icons/flag.svg'

class AnchorUI extends Plugin {
  static get requires () {
    return [ContextualBalloon, WidgetToolbarRepository]
  }

  init () {
    const editor = this.editor

    editor.editing.view.addObserver(ClickObserver)

    this.formView = null
    this._balloon = this.editor.plugins.get(ContextualBalloon)

    this._createToolbarButton()
    this._enableBalloonActivators()
  }

  destroy () {
    super.destroy()
    if (this.formView) this.formView.destroy()
  }

  _createViews () {
    this.formView = this._createFormView()

    // Attach lifecycle actions to the the balloon.
    this._enableUserBalloonInteractions()
  }

  _createToolbarButton () {
    const editor = this.editor
    const t = editor.t

    editor.ui.componentFactory.add('anchor', locale => {
      // const command = editor.commands.get( 'anchor' );
      const view = new ButtonView(locale)

      view.set({
        label: t('Anchor'),
        icon: AnchorIcon,
        tooltip: true
      })

      this.listenTo(view, 'execute', () => {
        this._showUI()
      })

      return view
    })
  }

  _showUI (forceVisible = false) {
    if (!this.formView) {
      this._createViews()
    }

    this._addFormView()

    if (forceVisible) {
      this._balloon.showStack('main')
    }

    this._startUpdatingUI()
  }

  _hideUI () {
    if (!this._isFormInPanel) return

    const editor = this.editor

    this.stopListening(editor.ui, 'update')
    this.stopListening(this._balloon, 'change:visibleView')

    // Make sure the focus always gets back to the editable _before_ removing the focused form view.
    // Doing otherwise causes issues in some browsers. See https://github.com/ckeditor/ckeditor5-link/issues/193.
    editor.editing.view.focus()

    this._removeFormView()

  }

  _createFormView () {
    const editor = this.editor
    const anchorCommand = editor.commands.get('anchor')

    const formView = new AnchorView(editor.locale)

    formView.anchorInputView.fieldView.bind( 'value' ).to( anchorCommand, 'value' );

    // Form elements should be read-only when corresponding commands are disabled.
    // formView.urlInputView.bind( 'isReadOnly' ).to( anchorCommand, 'isEnabled', value => !value );
    formView.anchorInputView.bind( 'isEnabled' ).to( anchorCommand );

    // Execute link command after clicking the "Save" button.
    this.listenTo(formView, 'submit', () => {
      const { value } = formView.anchorInputView.fieldView.element
      editor.execute('anchor', value)
      this._hideUI()
    })

    // Hide the panel after clicking the "Cancel" button.
    this.listenTo(formView, 'cancel', () => {
      this._hideUI()
    })

    // Close the panel on esc key press when the **form has focus**.
    formView.keystrokes.set('Esc', (data, cancel) => {
      this._hideUI()
      cancel()
    })

    return formView
  }

  _addFormView () {
    if (!this.formView) {
      this._createViews()
    }

    if (this._isFormInPanel) {
      return
    }

    const editor = this.editor
    const anchorCommand = editor.commands.get('anchor')

    this.formView.disableCssTransitions()


    this._balloon.add({
      view: this.formView,
      position: this._getBalloonPositionData()
    })

    // Select input when form view is currently visible.
    if (this._balloon.visibleView === this.formView) {
      this.formView.anchorInputView.fieldView.select()
    }

    this.formView.enableCssTransitions()

    // Make sure that each time the panel shows up, the URL field remains in sync with the value of
    // the command. If the user typed in the input, then canceled the balloon (`urlInputView.fieldView#value` stays
    // unaltered) and re-opened it without changing the value of the link command (e.g. because they
    // clicked the same link), they would see the old value instead of the actual value of the command.
    // https://github.com/ckeditor/ckeditor5-link/issues/78
    // https://github.com/ckeditor/ckeditor5-link/issues/123

    this.formView.anchorInputView.fieldView.element.value =
      anchorCommand.value || ''
    // this.formView.anchorInputView.fieldView.element.value = ''
  }

  _removeFormView () {
    if (this._isFormInPanel) {
      // Blur the input element before removing it from DOM to prevent issues in some browsers.
      // See https://github.com/ckeditor/ckeditor5/issues/1501.
      this.formView.saveButtonView.focus()

      this._balloon.remove(this.formView)

      // Because the form has an input which has focus, the focus must be brought back
      // to the editor. Otherwise, it would be lost.
      this.editor.editing.view.focus()
    }
  }

  _startUpdatingUI () {
    const editor = this.editor
    const viewDocument = editor.editing.view.document

    let prevSelectedLink = this._getSelectedAnchorElement()
    let prevSelectionParent = getSelectionParent()

    const update = () => {
      const selectedLink = this._getSelectedAnchorElement()
      const selectionParent = getSelectionParent()

      // Hide the panel if:
      //
      // * the selection went out of the EXISTING link element. E.g. user moved the caret out
      //   of the link,
      // * the selection went to a different parent when creating a NEW link. E.g. someone
      //   else modified the document.
      // * the selection has expanded (e.g. displaying link actions then pressing SHIFT+Right arrow).
      //
      // Note: #_getSelectedAnchorElement will return a link for a non-collapsed selection only
      // when fully selected.
      if (
        (prevSelectedLink && !selectedLink) ||
        (!prevSelectedLink && selectionParent !== prevSelectionParent)
      ) {
        this._hideUI()
      }
      // Update the position of the panel when:
      //  * link panel is in the visible stack
      //  * the selection remains in the original link element,
      //  * there was no link element in the first place, i.e. creating a new link
      else if (this._isUIVisible) {
        // If still in a link element, simply update the position of the balloon.
        // If there was no link (e.g. inserting one), the balloon must be moved
        // to the new position in the editing view (a new native DOM range).
        this._balloon.updatePosition(this._getBalloonPositionData())
      }

      prevSelectedLink = selectedLink
      prevSelectionParent = selectionParent
    }

    function getSelectionParent () {
      return viewDocument.selection.focus
        .getAncestors()
        .reverse()
        .find(node => node.is('element'))
    }

    this.listenTo(editor.ui, 'update', update)
    this.listenTo(this._balloon, 'change:visibleView', update)
  }

  get _isFormInPanel () {
    return !!this.formView && this._balloon.hasView(this.formView)
  }

  get _isUIVisible () {
    return !!this.formView && this.formView === this._balloon.visibleView
  }

  _getBalloonPositionData () {
    const view = this.editor.editing.view
    const viewDocument = view.document
    let target = null


      // Make sure the target is calculated on demand at the last moment because a cached DOM range
      // (which is very fragile) can desynchronize with the state of the editing view if there was
      // any rendering done in the meantime. This can happen, for instance, when an inline widget
      // gets unlinked.
      target = () => {
        const targetLink = this._getSelectedAnchorElement()

        return targetLink
          ? // When selection is inside link element, then attach panel to this element.
            view.domConverter.mapViewToDom(targetLink)
          : // Otherwise attach panel to the selection.
            view.domConverter.viewRangeToDom(
              viewDocument.selection.getFirstRange()
            )
      }

    return { target }
  }

  _enableBalloonActivators () {
    const editor = this.editor
    const viewDocument = editor.editing.view.document

    // Handle click on view document and show panel when selection is placed inside the link element.
    // Keep panel open until selection will be inside the same link element.
    this.listenTo(viewDocument, 'click', () => {
      const parentLink = this._getSelectedAnchorElement()
      if (parentLink) {
        // Then show panel but keep focus inside editor editable.
        this._showUI()
      }
    })
  }

  _enableUserBalloonInteractions () {
    // Focus the form if the balloon is visible and the Tab key has been pressed.
    this.editor.keystrokes.set('Tab', (data, cancel) => {
        if (this._areActionsVisible) cancel()
      },
      {
        // Use the high priority because the link UI navigation is more important
        // than other feature's actions, e.g. list indentation.
        // https://github.com/ckeditor/ckeditor5-link/issues/146
        priority: 'high'
      }
    )

    // Close the panel on the Esc key press when the editable has focus and the balloon is visible.
    this.editor.keystrokes.set('Esc', (data, cancel) => {
      if (this._isUIVisible) {
        this._hideUI()
        cancel()
      }
    })

    // Close on click outside of balloon panel element.
    clickOutsideHandler({
      emitter: this.formView,
      activator: () => this._isFormInPanel,
      contextElements: () => [this._balloon.view.element],
      callback: () => this._hideUI()
    })
  }

  _getSelectedAnchorElement () {
    const view = this.editor.editing.view
    const selection = view.document.selection
    const firstPosition = selection.getFirstPosition()
    const selectedElement = selection.getSelectedElement()

    if (!firstPosition) return null

    if (isAnchorElement(selectedElement)) return selectedElement

    return null
  }

}

export default class Anchor extends Plugin {
  static get requires () {
    return [AnchorUI, AnchorEditing]
  }
}
