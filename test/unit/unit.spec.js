"use strict"

const { expect } = require("chai")
const axios = require("axios")
const qs = require("qs")


const ApiAdapter = require("../../index")

describe("ApiAdapter", () => {
  
  const config = {
    name: "home1",
    host: "https://b2ads.ad5track.com",
    path: "/product_ad/top",
    method: "GET",
    properties: [
      { from: "headers.referrer", to: "query.referrer" },
      { from: "query.size", to: "query.limit"},
      { from: "query.userId", to: "query.user_id" , middleware: [ "parseInt" ] },
      { value: "json", to: "query.t" },
      { from: "query.terms", to: "query.q",  middleware: [ "threeFirstWords" ] },
      { from: "query.type", to: "query.type", required: true }
    ],
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

    context("without request callback", () => {
      let newRequest
      const apiAdapter = new ApiAdapter(config, middlewares)

      before(() => {

        newRequest = apiAdapter.fromApi(request)
      })

      it(".query", () => {
        expect(newRequest).to.be.eqls({
          method: 'GET',
          url: 'https://b2ads.ad5track.com/product_ad/top',
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

    context("with request callback", () => {
      let newRequest
      const apiAdapter = new ApiAdapter(config, middlewares)
      let response = null
      
      before(done => {
        apiAdapter.setTransportCallbak(req => {
          return axios.request({
            method: req.method,
            url: `${req.url}?${qs.stringify(req.query)}`
          })
        })
        
        apiAdapter.fromApi(request).then(res => {
          response = res
          done()
        }).catch(err => {
          console.error(err.options)
          done(err)
        })
      })
      
      it("response", () => {
        expect(response.status).to.be.equal(200)
      })
    })
  })
})
