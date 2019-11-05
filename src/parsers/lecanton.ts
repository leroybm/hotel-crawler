import { SearchOptions, SearchResult } from '../hotelSearch'
import { scrap, ScrapeElementsArg } from '../utils/scrapper'

/**
 * On a real product the following constants would be
 * available through a configuration API
 */

const urlTemplate: string =
  'https://myreservations.omnibees.com/default.aspx?q=5462&version=MyReservation&sid=3ad97cf9-d771-4783-8ecf-8b1fd87cb0af#/&diff=false&CheckIn=$checkin&CheckOut=$checkout&Code=&group_code=&loyality_card=&NRooms=1&ad=1&ch=0&ag=-'

const selectors: { [type: string]: string } = {
  name: '.excerpt h5',
  price: 'h6.bestPriceTextColor',
  description: '.excerpt .description',
  images: '.thumb img',
}

const parentSelector: string = '.roomExcerpt'

const controlSelector: string = `${parentSelector} ${selectors.price}:not(:empty)`

const contentBySelectorType: { [type: string]: string } = {
  description: 'textContent',
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
  )
}

module.exports = {
  scrapper,
  parseDate,
  buildUrl,
  scrapperFunction,
}
