/**
 * Depending on the position of the selection we either return the table under cursor or look for the table higher in the hierarchy.
 *
 * @param {module:engine/model/position~Position} position
 * @returns {module:engine/model/element~Element}
 */
 export function getSelectionAffectedTable (selection) {
  const selectedElement = selection.getSelectedElement()

  // Is the command triggered from the `tableToolbar`?
  if (selectedElement && selectedElement.is('element', 'table')) {
    return selectedElement
  }

  return selection.getFirstPosition().findAncestor('table')
}
