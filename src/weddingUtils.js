const uzbekMonths = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']
const uzbekWeekdays = ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba']

export function getEventDate(wedding) {
  const dateParts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(wedding.date)
  const timeParts = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(wedding.time)
  const offsetParts = /^([+-])(\d{2}):([0-5]\d)$/.exec(wedding.utcOffset)
  if (!dateParts || !timeParts || !offsetParts) return null

  const [, yearText, monthText, dayText] = dateParts
  const [year, month, day] = [yearText, monthText, dayText].map(Number)
  const calendarDate = new Date(Date.UTC(year, month - 1, day))
  if (
    year < 1000 ||
    calendarDate.getUTCFullYear() !== year ||
    calendarDate.getUTCMonth() !== month - 1 ||
    calendarDate.getUTCDate() !== day
  ) return null

  const [, hourText, minuteText] = timeParts
  const [, sign, offsetHours, offsetMinutes] = offsetParts
  const offset = (Number(offsetHours) * 60 + Number(offsetMinutes)) * (sign === '+' ? 1 : -1)
  if (Math.abs(offset) > 14 * 60) return null

  const localTime = Date.UTC(year, month - 1, day, Number(hourText), Number(minuteText))
  return new Date(localTime - offset * 60_000)
}

export function formatWeddingDate(wedding, options = {}) {
  const eventDate = getEventDate(wedding)
  if (!eventDate) return 'Sanani kiriting'

  const [, yearText, monthText, dayText] = /^(\d{4})-(\d{2})-(\d{2})$/.exec(wedding.date)
  const year = Number(yearText)
  const month = Number(monthText)
  const day = Number(dayText)
  const parts = []
  if (options.weekday) parts.push(uzbekWeekdays[new Date(Date.UTC(year, month - 1, day)).getUTCDay()])
  if (options.day && options.month) parts.push(`${day}-${uzbekMonths[month - 1]}`)
  else if (options.day) parts.push(String(day))
  else if (options.month) parts.push(uzbekMonths[month - 1])
  if (options.year) parts.push(`${year}-yil`)
  return parts.join(options.weekday ? ', ' : ' ')
}

export function getCountdownParts(target, now = Date.now()) {
  if (!(target instanceof Date) || !Number.isFinite(target.getTime())) return null
  const remaining = Math.max(0, target.getTime() - now)
  if (remaining === 0) return { arrived: true, units: [] }
  return {
    arrived: false,
    units: [
      ['KUN', Math.floor(remaining / 86_400_000)],
      ['SOAT', Math.floor((remaining / 3_600_000) % 24)],
      ['DAQIQA', Math.floor((remaining / 60_000) % 60)],
      ['SONIYA', Math.floor((remaining / 1000) % 60)],
    ],
  }
}

function escapeIcs(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

function foldIcsLine(line) {
  const folded = []
  const encoder = new TextEncoder()
  let current = ''
  let byteLength = 0
  for (const character of line) {
    const characterBytes = encoder.encode(character).length
    if (byteLength + characterBytes > 75) {
      folded.push(current)
      current = ` ${character}`
      byteLength = characterBytes + 1
    } else {
      current += character
      byteLength += characterBytes
    }
  }
  folded.push(current)
  return folded.join('\r\n')
}

export function createCalendarData(wedding) {
  const start = getEventDate(wedding)
  const durationMinutes = Number(wedding.eventDurationMinutes)
  if (!start || !Number.isFinite(durationMinutes) || durationMinutes <= 0) return null

  const end = new Date(start.getTime() + durationMinutes * 60_000)
  const calendarText = `${wedding.groomName} & ${wedding.brideName} — ${wedding.eventName}`
  const location = [wedding.venue, wedding.address].filter(Boolean).join(', ')
  const utcStamp = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const startStamp = utcStamp(start)
  const endStamp = utcStamp(end)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: calendarText,
    dates: `${startStamp}/${endStamp}`,
    details: wedding.invitationText,
    location,
    ctz: wedding.timeZone,
  })
  const now = utcStamp(new Date())
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Taklifnoma//Nikoh taklifnomasi//UZ',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${start.getTime()}.${encodeURIComponent(wedding.groomName)}@taklifnoma.local`,
    `DTSTAMP:${now}`,
    `DTSTART:${startStamp}`,
    `DTEND:${endStamp}`,
    `SUMMARY:${escapeIcs(calendarText)}`,
    `LOCATION:${escapeIcs(location)}`,
    `DESCRIPTION:${escapeIcs(wedding.invitationText)}`,
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].map(foldIcsLine).join('\r\n')

  return {
    googleUrl: `https://calendar.google.com/calendar/render?${params.toString()}`,
    ics,
    filename: `${wedding.groomName}-${wedding.brideName}-nikoh.ics`
      .toLocaleLowerCase('uz-UZ')
      .replace(/[^a-z0-9.-]/g, '-'),
  }
}
