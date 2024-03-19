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

calendarAddBtnEl.addEventListener('click', function () {
  addItemModalEl.classList.toggle('hidden')

  if (!addItemModalEl.classList.contains('hidden') && addItemFormDateInputEl.value === '') {
    let today = new Date()
    let formattedDate = today.toISOString().slice(0, 10)
    addItemFormDateInputEl.value = formattedDate
  }
})

addItemModalCancelBtnEl.addEventListener('click', function () {
  addItemModalEl.classList.add('hidden')
})

addItemModalSubmitBtnEl.addEventListener('click', function (e) {
  e.preventDefault()

  console.log('text:', addItemFormTextInputEl.value)
  const textIsEmpty = addItemFormTextInputEl.value.trim() == ''
  const dateIsEmpty = addItemFormDateInputEl.value == ''

  if (textIsEmpty) {
    addItemFormTextInputEl.classList.add('error')
  } else {
    addItemFormTextInputEl.classList.remove('error')
  }
  if (dateIsEmpty) {
    addItemFormDateInputEl.classList.add('error')
  } else {
    addItemFormDateInputEl.classList.remove('error')
  }

  if (textIsEmpty || dateIsEmpty) return

  const formData = new FormData(addItemFormEl)
  console.log('here is form data', formData)
  for (const pair of formData.entries()) {
    console.log(pair[0] + ', ' + pair[1])
  }

  var object = {}
  formData.forEach(function (value, key) {
    console.log(`value="${value}" key="${key}"`)
    if (key == 'target_on') {
      // '2024-03-08' -> '03-08-2024' for march
      const [yyyyPart, mmPart, ddPart] = value.split('-')
      object[key] = `${mmPart}/${ddPart}/${yyyyPart}`
    } else {
      object[key] = value
    }
  })
  var json = JSON.stringify(object)
  console.log('====>>>>', json)
  fetch('http://127.0.0.1:8000/items/create', {
    method: 'POST',
    headers: new Headers({ 'content-type': 'application/json' }),
    body: json,
  })
    .then((response) => {
      if (response.ok) {
        addItemFormEl.reset()
        addItemModalEl.classList.add('hidden')

        setupCalendar(getActiveDateObj())
        showToastMessage('Item successfully added to the calendar', {
          itemText: '',
          target_on: '',
        })
      } else {
        console.error('Error adding event:', response.statusText)
      }
    })
    .catch((error) => {
      console.error('Error adding event:', error)
    })
})

getModifyDayButtons().forEach((btnEl) => {
  btnEl.addEventListener('click', function (e) {
    console.log(`INFO: triggered event listener onclick day Modify button`)
    const editBtnEl = e.target.parentNode
    const ariaLabel = editBtnEl.ariaLabel
    const dateobj = Utils.ariaLabelDateStrToDateObj(ariaLabel)
    openUpdateModal(dateobj, {})
  })
})

updateDayModalResetBtnEl.addEventListener('click', function (e) {
  updateForm.reset()
})

updateDayModalUpdateBtnEl.addEventListener('click', function (e) {
  console.log('clicked on update day modal - UPDATE button')
})

updateDayModalDeleteBtnEl.addEventListener('click', async function (e) {
  console.log('clicked on update day modal - DELETE button')
  const deleteTargetId = document.querySelector('form .info span:first-of-type').textContent
  const selectedItemEl = document.querySelector('.day-item.selected')
  const selectedItemId = selectedItemEl.getAttribute('data-id')
  const selectedItemText = selectedItemEl.textContent
  const selectedItemCreatedOn = selectedItemEl.getAttribute('data-created-on')
  const selectedItemTargetOn = selectedItemEl.getAttribute('data-target-on')
  const selectedStatus = document.querySelector('.status-counts button.selected').getAttribute('title').split(' ')[0].toUpperCase()
  const selectedDateObj = Utils.dateobjFromStandardFormatStr(selectedItemTargetOn)
  await deleteItemUsingItemId(deleteTargetId)
  showToastMessage('Item successfully removed from calendar', {
    itemText: selectedItemText,
    target_on: selectedItemTargetOn,
  })
  refreshItemsData(selectedDateObj, { selectedStatus: selectedStatus })
  refreshCalendar()
})

