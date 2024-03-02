// Elements
const calendarEl = document.querySelector('.calendar')
const headerMonthEl = document.querySelector('.header .month')
const todayBtnEl = document.querySelector('.header .today')
const prevMonthBtnEl = document.querySelector('.header .previous')
const nextMonthBtnEl = document.querySelector('.header .next')
const monthDisplayEl = document.querySelector('.header .month')

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
  calendarEl.textContent = ''
  calendarEl.style.gridTemplateRows = `repeat(${dimensions.length}, minmax(280px, 1fr));`
  headerMonthEl.textContent = `${monthName} ${sourceDate.getFullYear()}`
  headerMonthEl.ariaLabel = `${monthName} ${sourceDate.getFullYear()}`
  todayBtnEl.title = `${Utils.getMonthName(today.getMonth())} ${today.getFullYear()}`

  const prevMonthDateObj = new Date(sourceDate.getFullYear(), sourceDate.getMonth() - 1, 1)
  prevMonthBtnEl.title = `${Utils.getMonthName(prevMonthDateObj.getMonth())} ${prevMonthDateObj.getFullYear()}`
  const nextMonthDateObj = new Date(sourceDate.getFullYear(), sourceDate.getMonth() + 1, 1)
  nextMonthBtnEl.title = `${Utils.getMonthName(nextMonthDateObj.getMonth())} ${nextMonthDateObj.getFullYear()}`

  for (let r = 0; r < dimensions.length; r++) {
    const weekEl = document.createElement('div')
    weekEl.className = `week row-${r + 1}`
    for (let c = 0; c < dimensions[0].length; c++) {
      const dayOfWeek = Utils.dayToStrMapping[c]
      const dayEl = document.createElement('div')
      dayEl.className = `day col-${c + 1}`

      // no date - grey out background and don't any buttons or text
      if (dimensions[r][c].length == 0) {
        dayEl.className += ' empty'
      }
      // has a date
      else if (dimensions[r][c].length > 0) {
        const dayHeaderEl = document.createElement('div')
        dayHeaderEl.className = 'day-header'
        const dayBodyEl = document.createElement('div')
        dayBodyEl.className = 'day-body'
        const dateEl = document.createElement('div')
        dateEl.className = 'date'
        dateEl.textContent = dimensions[r][c]
        if (sourceDate.getMonth() == today.getMonth() && dimensions[r][c] == today.getDate()) {
          dateEl.className += ' active'
        }

        const toolsBtnEl = document.createElement('button')
        toolsBtnEl.ariaLabel = `Edit ${dayOfWeek}, ${monthName} ${dimensions[r][c]}, ${sourceDate.getFullYear()}`
        toolsBtnEl.title = `Edit ${dayOfWeek}, ${monthName} ${dimensions[r][c]}, ${sourceDate.getFullYear()}`
        toolsBtnEl.className = 'modify'
        const toolsBtnImgEl = document.createElement('img')
        toolsBtnImgEl.src = './assets/icons/ellipses.svg'
        toolsBtnEl.appendChild(toolsBtnImgEl)
        dateEl.title = `${dayOfWeek}, ${monthName} ${dimensions[r][c]}, ${sourceDate.getFullYear()}` // ex. "Saturday, March 2, 2024"
        dayEl.ariaLabel = `${dayOfWeek}, ${monthName} ${dimensions[r][c]}, ${sourceDate.getFullYear()}`
        dayHeaderEl.appendChild(dateEl)
        dayHeaderEl.appendChild(toolsBtnEl)
        dayEl.appendChild(dayHeaderEl)
        dayEl.appendChild(dayBodyEl)
      }

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
setupCalendar(new Date(today.getFullYear(), today.getMonth() - 1, 3))
setupFooter()
