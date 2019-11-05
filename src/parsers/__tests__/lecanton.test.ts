const { JSDOM } = require('jsdom')
const {
  parseDate,
  buildUrl,
  scrapperFunction,
  scrapper,
} = require('../lecanton')

describe('Lecanton Parser - parseDate()', () => {
  it('returns a date in numbers only', () => {
    expect(parseDate('12/34/5678')).toBe('12345678')
    expect(parseDate('12345678')).toBe('12345678')
  })

  it('returns an empty string if arrity is 0', () => {
    expect(parseDate()).toBe('')
  })

  it('returns an empty string if result has bad length', () => {
    expect(parseDate('123/456/567')).toBe('')
    expect(parseDate('1236567')).toBe('')
  })
})

describe('Lecanton Parser - buildUrl()', () => {
  let url: string

  beforeEach(() => {
    url = 'https://test.jest/buscar?checkin=$checkin&checkout=$checkout'
  })

  it('returns a string with the proper dates in', () => {
    expect(buildUrl(url, '12345678', '98765432')).toBe(
      'https://test.jest/buscar?checkin=12345678&checkout=98765432',
    )
  })

  it('returns an empty string if any argument is invalid', () => {
    expect(buildUrl(url, false, '98765432')).toBe('')
    expect(buildUrl(url, '123', {})).toBe('')
  })
})

describe('Lecanton Parser - scrapperFunction()', () => {
  let faucet = {
    selectors: {
      price: '.price',
    },
    parentSelector: '.parent',
    contentAcessorByType: {},
  }

  it('returns empty array if no parent element is found', () => {
    Object.defineProperty(global, 'document', {
      value: {
        querySelectorAll: jest.fn().mockReturnValueOnce([]),
      },
      writable: true,
    })

    expect(scrapperFunction(faucet)).toEqual([])
  })

  it('returns an array with an empty object if parents is found and children not found', () => {
    const dom = new JSDOM('<div class="parent"></div>')
    const parent = dom.window.document.querySelector('.parent')

    Object.defineProperty(global, 'document', {
      value: {
        querySelectorAll: jest.fn().mockReturnValueOnce([parent]),
      },
      writable: true,
    })

    expect(scrapperFunction(faucet)).toEqual([{}])
  })

  it('returns an array with a object with a [property: string]: value: string for single element', () => {
    const dom = new JSDOM(
      '<div class="parent"><p class="price">123456</p></div>',
    )
    const parent = dom.window.document.querySelector('.parent')

    Object.defineProperty(global, 'document', {
      value: {
        querySelectorAll: jest.fn().mockReturnValueOnce([parent]),
      },
      writable: true,
    })

    expect(scrapperFunction(faucet)).toEqual([{ price: '123456' }])
  })

  it('returns an array with a object with a [property: string]: value: Array<string> for multiple elements', () => {
    const dom = new JSDOM(
      '<div class="parent"><p class="price">123456</p><p class="price">987654</p></div>',
    )
    const parent = dom.window.document.querySelector('.parent')

    Object.defineProperty(global, 'document', {
      value: {
        querySelectorAll: jest.fn().mockReturnValueOnce([parent]),
      },
      writable: true,
    })

    expect(scrapperFunction(faucet)).toEqual([{ price: ['123456', '987654'] }])
  })

  it('should access element content by the acessor type given by user', () => {
    const dom = new JSDOM(
      '<div class="parent"><a class="price" href="I don\'t want this">I want this</p></div>',
    )
    const parent = dom.window.document.querySelector('.parent')

    Object.defineProperty(global, 'document', {
      value: {
        querySelectorAll: jest.fn().mockReturnValueOnce([parent]),
      },
      writable: true,
    })

    faucet.contentAcessorByType = {
      price: 'textContent',
    }

    expect(scrapperFunction(faucet)).toEqual([{ price: 'I want this' }])
  })

  it('should access element content by the acessor type of node, if acessor type given by user is not available', () => {
    const dom = new JSDOM(
      '<div class="parent"><a class="price" href="I want this">Now I don\'t want this</p></div>',
    )
    const parent = dom.window.document.querySelector('.parent')

    Object.defineProperty(global, 'document', {
      value: {
        querySelectorAll: jest.fn().mockReturnValueOnce([parent]),
      },
      writable: true,
    })

    // We sould be recieving this from an external module
    faucet.contentAcessorByType = {
      A: 'href',
    }

    expect(scrapperFunction(faucet)).toEqual([{ price: 'I want this' }])
  })

  it('should access element content by textContent as a fallback for no acessor found', () => {
    const dom = new JSDOM(
      '<div class="parent"><p class="price">123456</p></div>',
    )
    const parent = dom.window.document.querySelector('.parent')

    Object.defineProperty(global, 'document', {
      value: {
        querySelectorAll: jest.fn().mockReturnValueOnce([parent]),
      },
      writable: true,
    })

    // We don't know how to acess price's content, se we'll use textContent as the fallback
    faucet.contentAcessorByType = {}

    expect(scrapperFunction(faucet)).toEqual([{ price: '123456' }])
  })
})

describe('Lecanton Parser - scrapper()', () => {
  it("should throw if there's no checkin or checkout", async () => {
    await expect(scrapper({})).rejects.toThrowError()
  })

  it('should throw if the date format is invalid', async () => {
    await expect(
      scrapper({ checkin: '01/01/1001', checkout: '' }),
    ).rejects.toThrowError()
  })
})
