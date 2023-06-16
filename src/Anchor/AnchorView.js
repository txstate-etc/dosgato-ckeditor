import {
  View,
  LabeledFieldView,
  createLabeledInputText,
  ButtonView,
  submitHandler,
  ViewCollection,
  FocusCycler,
  injectCssTransitionDisabler
} from '@ckeditor/ckeditor5-ui'
import { icons } from '@ckeditor/ckeditor5-core'
import { FocusTracker, KeystrokeHandler } from '@ckeditor/ckeditor5-utils'

export default class AnchorView extends View {
  constructor (locale) {
    super(locale)

    this.focusTracker = new FocusTracker()
    this.keystrokes = new KeystrokeHandler()
    this._focusables = new ViewCollection()

    this.anchorInputView = this._createInput('Add anchor')

    this.saveButtonView = this._createButton(
      'Save',
      icons.check,
      'ck-button-save'
    )
    // Submit type of the button will trigger the submit event on entire form when clicked
    // (see submitHandler() in render() below).
    this.saveButtonView.type = 'submit'

    this.cancelButtonView = this._createButton(
      'Cancel',
      icons.cancel,
      'ck-button-cancel'
    )

    // Delegate ButtonView#execute to FormView#cancel
    this.cancelButtonView.delegate('execute').to(this, 'cancel')

    this.children = this._createformChildren()

    this._focusCycler = new FocusCycler({
      focusables: this._focusables,
      focusTracker: this.focusTracker,
      keystrokeHandler: this.keystrokes,
      actions: {
        // Navigate form fields backwards using the Shift + Tab keystroke.
        focusPrevious: 'shift + tab',

        // Navigate form fields forwards using the Tab key.
        focusNext: 'tab'
      }
    })

    this.setTemplate({
      tag: 'form',
      attributes: {
        class: ['ck', 'ck-link-form', 'ck-responsive-form'],
        tabindex: '-1'
      },
      children: this.children
    })

    injectCssTransitionDisabler(this)
  }

  render () {
    super.render()

    // Submit the form when the user clicked the save button or pressed enter in the input.
    submitHandler({
      view: this
    })

    const views = [
      this.anchorInputView,
      this.saveButtonView,
      this.cancelButtonView
    ]

    views.forEach(view => {
      // Register the view as focusable.
      this._focusables.add(view)

      // Register the view in the focus tracker.
      this.focusTracker.add(view.element)
    })

    // Start listening for the keystrokes coming from #element.
    this.keystrokes.listenTo(this.element)
  }

  destroy () {
    super.destroy()

    this.focusTracker.destroy()
    this.keystrokes.destroy()
  }

  focus () {
    // this.childViews.first.focus()
    this._focusCycler.focusFirst()
  }

  _createInput (label) {
    const labeledInput = new LabeledFieldView(
      this.locale,
      createLabeledInputText
    )

    labeledInput.label = label

    return labeledInput
  }

  _createButton (label, icon, className) {
    const button = new ButtonView()

    button.set({
      label,
      icon,
      tooltip: true,
      class: className
    })

    return button
  }

  _createformChildren () {
    const children = this.createCollection()
    
    children.add(this.anchorInputView)
    children.add(this.saveButtonView)
    children.add(this.cancelButtonView)
    
    return children
  }
}
