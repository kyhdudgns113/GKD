export const shiftDateValue = (startOrEnd: number, shift: number) => {
  const dateStr = startOrEnd.toString()
  const year = parseInt('20' + dateStr.slice(0, 2))
  const month = parseInt(dateStr.slice(2, 4)) - 1
  const day = parseInt(dateStr.slice(4, 6))

  const date = new Date(year, month, day)

  date.setDate(date.getDate() + shift)

  const newYear = date.getFullYear().toString().slice(2)
  const newMonth = (date.getMonth() + 1).toString().padStart(2, '0')
  const newDay = date.getDate().toString().padStart(2, '0')

  return parseInt(`${newYear}${newMonth}${newDay}`)
}
