// Elements
const calendarEl = document.querySelector('.calendar')
const headerMonthEl = document.querySelector('.header .month')
const todayBtnEl = document.querySelector('.header .today')
const prevMonthBtnEl = document.querySelector('.header .previous')
const nextMonthBtnEl = document.querySelector('.header .next')
const monthDisplayEl = document.querySelector('.header .month')
const calendarAddBtnEl = document.querySelector('button#open-modal')
const addItemModalEl = document.querySelector('#modal')
const addItemModalCancelBtnEl = document.querySelector('#modal button[type=button]')
const addItemModalSubmitBtnEl = document.querySelector('#modal button[type=submit]')
const addItemFormEl = document.querySelector('#item-form')
const addItemFormTextInputEl = document.querySelector('#item-text')
const addItemFormDateInputEl = document.querySelector('#target-on')
const toastEl = document.querySelector('.toast')
const toastMssgEl = document.querySelector('.toast .message span')
const toastDetailsEl = document.querySelector('.toast .details')

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

        dayHeaderEl.ariaLabel = `Edit ${dayOfWeek}, ${monthName} ${dimensions[r][c]}, ${sourceDate.getFullYear()}`
        dayHeaderEl.title = `Edit ${dayOfWeek}, ${monthName} ${dimensions[r][c]}, ${sourceDate.getFullYear()}`
        dayHeaderEl.appendChild(dateEl)
        dayHeaderEl.appendChild(toolsBtnEl)
        dayEl.appendChild(dayHeaderEl)
        dayEl.appendChild(dayBodyEl)
      }

      weekEl.appendChild(dayEl)
    }
    calendarEl.appendChild(weekEl)
  }

  setupCalendarData()
}

function setupFooter() {
  // setup current date
  const todayDisplayEl = document.querySelector('.footer .today')
  let today = new Date()
  todayDisplayEl.textContent = today
}

function addItems(items) {
  // console.log('And here are the items', items)

  for (const { id, item: itemStr, status, target_on } of items) {
    const targetDay = parseInt(target_on.split('/')[1])
    const dayEl = document.querySelector(`.day-header[title*=" ${targetDay},"] + .day-body`)
    const itemEl = document.createElement('div')
    itemEl.className = `${status.toLowerCase()} item`
    itemEl.title = itemStr
    itemEl.textContent = itemStr
    itemEl.setAttribute('data-item-id', id)
    dayEl.appendChild(itemEl)
  }
}

async function setupCalendarData(dateVal) {
  const sourceDate = dateVal ?? today
  let monthStr = headerMonthEl.textContent.split(' ')[0]
  let yearStr = headerMonthEl.textContent.split(' ')[1]
  let paramStr = String(Utils.getMonthIndex(monthStr) + 1).padStart(2, '0') + yearStr

  await fetch(`http://127.0.0.1:8000/items/month/${paramStr}`)
    .then((resp) => resp.json())
    .then((data) => {
      console.log('Here is the data', data)
      addItems(data.data)
    })
    .catch((err) => console.error('There was an error', err))
}

function setupDefaultTargetDate() {
  // form field expects format yyyy-mm-dd
  const today = new Date().toLocaleDateString() // default format is mm/dd/yyyy
  const [monthStr, dayStr, yearStr] = today.split('/')
  addItemFormDateInputEl.value = `${yearStr}-${monthStr.padStart(2, '0')}-${dayStr.padStart(2, '0')}`
}

function showToastMessage(message, { itemText, target_on }) {
  toastEl.classList.remove('hidden')
  toastMssgEl.textContent = message

  if (itemText.length > 51) {
    itemText = itemText.slice(0, 48) + ' . . . '
  }
  toastDetailsEl.textContent = itemText

  setTimeout(function () {
    toastEl.classList.add('hidden')
    toastMssgEl.textContent = ''
    toastMssgEl.textContent = ''
  }, 2000)
}

function getActiveDateObj() {
  const activeMonthDate = monthDisplayEl.textContent
  const activeYear = parseInt(activeMonthDate.split(' ')[1])
  const activeMonth = activeMonthDate.split(' ')[0]
  const activeMonthIdx = Utils.getMonthIndex(activeMonth)
  return new Date(activeYear, activeMonthIdx, 1)
}

// Setup
const today = new Date()
setupCalendar(new Date(today.getFullYear(), today.getMonth(), 1))
setupFooter()
setupDefaultTargetDate()
