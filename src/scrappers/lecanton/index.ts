import { SearchOptions, SearchResult } from '../../hotelSearch'
import { ScrapeElementsArg } from '../../utils/scrapper'

const {
  urlTemplate,
  selectors,
  parentSelector,
  controlSelector,
  contentBySelectorType,
} = require('./constants')
const { scrap } = require('../../utils/scrapper')
const { buildUrl, normalizeData } = require('./utils')

/**
 * Scrapes over each element parentSelector, using the selectors as data sources
 * Uses contentAcessorByType to know where the data is in each element
 * Must be 'pure' (using only browser api as source), as it's run in the browser
 */
function scrapperFunction(faucetFromPuppetter: ScrapeElementsArg) {
  const {
    selectors,
    parentSelector,
    contentAcessorByType,
  } = faucetFromPuppetter
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
  scrapperFunction,
}
