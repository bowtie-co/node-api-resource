const qs = require('qs')
const Api = require('@bowtie/api')
const { verifyRequired } = require('@bowtie/utils')

const DEFAULT_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

if (process.env.API_DEFAULT_HEADERS) {
  Object.assign(DEFAULT_HEADERS, qs.parse(process.env.API_DEFAULT_HEADERS))
}

verifyRequired(process.env, [
  'API_ROOT_URL'
])

const config = {
  root: process.env.API_ROOT_URL,
  stage: process.env.API_STAGE,
  prefix: process.env.API_PREFIX,
  version: process.env.API_VERSION,
  authorization: process.env.API_AUTHORIZATION || 'None',
  secureOnly: process.env.NODE_ENV === 'production',
  verbose: !!process.env.VERBOSE,
  defaultOptions: {
    headers: DEFAULT_HEADERS
  }
}

module.exports = new Api(config)
