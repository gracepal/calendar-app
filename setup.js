const data = { message: 'hello from setup file' }

/**
 *
 */
function setupNavbar() {
  // setup current date
  const todayDisplayEl = document.querySelector('.header .today')
  let today = new Date()
  todayDisplayEl.textContent = today
}

/**
 *
 */
function setupCalendar() {
  //
}

/**
 *
 */
function setupFooter() {}

setupNavbar()
