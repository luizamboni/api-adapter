const ObjectPath = require("object-path");

const response = {

  body: [
    {
      t: "Notebook Acer A315-51-50LA Intel Core i5 8GB RAM HD 1TB 15.6\" Windows 10",
      u: "https://b2tracker.ad5track.com/tracker/click/?redirect_url=https%3A%2F%2Fwww.americanas.com.br%2Fproduto%2F35313331%3Fchave%3Db2wads_5b0308384d7bb10eddf23bad_11068167000453_35313331&aid=5b0308384d7bb10eddf23bad&sid=11068167000453&pid=35313331&pos=1&impression_id=30e5fdc7-951a-427e-85e1-1b9466675283",
      i: "https://images-americanas.b2w.io/produtos/01/00/sku/35313/3/35313334G1.jpg",
      queryString: "chave=b2wads_5b0308384d7bb10eddf23bad_11068167000453_35313331&sellerId=11068167000453",
      pr: 2699,
      product: { id: 2 },
      ad_id: "5b0308384d7bb10eddf23bad",
      seller_id: "11068167000453",
      id: "35313331",
      s: "Percycle (Acer)"
    }, {
      t: "Notebook Acer A515-51G-72DB Intel Core i7 8GB RAM 1TB HD NVIDIA GeForce 940MX 2GB 15,6\" FHD Windows 10",
      u: "https://b2tracker.ad5track.com/tracker/click/?redirect_url=https%3A%2F%2Fwww.americanas.com.br%2Fproduto%2F30222000%3Fchave%3Db2wads_5b0308394d7bb10eddf23baf_11068167000453_30222000&aid=5b0308394d7bb10eddf23baf&sid=11068167000453&pid=30222000&pos=2&impression_id=30e5fdc7-951a-427e-85e1-1b9466675283",
      i: "https://images-americanas.b2w.io/produtos/01/00/sku/30222/0/30222002G1.jpg",
      queryString: "chave=b2wads_5b0308394d7bb10eddf23baf_11068167000453_30222000&sellerId=11068167000453",
      pr: 3399,
      product: { id: 3 },
      ad_id: "5b0308394d7bb10eddf23baf",
      seller_id: "11068167000453",
      id: "30222000",
      s: "Percycle (Acer)"
    },
  ]
}

const config = {
  properties: [
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


const newResponse = {}

function parseProperties(props, data) {

  const newResponse = {}
  for(const prop of props ) {
    const { to, value, from , properties } = prop

    let value2
    
    if (properties) {
      const Root = ObjectPath.get(data, from)

      value2 = Root.map(el => (
        parseProperties(properties, el)
      ))

       
    } else {
      value2 = from ? ObjectPath.get(data, from) : value 
    }

    ObjectPath.set(newResponse, to, value2)
  }

  return newResponse
}


console.log(
  parseProperties(config.properties, response)
)