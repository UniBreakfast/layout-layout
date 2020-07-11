toggleFora =()=> [...document.querySelectorAll('.blockRow')].slice(2, -1)
  .forEach(row => row.classList.toggle('hidden'))