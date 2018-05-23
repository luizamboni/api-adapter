"use strict"

const { expect } = require("chai")
const axios = require("axios")
const qs = require("qs")


const ApiAdapter = require("../../index")

describe("ApiAdapter", () => {

  const config = {
    name: "home1",
    host: "https://b2ads.ad5track.com",
    path: "/product_ad",
    method: "GET",
    request: [
      { from: "headers.referrer", to: "query.referrer" },
      { from: "query.size", to: "query.limit" },
      { from: "query.userId", to: "query.user_id", middleware: [ "parseInt" ] },
      { value: "json", to: "query.t" },
      { value: "americanas", to: "query.publisher" },
      { from: "query.terms", to: "query.q",  middleware: [ "threeFirstWord" ] },
      { from: "query.type", to: "query.type", required: true },
      { value: "americanas", to: "query.publisher" }
    ],
    response: [
      { 
        from: "body", 
        to: "data", 
        properties: [
          { from: "t", to: "title" },
          { from: "u" ,to: "url"},
          { from: "product.id" , to: "product_id"},
        ]
      }
    ]
  }

  const middlewares = {
    threeFirstWord: terms => terms.split(" ").slice(0, 3).join(" ") 
  }

  describe(".parseRequest", () => {

    const request = {
      headers: {
        referrer: "http://www.americanas.com"
      },
      query: {
        size: 10,
        userId: "30",
        terms: "notebook sansumg 15 16gb blabla bla",
        type: "supplier",
      }
    }

    let newRequest
    const apiAdapter = new ApiAdapter(config, middlewares)

    before(() => {
      newRequest = apiAdapter.parseRequest(request)
    })

    it("request", () => {
      expect(newRequest).to.be.eqls({
        method: 'GET',
        url: 'https://b2ads.ad5track.com/product_ad',
        query: {
          referrer: 'http://www.americanas.com',
          limit: 10,
          user_id: 30,
          t: 'json',
          q: 'notebook sansumg 15',
          type: 'supplier',
          publisher: "americanas",
        }
      })
    })
  })

  describe(".parseResponse" ,() => {
    const response = {
      body: [
        {
          t: "Notebook Acer A315-51-50LA Intel Core i5 8GB RAM HD 1TB 15.6\" Windows 10",
          u: "https://b2tracker.ad5track.com/tracker/click/?redirect_url=https%3A%2F%2Fwww.americanas.com.br%2Fproduto%2F35313331%3Fchave%3Db2wads_5b0308384d7bb10eddf23bad_11068167000453_35313331&aid=5b0308384d7bb10eddf23bad&sid=11068167000453&pid=35313331&pos=1&impression_id=30e5fdc7-951a-427e-85e1-1b9466675283",
          i: "https://images-americanas.b2w.io/produtos/01/00/sku/35313/3/35313334G1.jpg",
          pr: 2699,
          product: { id: 2 },
        }, {
          t: "Notebook Acer A515-51G-72DB Intel Core i7 8GB RAM 1TB HD NVIDIA GeForce 940MX 2GB 15,6\" FHD Windows 10",
          u: "https://b2tracker.ad5track.com/tracker/click/?redirect_url=https%3A%2F%2Fwww.americanas.com.br%2Fproduto%2F30222000%3Fchave%3Db2wads_5b0308394d7bb10eddf23baf_11068167000453_30222000&aid=5b0308394d7bb10eddf23baf&sid=11068167000453&pid=30222000&pos=2&impression_id=30e5fdc7-951a-427e-85e1-1b9466675283",
          i: "https://images-americanas.b2w.io/produtos/01/00/sku/30222/0/30222002G1.jpg",
          pr: 3399,
          product: { id: 3 },
        },
      ]
    }

    let newResponse
    const apiAdapter = new ApiAdapter(config, middlewares)

    before(() => {
      newResponse = apiAdapter.parseResponse(response)
    })

    it("response", () => {
      expect(newResponse.data).to.be.eqls([
        {
          title: response.body[0].t,
          url:  response.body[0].u,
          product_id: 2,
        },
        {
          title: response.body[1].t,
          url:  response.body[1].u,
          product_id: 3,
        }
      ])
    })

  })
})
