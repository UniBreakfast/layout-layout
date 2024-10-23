fetch('../top-panel').then(r => r.text()).then(html => {
  const header = html.match(/<header>[\s\S]*<\/header>/)[0]
  document.body.innerHTML = header + document.body.innerHTML
})
