jest.mock('puppeteer')

const puppeteer = require('puppeteer')
const {
  scrap,
  getPage,
  executeScriptOnPage,
  CONTENT_ACESSOR_BY_NODE_TYPE,
  DEFAULT_TIMEOUT,
} = require('../scrapper')

describe('Scrapper - getPage()', () => {
  const url = 'https://mockurl.com/'
  let getPageReturn

  beforeAll(async () => {
    getPageReturn = await getPage(url)
  })

  it('should launch a puppeteer instance', () => {
    expect(puppeteer.launch).toHaveBeenCalledTimes(1)
  })

  it('should launch a new page', () => {
    expect(getPageReturn.browser.newPage).toHaveBeenCalledTimes(1)
  })

  it('should go to the parameter page', () => {
    expect(getPageReturn.page.goto).toHaveBeenCalledWith(url, expect.anything())
  })
})

describe('Scrapper - executeScriptOnPage()', () => {
  let getPageReturn

  beforeAll(async () => {
    getPageReturn = await getPage()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('throws if options is incomplete', async () => {
    const options = {}

    try {
      await executeScriptOnPage(getPageReturn.page, options, () => {})
    } catch (error) {
      expect(error.message).toEqual(
        'Options has incomplete set of required properties',
      )
      expect(error instanceof Error).toBeTruthy()
    }
  })

  it('must work passing only the required parameters on option', async () => {
    const options = { url: '', selectors: {} }
    const script = jest.fn(() => 'worked')

    const result = await executeScriptOnPage(
      getPageReturn.page,
      options,
      script,
    )

    expect(result).toBe('worked')
    expect(script).toHaveBeenCalled()
    expect(getPageReturn.page.waitForSelector).toBeCalledWith('html', {
      timeout: DEFAULT_TIMEOUT,
    })
    expect(getPageReturn.page.evaluate).toBeCalledWith(script, {
      selectors: options.selectors,
      parentSelector: '',
      contentAcessorByType: {
        ...CONTENT_ACESSOR_BY_NODE_TYPE,
      },
    })
  })

  it("throws if control selector isn't found or timeout is hit", async () => {
    const options = { url: '', selectors: {} }
    getPageReturn.page.waitForSelector = jest.fn(() => {
      // waitForSelector real implentation will throw
      throw new Error('throwed')
    })

    try {
      await executeScriptOnPage(getPageReturn.page, options, () => {})
    } catch (error) {
      expect(error.message).toEqual('throwed')
      expect(error instanceof Error).toBeTruthy()
    }

    getPageReturn.page.waitForSelector = jest.fn()
  })

  it('evaluates script with right params and returns script return', async () => {
    const options = {
      url: '',
      selectors: {
        price: '.price',
      },
      parentSelector: '.parent',
      contentBySelectorType: {
        price: 'textContent',
      },
    }
    const expectedParams = {
      selectors: options.selectors,
      parentSelector: options.parentSelector,
      contentAcessorByType: {
        ...CONTENT_ACESSOR_BY_NODE_TYPE,
        ...options.contentBySelectorType,
      },
    }
    const script = jest.fn(x => x)

    const result = await executeScriptOnPage(
      getPageReturn.page,
      options,
      script,
    )

    expect(script).toBeCalledWith(expectedParams)
    expect(getPageReturn.page.evaluate).toHaveBeenCalled()
    expect(result).toEqual(expectedParams)
  })
})

describe('Scrapper - scrap()', () => {
  let options = { url: '', selectors: {} }

  it("runs the scrapperFunction and returns it's result", async () => {
    const scrapperFunction = jest.fn(() => 'scrapperFunction return')

    const result = await scrap(options, scrapperFunction)

    expect(scrapperFunction).toBeCalled()
    expect(result).toBe('scrapperFunction return')
  })
})
