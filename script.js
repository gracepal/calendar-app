todayBtnEl.addEventListener('click', function (e) {
  setupCalendar()
})

prevMonthBtnEl.addEventListener('click', function (e) {
  const curMonthLabel = monthDisplayEl.ariaLabel
  let [curMonth, curYear] = curMonthLabel.split(' ')
  curMonth = Utils.getMonthIndex(curMonth)
  curYear = parseInt(curYear)
  const prevMonthDateObj = new Date(curYear, curMonth - 1, 1)
  setupCalendar(prevMonthDateObj)
})

nextMonthBtnEl.addEventListener('click', function () {
  const curMonthLabel = monthDisplayEl.ariaLabel
  let [curMonth, curYear] = curMonthLabel.split(' ')
  curMonth = Utils.getMonthIndex(curMonth)
  curYear = parseInt(curYear)
  const nextMonthDateObj = new Date(curYear, curMonth + 1, 1)
  setupCalendar(nextMonthDateObj)
})
