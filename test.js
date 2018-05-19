const ApiAdapter = require("./index")

const config = {
  name: "home1",
  host: "https://b2ads.ad5track.com",
  path: "/ad_products/top",
  method: "GET",
  properties: [
    { from: "headers.referrer", to: "query.referrer" },
    { from: "query.size" , to: "query.limit"},
    { from: "query.userId" , to: "query.user_id"},
    { value: "json" , to: "query.t" },
    { from: "query.terms", to: "query.q",  middleware: [ "threeFirstWords" ] },
    { from: "query.type", to: "query.type", required: true }
  ]
}

const middlewares = {
  threeFirstWords: terms => terms.split(" ").slice(0,3).join(" ") 
}

const apiAdapter = new ApiAdapter(config, middlewares)


console.log(apiAdapter.fromApi({
  headers: { referrer: "http://www.americanas.com "},
  query: { 
    size: 10,
    userId: 30,
    terms: "notebook asus 16gb blabla bla",
    type: "supplier"
  }
}))