udpateDayModalAllCountEl.addEventListener('click', function (e) {
  console.log('clicked on update day modal - ALL status items count')
  const modalEl = e.target.closest('.modal')
  const datestr = modalEl.getAttribute('data-date')
  const dateobj = Utils.dateobjFromStandardFormatStr(datestr)
  refreshItemsData(dateobj, { selectedStatus: 'ALL' })
})

udpateDayModalActiveCountEl.addEventListener('click', function (e) {
  console.log('clicked on update day modal - ACTIVE status items count')
  const modalEl = e.target.closest('.modal')
  const datestr = modalEl.getAttribute('data-date')
  const dateobj = Utils.dateobjFromStandardFormatStr(datestr)
  refreshItemsData(dateobj, { selectedStatus: 'ACTIVE' })
})

udpateDayModalCompletedCountEl.addEventListener('click', function (e) {
  console.log('clicked on update day modal - COMPLETED status items count')
  const modalEl = e.target.closest('.modal')
  const datestr = modalEl.getAttribute('data-date')
  const dateobj = Utils.dateobjFromStandardFormatStr(datestr)
  refreshItemsData(dateobj, { selectedStatus: 'COMPLETED' })
})

udpateDayModalCancelledCountEl.addEventListener('click', function (e) {
  console.log('clicked on update day modal - CANCELLED status items count')
  const modalEl = e.target.closest('.modal')
  const datestr = modalEl.getAttribute('data-date')
  const dateobj = Utils.dateobjFromStandardFormatStr(datestr)
  refreshItemsData(dateobj, { selectedStatus: 'CANCELLED' })
})

udpateDayModalInactiveCountEl.addEventListener('click', function (e) {
  console.log('clicked on update day modal - INACTIVE status items count')
  const modalEl = e.target.closest('.modal')
  const datestr = modalEl.getAttribute('data-date')
  const dateobj = Utils.dateobjFromStandardFormatStr(datestr)
  refreshItemsData(dateobj, { selectedStatus: 'INACTIVE' })
})

document.addEventListener('click', async function (e) {
  console.log(`Clicked x,y ${e.clientX}, ${e.clientY}`)

  if (e.target.classList.contains('item')) {
    const itemEl = e.target
    const itemStatus = itemEl.className.replace(/item/, '').trim()
    const itemText = itemEl.textContent
    const itemId = itemEl.getAttribute('data-item-id')
    const itemDayAriaLabel = itemEl.parentNode.parentNode.getAttribute('aria-label')
    const itemDateobj = Utils.ariaLabelDateStrToDateObj(itemDayAriaLabel)

    console.log(`Clicked on item "${itemText}" with status "${itemStatus}" and id "${itemId}"`)
    // Click target is trash icon -> removes item from calendar
    const trashIconWidth = 16 // as of now
    const itemRect = itemEl.getBoundingClientRect()
    const rightEdge = itemRect.right - trashIconWidth
    if (e.clientX >= rightEdge && e.clientX <= itemRect.right) {
      await fetch(`http://127.0.0.1:8000/items/delete/${itemId}`, {
        method: 'DELETE',
      })
        .then((resp) => resp.json())
        .then((data) => {
          setupCalendar()
          showToastMessage('Item successfully removed from calendar', {
            itemText: itemText,
            target_on: itemEl.parentNode.parentNode.ariaLabel,
          })
        })
        .catch((err) => console.error('There was an error', err))
    }
    // Click target is item -> opens update item modal
    else {
      console.log('clicked on item - opening item edit modal')
      openUpdateModal(itemDateobj)
    }
  }
  // Update Day Modal
  else if (e.target.classList.contains('update-day-modal')) {
    console.log('clicked within update day modal - close xmark')
    closeUpdateModal()
  } else if (e.target.classList.contains('day-item')) {
    const itemData = readItemData(e)
    selectItemInUpdateDayModal(itemData)
    console.log(`clicked day item: ${itemData.item} with id ${itemData.id}`)
  }
})

document.addEventListener('dblclick', function (e) {
  console.log('Double clicked')
  console.log(`Clicked x,y ${e.clientX}, ${e.clientY}`)
  if (e.target.classList.contains('day-item')) {
    console.log('clicked on update modal day item')
    // selectItemInUpdateDayModal(readItemData())
  }
})

updateDayModalResetBtnEl.addEventListener('click', function () {
  clearUpdateCalendarModalForm()
})
