require('dotenv').config()

const qs = require('qs')
const deepmerge = require('deepmerge')
const Api = require('@bowtie/api')

/**
 * Class ApiResource
 */
class ApiResource {
  /**
   * Create new ApiResource instance
   *
   * @param {object} data
   */
  constructor (data = {}, parent = null) {
    Object.assign(this, data)

    this._parent = parent

    if (this._parent && !(this._parent instanceof ApiResource)) {
      throw new Error('parent must be an ApiResource!')
    }
  }

  get _id () {
    return this.id
  }

  get _baseRoute () {
    return this.constructor.buildBaseRoute(this._parent)
  }

  get _resourceRoute () {
    return `${this._baseRoute}/${this._id}`
  }

  get _defaultOptions () {
    return {}
  }

  _options (extra = {}) {
    return deepmerge(this._defaultOptions, extra)
  }

  /**
   * Update current ApiResource instance
   *
   * @param {object} data
   * @param {object} [options]
   */
  update (data = {}, options = {}) {
    return this.api.put(`${this._baseRoute}/${this._id}`, data, this._options(options))
      .then(resp => resp.json())
      .then(data => {
        Object.assign(this, data)
        return this
      })
  }

  /**
   * Destroy the current ApiResource instance
   *
   * @param {object} [options]
   */
  destroy (options = {}) {
    return this.api.delete(`${this._baseRoute}/${this._id}`, this._options(options))
  }

  get routePrefix () {
    return `/${this._baseRoute}/${this._id}`
  }

  static get envConfig () {
    const DEFAULT_HEADERS = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    if (process.env.API_DEFAULT_HEADERS) {
      Object.assign(DEFAULT_HEADERS, qs.parse(process.env.API_DEFAULT_HEADERS))
    }

    /**
     * [HIGH] TODO: Refactor, don't require env setup/usage ...
     */
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

    Object.keys(config).forEach(configKey => {
      if (typeof config[configKey] === 'undefined') {
        delete config[configKey]
      }
    })

    return config
  }

  get api () {
    return this.constructor.api
  }

  /**
   * API instance
   */
  static get api () {
    const config = deepmerge(this.apiConfig || {}, this.envConfig)

    return new Api(config)
  }

  /**
   * baseRoute (used as path prefix for API requests)
   */
  static get baseRoute () {
    throw new Error('Not implemented')
  }

  static buildBaseRoute (parent) {
    let route = this.baseRoute

    if (parent instanceof ApiResource) {
      route = `${parent._resourceRoute}/${route}`
    }

    return route.replace(/\s+/g, '').replace(/\/+/g, '/')
  }

  /**
   * Get a single instance for this ApiResource
   *
   * @param {string} id
   * @param {object} [options]
   */
  static get (id, options = {}, parent = null) {
    return this.api.get(`${this.buildBaseRoute(parent)}/${id}`, options)
      .then(resp => resp.json())
      .then(data => new this(data, parent))
  }

  /**
   * Create a new instance of this ApiResource
   *
   * @param {object} data
   * @param {object} [options]
   */
  static create (data = {}, options = {}, parent = null) {
    return this.api.post(`${this.buildBaseRoute(parent)}`, data, options)
      .then(resp => resp.json())
      .then(data => new this(data, parent))
  }

  /**
   * Get all instances for this ApiResource
   *
   * @param {object} [options]
   */
  static all (options = {}, parent = null) {
    return this.api.get(`${this.buildBaseRoute(parent)}`, options)
      .then(resp => resp.json())
      .then(data => data.map(item => new this(item, parent)))
  }
}

module.exports = ApiResource
