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

document.querySelectorAll('button.modify').forEach((btnEl) => {
  btnEl.addEventListener('click', function (e) {
    const editBtnEl = e.target.parentNode
    const ariaLabel = editBtnEl.ariaLabel
    console.log(`Clicked button to "${ariaLabel}"`)
  })
})

document.addEventListener('click', async function (e) {
  if (e.target.classList.contains('item')) {
    const itemEl = e.target
    const itemStatus = itemEl.className.replace(/item/, '').trim()
    const itemText = itemEl.textContent
    const itemId = itemEl.getAttribute('data-item-id')
    console.log(`Clicked on item "${itemText}" with status "${itemStatus}" and id "${itemId}"`)

    // Click target is trash icon -> removes item from calendar
    const trashIconWidth = 16 // as of now
    const itemRect = itemEl.getBoundingClientRect()
    const rightEdge = itemRect.right - trashIconWidth
    if (e.clientX >= rightEdge && e.clientX <= itemRect.right) {
      console.log(`clicked on item trash icon - deleting item from calendar id=${itemId}`)
      await fetch(`http://127.0.0.1:8000/items/delete/${itemId}`, {
        method: 'DELETE',
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log('here the data', data)
          console.log(`Delete item "${itemId}" successfully`)

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
    }
  }
})
