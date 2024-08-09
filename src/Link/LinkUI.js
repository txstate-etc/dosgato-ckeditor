import { Plugin } from '@ckeditor/ckeditor5-core'
import { ContextualBalloon, clickOutsideHandler } from '@ckeditor/ckeditor5-ui'
import { AutoLink, LinkEditing, LinkImageEditing, LinkUI as LUI, LinkImageUI as LIUI } from '@ckeditor/ckeditor5-link'
import { LINK_KEYSTROKE } from '@ckeditor/ckeditor5-link/src/utils'
import LinkActionsView from '@ckeditor/ckeditor5-link/src/ui/linkactionsview'
import '../assetbrowser.css'
import LinkFormView from './LinkFormView'
import AnchorFormView from './AnchorFormView'
import { isAnchorElement } from '../utils/helpers'

export class LinkUI extends LUI {
  static get pluginName() {
		return 'LinkUI'
	}

	init () {
		super.init()

		const editor = this.editor

		this._anchorBalloon = editor.plugins.get( ContextualBalloon )
		this.anchorView = null

		this.listenTo(editor.editing.view.document, 'click', ( evt, data ) => {
			if (editor.model.document.selection.getAttribute('linkHref')) {
				// Prevent browser navigation when clicking a link.
				data.preventDefault()
			}
		}, { priority: 'high' } )
	}

	destroy () {
    super.destroy()
    if (this.anchorView) this.anchorView.destroy()
  }

  _createFormView() {
		const editor = this.editor
		const linkCommand = editor.commands.get( 'link' )
		const defaultProtocol = editor.config.get( 'link.defaultProtocol' )
		const config = editor.config.get('assetBrowser')

		const formView = new LinkFormView( editor.locale, linkCommand, !!config.browsLink )

		formView.urlInputView.fieldView.bind( 'value' ).to( linkCommand, 'value' )

		// Form elements should be read-only when corresponding commands are disabled.
		formView.urlInputView.bind( 'isReadOnly' ).to( linkCommand, 'isEnabled', value => !value )
		formView.saveButtonView.bind( 'isEnabled' ).to( linkCommand )

		formView.browseLinkButton.on('execute', () => {
      const selection = editor.model.document.selection
      config.browseLink(formView.urlInputView.fieldView.value, linkUrl => {
        editor.model.change(writer => {
          writer.setSelection(selection)
        })
        this._showUI(true)
        this._addFormView()
        formView.urlInputView.fieldView.value = ''
        formView.urlInputView.fieldView.value = linkUrl
      })
    })

		formView.linkTypeDropdown.fieldView.on('execute', evt => {
			const linkType = evt.source.commandParam
			this._updateLabel(linkType)
			if (linkType === 'anchor') {
				formView.urlInputView.label = 'Anchor'
				this._showAnchorView()
			}
    })

		// Execute link command after clicking the "Save" button.
		this.listenTo( formView, 'submit', () => {
			const { value } = formView.urlInputView.fieldView.element
			const parsedUrl = this._addLinkProtocolIfApplicable( value, defaultProtocol )
			editor.execute( 'link', parsedUrl, formView.getDecoratorSwitchesState() )
			this._closeFormView()
		} )

		// Hide the panel after clicking the "Cancel" button.
		this.listenTo( formView, 'cancel', () => {
			this._closeFormView()
		})

		// Close the panel on esc key press when the **form has focus**.
		formView.keystrokes.set( 'Esc', ( data, cancel ) => {
			this._closeFormView()
			cancel()
		})

		return formView
	}

	_createActionsView() {
		const editor = this.editor;
		const actionsView = new LinkActionsView( editor.locale );
		const linkCommand = editor.commands.get( 'link' );
		const unlinkCommand = editor.commands.get( 'unlink' );

		actionsView.bind( 'href' ).to( linkCommand, 'value' );
		actionsView.editButtonView.bind( 'isEnabled' ).to( linkCommand );
		actionsView.unlinkButtonView.bind( 'isEnabled' ).to( unlinkCommand );

		// Execute unlink command after clicking on the "Edit" button.
		this.listenTo( actionsView, 'edit', () => {
			this._updateDropdown(linkCommand.value)
			this._updateLabel(this.formView.linkType)
			this._addFormView();
		} );

		// Execute unlink command after clicking on the "Unlink" button.
		this.listenTo( actionsView, 'unlink', () => {
			editor.execute( 'unlink' );
			this._hideUI();
		} );

		// Close the panel on esc key press when the **actions have focus**.
		actionsView.keystrokes.set( 'Esc', ( data, cancel ) => {
			this._hideUI();
			cancel();
		} );

		// Open the form view on Ctrl+K when the **actions have focus**..
		actionsView.keystrokes.set( LINK_KEYSTROKE, ( data, cancel ) => {
			this._addFormView();
			cancel();
		} );

		return actionsView;
	}

