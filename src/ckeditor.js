/**
 * @license Copyright (c) 2014-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
 import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor.js';
 import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat.js';
 import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote.js';
 import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js';
 import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
 import Heading from '@ckeditor/ckeditor5-heading/src/heading.js';
 import { Image, ImageCaption, ImageStyle, ImageToolbar, ImageResize } from '@ckeditor/ckeditor5-image';
 import Indent from '@ckeditor/ckeditor5-indent/src/indent.js';
 import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js';
 import Link from '@ckeditor/ckeditor5-link/src/link.js';
 import List from '@ckeditor/ckeditor5-list/src/list.js';
 import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';
 import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice.js';
 import { SourceEditing } from '@ckeditor/ckeditor5-source-editing';
 import Table from '@ckeditor/ckeditor5-table/src/table.js';
 import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar.js';
 import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation.js';
 import AssetBrowser from './AssetBrowser.js';

 class Editor extends ClassicEditor {}

 // Plugins to include in the build.
 Editor.builtinPlugins = [
	 Autoformat,
	 BlockQuote,
	 Bold,
	 Essentials,
	 Heading,
	 Image,
	 ImageCaption,
	 ImageResize,
	 ImageStyle,
	 ImageToolbar,
	 Indent,
	 Italic,
	 Link,
	 List,
	 Paragraph,
	 PasteFromOffice,
	 SourceEditing,
	 Table,
	 TableToolbar,
	 TextTransformation,
	 AssetBrowser
 ];

 // Editor configuration.
 Editor.defaultConfig = {
	 toolbar: {
		 items: [
			 'heading',
			 '|',
			 'bold',
			 'italic',
			 'link',
			 'bulletedList',
			 'numberedList',
			 '|',
			 'outdent',
			 'indent',
			 '|',
			 'assetBrowserImage',
			 'blockQuote',
			 'sourceEditing'
		 ]
	 },
	 language: 'en',
	 image: {
		 toolbar: [
			 'imageTextAlternative',
			 'imageStyle:inline',
			 'imageStyle:block',
			 'imageStyle:side',
			 'toggleImageCaption'
		 ]
	 },
	 table: {
		 contentToolbar: [
			 'tableColumn',
			 'tableRow',
			 'mergeTableCells'
		 ]
	 }
 };

 export default Editor;
