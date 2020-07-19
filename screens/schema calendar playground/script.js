schemaBtns.append(buildEmptySchemaBtn(), ...(JSON.parse(localStorage.schemas || '""') || schemas).filter(schema => schema!=`{
  title: "",

}`).map(buildSchemaBtn), buildEmptySchemaBtn())

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
  if (day == 'Sun') week = week=='odd'? 'even':'odd'
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
  if (e.target.tagName=='PRE') {
    if (e.altKey) {
      const ta = document.createElement('textarea')
      ta.value = e.target.innerText
      e.target.replaceWith(ta)
      ta.focus()
    } else if (e.ctrlKey + e.shiftKey) {
      e.stopPropagation()
      e.preventDefault()
      e.target.parentNode.remove()
      localStorage.schemas = JSON.stringify([...schemaBtns.querySelectorAll('pre, textarea')].map(el => el.innerText || el.value))
    } else
      plan(100, eval(`(${e.target.innerText})`))
  }
}

schemaBtns.onkeydown = e => {
  if (e.target.tagName=='TEXTAREA' &&
    (e.key=='Enter' && e.ctrlKey || e.key=='Escape')) {
    const pre = document.createElement('pre')
    pre.innerText = e.target.value
    e.target.replaceWith(pre)
    localStorage.schemas = JSON.stringify([...schemaBtns.querySelectorAll('pre, textarea')].map(el => el.innerText || el.value))
    if (!schemaBtns.firstChild.querySelector('textarea'))
      schemaBtns.prepend(buildEmptySchemaBtn())
    if (!schemaBtns.lastChild.querySelector('textarea'))
      schemaBtns.append(buildEmptySchemaBtn())
  }
}

function buildEmptySchemaBtn() {
  const btn = document.createElement('button')
  const ta = document.createElement('textarea')
  ta.value = `{
  title: "",

}`
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
  calendar.querySelectorAll('.planned').forEach(btn =>
    btn.classList.remove('planned'))
  dodays.forEach(date =>
    calendar.querySelector(`[title="${date}"]`)?.classList.add('planned'))
}

function plan(n/* days */, s/* schema */, dayLimit=999) {
  const days = s.days.length? s.days : [0,1,2,3,4,5,6]
  dateObj = new Date('2020')
  dodays.length = 0
  if (s.days) {
    while (dodays.length < n && dayLimit--) {
      const weekday = (dateObj.getDay()+6)%7
      const [day, mon, date, year] = dateObj.toString().split(' ')
      const month = String(dateObj.getMonth() + 1).padStart(2, 0)
      if (days.includes(weekday))
        if (s.skip)
          if (s.do) ;
          else
            if (days.length-days.indexOf(weekday) > s.skip)
              dodays.push(`${year}-${month}-${date}`)
            else;
        else dodays.push(`${year}-${month}-${date}`)



      dateObj.setDate(dateObj.getDate()+1)
    }
  } else if (s.dates) {

  } else {

  }
  render()
}
