

class ApiAdapter {
  constructor(config, middleware) {
    this.config = config
    this.middleware = middleware
  }

  _getPathValue(path, obj) {
    const [ head, ...tail ] = path.split(".")
    
    const value = obj[head]

    if(tail.length > 0)
      return this._getPathValue(tail.join("."), value)
    else
      return value
  }

  _buildPathInObject(path, obj, value) {
    const [ head, ...tail ] = path.split(".")


    if(!obj[head]) 
      obj[head] = {}
    
    obj[head] = (tail.length > 0) ? this._buildPathInObject(tail.join("."), obj[head], value) : value

    return obj
  }

  _convertProverties(toKey, req) {
    const queries = this.config
                        .properties
                        .filter(p => p.to.startsWith(`${toKey}.`))

    const newQ = {}

    for(const q of queries) {
      const { from, to, value, middleware = [], required } = q
      
      const queryKey = to.replace(new RegExp(`^${toKey}\.`), "")      

      let value2 = value || this._getPathValue(from, req)

      if(!value2 && required)
        throw new Error(`${to} is required`)

      middleware.forEach(funcName => {
        value2 = this.middleware[funcName](value2)
      })

      this._buildPathInObject(queryKey, newQ, value2)
    }
    return newQ
  }

  fromApi(req) {
    const { host, path, method = "GET" } = this.config

    const toConvert =  Array.from(new Set(this.config.properties.map(p => p.to.split(".")[0] ) ))
    const uri =  [ host, path ].join("")

    const resp = {
      method,
      uri,
    }

    toConvert.forEach(to => {
      resp[to] = this._convertProverties(to, req)
    })

    return resp

    // const query = this._buildQuery(req)
    // const headers = this._buildHeader(req)
    // const data = this._buildData(req)
    // return {
    //   method,
    //   uri,
    //   query,
    //   headers,
    //   data
    // }
  }
}

module.exports = ApiAdapter
