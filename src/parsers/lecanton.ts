import { SearchOptions, SearchResult } from '../hotelSearch'
import { ScrapeElementsArg, Selectors } from '../utils/scrapper'

const { scrap } = require('../utils/scrapper')

/**
 * String for the template of the URL that needs to be crawled
 */
const urlTemplate: string =
  'https://myreservations.omnibees.com/default.aspx?q=5462&version=MyReservation&sid=3ad97cf9-d771-4783-8ecf-8b1fd87cb0af#/&diff=false&CheckIn=$checkin&CheckOut=$checkout&Code=&group_code=&loyality_card=&NRooms=1&ad=1&ch=0&ag=-'

/**
 * Selector for each element that needs to be scrapped (each hotel's room information)
 */
const selectors: Selectors = {
  name: '.excerpt h5',
  price: 'h6.bestPriceTextColor',
  description: '.excerpt .description',
  images: '.thumb img',
}

/**
 * Selector for the parent element (each hotel room)
 */
const parentSelector: string = '.roomExcerpt'

/**
 * Selector for the element that needs to be loaded for the page to be scrapper
 */
const controlSelector: string = `${parentSelector} ${selectors.price}:not(:empty)`

/**
 * Custom data acessor based on the selectors
 */
const contentBySelectorType: { [type: string]: string } = {
  description: 'textContent',
}

/**
 * Normalizes result data
 */
function normalizeData(result: any): SearchResult {
  const parsedNumber = parseFloat(
    String(result.price)
      .replace('R$ ', '')
      .replace(',', '.'),
  )
  result.price = (!Number.isNaN(parsedNumber) && parsedNumber) || result.price
  return result
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

/**
 * Scrapes over each element parentSelector, using the selectors as data sources
 * Uses contentAcessorByType to know where the data is in each element
 * Must be 'pure' (using only browser api as source), as it's run in the browser
 */
function scrapperFunction(faucetFromPupetter: ScrapeElementsArg) {
  const { selectors, parentSelector, contentAcessorByType } = faucetFromPupetter
  const parentElements = document.querySelectorAll(parentSelector)

  return Array.from(parentElements).map(parentElement => {
    return Object.entries(selectors).reduce((content, [type, selector]) => {
      const elements = parentElement.querySelectorAll(selector)
      if (!elements.length) {
        return content
      }

      content[type] = Array.from(elements).map(element => {
        const nodeAcessor: string =
          contentAcessorByType[type] ||
          contentAcessorByType[element.nodeName] ||
          'textContent'
        return element[nodeAcessor]
      })

      content[type] =
        content[type].length === 1 ? content[type][0] : content[type]

      return content
    }, {})
  })
}

/**
 * Scrapper for lecanton
 */
async function scrapper(
  searchOptions: SearchOptions,
): Promise<Array<SearchResult>> {
  const { checkin, checkout } = searchOptions
  if (!checkin || !checkout)
    throw new Error('Checkin and checkout must be filled')

  const url = buildUrl(urlTemplate, checkin, checkout)
  if (!url) throw new Error('Date format incorrect')

  return await scrap(
    {
      url,
      selectors,
      parentSelector,
      controlSelector,
      contentBySelectorType,
    },
    scrapperFunction,
  ).then(result => result.map(normalizeData))
}

module.exports = {
  scrapper,
  parseDate,
  buildUrl,
  scrapperFunction,
  normalizeData,
}
