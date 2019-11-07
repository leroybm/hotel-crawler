import { NextFunction } from 'express-serve-static-core'

const { catchErrors, sendError } = require('../errors')

describe('Errors - catchErrors()', () => {
  it('appends a catch passing next', () => {
    const next = error => {
      expect(error).toBeInstanceOf(Error)
    }

    const noCatch = (req, res, next) =>
      new Promise((_, reject) => reject(new Error(':(')))

    const withCatch = catchErrors(noCatch)

    withCatch(null, null, next)
  })
})

describe('Errors - sendErrors()', () => {
  const res = {
    status: jest.fn(),
    send: jest.fn(),
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should set status as 500 if no error status is passed ', async () => {
    await sendError({}, null, res, null)

    expect(res.status).toBeCalledWith(500)
  })

  it('should set the status to the passed status', async () => {
    await sendError({ status: 404 }, null, res, null)

    expect(res.status).toBeCalledWith(404)
  })

  it('should send an error message', async () => {
    await sendError({ message: 'mockError' }, null, res, null)

    expect(res.send).toBeCalledWith({ error: 'mockError' })
  })
})

export {}
