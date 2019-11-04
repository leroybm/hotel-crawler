import { SearchResult } from '../hotelSearch'

const puppeteer = require('puppeteer')

interface Selectors {
  [type: string]: string
  parent: string
}

interface ScrapeElementsArg {
  selectors: Selectors
  CONTENT_BY_NODE_TYPE: Object
}

const TIMEOUT = 10 * 1000

/**
 * Acessor type for each HTML element
 */
const CONTENT_BY_NODE_TYPE = {
  IMG: 'src',
}

/**
 * Gets a running instance of pupeteer's chromium at given url
 *
 * @param {String} url
 */
async function getPage(url: string) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'networkidle2' })
  return { page, browser }
}

/**
 * Function that executes inside the browser to scrap the elemennts
 * Must be pure!
 *
 * @param {Object} faucetFromPupetter
 */
function scrapeElements(faucetFromPupetter: ScrapeElementsArg) {
  const {
    selectors,
    CONTENT_BY_NODE_TYPE: ACESSOR_BY_NODE_NAME,
  } = faucetFromPupetter
  const parentSelector = selectors.parent
  delete selectors.parent
  const scrappedContent = []

  // Pra cada parentSelector
  const parentElements = document.querySelectorAll(parentSelector)
  parentElements.forEach(parentElement => {
    let currentContent = {}

    Object.entries(selectors).forEach(([type, selector]) => {
      const elements = parentElement.querySelectorAll(selector)
      if (!elements.length) {
        return
      }

      if (elements.length === 1) {
        const singleElement = elements[0]
        const nodeAcessor =
          ACESSOR_BY_NODE_NAME[singleElement.nodeName] || 'innerText'
        currentContent[type] = singleElement[nodeAcessor]
        return
      }

      currentContent[type] = Array.from(elements).map(element => {
        const nodeAcessor =
          ACESSOR_BY_NODE_NAME[element.nodeName] || 'innerText'
        return element[nodeAcessor]
      })
    })

    scrappedContent.push(currentContent)
  })

  return scrappedContent
}

/**
 * Execute script on page as soon as parent selector is available
 *
 * @param {Page} page
 * @param {Object[]} selectors
 * @param {String} parent
 * @param {Function} script
 */
async function executeScriptOnPage(
  page,
  selectors,
  script: Function = scrapeElements,
): Promise<Array<SearchResult>> {
  await page.waitForSelector(
    `${selectors.parent} ${selectors.price}:not(:empty)`,
    {
      timeout: TIMEOUT,
    },
  )
  return await page.evaluate(script, {
    selectors,
    CONTENT_BY_NODE_TYPE,
  })
}

/**
 *
 */
async function scrap(
  options: {
    url: string
    selectors: object
  },
  scrapperFunction?: Function,
) {
  const { page, browser } = await getPage(options.url)
  page.on('console', msg => console.log('PAGE LOG:', msg.text()))
  const result = await executeScriptOnPage(
    page,
    options.selectors,
    scrapperFunction,
  )
  browser.close()
  return result
}

export { scrap }
