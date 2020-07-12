x = 40
delay = 20

lis = makeArr(x, ()=> lorem.sentence().slice(0, -1))
  .map(element => `<li>${element}</li>`)

interval = setInterval(()=> {
  elements.innerHTML += lis.pop()
  switchAlignContent()
}, delay)

setTimeout(()=> clearInterval(interval), delay*x)

function switchAlignContent() {
  elements.style.alignContent =
    elements.scrollWidth > elements.clientWidth? 'flex-start' : 'center'
}