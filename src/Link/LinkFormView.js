import { LabeledFieldView, createLabeledDropdown, addListToDropdown, ButtonView } from '@ckeditor/ckeditor5-ui'
import { createDropdown, getDropdownItemsDefinitions, getLabels } from '../utils/helpers'
import { default as LFV } from '@ckeditor/ckeditor5-link/src/ui/linkformview'

const items = [
  { label: 'URL', value: 'url' },
  { label: 'Anchor', value: 'anchor' },
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' }
]

export default class LinkFormView extends LFV {
  constructor( locale, linkCommand, options ) {
    super(locale, linkCommand)

    this.set({
      linkType: 'url'
    })

    this.browseLinkButton = this.createBrowseButton(linkCommand)

    this.linkTypeDropdown = createDropdown(this, { key: 'linkType', label: 'Link Type', items })

    this.options = options
    
    if (!options.disableDropdown) {
      this.children.add(this.linkTypeDropdown, 0)
      this.linkTypeDropdown.bind('isEnabled').to(linkCommand, 'isEnabled')
    }

    if (!options.disableBrowse) this.children.add(this.browseLinkButton, 2)
  }

  render () {
    super.render()

    const children = [this.linkTypeDropdown, this.browseLinkButton]

    if (!this.options.disableDropdown) {
      this._focusables.add(children[0], 0)
      this.focusTracker.add( children[0].element )
    }
    
    if (!this.options.disableBrowse) {
      this._focusables.add(children[1], 2)
      this.focusTracker.add( children[1].element )
    }
    
  }

  createBrowseButton (linkCommand) {
    // const editor = this.ed
    const chooserButton = new ButtonView(this.locale)
    chooserButton.set({
      label: 'Browse',
      withText: true,
      tooltip: true
    })
    chooserButton.bind('isEnabled').to(linkCommand, 'isEnabled')

    return chooserButton
  }
}
