import { SearchOptions, SearchResult } from '../hotelSearch'
import { scrap } from '../utils/scrapper'

/**
 * On a real product the following constants would be
 * available through a configuration API
 */

/**
 * Url template for lecanton search
 */
const urlTemplate: string =
  'https://myreservations.omnibees.com/default.aspx?q=5462&version=MyReservation&sid=3ad97cf9-d771-4783-8ecf-8b1fd87cb0af#/&diff=false&CheckIn=$checkin&CheckOut=$checkout&Code=&group_code=&loyality_card=&NRooms=1&ad=1&ch=0&ag=-'

/**
 * Selectors for the lecanton search scrapping
 */
const selectors = {
  parent: '.roomExcerpt',
  name: '.excerpt h5',
  price: 'h6.bestPriceTextColor',
  description: '.excerpt .description',
  images: '.thumb img',
}

/**
 * Parses input date to be used in queryParams
 */
function parseDate(date: string): string {
  return date.replace(/\//g, '')
}

/**
 * Build url to scrape based on a template
 */
function buildUrl(template: string, checkin: string, checkout: string): string {
  return template
    .replace(/\$checkin/, parseDate(checkin))
    .replace(/\$checkout/, parseDate(checkout))
}

/**
 * Scrapper for lecanton
 */
async function scrapper(
  searchOptions: SearchOptions,
): Promise<Array<SearchResult>> {
  const { checkin, checkout } = searchOptions
  const url = buildUrl(urlTemplate, checkin, checkout)

  return await scrap({
    url,
    selectors,
  })
}

module.exports = {
  scrapper,
}
