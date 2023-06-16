import { Plugin } from '@ckeditor/ckeditor5-core'
import { ButtonView } from '@ckeditor/ckeditor5-ui'
import ImageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg'
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
  }
}
