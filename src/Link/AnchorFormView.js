import checkIcon from '@ckeditor/ckeditor5-core/theme/icons/check.svg'
import cancelIcon from '@ckeditor/ckeditor5-core/theme/icons/cancel.svg'
import { View, ButtonView, ViewCollection, FocusCycler, FormHeaderView, submitHandler, addListToDropdown } from '@ckeditor/ckeditor5-ui'
import FormRowView from '@ckeditor/ckeditor5-table/src/ui/formrowview'
import { FocusTracker, KeystrokeHandler } from '@ckeditor/ckeditor5-utils'
import { createDropdown, getDropdownItemsDefinitions } from '../utils/helpers'

export default class AnchorFormView extends View {

  constructor (locale, options) {
    super(locale)

    this.set({
      anchor: ''
    })

    this.options = options

    const { saveButtonView, cancelButtonView} = this._createActionButtons()

    this.saveButtonView = saveButtonView

    this.cancelButtonView = cancelButtonView

    const anchorsDropdown = createDropdown(this, { key: 'anchor', label: 'Anchors', items: this.options })

    this.anchorsDropdown = anchorsDropdown

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
      label: this.t('Anchors')
    }))

    this.children.add(new FormRowView(locale, {
      children: [this.anchorsDropdown],
      class: 'ck-table-form__border-row'
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

    const views = [this.anchorsDropdown, this.saveButtonView, this.cancelButtonView]

    views.forEach(view => {
		// 	// Register the view as focusable.
			this._focusables.add( view );

			// Register the view in the focus tracker.
			this.focusTracker.add( view.element );
		})

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
      icon: checkIcon,
      class: 'ck-button-save',
      type: 'submit',
      withText: true
    })

    cancelButtonView.set({
      label: t('Cancel'),
      icon: cancelIcon,
      class: 'ck-button-cancel',
      withText: true
    })

    cancelButtonView.delegate('execute').to(this, 'cancel')

    return {
      saveButtonView, cancelButtonView
    }
  }
}
