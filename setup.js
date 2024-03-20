// Elements
const calendarEl = document.querySelector('main > .calendar')
const headerMonthEl = document.querySelector('.header .month')
const todayBtnEl = document.querySelector('.header .today')
const prevMonthBtnEl = document.querySelector('.header .previous')
const nextMonthBtnEl = document.querySelector('.header .next')
const monthDisplayEl = document.querySelector('.header .month')
const calendarAddBtnEl = document.querySelector('button#open-modal')
const addItemModalEl = document.querySelector('.modal.add-item-modal ')
const addItemModalCancelBtnEl = document.querySelector('.modal.add-item-modal button[type=button]')
const addItemModalSubmitBtnEl = document.querySelector('.modal.add-item-modal button[type=submit]')
const addItemFormEl = document.querySelector('#add-item-form')
const addItemFormTextInputEl = document.querySelector('#add-item-form #item-text')
const addItemFormDateInputEl = document.querySelector('#add-item-form #target-on')
const toastEl = document.querySelector('#toast.toast')
const toastMssgEl = document.querySelector('#toast.toast .message span')
const toastDetailsEl = document.querySelector('#toast.toast .details')
const modalOverlayEl = document.querySelector('.modal-overlay')
const updateDayModalEl = document.querySelector('.update-day-modal')
const updateDayModalResetBtnEl = document.querySelector('.edit-panel .action-buttons button:first-of-type')
const updateDayModalUpdateBtnEl = document.querySelector('.edit-panel .action-buttons button:nth-of-type(2)')
const updateDayModalDeleteBtnEl = document.querySelector('.edit-panel .action-buttons button:last-of-type')
const udpateDayModalAllCountEl = document.querySelector('.update-day-modal button[title="all count"]')
const udpateDayModalActiveCountEl = document.querySelector('.update-day-modal button[title="active count"]')
const udpateDayModalCompletedCountEl = document.querySelector('.update-day-modal button[title="completed count"]')
const udpateDayModalCancelledCountEl = document.querySelector('.update-day-modal button[title="cancelled count"]')
const udpateDayModalInactiveCountEl = document.querySelector('.update-day-modal button[title="inactive count"]')
const udpateDayModalItemsListEl = document.querySelector('.items-list')
const udpateDayModalStatusCountEls = document.querySelectorAll('.status-counts button span')
const updateForm = document.querySelector('#update-form')

const getModifyDayButtons = () => document.querySelectorAll('button.modify')
const getUpdateDayModalStatusCountButtons = () => document.querySelectorAll('.status-counts button')
const getUpdateDayModalStatusCountEl = (statusKey) => document.querySelector(`.update-day-modal button[title*="${statusKey.toLowerCase()}"]`)
const getUpdateDayModalSelectedItemEl = () => document.querySelector('button.day-item.selected')
const getUpdateDayModalItemsPanelEl = () => document.querySelector('.items-panel')
const getUpdateDayModalSelectedStatusCountEl = () => document.querySelector('.status-counts button.selected')
const getUpdateDayModalSelectedStatusValue = () => document.querySelector('.status-counts button.selected').getAttribute('title').split(' ')[0].toUpperCase()

function refreshCalendar() {
  setupCalendar(getActiveDateObj())
}

function setupCalendar(dateVal) {
  const today = new Date()
  const sourceDate = dateVal ?? today
  const dimensions = Utils.getGridDimensions(sourceDate)
  const monthName = Utils.getMonthName(sourceDate.getMonth())
  calendarEl.textContent = ''

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
  console.log('FUNC: showToastMessage()')
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
  console.log('FUNC: getActiveDateObj()')
  const activeMonthDate = monthDisplayEl.textContent
  const activeYear = parseInt(activeMonthDate.split(' ')[1])
  const activeMonth = activeMonthDate.split(' ')[0]
  const activeMonthIdx = Utils.getMonthIndex(activeMonth)
  return new Date(activeYear, activeMonthIdx, 1)
}

// --------------------------------
// ----- UPDATE MODAL RELATED -----
// --------------------------------

