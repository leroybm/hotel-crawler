/** es */
import { SearchOptions, SearchResult } from '../hotelSearch'

const urlTemplate: string =
  'https://myreservations.omnibees.com/default.aspx?q=5462&version=MyReservation&sid=3ad97cf9-d771-4783-8ecf-8b1fd87cb0af#/&diff=false&CheckIn=$checkin&CheckOut=$checkout&Code=&group_code=&loyality_card=&NRooms=1&ad=1&ch=0&ag=-'

/**
 * Parses input date to be used in queryParams
 */
function parseDate(date: string): string {
  return date.replace(/\//g, '')
}

function buildUrl(template: string, checkin: string, checkout: string): string {
  return template
    .replace(/\$checkin/, parseDate(checkin))
    .replace(/\$checkout/, parseDate(checkout))
}

function scrapper(searchOptions: SearchOptions): Array<SearchResult> {
  const { checkin, checkout } = searchOptions
  const url = buildUrl(urlTemplate, checkin, checkout)
  console.log(url)

  return [
    {
      name: '',
      price: 0,
      description: '',
      images: [''],
    },
  ]
}

module.exports = {
  scrapper,
}
