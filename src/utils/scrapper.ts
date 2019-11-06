import { SearchResult } from '../hotelSearch'
import { Page, Browser } from 'puppeteer'

const puppeteer = require('puppeteer')

export interface ScrapperOptions {
  /** Url to be crawled */
  url: string
  /** Selectors that will be scrapped for data */
  selectors: Selectors
  /** Parent selector for each element that will have it's selectors scrapped for data */
  parentSelector?: string
  /** Scrapper will wait for this selector to return something to scrape all data */
  controlSelector?: string
  /** Timeout for the whole scrapping process */
  timeout?: number
  /** Map of a type of selector to the getter of the selector's data. Property must match `selectors` property */
  contentBySelectorType?: object
}

export interface Selectors {
  /** Selector for data to be scrapped, will be mapped to the result */
  [type: string]: string
}

export interface ScrapeElementsArg {
  /** Object of Selectors */
  selectors: Selectors
  /** Parent selector for each element that will have it's selectors scrapped for data */
  parentSelector: string
  /** Map of a type of selector to the getter of the selector's data. Property must be a `selectors` property or nodeName */
  contentAcessorByType: object
}

const DEBUG: boolean = process.env.NODE_ENV === 'development'

const DEFAULT_TIMEOUT: number = 10 * 1000

/**
 * Acessor type for each HTML element
 */
const CONTENT_ACESSOR_BY_NODE_TYPE: object = {
  IMG: 'src',
  A: 'href',
}

/**
 * Gets a running instance of pupeteer's chromium at given url
 */
async function getPage(url: string): Promise<{ page: Page; browser: Browser }> {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'networkidle2' })
  return { page, browser }
}

/**
 * Execute script on page as soon as parent selector is available
 */
async function executeScriptOnPage(
  page: Page,
  options: ScrapperOptions,
  script: Function | string | any,
): Promise<Array<SearchResult>> {
  const controlSelector =
    options.controlSelector || options.parentSelector || 'html'

  await page.waitForSelector(controlSelector, {
    timeout: options.timeout || DEFAULT_TIMEOUT,
  })

  return await page.evaluate(script, {
    selectors: options.selectors,
    parentSelector: options.parentSelector || '',
    contentAcessorByType: {
      ...CONTENT_ACESSOR_BY_NODE_TYPE,
      ...(options.contentBySelectorType || {}),
    },
  })
}

/**
 * Scrapes a page given options for scrapper behaviours and
 * function to be called on page
 */
async function scrap(options: ScrapperOptions, scrapperFunction: Function) {
  const { page, browser } = await getPage(options.url)
  if (DEBUG) {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()))
  }
  const result = await executeScriptOnPage(page, options, scrapperFunction)
  browser.close()
  return result
}

module.exports = { scrap }