function addStatusCountsToUpdateModal(itemsData, { selectedStatus = 'all' }) {
  // Default selected status bubble is "All" unless specified
  const selectedStatusBtnEl = getUpdateDayModalStatusCountEl(selectedStatus)
  selectedStatusBtnEl.className = 'selected'

  // Count the status
  const statusCounts = {}

  itemsData.forEach((itemData) => {
    const key = itemData.status.toLowerCase()
    statusCounts[key] = (statusCounts[key] || 0) + 1
  })

  // Add status counts to the bubbles
  udpateDayModalAllCountEl.querySelector('span').textContent = itemsData.length
  udpateDayModalActiveCountEl.querySelector('span').textContent = statusCounts['active'] || 0
  udpateDayModalCompletedCountEl.querySelector('span').textContent = statusCounts['completed'] || 0
  udpateDayModalCancelledCountEl.querySelector('span').textContent = statusCounts['cancelled'] || 0
  udpateDayModalInactiveCountEl.querySelector('span').textContent = statusCounts['inactive'] || 0
}

function readItemData(e) {
  return {
    id: e.target.getAttribute('data-id'),
    item: e.target.textContent.trim(),
    status: e.target.getAttribute('data-status'), //'COMPLETED',
    created_on: e.target.getAttribute('data-created-on'), // '03/18/2024',
    target_on: e.target.getAttribute('data-target-on'), // '03/04/2024',
  }
}

function selectItemInUpdateDayModal(selectedItem) {
  console.log(`FUNC: selectItemInUpdateDayModal()`, selectedItem)
  // Clear or reset any prior selected styling
  document.querySelectorAll('.items-list button').forEach((btnEl) => {
    btnEl.classList.remove('selected')
  })
  // Add selected marking to item in items list
  document.querySelector(`.items-list button[data-id="${selectedItem.id}"]`).classList.add('selected')
  // Populate edit panel with selected item data
  document.querySelector('#update-target-on').value = Utils.convertDateStrToYearMonthDay(selectedItem.target_on)
  document.querySelector('#update-item-text').value = selectedItem.item
  document.querySelector('#update-status').value = selectedItem.status.toLowerCase()
  document.querySelector('form .info span:first-of-type').textContent = selectedItem.id
  document.querySelector('form .info span:last-of-type').textContent = selectedItem.created_on
}

function createItemInUpdateModalList(itemData) {
  const { id, item, status, created_on, target_on } = itemData
  const itemBtnEl = document.createElement('button')
  itemBtnEl.className = `day-item ${status.toLowerCase()}`
  itemBtnEl.textContent = item
  itemBtnEl.setAttribute('data-id', id)
  itemBtnEl.setAttribute('data-target-on', target_on)
  itemBtnEl.setAttribute('data-created-on', created_on)
  itemBtnEl.setAttribute('data-status', status)
  return itemBtnEl
}

