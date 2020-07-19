const schema0 = `{
  title: "",

}`

schemaBtns.append(buildEmptySchemaBtn(), ...(JSON.parse(localStorage.schemas || '""') || schemas).filter(schema => schema!=schema0).map(buildSchemaBtn), buildEmptySchemaBtn())

let dateObj = new Date('2020')

let week = 'odd'

do { //* BUILD CALENDAR BUTTONS
  const btn = document.createElement('button')
  const [day, mon, date, year] = dateObj.toString().split(' ')
  const month = String(dateObj.getMonth() + 1).padStart(2, 0)
  btn.innerText = date
  btn.title = `${year}-${month}-${date}`
  btn.className = week
  if (date=='01') calendar.append(mon)
  calendar.append(btn)
  dateObj.setDate(dateObj.getDate() + 1)
  if (day == 'Sun') week = week? '':'odd'
} while (document.body.scrollHeight < innerHeight)

//* REMOVE EXCESSIVE BUTTONS
while (document.body.scrollHeight > innerHeight)
  calendar.lastChild.remove()


const dodays = [
  '2020-01-01',
  '2020-01-02',
  '2020-01-03',
  '2020-01-05',
  '2020-01-06',
  '2020-01-07',
  '2020-01-09',
  '2020-01-10',
]

// plan(200, {days: [0,3,6]})
setTimeout(()=> schemaBtns.querySelector('pre').click())


schemaBtns.onclick = e => {
  if (e.target.tagName=='PRE' || e.target.firstChild?.tagName=='PRE') {
    if (e.altKey) {
      const ta = document.createElement('textarea')
      ta.value = e.target.innerText
      e.target.replaceWith(ta)
      fixSize(ta)
      ta.focus()
    } else if (e.ctrlKey && e.shiftKey) {
      e.stopPropagation()
      e.preventDefault()
      e.target.parentNode.remove()
      localStorage.schemas = JSON.stringify([...schemaBtns.querySelectorAll('pre, textarea')].map(el => el.innerText || el.value))
    } else
      plan(500, eval(`(${e.target.innerText})`))
  }
}

schemaBtns.onkeydown = e => {
  if (e.target.tagName=='TEXTAREA') {
    const ta = e.target
    if (e.key=='Enter' && e.ctrlKey || e.key=='Escape') {
      const pre = document.createElement('pre')
      pre.innerText = ta.value
      ta.replaceWith(pre)
      storeSchemas()
      pre.parentNode.focus()
      if (!schemaBtns.firstChild.querySelector('textarea'))
        schemaBtns.prepend(buildEmptySchemaBtn())
      if (!schemaBtns.lastChild.querySelector('textarea'))
        schemaBtns.append(buildEmptySchemaBtn())
    } else if (e.key=='Tab') {
      e.preventDefault()
      const pos = ta.selectionStart
      ta.value = ta.value.slice(0, pos) + '  ' + ta.value.slice(pos)
      ta.selectionStart = ta.selectionEnd = pos+2
    } else if (e.key=='ArrowLeft' && e.ctrlKey
      && ta.parentNode.previousSibling) {
        schemaBtns.insertBefore(ta.parentNode, ta.parentNode.previousSibling)
        e.preventDefault(),  storeSchemas(),  ta.focus()
    } else if (e.key=='ArrowRight' && e.ctrlKey
      && ta.parentNode.nextSibling) {
        schemaBtns.insertBefore(ta.parentNode.nextSibling, ta.parentNode)
        e.preventDefault(),  storeSchemas(),  ta.focus()
    } else fixSize(ta)
  } else {
    const btn = e.target
    if (e.key=='ArrowLeft' && e.ctrlKey && btn.previousSibling) {
      schemaBtns.insertBefore(btn, btn.previousSibling)
      e.preventDefault(),  storeSchemas(),  btn.focus()
    } else if (e.key=='ArrowRight' && e.ctrlKey && btn.nextSibling) {
      schemaBtns.insertBefore(btn.nextSibling, btn)
      e.preventDefault(),  storeSchemas(),  btn.focus()
    }
  }
}

function storeSchemas() {
  localStorage.schemas = JSON.stringify([...schemaBtns.querySelectorAll('pre, textarea')].map(el => el.innerText || el.value))
}

function buildEmptySchemaBtn() {
  const btn = document.createElement('button')
  const ta = document.createElement('textarea')
  ta.value = schema0
  ta.cols = 13, ta.rows = 5
  btn.append(ta)
  return btn
}

function buildSchemaBtn(schema) {
  const btn = document.createElement('button')
  const pre = document.createElement('pre')
  pre.innerText = schema
  btn.append(pre)
  return btn
}

function render() {
  calendar.querySelectorAll('.planned, .even').forEach(btn =>
    btn.classList.remove('planned', 'even'))
  dodays.forEach(day => {
    const btn = calendar.querySelector(`[title="${day.date}"]`)
    if (btn) {
      btn.classList.add('planned')
      if (day.group%2) btn.classList.add('even')
    }
  })
}

function plan(n/* days */, s/* schema */, dayLimit=999) {
  const days = s.days?.length? s.days : [0,1,2,3,4,5,6]
  dateObj = new Date('2020')
  dodays.length = 0
  let i = 0,  shift = 0
  if (s.days) {
    const doLength = s.do || days.length
    if (!s.do && dateObj.getDay()-1) {
      const weekday = (dateObj.getDay()+6)%7
      shift = days.filter(day => day<weekday).length
    }
    while (dodays.length < n && dayLimit--) {
      const [day, mon, date, year] = dateObj.toString().split(' ')
      const month = String(dateObj.getMonth() + 1).padStart(2, 0)
      const weekday = (dateObj.getDay()+6)%7
      const j = (i+shift)%doLength
      if (days.includes(weekday)) {
        dodays.push(new DoDay(`${year}-${month}-${date}`,
          i, (i+shift)/doLength|0, j))
        i++
      }
      dateObj.setDate(dateObj.getDate()+1)
    }
  } else if (s.dates) {

  } else {
    let rest = 0,  breaks = 0
    const doLength = s.do || 1
    while (dodays.length < n && dayLimit--) {
      const [day, mon, date, year] = dateObj.toString().split(' ')
      const month = String(dateObj.getMonth() + 1).padStart(2, 0)
      const weekday = (dateObj.getDay()+6)%7
      const j = i%doLength
      if (i && !j) {
        if (breaks < s.breaks) breaks++
        else if (rest < s.rest) rest++
        else {
          breaks = rest = 0
          dodays.push(new DoDay(`${year}-${month}-${date}`,
            i, i/doLength|0, j))
          i++
        }
      } else {
        dodays.push(new DoDay(`${year}-${month}-${date}`,
          i, i/doLength|0, j))
        i++
      }
      dateObj.setDate(dateObj.getDate()+1)
    }
  }
  render()
}

function fixSize(textarea) {
  setTimeout(()=> {
    const lines = textarea.value.split('\n')
    textarea.cols = 0| 1.053*
      Math.max(...lines.map(line => line.length))
    textarea.rows = lines.length+1
  })
}

function DoDay(date, i, group, j) {
  Object.assign(this, {date, i, group, j})
}