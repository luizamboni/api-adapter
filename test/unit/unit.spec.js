"use strict"

const { expect } = require("chai")
const ApiAdapter = require("../../index")

describe("ApiAdapter", () => {
  
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
  
  const middlewares = {
    threeFirstWords: terms => terms.split(" ").slice(0,3).join(" ") 
  }
  
  describe(".fromApi", () => {
    
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

    let newRequest

    before(() => {
      newRequest = new ApiAdapter(config, middlewares).fromApi(request)
    })
    
    it(".query", () => {
      expect(newRequest).to.be.eqls({ 
        method: 'GET',
        uri: 'https://b2ads.ad5track.com/ad_products/top',
        query: { 
          referrer: 'http://www.americanas.com',
          limit: 10,
          user_id: 30,
          t: 'json',
          q: 'notebook asus 16gb',
          type: 'supplier' 
        }
      })
    })
    
  })
})