function addItemsToUpdateModalItemsList(itemsData, { selectItemId = null, selectedStatus = null }) {
  // Clear starting state just in case
  udpateDayModalItemsListEl.textContent = ''
  // Add items
  for (let i = 0; i < itemsData.length; i++) {
    if (selectedStatus != null && selectedStatus.toLowerCase() != 'all' && itemsData[i].status.toLowerCase() != selectedStatus.toLowerCase()) {
      continue
    }
    const itemData = itemsData[i]
    const itemBtnEl = createItemInUpdateModalList(itemData)
    udpateDayModalItemsListEl.appendChild(itemBtnEl)
  }
  // After adding
  const totalItems = udpateDayModalItemsListEl.querySelectorAll('button').length
  if (totalItems == 0) {
    const formContainer = document.querySelector('.form-container')
    const emptyStateIconEl = document.createElement('div')
    emptyStateIconEl.className = 'empty-shrug'
    emptyStateIconEl.textContent = '¯_(ツ)_/¯'
    document.querySelector('#update-form').classList.add('hidden')
    formContainer.appendChild(emptyStateIconEl)

    const emptyStateMessageEl = document.createElement('div')
    emptyStateMessageEl.className = 'empty-message'
    emptyStateMessageEl.textContent = `0 items marked ${selectedStatus}`
    udpateDayModalItemsListEl.appendChild(emptyStateMessageEl)

    updateDayModalResetBtnEl.disabled = true
    updateDayModalUpdateBtnEl.disabled = true
    updateDayModalDeleteBtnEl.disabled = true
  } else {
    document.querySelector('#update-form').classList.remove('hidden')
    updateDayModalResetBtnEl.disabled = false
    updateDayModalUpdateBtnEl.disabled = false
    updateDayModalDeleteBtnEl.disabled = false
    if (selectItemId == null) {
      if (selectedStatus == null || selectedStatus.toLowerCase() == 'all') {
        selectItemId = itemsData[0].id
      } else {
        selectItemId = itemsData.find((itemData) => itemData.status == selectedStatus).id
      }
    }
    const selectedItemData = itemsData.find((itemData) => itemData.id == selectItemId)
    selectItemInUpdateDayModal(selectedItemData)
  }
}

async function refreshItemsData(dateobj, { selectedStatus = 'all', selectItemId = null }) {
  console.log('FUNC: refreshItemsData()')
  const selectedStatusBtnEl = getUpdateDayModalStatusCountEl(selectedStatus)
  const statusCountButtons = getUpdateDayModalStatusCountButtons()
  for (let i = 0; i < statusCountButtons.length; i++) {
    statusCountButtons[i].classList.remove('selected')
  }

  selectedStatusBtnEl.className = 'selected'
  const paramStr = Utils.getDayParamStrFromObj(dateobj)
  const url = `http://127.0.0.1:8000/items/day/${paramStr}`

  await fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
      addStatusCountsToUpdateModal(data.data, { selectedStatus })
      addItemsToUpdateModalItemsList(data.data, { selectedStatus, selectItemId })
    })
    .catch((err) => console.error('There was an error', err))
}

async function openUpdateModal(dateobj, { selectedStatus = 'all', selectedItem = null }) {
  console.log('FUNC: openUpdateModal()')

  const statusCountButtons = getUpdateDayModalStatusCountButtons()
  for (let i = 0; i < statusCountButtons.length; i++) {
    statusCountButtons[i].classList.remove('selected')
  }

  const paramStr = Utils.getDayParamStrFromObj(dateobj)
  const url = `http://127.0.0.1:8000/items/day/${paramStr}`
  await fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
      // show the modal and overlay
      modalOverlayEl.classList.remove('hidden')
      updateDayModalEl.classList.remove('hidden')
      updateDayModalEl.setAttribute('data-date', Utils.dateobjToStandardFormatStr(dateobj))
      addStatusCountsToUpdateModal(data.data, { selectedStatus })
      addItemsToUpdateModalItemsList(data.data, { selectedStatus, selectedItem })
    })
    .catch((err) => console.error('There was an error', err))
}

function closeUpdateModal() {
  console.log('FUNC: closeUpdateModal()')
  updateDayModalEl.classList.add('hidden')
  modalOverlayEl.classList.add('hidden')
  updateDayModalEl.setAttribute('data-date', null)
}

function clearUpdateCalendarModalForm() {
  console.log('FUNC: clearUpdateCalendarModalForm()')
  document.querySelector('#update-target-on').value = ''
  document.querySelector('#update-item-text').value = ''
  document.querySelector('#update-status').value = ''
}

async function deleteItemUsingItemId(itemId) {
  const deleteUrl = `http://127.0.0.1:8000/items/delete/${itemId}`
  await fetch(deleteUrl, { method: 'DELETE' })
    .then((resp) => resp.json())
    .then((data) => console.log('Here data', data))
    .catch((err) => console.log('Error during delete', err))
}

// Setup
const today = new Date()
setupCalendar(new Date(today.getFullYear(), today.getMonth(), 1))
setupFooter()
setupDefaultTargetDate()
