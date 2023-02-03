import { icons } from '@ckeditor/ckeditor5-core'
import { View, ButtonView, ViewCollection, FocusCycler, FormHeaderView, submitHandler, addListToDropdown, Model, LabeledFieldView, createLabeledDropdown } from '@ckeditor/ckeditor5-ui'
import FormRowView from '@ckeditor/ckeditor5-table/src/ui/formrowview'
import { FocusTracker, KeystrokeHandler, Collection } from '@ckeditor/ckeditor5-utils'

function getLabels (t, c) {
  return c.reduce((acc, curr) => {
    acc[curr.value] = t(curr.label)
    return acc
  }, {})
}

export default class TablePropertiesView extends View {

  constructor (locale, options) {
    super(locale)

    this.set({
      tableHeaderColors: '',
      tableWidth: '',
      tableHeaders: '',
      tableBorder: false,
      tableAltBGColor: false
    })

    this.options = options

    const { saveButtonView, cancelButtonView} = this._createActionButtons()

    this.saveButtonView = saveButtonView
    
    this.cancelButtonView = cancelButtonView

    const { headersDropdownView, tableHeaderColorsDropdownView } = this._createHeaderButtons()

    this.headersDropdownView = headersDropdownView

    this.tableHeaderColorDropdownView = tableHeaderColorsDropdownView

    const { borderButtonView, altBGButtonView } = this._createToggleButtons()

    this.borderButtonView = borderButtonView

    this.altBGButtonView = altBGButtonView

    const tableWidthsDropdown = this._createDropdown('tableWidth', 'Table Width', this.options.tableWidth)

    this.tableWidthsDropdown = tableWidthsDropdown
    
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

    this.children.add(new FormRowView(locale, {
      children: [
        this.headersDropdownView,
        this.tableHeaderColorDropdownView
      ],
      class: 'ck-table-form__border-row'
    }))

    this.children.add(new FormRowView(locale, {
      children: [
        this.tableWidthsDropdown,
      ],
      class: 'ck-table-form__border-row'
    }))

    this.children.add(new FormRowView(locale, {
      children: [
        this.borderButtonView,
        this.altBGButtonView
      ],
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

    // const views = [this.headersDropdownView, this.tableHeaderColorDropdownView, this.borderButtonView, this.altBGButtonView, this.saveButtonView, this.cancelButtonView]
    // views.forEach(view => {
		// 	// Register the view as focusable.
		// 	this._focusables.add( view );

		// 	// Register the view in the focus tracker.
		// 	this.focusTracker.add( view.element );
		// })

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

  _validate () {
    this.on('change:tableHeaders', (evt, name, newValue) => {
      const colors = this.options.tableHeaderColors
      if (newValue.includes('none')) {
        const none = colors.find(({ label, value }) => value.toLowerCase().includes('none') || label.toLowerCase().includes('none'))
        if (none) this.tableHeaderColors = none.value
        else this.tableHeaderColors = ''
      } else if (this.tableHeaderColors.includes('none')) {
        const defaultColor = colors.find(({ label, value }) => value.toLowerCase().includes('default') || label.toLowerCase().includes('default'))
        if (defaultColor) {
          this.tableHeaderColors = defaultColor.value
        } else if (this.colors.length) this.tableHeaderColors = colors[0].value
      }
    })
  }

  _createDropdown (key, label, items) {
    const locale = this.locale
    const t = this.t
    
    const headerView = new LabeledFieldView(locale, createLabeledDropdown)

    const labels = getLabels(t, items)

    headerView.set({
			label: t(label),
			// class: 'ck-table-form__border-style'
		})

    headerView.fieldView.buttonView.set({
      label: t(label),
      isOn: false,
      withText: true,
    })

    headerView.fieldView.buttonView.bind('label').to( this, key, value => {
			return labels[value] || Object.values(labels)[0]
		})

		headerView.fieldView.on('execute', evt => { this[key] = evt.source.commandParam })
    
		headerView.bind('isEmpty').to(this, key, value => !value)

    addListToDropdown(
      headerView.fieldView,
      getDropdownItemsDefinitions(t, items)
    )

    return headerView
  }

  _createHeaderButtons () {
    return {
      headersDropdownView: this._createDropdown('tableHeaders', 'Headers', this.options.tableHeaders),
      tableHeaderColorsDropdownView: this._createDropdown('tableHeaderColors', 'Header Colors', this.options.tableHeaderColors)
    }
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

  _createToggleButtons () {
    const t = this.t
    const locale = this.locale

    const borderButtonView = new ButtonView(locale)
    const altBGButtonView = new ButtonView(locale)

    borderButtonView.set({
      label: t('Border'),
      tooltip: true,
      withText: true,
      isToggleable: true
    })

    altBGButtonView.set({
      label: t('Alternating Background'),
      tooltip: true,
      withText: true,
      isToggleable: true
    })

    borderButtonView.bind('isOn').to(this, 'tableBorder', value => {
			return !!Number(value)
    })

    altBGButtonView.bind('isOn').to(this, 'tableAltBGColor', value => {
      return !!value
    })

    borderButtonView.on('execute', () => {
      const value = borderButtonView.isOn ? '1' : '0'
      this.tableBorder = value === '1' ? '0' : '1'
    })

    altBGButtonView.on('execute', () => {
      this.tableAltBGColor = altBGButtonView.isOn ? '' : 'alternate-row-color'
    })

    return {
      borderButtonView,
      altBGButtonView
    }
  }
}

function getDropdownItemsDefinitions (t, items) {
  const itemDefinitions = new Collection()
  const labels = getLabels(t, items)

  for (const item in labels) {
    const definition = {
      type: 'button',
      model: new Model({
        commandParam: item,
        label: labels[item],
        withText: true
      })
    }

    // Add the item definition to the collection.
    itemDefinitions.add(definition)
  }

  return itemDefinitions
}
