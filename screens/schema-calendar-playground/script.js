const schema0 = `{
  title: "",

}`

schemaBtns.append(buildEmptySchemaBtn(), ...(JSON.parse(localStorage.schemas || '""') || schemas).filter(schema => schema!=schema0).map(buildSchemaBtn), buildEmptySchemaBtn())

let dateObj = new Date()
dateObj.setDate(dateObj.getDate()-5)

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

let questDays, pool, schema

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
    } else {
      // plan(500, eval(`(${e.target.innerText})`))
      const newSchema = eval(`(${e.target.innerText})`)
      if (JSON.stringify(schema) == JSON.stringify(newSchema)) {
        const date = new Date(questDays[questDays.length-1].date)
        date.setDate(date.getDate()+1)
        questDays.push(...projectQuestDays(getISO(date), null, schema, pool)[0])
      } else {
        schema = newSchema;
        [questDays, pool] = projectQuestDays(getISO(new Date),
          Math.floor(Math.random()*63+7), schema)
      }
      renderQuestDays()
    }

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

function renderQuestDays() {
  calendar.querySelectorAll('.even, .do, .done, .break, .didbreak, .rest, .rested, .skip, .skipped, .final').forEach(btn =>
    btn.classList.remove('even', 'do', 'done', 'break', 'didbreak', 'rest', 'rested', 'skip', 'skipped', 'final'))
  questDays.forEach(day => {
    const btn = calendar.querySelector(`[title="${day.date}"]`)
    if (btn) {
      btn.classList.add(day.cat)
      if (day.group%2 && (day.cat=='do' || day.cat=='done'))
        btn.classList.add('even')
      if (day.final) btn.classList.add('final')
    }
  })
}

