console.log('hello from scripts')
const todayBtnEl = document.querySelector('button.next + button.today')

todayBtnEl.addEventListener('click', function (e) {
  console.log('clicked on button to go to today')
})
