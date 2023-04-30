/**
 * Hypertext Transfer Protocol (HTTP) response status codes.
 * @see {@link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes}
 * @credit {@link https://gist.github.com/scokmen/f813c904ef79022e84ab2409574d1b45}
 */
enum StatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
}

export default StatusCode
