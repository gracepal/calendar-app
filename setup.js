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
  const today = new Date()
  const sourceDate = dateVal ?? today
  const dimensions = Utils.getGridDimensions(sourceDate)
  const monthName = Utils.getMonthName(sourceDate.getMonth())
  calendarEl.style.gridTemplateRows = `repeat(${dimensions.length}, minmax(180px, 1fr));`
  headerMonthEl.textContent = `${monthName} ${sourceDate.getFullYear()}`

  for (let r = 0; r < dimensions.length; r++) {
    const weekEl = document.createElement('div')
    weekEl.className = `week row-${r + 1}`
    for (let c = 0; c < dimensions[0].length; c++) {
      const dayEl = document.createElement('div')
      dayEl.className = `day col-${c + 1}`
      const dateEl = document.createElement('div')
      dateEl.className = 'date'
      dateEl.textContent = dimensions[r][c]
      if (sourceDate.getMonth() == today.getMonth() && dimensions[r][c] == today.getDate()) {
        dateEl.className += ' active'
      }

      const dayOfWeek = Utils.dayToStrMapping[c]
      dateEl.title = `${dayOfWeek}, ${monthName} ${dimensions[r][c]}, ${sourceDate.getFullYear()}` // ex. "Saturday, March 2, 2024"

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
setupCalendar(new Date(today.getFullYear(), today.getMonth() + 2, 3))
setupFooter()
