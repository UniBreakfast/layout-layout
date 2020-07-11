x = 40
delay = 20

lis = makeArr(x, ()=> lorem.sentence().slice(0, -1))
  .map(activity => `<li>${activity}</li>`)

interval = setInterval(()=> {
  activities.innerHTML += lis.pop()
  switchAlignContent()
}, delay)

setTimeout(()=> clearInterval(interval), delay*x)

function switchAlignContent() {
  activities.style.alignContent =
    activities.scrollWidth > activities.clientWidth? 'flex-start' : 'center'
}