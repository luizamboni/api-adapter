

class ApiAdapter {
  constructor(config) {
    this.config = config
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
    
    if(tail.length > 0)
      obj[head] = this._buildPathInObject(tail.join("."), obj[head], value)
    else 
      obj[head] = value
    
    return obj
  }

  _buildQuery(req) {
    
    const queries = this.config
                  .properties
                  .filter(p => p.to.startsWith("query."))

    const newQ = {}
    
    for(const q of queries) {
      const { from, to } = q
      const queryKey = to.replace(/^query\./, "")
      this._buildPathInObject(queryKey, newQ, this._getPathValue(from, req))
    }
    return newQ
  }

  _buildData(req) {
    
    const queries = this.config
                  .properties
                  .filter(p => p.to.startsWith("data."))

    const newQ = {}
    
    for(const q of queries) {
      const { from, to } = q
      const queryKey = to.replace(/^data\./, "")
      this._buildPathInObject(queryKey, newQ, this._getPathValue(from, req))
    }
    return newQ
  }


  _buildHeader(req) {
    const queries = this.config
    .properties
    .filter(p => p.to.startsWith("headers."))

    const newQ = {}

    for(const q of queries) {
    const { from, to } = q
    const queryKey = to.replace(/^headers\./, "")
    this._buildPathInObject(queryKey, newQ, this._getPathValue(from, req))
    }
    return newQ
  }

  fromApi(req) {
    const { host, path, method = "GET" } = this.config

    const uri =  [ host, path ].join("")
    const query = this._buildQuery(req)
    const headers = this._buildHeader(req)
    const data = this._buildData(req)

    return {
      method,
      uri,
      query,
      headers,
      data
    }
  }
}

module.exports = ApiAdapter
