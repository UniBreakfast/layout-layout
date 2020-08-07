const x = 10
const delay = 20

// weekdays = 'вс, пн, вт, ср, чт, пт, сб'.split(', ');
const weekdays = 'воскресенье, понедельник, вторник, среда, четверг, пятница, суббота'.split(', ');
const theseDays = {'-2': 'позавчера', '-1': 'вчера', '0': 'сегодня', '1': 'завтра', '2': 'послезавтра'}
const today = (new Date() - new Date().getTimezoneOffset()*6e4) / 864e5 | 0
const items = [...Array(x).keys()].map((dateShift, i) => {
    const date = new Date('2020-07-04')
    date.setDate(date.getDate()+dateShift)
    const dayNum = date.getDate()
    const day = date.getDay()
    const diff = date / 864e5 - today
    const prefix = diff in theseDays? theseDays[diff]+', ' : ''
    return `<li>${i<4? '<s>':''}${prefix}${dayNum}, ${weekdays[day]}${i<4?
      '</s>':''}</li>`
})

const interval = setInterval(()=> {
  days.innerHTML += items.shift()
  switchAlignContent()
}, delay)

setTimeout(()=> clearInterval(interval), delay*(x+3))

function switchAlignContent() {
  days.style.alignContent =
    days.scrollWidth > days.clientWidth? 'flex-start' : 'center'
}