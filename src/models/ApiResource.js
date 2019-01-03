// const qs = require('qs')
const { api } = require('../lib')

/**
 * Class ApiResource
 */
class ApiResource {
  /**
   * Create new ApiResource instance
   *
   * @param {object} data
   */
  constructor (data = {}) {
    this.ModelName = this.constructor.ModelName
    this.BaseRoute = this.constructor.BaseRoute

    Object.assign(this, data)
  }

  /**
   * Update current ApiResource instance
   *
   * @param {object} data
   * @param {object} [options]
   */
  update (data = {}, options = {}) {
    return api.put(`${this.BaseRoute}/${this.id}`, data, options)
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
    return api.delete(`${this.BaseRoute}/${this.id}`, options)
      .then(resp => this)
  }

  /**
   * API instance
   */
  static get api () {
    return api
  }

  /**
   * ModelName (used to construct BaseRoute)
   *
   * @throws {Error} - Unless this method is extended in subclass
   */
  static get ModelName () {
    throw new Error('Not implemented')
  }

  /**
   * BaseRoute (used as path prefix for API requests)
   */
  static get BaseRoute () {
    return `/${this.ModelName}`
  }

  /**
   * Get a single instance for this ApiResource
   *
   * @param {string} id
   * @param {object} [options]
   */
  static get (id, options = {}) {
    return api.get(`${this.BaseRoute}/${id}`, options)
      .then(resp => resp.json())
      .then(data => new this(data))
  }

  /**
   * Create a new instance of this ApiResource
   *
   * @param {object} data
   * @param {object} [options]
   */
  static create (data = {}, options = {}) {
    return api.post(`${this.BaseRoute}`, data, options)
      .then(resp => resp.json())
      .then(data => new this(data))
  }

  /**
   * Get all instances for this ApiResource
   *
   * @param {object} [options]
   */
  static all (options = {}) {
    return api.get(`${this.BaseRoute}`, options)
      .then(resp => resp.json())
      .then(data => data.map(item => new this(item)))
  }
}

module.exports = ApiResource
