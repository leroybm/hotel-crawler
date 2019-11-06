import { Request, Response } from 'express'

const { catchErrors } = require('./utils/errors')

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
    const scrapperModule =
      (isValidSource(searchOptions.source) && searchOptions.source) || 'default'
    const { scrapper } = require(`./scrappers/${scrapperModule}`)
    return scrapper(searchOptions)
  } catch (error) {
    throw new Error('Invalid source')
  }
}

/**
 * Handles the search request
 */
const handleSearchRequest = catchErrors(async (req: Request, res: Response) => {
  if (!req.body) throw new Error('Empty Body')
  const result: Array<object> = await searchHotels(req.body)
  res.send(result)
})

module.exports = {
  handleSearchRequest,
  searchHotels,
  isValidSource,
}
