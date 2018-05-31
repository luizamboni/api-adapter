const ApiAdapter = require("./index")
const _ = require("underscore")
const ObjectPath = require("object-path");
const merge = require('deepmerge')


const config = {
  name: "home1",
  host: "https://b2ads.ad5track.com",
  path: "/ad_products/top",
  method: "GET",
  request: [
    { from: "headers.referrer", to: "query.referrer" },
    { from: "query.size" , to: "headers.limit"},
    { from: "query.userId" , to: "query.user_id" , middleware: [ "parseInt" ] },
    { value: "json" , to: "query.t" },
    { from: "query.terms", to: "query.q",  middleware: [ "threeFirstWords" ] },
    { from: "query.type", to: "query.type", required: true }
  ]
}

const request = {
  headers: { 
    referrer: "http://www.americanas.com"
  },
  query: { 
    size: 10,
    userId: "30",
    terms: "notebook asus 16gb blabla bla",
    type: "supplier"
  }
}

const request2 = {
  headers: { 
    referrer: "http://www.shoptime.com"
  },
  query: { 
    size: 10,
    userId: "30",
    terms: "iphone 16gb blabla bla",
    type: "seller"
  }
}

const allMiddlewares = {
  threeFirstWords: (terms, data, allData) => {
    return terms.split(" ").slice(0, 3).join(" ") 
  }
}


function generateFunction(config, middlewares) {


  function applyMiddlewares(middlewares, valueAssign) {
    const [ left, right ] = valueAssign;
    const rightWithMiddleware = middlewares.reduce((prev, state) => 
      `${state}(${right})`
    , right)
    return [ left , rightWithMiddleware ].join(" = ")
  }

  function defineMiddlewares(middlewares) {
    return _(middlewares).keys().map(middlewareName =>
      `const ${middlewareName} = ${middlewares[middlewareName].toString()}`
    ).join(";\n")
  }

  function getProperties(config) {
    return config.map(conf => {
      const { to, from, value, middleware = [] } = conf
      const valueAssign = [ `output.${to}`, `data.${from} || "${value}"` ]

      return applyMiddlewares(middleware, valueAssign)
    }).join(";\n")
  }

  function genObjectsByKeys(dotKeys, obj = {}) {
    const [ head, ...tail ] = dotKeys.split(".")

    if(!obj[head])
        obj[head] = {}
    
    if (tail.length > 0)
      obj[head] = genObjectsByKeys(tail.join("."), obj[head])
    return obj
  }

  function getBaseKeys(config) {
    return merge.all( config.map(conf => genObjectsByKeys(conf.to)))
  }


  return new Function("data",`
    ${defineMiddlewares(middlewares)}
    const output = ${JSON.stringify(getBaseKeys(config),"", 2)};
    ${getProperties(config)}
    return output;
  `)
}

const callback2 = generateFunction(config.request, allMiddlewares)
console.log(callback2.toString())
console.log(callback2(request))
console.log(callback2(request2))