function plan(n/* days */, s/* schema */, dayLimit=999) {
  const days = s.days?.length? s.days : [0,1,2,3,4,5,6]
  dateObj = new Date('2020')
  dodays.length = 0
  let i = 0,  shift = 0,  rest = 0,  breaks = 0
  if (s.days) {
    const doLength = s.do || days.length - ((s.breaks||0) + (s.rest||0))
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
        if (i && !j) {
          if (breaks < s.breaks) breaks++
          else if (rest < s.rest) rest++
          else {
            breaks = rest = 0
            dodays.push(new DoDay(`${year}-${month}-${date}`,
              i, (i+shift)/doLength|0, j))
            i++
          }
        } else {
          dodays.push(new DoDay(`${year}-${month}-${date}`,
            i, (i+shift)/doLength|0, j))
          i++
        }
      }
      dateObj.setDate(dateObj.getDate()+1)
    }
  } else if (s.dates) {

  } else {
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

function QuestDay(date, i, group, j, cat, inertial, final) {
  Object.assign(this, {date, group, cat})
  if (typeof i == 'number') this.i = i, this.j = j
  if (inertial) this.inertial = true
  else if (final) this.final = true
}

function projectQuestDay(schema, initialDays, lazy) {
  if (!Array.isArray(initialDays)) {
    return new QuestDay(initialDays, 0, 0, 0, 'do')
  } else {
    const {length} = initialDays
    const lastDay = initialDays[length-1]
    const dateObj = new Date(lastDay.date)
    dateObj.setDate(dateObj.getDate()+1)
    const dateStr = getISO(dateObj)
    const i = lastDay.i + 1

    if (schema.days) {
      const groupSize = schema.do? schema.do + (schema.breaks || 0)
        : schema.days.length
    } else if (schema.dates) {

    } else {

    }
  }
}

function getISO(dateObj) {
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth()+1+''
  const date = dateObj.getDate()+''
  return `${year}-${month.padStart(2, 0)}-${date.padStart(2, 0)}`
}

function digest(schema) {
  const mode = schema.days? 'weekdays' : schema.dates? 'dates' : 'unbound'
  const groupMode = mode=='weekdays' && schema.do? 'unbound' : ''
}
{
//TODO Все варианты схем:


//* Просто кол-во вып-ний в серии
//* Просто дни нед (нед - серия)
//* Дни нед с кол-вом вып-ний в серии
//* Просто числа мес (мес - серия)
//* Числа мес с кол-вом вып-ний в серии

//? Кол-во вып-ний в серии с кол-вом дней отдыха между сериями
//? Дни нед с отдыхом в кол-ве нед между неделями-сериями
//? Дни нед с кол-вом вып-ний в серии и кол-вом дней отдыха между сериями
//? Числа мес с отдыхом в кол-ве мес между мес-сериями
//? Числа мес с кол-вом вып-ний в серии и кол-вом дней отдыха между сериями

//! Кол-во вып-ний с кол-вом дней перерывов в серии
//! Дни нед с кол-вом дней перерывов в нед
//! Дни нед с кол-вом вып-ний и кол-вом дней перерывов в серии
//! Числа мес с кол-вом дней перерывов в мес
//! Числа мес с кол-вом вып-ний и кол-вом дней перерывов в серии

//  Кол-во вып-ний с кол-вом дней перерывов в серии и кол-вом дней отдыха после
//  Дни нед с кол-вом дней перерывов в нед и отдыхом в кол-ве нед между
//  Дни нед с кол-вом вып-ний и кол-вом дней перерывов в серии и кол-вом дней
//    отдыха после
//  Числа мес с кол-вом дней перерывов в мес и отдыхом в кол-ве мес между
//  Числа мес с кол-вом вып-ний и кол-вом дней перерывов в серии и кол-вом дней
//    отдыха после


//* Кол-ва вып-ний и откладываний в серии
//* Дни нед (нед - серия) с кол-вом пропусков в нед
//* Дни нед с кол-вами вып-ний и откладываний в серии
//* Числа мес (мес - серия) с кол-вом пропусков в мес
//* Числа мес с кол-вами вып-ний и откладываний в серии

//? Кол-во вып-ний в серии c кол-вами откладываний на каждую серию и дней отдыха
//?   между сериями
//? Дни нед с кол-вом пропусков в нед и отдыхом в кол-ве нед между
//?   неделями-сериями
//? Дни нед с кол-вами вып-ний и откладываний в серии и кол-вом дней отдыха
//?   между ними
//? Числа мес с кол-вом пропусков в мес и отдыхом в кол-ве мес между мес-сериями
//? Числа мес с кол-вами вып-ний и откладываний в серии и кол-вом дней отдыха
//?   между ними

//! Кол-во вып-ний с кол-вами дней перерывов и дней откладываний в серии
//! Дни нед с кол-вами дней перерывов и дней пропусков в нед
//! Дни нед с кол-вами вып-ний, дней перерывов и дней откладываний в серии
//! Числа мес с кол-вами дней перерывов и дней пропусков в мес
//! Числа мес с кол-вами вып-ний, дней перерывов и дней откладываний в серии

//  Кол-во вып-ний с кол-вами дней перерывов и откладываний в серии и дней
//    отдыха после
//  Дни нед с кол-вами дней перерывов и пропусков в нед и отдыхом в кол-ве нед
//    между ними
//  Дни нед с кол-вами вып-ний, дней перерывов и откладываний в серии и дней
//    отдыха после
//  Числа мес с кол-вами дней перерывов и пропусков в мес и отдыхом в кол-ве
//    мес между ними
//  Числа мес с кол-вами вып-ний, дней перерывов и откладываний в серии и дней
//    отдыха после


//TODO переменные в схемах:
//!
//! режим привязки (дни недели, числа месяца, без привязки)
//!      -- кол-ва --
//! выполнений в серии
//! перерывов в серии/неделе/месяце
//! дней отдыха после серии / недель/месяцев отдыха после недели/месяца
//! откладываний/пропусков (в серии / в неделе/месяце если нет следующего)
//! выполнений для получения одного откладывания/пропуска
//!
}
const projectBy = {
  do(d, l, s, p) {},
  days(d, l, s, p) {},
  daysDo(d, l, s, p) {},
  dates(d, l, s, p) {},
  datesDo(d, l, s, p) {},
  doBreaks(d, l, s, p) {},
  daysBreaks(d, l, s, p) {},
  daysDoBreaks(d, l, s, p) {},
  datesBreaks(d, l, s, p) {},
  datesDoBreaks(d, l, s, p) {},
  doRest(d, l, s, p) {},
  daysRest(d, l, s, p) {},
  daysDoRest(d, l, s, p) {},
  datesRest(d, l, s, p) {},
  datesDoRest(d, l, s, p) {},
  doBreaksRest(d, l, s, p) {},
  daysBreaksRest(d, l, s, p) {},
  daysDoBreaksRest(d, l, s, p) {},
  datesBreaksRest(d, l, s, p) {},
  datesDoBreaksRest(d, l, s, p) {},
  doSkip(d, l, s, p) {},
  daysSkip(d, l, s, p) {},
  daysDoSkip(d, l, s, p) {},
  datesSkip(d, l, s, p) {},
  datesDoSkip(d, l, s, p) {},
  doBreaksSkip(d, l, s, p) {},
  daysBreaksSkip(d, l, s, p) {},
  daysDoBreaksSkip(d, l, s, p) {},
  datesBreaksSkip(d, l, s, p) {},
  datesDoBreaksSkip(d, l, s, p) {},
  doRestSkip(d, l, s, p) {},
  daysRestSkip(d, l, s, p) {},
  daysDoRestSkip(d, l, s, p) {},
  datesRestSkip(d, l, s, p) {},
  datesDoRestSkip(d, l, s, p) {},
  doBreaksRestSkip(d, l, s, p) {},
  daysBreaksRestSkip(d, l, s, p) {},
  daysDoBreaksRestSkip(d, l, s, p) {},
  datesBreaksRestSkip(d, l, s, p) {},
  datesDoBreaksRestSkip(d, l, s, p) {},
  doEarn(d, l, s, p) {},
  daysEarn(d, l, s, p) {},
  daysDoEarn(d, l, s, p) {},
  datesEarn(d, l, s, p) {},
  datesDoEarn(d, l, s, p) {},
  doBreaksEarn(d, l, s, p) {},
  daysBreaksEarn(d, l, s, p) {},
  daysDoBreaksEarn(d, l, s, p) {},
  datesBreaksEarn(d, l, s, p) {},
  datesDoBreaksEarn(d, l, s, p) {},
  doRestEarn(d, l, s, p) {},
  daysRestEarn(d, l, s, p) {},
  daysDoRestEarn(d, l, s, p) {},
  datesRestEarn(d, l, s, p) {},
  datesDoRestEarn(d, l, s, p) {},
  doBreaksRestEarn(d, l, s, p) {},
  daysBreaksRestEarn(d, l, s, p) {},
  daysDoBreaksRestEarn(d, l, s, p) {},
  datesBreaksRestEarn(d, l, s, p) {},
  datesDoBreaksRestEarn(d, l, s, p) {},
  doSkipEarn(d, l, s, p) {},
  daysSkipEarn(d, l, s, p) {},
  daysDoSkipEarn(d, l, s, p) {},
  datesSkipEarn(d, l, s, p) {},
  datesDoSkipEarn(d, l, s, p) {},
  doBreaksSkipEarn(d, l, s, p) {},
  daysBreaksSkipEarn(d, l, s, p) {},
  daysDoBreaksSkipEarn(d, l, s, p) {},
  datesBreaksSkipEarn(d, l, s, p) {},
  datesDoBreaksSkipEarn(d, l, s, p) {},
  doRestSkipEarn(d, l, s, p) {},
  daysRestSkipEarn(d, l, s, p) {},
  daysDoRestSkipEarn(d, l, s, p) {},
  datesRestSkipEarn(d, l, s, p) {},
  datesDoRestSkipEarn(d, l, s, p) {},
  doBreaksRestSkipEarn(d, l, s, p) {},
  daysBreaksRestSkipEarn(d, l, s, p) {},
  daysDoBreaksRestSkipEarn(d, l, s, p) {},
  datesBreaksRestSkipEarn(d, l, s, p) {},
  datesDoBreaksRestSkipEarn(d, l, s, p) {
    if (!p) p = {do: s.do, breaks: s.breaks, rest: s.rest,
                    i: 0, group: 0, j: 0, skip: 0, earn: 0, inertia: 0}
    if (!l) l = s.do
    const dateObj = new Date(d)
    const questDays = []
    do {
      const date = dateObj.getDate()
      if (s.dates.includes(date)) {
        if (p.skip) {
          questDays.push(new QuestDay(getISO(dateObj),
            null, null, null, 'skip'))
          p.skip--
          continue
        }
        if (p.do) {
          questDays.push(new QuestDay(getISO(dateObj),
            p.i++, p.group, p.j++, 'do', p.inertia, !--l))
          if (!l || p.inertia) p.inertia++
          p.do--
          if (++p.earn == s.earn) {
            p.skip++
            p.earn = 0
          }
        } else if (p.breaks) {
          questDays.push(new QuestDay(getISO(dateObj),
            null, p.group, null, 'break'))
          p.breaks--
        } else if (p.rest) {
          questDays.push(new QuestDay(getISO(dateObj),
            null, p.group, null, 'rest'))
          p.rest--
        } else {
          p.do = s.do
          p.breaks = s.breaks
          p.rest = s.rest
          p.group++
          p.j = 0
          continue
        }
      }
      dateObj.setDate(date+1)
    } while (l > 0 || p.do + p.breaks + p.rest > 0);
    return [questDays, p]
  },
}

function projectQuestDays(date, length, schema, pool) {
  const methodParts = 'Days,Dates,Do,Breaks,Rest,Skip,Earn'.split(',')
    .filter(part => schema[part.toLowerCase()])
  const method = methodParts.shift().toLowerCase()+methodParts.join('')
  return projectBy[method](date, length, schema, pool)
}

const datesDoBreaksRestSkipEarn_schema = {
  dates: [1,2,3,4,5,11,12,13,14,15,21,22,23,24,25],
  do: 5,
  breaks: 2,
  rest: 1,
  skip: 2,
  earn: 4
}

// const [qDays, pool] = projectQuestDays(getISO(new Date), 21, datesDoBreaksRestSkipEarn_schema).c()
// projectQuestDays(qDays[qDays.length-1].date, 5, datesDoBreaksRestSkipEarn_schema, pool).c()