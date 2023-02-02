export const defaultConfig = {
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
    contentToolbar: ['customTableColumn', 'customTableRow', 'mergeTableCells', 'tableCellProperties', 'tableProperties'],
    tableProperties: {
      tableHeaderColors: [
        { label: 'None', value: 'header-color-none' },
        { label: 'Default (Gold)', value: 'header-color-gold' },
        { label: 'Maroon', value: 'header-color-maroon' },
        { label: 'Charcoal', value: 'header-color-charcoal' },
        { label: 'Deep Blue', value: 'header-color-blue' },
        { label: 'River', value: 'header-color-river' },
        { label: 'Sandstone', value: 'header-color-sandstone' },
        { label: 'Old Gold', value: 'header-color-oldgold' }
      ],
      tableWidth: [
        { label: '100%', value: 'full-width' },
        { label: 'Auto', value: 'auto-width' }
      ],
      tableHeaders: [
        { label: 'None', value: 'none' },
        { label: 'First Row', value: 'row' },
        { label: 'First Column', value: 'column' },
        { label: 'Both', value: 'both' }
      ],
    }
  },
  htmlSupport: {
    allow: htmlSupport
  },
  fontColor: {
    colors: []
  }
}

const allowedContent = 'a abbr address area article aside audio b base bdi bdo blockquote body br button canvas caption cite code col colgroup command datalist dd del details dfn div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link map mark menu meta meter nav noscript object ol optgroup option output p param pre progress q rp rt ruby s samp script section select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr acronym applet basefont big center dialog dir font isindex noframes strike tt'

const allowedStyles = 'align-content, align-items, align-self, alignment, alignment-baseline, all, alt, animation, animation-delay, animation-direction, animation-duration, animation-fill-mode, animation-iteration-count, animation-name, animation-play-state, animation-timing-function, appearance, azimuth, backface-visibility, background, background-attachment, background-blend-mode, background-clip, background-color, background-image, background-origin, background-position, background-position-block, background-position-inline, background-position-x, background-position-y, background-repeat, background-size, baseline-shift, bookmark-label, bookmark-level, bookmark-state, border, border-bottom, border-bottom-color, border-bottom-left-radius, border-bottom-right-radius, border-bottom-style, border-bottom-width, border-boundary, border-clip, border-clip-bottom, border-clip-left, border-clip-right, border-clip-top, border-collapse, border-color, border-image, border-image-outset, border-image-repeat, border-image-slice, border-image-source, border-image-width, border-left, border-left-color, border-left-style, border-left-width, border-limit, border-radius, border-right, border-right-color, border-right-style, border-right-width, border-spacing, border-style, border-top, border-top-color, border-top-left-radius, border-top-right-radius, border-top-style, border-top-width, border-width, bottom, box-decoration-break, box-shadow, box-sizing, box-snap, box-suppress, break-after, break-before, break-inside, caption-side, caret, caret-animation, caret-color, caret-shape, chains, child-align, clear, clear-after, clip, clip-path, clip-rule, color, color-interpolation-filters, column-count, column-fill, column-gap, column-rule, column-rule-color, column-rule-style, column-rule-width, column-span, column-width, columns, content, continue, corner-shape, corners, counter-increment, counter-reset, counter-set, crop, cue, cue-after, cue-before, cursor, direction, display, dominant-baseline, elevation, empty-cells, filter, flex, flex-basis, flex-direction, flex-flow, flex-grow, flex-shrink, flex-wrap, float, float-defer, float-displace, float-offset, float-reference, flood-color, flood-opacity, flow, flow-from, flow-into, font, font-family, font-feature-settings, font-kerning, font-language-override, font-size, font-size-adjust, font-stretch, font-style, font-synthesis, font-variant, font-variant-alternates, font-variant-caps, font-variant-east-asian, font-variant-ligatures, font-variant-numeric, font-variant-position, font-weight, footnote-display, footnote-policy, glyph-orientation-vertical, grid, grid-area, grid-auto-columns, grid-auto-flow, grid-auto-rows, grid-column, grid-column-end, grid-column-gap, grid-column-start, grid-gap, grid-row, grid-row-end, grid-row-gap, grid-row-start, grid-template, grid-template-areas, grid-template-columns, grid-template-rows, hanging-punctuation, height, hyphenate-character, hyphenate-limit-chars, hyphenate-limit-last, hyphenate-limit-lines, hyphenate-limit-zone, hyphens, image-orientation, image-rendering, image-resolution, indent-edge-reset, initial-letter, initial-letter-align, initial-letter-wrap, isolation, justify-content, justify-items, justify-self, left, letter-spacing, lighting-color, line-break, line-grid, line-snap, list-style, list-style-image, list-style-position, list-style-type, margin, margin-bottom, margin-left, margin-right, margin-top, marker-side, marquee-direction, marquee-loop, marquee-speed, marquee-style, mask, mask-border, mask-border-mode, mask-border-outset, mask-border-repeat, mask-border-slice, mask-border-source, mask-border-width, mask-clip, mask-composite, mask-image, mask-mode, mask-origin, mask-position, mask-repeat, mask-size, mask-type, max-height, max-lines, max-width, max-zoom, min-height, min-width, min-zoom, mix-blend-mode, motion, motion-offset, motion-path, motion-rotation, move-to, nav-down, nav-left, nav-right, nav-up, object-fit, object-position, offset-after, offset-before, offset-end, offset-start, opacity, order, orientation, orphans, outline, outline-color, outline-offset, outline-style, outline-width, overflow, overflow-style, overflow-wrap, overflow-x, overflow-y, padding, padding-bottom, padding-left, padding-right, padding-top, page, page-break-after, page-break-before, page-break-inside, page-policy, pause, pause-after, pause-before, perspective, perspective-origin, pitch, pitch-range, play-during, polar-anchor, polar-angle, polar-distance, polar-origin, position, presentation-level, quotes, region-fragment, resize, resolution, rest, rest-after, rest-before, richness, right, rotation, rotation-point, ruby-align, ruby-merge, ruby-position, running, scroll-behavior, scroll-snap-align, scroll-snap-coordinate, scroll-snap-destination, scroll-snap-margin, scroll-snap-padding, scroll-snap-points-x, scroll-snap-points-y, scroll-snap-type, shape-image-threshold, shape-inside, shape-margin, shape-outside, size, speak, speak-as, speak-header, speak-numeral, speak-punctuation, speech-rate, stress, string-set, tab, tab-align, tab-leaders, tab-leaders-alignment, tab-position, tab-size, table-baseline, table-column-span, table-layout, table-row-span, text-align, text-align-all, text-align-last, text-combine-upright, text-decoration, text-decoration-color, text-decoration-line, text-decoration-skip, text-decoration-style, text-emphasis, text-emphasis-color, text-emphasis-position, text-emphasis-style, text-indent, text-justify, text-orientation, text-overflow, text-shadow, text-space-collapse, text-space-trim, text-spacing, text-transform, text-underline-position, text-wrap, top, transform, transform-box, transform-origin, transform-style, transition, transition-delay, transition-duration, transition-property, transition-timing-function, unicode-bidi, user-select, user-zoom, vertical-align, visibility, voice-balance, voice-duration, voice-family, voice-pitch, voice-range, voice-rate, voice-stress, voice-volume, volume, white-space, widows, width, will-change, word-break, word-spacing, word-wrap, wrap-after, wrap-before, wrap-flow, wrap-inside, wrap-through, writing-mode, z-index, zoom'

export const htmlSupport = allowedContent.split(' ').map(name => ({
  name,
  styles: allowedStyles.split(', '),
  classes: true,
  attributes: true
}))
