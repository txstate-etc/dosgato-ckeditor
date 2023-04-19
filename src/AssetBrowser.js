import { Plugin } from '@ckeditor/ckeditor5-core'
import { ButtonView } from '@ckeditor/ckeditor5-ui'
import { LinkUI } from '@ckeditor/ckeditor5-link'
import { viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget'
import ImageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg'
import AssetLinkIcon from './assetlink.svg'
import './assetbrowser.css'

export default class AssetBrowser extends Plugin {
  init () {
    const editor = this.editor
    const config = editor.config.get('assetBrowser')

    editor.ui.componentFactory.add( 'assetBrowserImage', locale => {
      const view = new ButtonView( locale )

      view.set( {
        label: 'Insert image',
        icon: ImageIcon,
        tooltip: true
      })

      // Callback executed once the image is clicked.
      view.on( 'execute', () => {
        // User will give us a function to run on activation
        // we pass that function a completion function with the final image url
        // this way it can take its time to do whatever it needs to do to elicit
        // the image url from the user
        config.browseImage(imageUrl => {
          editor.model.change( writer => {
              const imageElement = writer.createElement( 'imageBlock', {
                  src: imageUrl
              })

              // Insert the image in the current selection location.
              editor.model.insertContent( imageElement, editor.model.document.selection )
              writer.setSelection(imageElement, 'after')
          })
        })
      })

      return view
    })

    // add a chooser button to the link form
    const linkUI = editor.plugins.get(LinkUI)
    const linkFormView = linkUI.formView
    const chooserButton = new ButtonView(this.locale)
    const linkCommand = editor.commands.get('link')
    chooserButton.set({
      label: 'Browse',
      withText: true,
      tooltip: true
    })
    chooserButton.bind('isEnabled').to(linkCommand, 'isEnabled')
    chooserButton.on('execute', (writer) => {
      const selection = editor.model.document.selection
      config.browseLink(linkFormView.urlInputView.fieldView.value, linkUrl => {
        editor.model.change(writer => {
          writer.setSelection(selection)
        })
        linkUI._showUI(true)
        linkUI._addFormView()
        linkFormView.urlInputView.fieldView.value = ''
        linkFormView.urlInputView.fieldView.value = linkUrl
      })
    })
    linkFormView.once('render', () => {
      chooserButton.render()
      linkFormView.registerChild(chooserButton)
      linkFormView.element.insertBefore(chooserButton.element, linkFormView.saveButtonView.element)
    })

    this.listenTo(editor.editing.view.document, 'click', ( evt, data ) => {
			if (editor.model.document.selection.getAttribute('linkHref')) {
				// Prevent browser navigation when clicking a link.
				data.preventDefault();
			}
		}, { priority: 'high' } );
  }
}
