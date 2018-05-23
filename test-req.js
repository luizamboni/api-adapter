const ObjectPath = require("object-path");


const config = {
  name: "home1",
  host: "https://b2ads.ad5track.com",
  path: "/ad_products/top",
  method: "GET",
  properties: [
    { from: "headers.referrer", to: "query.referrer" },
    { from: "query.size" , to: "query.limit"},
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

const newRequest = {}
config.properties.forEach(prop => {
  const { to, value, from } = prop
  const value2 = from ? ObjectPath.get(request, from) : value 
  ObjectPath.set(newRequest, to, value2)
  console.log(newRequest)
})




