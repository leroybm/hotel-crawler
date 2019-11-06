import { SearchResult } from '../hotelSearch'
import { Page, Browser } from 'puppeteer'

const puppeteer = require('puppeteer')

export interface ScrapperOptions {
  url: string
  selectors: Selectors
  parentSelector?: string
  controlSelector?: string
  timeout?: number
  contentBySelectorType?: object
}

export interface Selectors {
  [type: string]: string
}

export interface ScrapeElementsArg {
  selectors: Selectors
  parentSelector: string
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

module.exports = {scrap}
