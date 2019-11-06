import { Selectors } from '../../utils/scrapper'

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

module.exports = {
  urlTemplate,
  selectors,
  parentSelector,
  controlSelector,
  contentBySelectorType,
}
