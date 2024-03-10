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
    if (key == 'target_on') {
      const thisData = value.slice(5, 10) + '-' + value.slice(0, 4)
      thisData.replace(/-/g, '/')
    } else {
      object[key] = value
    }
  })
  var json = JSON.stringify(object)
  fetch('http://127.0.0.1:8000/items/create', {
    method: 'POST',
    headers: new Headers({ 'content-type': 'application/json' }),
    body: json,
  })
    .then((response) => {
      if (response.ok) {
        console.log('Event added successfully!')
        modal.classList.add('hidden')
      } else {
        console.error('Error adding event:', response.statusText)
      }
    })
    .catch((error) => {
      console.error('Error adding event:', error)
    })
})
