class Utils {
  // mapping Date() object's mapping for getDay() -> corresponding string value
  // with the main point being that the values are 0-indexed and start with Sunday
  static dayToStrMapping = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  }
  // mapping a month's 1st *cell nth day value given the dayOfWeek of the month's 1st *day
  static firstCellMapping = {
    // if 1st day of the month is a Sunday (index=0), our first cell can start with 1
    0: 1,
    1: 0,
    2: -1,
    3: -2,
    4: -3,
    // if our 1st day of the month is a Friday (index=5), our first cell starts with -4,
    // because row [  su,  mo,  tu,  we, th, fr, sa] maps as below, where our 1st day starts on Friday
    //             [(-4),(-3),(-2),(-1),(0),  1 , 2]
    //                                       ^^^^^^^
    5: -4,
    6: -5,
  }
  // mapping a month's last day (months are 0-indexed, as per Date().getMonth() outputs)
  static monthLastDayMapping = {
    0: 31, // January
    1: 28, // February
    2: 31,
    3: 30,
    4: 31,
    5: 30,
    6: 31,
    7: 31,
    8: 30,
    9: 31,
    10: 30,
    11: 31, // December
  }
  // Returns name of the month from the month index
  static getMonthName = (monthIndex) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return monthNames[monthIndex]
  }
  // Returns the month index from the month name
  static getMonthIndex = (monthName) => {
    const monthIndices = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    }
    return monthIndices[monthName]
  }
  // Returns boolean whether or not input/current year is leap year
  static isLeapYear = (yearVal) => {
    const year = yearVal ?? new Date().getFullYear()
    if (year % 400 == 0) return true
    else if (year % 100 == 0) return false
    else if (year % 4 == 0) return true
    else return false
  }
  // Returns last day of the month
  static getLastDayInMonth = (dateVal) => {
    const sourceDate = dateVal ?? new Date()
    console.log(sourceDate)
    if (sourceDate.getMonth() == 1 && this.isLeapYear(sourceDate.getFullYear())) {
      return 29 // last day of feb in a leap year is 29
    } else {
      return this.monthLastDayMapping[sourceDate.getMonth()]
    }
  }
  // Returns grid dimensions as a list of rows, containing list of days of the week
  static getGridDimensions = (dateVal) => {
    const sourceDate = dateVal ?? new Date()
    const dateObj = new Date(sourceDate.getFullYear(), sourceDate.getMonth(), 1)
    const month = []
    const lastDay = this.getLastDayInMonth(dateObj)
    let curDay = this.firstCellMapping[dateObj.getDay()]
    while (curDay <= lastDay) {
      const week = []
      for (let i = 0; i < 7; i++) {
        week.push(curDay >= 1 && curDay <= lastDay ? curDay.toString() : '')
        curDay += 1
      }
      month.push(week)
    }
    return month
  }
}
