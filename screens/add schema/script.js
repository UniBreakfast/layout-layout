function handleBoundBtns(e) {
  if (e.target.tagName == "BUTTON") {
    const current = boundBtns.querySelector('.pressed')
    current.className = ''
    boundDivs.children[current.id.replace('Btn', 'Div')].hidden = true
    boundDivs.children[e.target.id.replace('Btn', 'Div')].hidden = false
    e.target.className = 'pressed'
  }
}

function handleToggleDiv(e, parent, cb) {
  if (e.path.some(el => el.tagName == 'BUTTON')) {
    for (const div of parent.children) div.hidden = !div.hidden
    if (cb) cb(e, parent)
  }
}

function switchBreakName(e, parent) {
  const breakName =
    parent.firstElementChild.hidden? "перерывов" : "откладываний"
  parent.nextElementSibling.querySelectorAll('.breaks')
    .forEach(span => span.innerText = breakName)
}