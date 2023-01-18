import { icons } from '@ckeditor/ckeditor5-core'
import { View, ButtonView, ViewCollection, FocusCycler, FormHeaderView, submitHandler } from '@ckeditor/ckeditor5-ui'
import FormRowView from '@ckeditor/ckeditor5-table/src/ui/formrowview'
import { FocusTracker, KeystrokeHandler } from '@ckeditor/ckeditor5-utils'

export default class TablePropertiesView extends View {

  constructor (locale, options) {
    super(locale)

    this.set({
      headerColor: '',
      tableWidth: '',
      headers: {
        row: false,
        column: false
      },
      border: true,
      altBGColor: false
    })

    this.options = options

    // Defer creating to make sure other fields are present and the Save button can
		// bind its #isEnabled to their error messages so there's no way to save unless all
		// fields are valid.
    const { saveButtonView, cancelButtonView} = this._createActionButtons()

    this.saveButtonView = saveButtonView

    this.cancelButtonView = cancelButtonView

    
    this.focusTracker = new FocusTracker()
    
    this.keystrokes = new KeystrokeHandler()
    
    this.children = this.createCollection()

    this._focusables = new ViewCollection()

    this._focusCycler = new FocusCycler({
      focusables: this._focusables,
      focusTracker: this.focusTracker,
      keystrokeHandler: this.keystrokes,
      actions: {
        // Navigate form fields backwards using Shift + Tab keystroke
        focusPrevious: 'shift + tab',
        // Navigate form fields forwards using the Tab key
        focusNext: 'tab'
      }
    })

    this.children.add(new FormHeaderView(locale, {
      label: this.t('Table Properties')
    }))

    // Action row.
		this.children.add( new FormRowView(locale, {
			children: [
				this.saveButtonView,
				this.cancelButtonView
			],
			class: 'ck-table-form__action-row'
		}))

    this.setTemplate({
      tag: 'form',
      attributes: {
        class: [
          'ck',
          'ck-form',
          'ck-table-form',
          'ck-table-cell-pr'
        ],
        tabindex: '-1'
      },
      children: this.children
    })
  }

  render () {
    super.render()

    // Enable the "submit" event for this view. It can be triggered by the #saveButtonView
		// which is of the "submit" DOM "type".
    submitHandler({ view: this })

    // Mainly for closing using "Esc" and navigation using "Tab"
    this.keystrokes.listenTo(this.element)
  }

  destroy () {
    super.destroy()

    this.focusTracker.destroy()
    this.keystrokes.destroy()
  }

  focus () {
    this._focusCycler.focusFirst()
  }

  _createActionButtons () {
    const locale = this.locale
    const t = this.t
    const saveButtonView = new ButtonView(locale)
    const cancelButtonView = new ButtonView(locale)

    saveButtonView.set({
      label: t('Save'),
      icon: icons.check,
      class: 'ck-button-save',
      type: 'submit',
      withText: true
    })

    cancelButtonView.set({
      label: t('Cancel'),
      icon: icons.cancel,
      class: 'ck-button-cancel',
      withText: true
    })

    cancelButtonView.delegate('execute').to(this, 'cancel')

    return {
      saveButtonView, cancelButtonView
    }
  }

}
