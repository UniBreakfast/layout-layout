
const schemas = [
`{
  title: "x1-x5-ые числа, сериями по 5,\
    по 2 перерыва и по дню отдыха на серию,\
    откладывание за каждые 4 выполнения, макс. 2",
  dates: [1,2,3,4,5,11,12,13,14,15,21,22,23,24,25],
  do: 5,
  breaks: 2,
  rest: 1,
  skip: 2,
  earn: 4
}`,
`{
  title: "пн, ср, пт - один не обязателен",
  days: [1, 3, 5],
  indult: 1
}`,
`{
  title: "пн, ср, пт - пропуск на шесть",
  days: [1, 3, 5],
  indult: 1,
  per: 6
}`,
`{
  title: "пн, ср, пт - 2 пропуска за четыре",
  days: [1, 3, 5],
  indult: 2,
  after: 4
}`,


`{
  title: "каждые 10, 20, 30-ое числа месяца",
  dates: [10, 20, 30],
}`,
`{
  title: "каждые вторые выходные",
  days: [5, 6],
  do: 2,
  rest: 2
}`,

`{
  title: "ежедневно",
  do: 1
}`,
`{
  title: "через день",
  do: 1,
  rest: 1
}`,
`{
  title: "еженедельно",
  do: 1,
  rest: 6
}`,
`{
  title: "раз в неделю",
  days: [],
  do: 1,
}`,
`{
  title: "раз в неделю, неделю можно пропускать",
  days: [],
  do: 1,
  indult: 1,
  after: 1
}`,
`{
  title: "раз в месяц",
  dates: [],
  do: 1
}`,
`{
  title: "через день или чаще",
  do: 1,
  indult: 1,
  after: 1
}`,
`{
  title: "1-2 раза в каждые четыре дня",
  do: 2,
  skip: 2,
  indult: 1,
}`,
`{
  title: "4 дня, 1-3 дня отдыха между",
  do: 4,
  skip: 1,
  indult: 2,
  after: 5,
}`,

`{
  mode: 'exact',
  do: 1,
  skip: 0,
}`,
`{
  id: 3,
  mode: 'exact',
  do: 1,
  skip: 2,
}`,
`{
  id: 4,
  title: "вт, чт, сб",
  mode: "weekdays",
  days: [1, 3, 5]
}`,
`{
  id: 5,
  title: "по будням",
  mode: "weekdays",
  days: [0,1,2,3,4]
}`,
`{
  id: 5,
  title: "по будням",
  mode: "flexible",
  do: 1,
  skip: {
    min: 1,
    max: 3,
  },
}`,

];