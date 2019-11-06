/**
 * Request params
 */
export interface SearchOptions {
  checkin: string
  checkout: string
  source?: string
}

/**
 * Request response
 */
export interface SearchResult {
  name: string
  price: number
  description: string
  images: Array<string>
}

/**
 * Verifies if it's a valid source
 */
function isValidSource(source: string): boolean {
  return /^[a-zA-Z0-9-]+$/g.test(source)
}

/**
 * Searching specifically in le canton hotels
 */
async function searchHotels(
  searchOptions: SearchOptions,
): Promise<Array<SearchResult>> {
  try {
    const { scrapper } = require(`./parsers/${(isValidSource(
      searchOptions.source,
    ) &&
      searchOptions.source) ||
      'default'}`)
    return scrapper(searchOptions)
  } catch (error) {
    throw new Error('Invalid source')
  }
}

module.exports = searchHotels
