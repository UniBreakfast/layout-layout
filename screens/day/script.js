const x = 12, y = 4
const delay = 20

const items = makeArr(x, ()=> lorem.sentence().slice(0, -1))
  .map((endeavor, i) => `<li>${i<y? '<s>':''}${endeavor}${i<y? '</s>':''}</li>`)

const interval = setInterval(()=> {
  quests.innerHTML += items.pop()
  switchAlignContent()
}, delay)



setTimeout(()=> clearInterval(interval), delay*x)

function switchAlignContent() {
  quests.style.alignContent =
    quests.scrollWidth > quests.clientWidth? 'flex-start' : 'center'
}