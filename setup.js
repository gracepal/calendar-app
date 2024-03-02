// Elements
const calendarEl = document.querySelector('.calendar')
const headerMonthEl = document.querySelector('.header .month')

/**
 *
 */
function setupNavbar() {}

/**
 *
 */
function setupCalendar(dateVal) {
  const sourceDate = dateVal ?? new Date()
  const dimensions = Utils.getGridDimensions(sourceDate)
  calendarEl.style.gridTemplateRows = `repeat(${dimensions.length}, minmax(180px, 1fr));`
  headerMonthEl.textContent = `${Utils.getMonthName(sourceDate.getMonth())} ${sourceDate.getFullYear()}`

  for (let r = 0; r < dimensions.length; r++) {
    const weekEl = document.createElement('div')
    weekEl.className = `week row-${r + 1}`
    for (let c = 0; c < dimensions[0].length; c++) {
      const dayEl = document.createElement('div')
      dayEl.className = `day col-${c + 1}`
      const dateEl = document.createElement('div')
      dateEl.className = 'date'
      dateEl.textContent = dimensions[r][c]
      dateEl.title = 'hello hello'
      if (dimensions[r][c] == today.getDate()) {
        dateEl.className += ' active'
      }
      dayEl.appendChild(dateEl)
      weekEl.appendChild(dayEl)
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
const today = new Date()
setupCalendar(new Date(today.getFullYear(), today.getMonth() + 1, 3))
setupFooter()
