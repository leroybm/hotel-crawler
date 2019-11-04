/**
 * Request params
 */
interface SearchOptions {
  checkin: string
  checkout: string
  source?: string
}

/**
 * Request response
 */
interface SearchResult {
  name: string
  price: number
  description: string
  images: Array<string>
}

/**
 * Searching specifically in le canton hotels
 */
function searchHotels(searchOptions: SearchOptions): Array<SearchResult> {
  try {
    const { scrapper } = require(`./parsers/${searchOptions.source ||
      'default'}`)
    return scrapper(searchOptions)
  } catch (error) {
    console.error(error)
    throw new Error('Could not find selected source')
  }
}

export default searchHotels
export { SearchOptions, SearchResult }
