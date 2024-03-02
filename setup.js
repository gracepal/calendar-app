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
  const today = new Date()
  // const dimensions = Utils.getGridDimensions(new Date(today.getFullYear(), today.getMonth() - 1, 12))
  const dimensions = Utils.getGridDimensions(today)
  calendarEl.style.gridTemplateRows = `repeat(${dimensions.length}, minmax(180px, 1fr));`
  console.log('here it is', calendarEl.style.gridTemplateRows)
  console.log('try again', `repeat(${dimensions.length}, minmax(180px, 1fr));`)

  for (let r = 0; r < dimensions.length; r++) {
    const weekEl = document.createElement('div')
    weekEl.className = `week row-${r + 1}`
    for (let c = 0; c < dimensions[0].length; c++) {
      const dayEl = document.createElement('div')
      dayEl.className = `day col-${c + 1}`
      const dateEl = document.createElement('div')
      dateEl.className = 'date'
      dateEl.textContent = dimensions[r][c]
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
setupCalendar()
setupFooter()