	_hideUI () {
		super._hideUI()
		this._resetDropdown()
	}

	_closeFormView () {
		super._closeFormView()
		this._resetDropdown()
	}

	_updateDropdown (link) {
		if (link.startsWith('tel:')) {
			this.formView.linkType = 'phone'
		} else if (link.startsWith('mailto:')) {
			this.formView.linkType = 'email'
		} else if (link.startsWith('#')) {
			this.formView.linkType = 'anchor'
		} else this.formView.linkType = 'url'
	}

	_updateLabel (linkType) {
		if (!this.formView) return
		if (linkType === 'url') this.formView.urlInputView.label = 'Link URL'
		else if (linkType === 'phone') this.formView.urlInputView.label = 'Phone'
		else if (linkType === 'email') this.formView.urlInputView.label = 'Email'
		else if (linkType === 'anchor') {
			this.formView.urlInputView.label = 'Anchor'
		}
	}

	_resetDropdown () {
		this.formView.urlInputView.label = 'Link URL'
		this.formView.linkType = 'url'
	}

	linkHasProtocol( link ) {
		// The regex checks for the protocol syntax ('xxxx://' or 'xxxx:')
		// or non-word characters at the beginning of the link ('/', '#' etc.).
		return /^((\w+:(\/{2,})?)|(\W))/i.test( link )
	}

  _addLinkProtocolIfApplicable(link) {
    let protocol = ''
		if (!this.linkHasProtocol(link)) {
			switch (this.formView.linkType) {
				case 'email':
					protocol = 'mailto:'
					break
				case 'phone':
					protocol = 'tel:'
			}
		}

    return link ? protocol + link : ''
  }

	get _isViewInBallon () {
    return !!this.anchorView && this._anchorBalloon.hasView(this.anchorView)
  }

	_getAllAnchorElements () {
		const editor = this.editor
		const range = editor.model.createRangeIn( editor.model.document.getRoot() )
		const anchors = []
		for ( const value of range.getWalker( { ignoreElementEnd: true } ) ) {
			if (isAnchorElement(value.item)) {
				anchors.push(value.item.getAttribute('id'))
			}
		}
		return anchors
	}

	_createAnchorViewProperties () {
    const editor = this.editor
		const anchorElements = this._getAllAnchorElements()

    const view = new AnchorFormView(editor.locale, anchorElements.map(a => ({ label: a, value: a })))

    view.render()

    this.listenTo(view, 'submit', (evt) => {
			const anchor = evt.source.anchor
			if (anchor) this.formView.urlInputView.fieldView.value = '#' + anchor
			this._hideAnchorView()
			this.formView.urlInputView.focus()
		})

    this.listenTo(view, 'cancel', () => {
      this._hideAnchorView()
    })

    view.keystrokes.set('Esc', (data, cancel) => {
      this._hideAnchorView()
      cancel()
    })

    clickOutsideHandler({
      emitter: view,
      activator: () => this._isViewInBallon,
      contextElements: [this._anchorBalloon.view.element],
      callback: () => {
				this._hideAnchorView()
				this._resetDropdown()
			}
    })

    return view
  }

  _showAnchorView () {
    const editor = this.editor

    if (!this.anchorView) this.anchorView = this._createAnchorViewProperties()

    const position = this._getBalloonPositionData(editor)

    this._balloon.add({
      view: this.anchorView,
      position
    })

    this.anchorView.focus()
  }


  _hideAnchorView () {
    const editor = this.editor

    this.stopListening(editor.ui, 'update')

    this.anchorView.saveButtonView.focus()

    this._anchorBalloon.remove(this.anchorView)

		this.anchorView.destroy()
		this.anchorView = null

    this.editor.editing.view.focus()
  }


}

export default class Link extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ LinkEditing, LinkUI, AutoLink ]
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'Link'
	}
}

export class LinkImageUI extends LIUI {
  static get pluginName() {
		return 'LinkImageUI';
	}

	init() {
		const editor = this.editor;
		const viewDocument = editor.editing.view.document;
		const plugin = editor.plugins.get( 'LinkUI' );

		this.listenTo( viewDocument, 'click', ( evt, data ) => {
			if ( this._isSelectedLinkedImage( editor.model.document.selection ) ) {
				// Prevent browser navigation when clicking a linked image.
				data.preventDefault();

				// Block the `LinkUI` plugin when an image was clicked.
				// In such a case, we'd like to display the image toolbar.
				evt.stop();

				plugin._hideUI();
			}
		}, { priority: 'high' } );

		this._createToolbarLinkImageButton();
	}

	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ LinkEditing, LinkUI, 'ImageBlockEditing' ];
	}
}

export class LinkImage extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'LinkImage';
	}

	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ LinkImageEditing, LinkImageUI ];
	}
}
