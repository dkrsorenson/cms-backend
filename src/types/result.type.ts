import { StatusCode } from './http-status-codes'

// Custom result type for requests
export type Result<T, E> = { result: 'success'; value: T } | { result: 'error'; statusCode: StatusCode; error: E }
