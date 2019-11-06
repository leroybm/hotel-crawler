import { SearchResult } from '../../hotelSearch'

/**
 * Normalizes result data
 */
function normalizeData(result: any): SearchResult {
  const parsedNumber = parseFloat(
    String(result.price)
      .replace('R$ ', '')
      .replace(',', '.'),
  )
  return {
    ...result,
    price: (!Number.isNaN(parsedNumber) && parsedNumber) || result.price,
  }
}

/**
 * Parses input date to be used in queryParams
 */
function parseDate(date: string): string {
  const parsedDate = (date && date.replace(/\//g, '')) || ''
  return (parsedDate.length === 8 && parsedDate) || ''
}

/**
 * Build url to scrape based on a template
 */
function buildUrl(template: string, checkin: string, checkout: string): string {
  if (typeof checkin !== 'string' || typeof checkout !== 'string') {
    return ''
  }

  return template
    .replace(/\$checkin/, parseDate(checkin))
    .replace(/\$checkout/, parseDate(checkout))
}

module.exports = {
  normalizeData,
  parseDate,
  buildUrl,
}
