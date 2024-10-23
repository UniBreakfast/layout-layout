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

function switchNaming(e, parent) {
  const breakName =
    parent.firstElementChild.hidden? "перерывов" : "откладываний"
  parent.nextElementSibling.querySelectorAll('.breaks')
    .forEach(span => span.innerText = breakName)
  parent.nextElementSibling.nextElementSibling.querySelector('.rest')
    .innerText = parent.firstElementChild.hidden? parent==daysDiv?
      "недель" : "месяцев" : "дней"
}

function switchEarnWords(e, parent) {
  parent.nextElementSibling.querySelector('.earn').innerText =
    parent.firstElementChild.hidden? "и заслужить его нельзя" : "раз за серию"
}

function switchSkipWords(e, parent) {
  const spans = parent.previousElementSibling.querySelectorAll('.skip')
  const earn = parent.firstElementChild.hidden
  spans[0].innerText =
    earn? "С правом на пропуски" : "Лимит пропусков в запасе"
  spans[1].innerText =
    earn? "Без права на пропуск" : "С правом заработать пропуски"
}