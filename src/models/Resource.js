const qs = require('qs')
const { api } = require('../lib')

class Resource {
  constructor(data = {}) {
    this.ModelName = this.constructor.ModelName
    this.BaseRoute = this.constructor.BaseRoute

    Object.assign(this, data)
  }

  update(data = {}) {
    return api.put(`${this.BaseRoute}/${this.id}`, data)
      .then(resp => resp.json())
      .then(data => {
        Object.assign(this, data)
        return this
      })
  }

  destroy() {
    return api.delete(`${this.BaseRoute}/${this.id}`)
      .then(resp => this)
  }

  static get api() {
    return api
  }

  static get ModelName() {
    throw new Error('Not implemented')
  }

  static get BaseRoute() {
    return `/${this.ModelName}`
  }

  static get(id) {
    return api.get(`${this.BaseRoute}/${id}`)
      .then(resp => resp.json())
      .then(data => new this(data))
  }

  static create(data = {}, params = {}) {
    return api.post(`${this.BaseRoute}?${qs.stringify(params, { encodeValuesOnly: true, arrayFormat: 'brackets' })}`, data)
      .then(resp => resp.json())
      .then(data => new this(data))
  }

  static all(params = {}) {
    return api.get(`${this.BaseRoute}?${qs.stringify(params, { encodeValuesOnly: true, arrayFormat: 'brackets' })}`)
      .then(resp => resp.json())
      .then(data => data.map(item => new this(item)))
  }
}

module.exports = Resource
