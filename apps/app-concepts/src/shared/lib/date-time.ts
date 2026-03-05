import type { TFunction } from 'i18next'
import { useMemo } from 'react'

type FormatTimeFormat = 'short'

const DEFAULT_FORMAT_TIME_FORMAT: FormatTimeFormat = 'short'

type FormatTimeOptions = {
  format: FormatTimeFormat
}

export const getTimeFormatter = (options?: FormatTimeOptions) => {
  const timeStyle = options?.format ?? DEFAULT_FORMAT_TIME_FORMAT
  return new Intl.DateTimeFormat('default', { timeStyle })
}

type FormatDateFormat = 'short' | 'long'

const DEFAULT_FORMAT_DATE_FORMAT: FormatDateFormat = 'short'

type FormatDateOptions = {
  format: FormatDateFormat
}

export const getDateFormatter = (options?: FormatDateOptions) => {
  const dateStyle = options?.format ?? DEFAULT_FORMAT_DATE_FORMAT
  return new Intl.DateTimeFormat('default', { dateStyle })
}

/**
 * @note Return null if the date is invalid
 */
export const formatDtaeTime = (formatter: Intl.DateTimeFormat, date: Date | string | number): string | null => {
  const dateToFormat = date instanceof Date ? date : new Date(date)
  return Number.isNaN(dateToFormat.getTime()) ? null : formatter.format(dateToFormat)
}

export const useFormattedTime = (date: Date | string | number, options?: FormatTimeOptions) => {
  const formatter = useMemo(() => getTimeFormatter(options), [options])
  return useMemo(() => formatDtaeTime(formatter, date), [formatter, date])
}

export const normalizeDate = (date: Date | number): Date => {
  const dateObj = date instanceof Date ? date : new Date(date)
  return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate())
}

const getDasyDiff = (now: Date | number, toLocalize: Date | number): number => {
  const nowDate = now instanceof Date ? now : new Date(now)
  const toLocalizeDate = toLocalize instanceof Date ? toLocalize : new Date(toLocalize)

  const nowNormalized = normalizeDate(nowDate)
  const toLocalizeNormalized = normalizeDate(toLocalizeDate)

  const timeDiff = nowNormalized.getTime() - toLocalizeNormalized.getTime()
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24))
}

export const localizeRelativeDate = (
  translate: TFunction,
  now: Date | number | string,
  toLocalize: Date | number | string,
): string => {
  const dateToLocalize = new Date(toLocalize)
  const dateNow = new Date(now)
  const daysDiff = getDasyDiff(dateNow, dateToLocalize)

  if (daysDiff === 0) return translate('today')
  else if (daysDiff === 1) return translate('yesterday')
  else {
    const dateFormatter = getDateFormatter({ format: 'long' })
    return dateFormatter.format(dateToLocalize)
  }
}

export const isSameDate = (date1: Date | number | string, date2: Date | number | string): boolean => {
  const date1ToCompare = date1 instanceof Date ? date1 : new Date(date1)
  const date2ToCompare = date2 instanceof Date ? date2 : new Date(date2)
  return date1ToCompare.toDateString() === date2ToCompare.toDateString()
}
