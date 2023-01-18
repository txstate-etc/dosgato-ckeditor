/**
 * @license Copyright (c) 2014-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor.js'
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment'
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat.js'
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote.js'
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js'
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js'
import Font from '@ckeditor/ckeditor5-font/src/font'
import Heading from '@ckeditor/ckeditor5-heading/src/heading.js'
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline'
import {
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageResize
} from '@ckeditor/ckeditor5-image'
import Indent from '@ckeditor/ckeditor5-indent/src/indent.js'
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js'
import Link from '@ckeditor/ckeditor5-link/src/link.js'
import List from '@ckeditor/ckeditor5-list/src/list.js'
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js'
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice.js'
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat'
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing'
import SpecialCharacters from '@ckeditor/ckeditor5-special-characters/src/specialcharacters'
import SpecialCharactersEssentials from '@ckeditor/ckeditor5-special-characters/src/specialcharactersessentials'
import Table from '@ckeditor/ckeditor5-table/src/table.js'
import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties'
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar.js'
import CustomTableToolbar from './Table/CustomTableToolbar.js'
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation.js'
import Undo from '@ckeditor/ckeditor5-undo/src/undo'
import TableProperties from './Table/TableProperties-plugin.js'
import TableHeaderColor from './Table/HeaderColor-plugin.js'
import TableWidth from './Table/TableWidth-plugin.js'
import TableBorder from './Table/TableBorder-plugin.js'
import TableAlternatingBG from './Table/TableAlternatingBG-plugin.js'
import AssetBrowser from './AssetBrowser.js'

import './ckeditor.css'

class Editor extends ClassicEditor {}

// Plugins to include in the build.
Editor.builtinPlugins = [
  Alignment,
  Autoformat,
  BlockQuote,
  Bold,
  CustomTableToolbar,
  Essentials,
  Font,
  Heading,
  HorizontalLine,
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
  RemoveFormat,
  SourceEditing,
  SpecialCharacters,
  SpecialCharactersEssentials,
  Table,
  TableAlternatingBG,
  TableBorder,
  TableCellProperties,
  TableHeaderColor,
  TableProperties,
  TableToolbar,
  TableWidth,
  TextTransformation,
  Undo,
  AssetBrowser
]

// Editor configuration.
Editor.defaultConfig = {
  toolbar: {
    items: [
      'bold',
      'italic',
      'horizontalLine',
      'blockQuote',
      'removeFormat',
      'specialCharacters',
      '|',
      'link',
      '|',
      'insertTable',
      '|',
      'assetBrowserImage',
      '|',
      'undo',
      'redo',
      '-',
      'sourceEditing',
      '|',
      'alignment',
      'numberedList',
      'bulletedList',
      'indent',
      'outdent',
      '|',
      'heading',
      '|',
      'fontColor'
    ],
    shouldNotGroupWhenFull: true
  },
  heading: {
    options: [
      { title: 'Paragraph', model: 'paragraph', class: 'ck-heading_paragraph' },
      { title: 'Title', view: 'h2', model: 'heading2', class: 'ck-heading_heading2' },
      { title: 'Subtitle', view: 'h3', model: 'heading3', class: 'ck-heading_heading3' },
      { title: 'Subsubtitle', view: 'h4', model: 'heading4', class: 'ck-heading_heading4' },
      { title: 'Preformatted Text', view: 'pre', model: 'preformattedText', class: 'ck-heading-preformattedText' },
      { title: 'Superscript', view: 'sup', model: 'superscript', class: 'ck-heading-superscript' },
      { title: 'Subscript', view: 'sub', model: 'subscript', class: 'ck-heading-subscript' },
      { title: 'Strike Out', view: 's', model: 'strikeout', class: 'ck-heading-strikeout' },
      { title: 'Computer Code', view: 'code', model: 'code', class: 'ck-heading-code' }
    ]
  },
  language: 'en',
  image: {
    toolbar: [
      'imageStyle:inline',
      'imageStyle:wrapText',
      'imageStyle:breakText',
      '|',
      'toggleImageCaption',
      'imageTextAlternative'
    ]
  },
  table: {
    contentToolbar: ['customTableColumn', 'customTableRow', 'mergeTableCells', 'tableCellProperties', 'tableProperties',
    // 'headerColor', 'tableWidth', 'tableBorder', 'tableAlternatingBG'
    ]
  },
  fontColor: {
    colors: []
  }
}

export default Editor
