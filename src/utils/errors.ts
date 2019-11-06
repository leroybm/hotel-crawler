import { Request, Response, NextFunction } from 'express'

export interface Error {
  status: number
  message: string
}

/**
 * Appends a catch to express middleware questions that sends the error to next
 */
const catchErrors = fn => (
  req: Request,
  res: Response,
  next: NextFunction,
): Function => fn(req, res, next).catch(next)

/**
 * Sends an error message as the request response
 */
const sendError = async (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  res.status(error.status || 500)
  res.send({ error: error.message })
}

module.exports = {
  catchErrors,
  sendError,
}
