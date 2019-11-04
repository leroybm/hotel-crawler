const puppeteer = require('puppeteer')

const TIMEOUT = 10 * 1000

/**
 * Acessor type for each HTML element
 */
const CONTENT_BY_NODE_TYPE = {
  url: 'href',
  title: 'innerText',
  body: 'innerText',
  image: 'src',
}

/**
 * Gets a running instance of pupeteer's chromium at given url
 *
 * @param {String} url
 */
async function getPage(url) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()
  await page.goto(url)
  return { page, browser }
}

interface NewsSelector {
  [type: string]: string
}

interface ScrapeElementsArg {
  newsSelector: Array<NewsSelector>
  CONTENT_BY_NODE_TYPE: Object
}

/**
 * Function that executes inside the browser to scrap the elemennts
 * Must be pure
 *
 * @param {Object} faucetFromPupetter
 */
function scrapeElements(faucetFromPupetter: ScrapeElementsArg) {
  const { newsSelector, CONTENT_BY_NODE_TYPE } = faucetFromPupetter
  const scrappedContent = []

  Object.entries(newsSelector).map(([type, selector]: Array<any>) => {
    const elements = document.querySelectorAll(selector)
    if (elements) {
      Array.from(elements).forEach((element, index) => {
        scrappedContent[index] = scrappedContent[index] || {}
        scrappedContent[index][type] = element[CONTENT_BY_NODE_TYPE[type]]
      })
    }
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
  parent = 'body',
  script = scrapeElements,
): Promise<Array<Promise<Element>>> {
  return selectors.map(async newsSelector => {
    try {
      await page.waitForSelector(parent, {
        timeout: TIMEOUT,
      })
      return await page.evaluate(script, {
        newsSelector,
        CONTENT_BY_NODE_TYPE,
      })
    } catch (error) {
      console.error(error)
    }
  })
}

async function scrapNews(options) {
  const { page, browser } = await getPage(options.siteUrl)
  const scrappers = await executeScriptOnPage(
    page,
    options.selectors,
    options.parentSelector,
    scrapeElements,
  )
  const [result]: Array<any> = await Promise.all(scrappers)
  browser.close()
  return result.filter(Boolean)
}

export { scrapNews }
