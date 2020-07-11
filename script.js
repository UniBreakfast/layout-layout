var slot = document.querySelector('.component-slot')

loadComponent('ItemList', slot)

function loadComponent(name, slot) {
  return Promise.all([
    fetch(`Components/${name}/${name}.html`).then(r => r.text()),
    Promise.all(['base.css', name+'.css', 'custom.css']
      .map(filename => fetch(`Components/${name}/`+filename)
        .then(r => r.ok? r.text() : '')
      )
    ).then(cssAll => Promise.all(cssAll.map(css => {
      const style = document.createElement('style')
      style.innerHTML = css
      document.head.append(style)
      return new Promise(resolve => style.onload = resolve)
    })))
  ]).then(([html])=> slot.innerHTML = html)
}
