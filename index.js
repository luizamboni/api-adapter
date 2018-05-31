"use strict"

const EventEmitter = require('events');

const parseProperties = require("./parser-properties")

class ApiAdapter {
  constructor(config, middleware) {
    this.config = config
    this.middleware = middleware
    this.emitter = new EventEmitter()
  }

  compile() {
    const { host, path, method, request } = this.config
    return new Function("data",
      `
      const newData ={
        method: "${method}",
        url: "${[ host, path ].join("")}"
      };
      
      
      return newData;
    `)
  }

  parseRequest(data) {
    const { host, path, method = "GET", request } = this.config

    const newResp = parseProperties(request, data, data, { middleware: this.middleware })

    newResp.method = method
    newResp.url = [ host, path ].join("")
    return newResp
  }

  parseResponse(data) {
    const { host, path, method = "GET", response } = this.config

    const newResp = parseProperties(response, data, data, { middleware: this.middleware })
    return newResp
  }
}

module.exports = ApiAdapter
