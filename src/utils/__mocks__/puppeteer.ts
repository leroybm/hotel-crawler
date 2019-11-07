const puppeteer: any = jest.genMockFromModule('puppeteer')

puppeteer.launch = jest.fn(async () => ({
  newPage: jest.fn(async () => ({
    goto: jest.fn().mockReturnValue(Promise),
    waitForSelector: jest.fn().mockReturnValue(Promise),
    evaluate: jest.fn((x, y) => {
      return new Promise(resolve => resolve(x(y)))
    }),
  })),
  close: jest.fn(),
}))

module.exports = puppeteer

export {}
