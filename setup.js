// Elements
const calendarEl = document.querySelector('.calendar')

/**
 *
 */
function setupNavbar() {}

/**
 *
 */
function setupCalendar() {
  //
  const dimensions = Utils.getGridDimensions()
  const numWeekRows = 6
  let curDate = -5 // -startDayOfWeek+1
  let todayDate = new Date().getDate()
  calendarEl.style.gridTemplateRows = `repeat(${numWeekRows}, minmax(180px, 1fr));`

  for (let i = 0; i < numWeekRows; i++) {
    const weekEl = document.createElement('div')
    weekEl.className = `week row-${i + 1}`
    for (let j = 0; j < 7; j++) {
      const dayEl = document.createElement('div')
      dayEl.className = `day col-${i + 1}`
      const dateEl = document.createElement('div')
      dateEl.className = 'date'
      if (curDate >= 1) {
        dateEl.textContent = curDate
        if (curDate == todayDate) {
          dateEl.className += ' active'
        }
      }
      dayEl.appendChild(dateEl)
      weekEl.appendChild(dayEl)
      curDate += 1
    }
    calendarEl.appendChild(weekEl)
  }
}

/**
 *
 */
function setupFooter() {
  // setup current date
  const todayDisplayEl = document.querySelector('.footer .today')
  let today = new Date()
  todayDisplayEl.textContent = today
}

// Setup
setupCalendar()
setupFooter()
