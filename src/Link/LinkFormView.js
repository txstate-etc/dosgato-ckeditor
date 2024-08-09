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
  constructor( locale, linkCommand, hasAssetBrowser ) {
    super(locale, linkCommand)
    this.hasAssetBrowser = hasAssetBrowser

    this.set({
      linkType: 'url'
    })

    this.browseLinkButton = this.createBrowseButton(linkCommand)

    this.linkTypeDropdown = createDropdown(this, { key: 'linkType', label: 'Link Type', items })

    this.linkTypeDropdown.bind('isEnabled').to(linkCommand, 'isEnabled')

    this.children.add(this.linkTypeDropdown, 0)
    if (this.hasAssetBrowser) this.children.add(this.browseLinkButton, 2)
  }

  render () {
    super.render()

    const children = [this.linkTypeDropdown]
    this._focusables.add(children[0], 0)
    if (this.hasAssetBrowser) {
      children.push(this.browseLinkButton)
      this._focusables.add(this.browseLinkButton, 2)
    }

    children.forEach(c => {
      // Register the view in the focus tracker.
      this.focusTracker.add( c.element )
    })
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
