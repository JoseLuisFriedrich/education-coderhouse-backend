
const get = (selector) => {
  return document.querySelector(selector)
}

const setInputFilter = (textbox, inputFilter) => {
  ['input', 'keydown', 'keyup', 'mousedown', 'mouseup', 'select', 'contextmenu', 'drop'].forEach(event => {
    textbox.addEventListener(event, e => {
      const target = e.currentTarget
      if (inputFilter(target.value)) {
        target.oldValue = target.value
        target.oldSelectionStart = target.selectionStart
        target.oldSelectionEnd = target.selectionEnd
      } else if (target.hasOwnProperty('oldValue')) {
        target.value = target.oldValue
        target.setSelectionRange(target.oldSelectionStart, target.oldSelectionEnd)
      } else {
        target.value = ''
      }
    });
  });
}

// input filter
setInputFilter(get("#price"), (value) => /^\d*\.?\d*$/.test(value))
