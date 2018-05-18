
# LzApiAdapter

```javascript

const config = {
  name: "home1",
  host: "https://b2ads.ad5track.com",
  path: "/ad_products/top",
  method: "GET",
  properties: [
    { from: "headers.referrer", to: "query.referrer" },
    { from: "query.size" , to: "query.limit"},
    { from: "query.userId" , to: "query.user_id"}
  ]
}

const apiAdapter = new ApiAdapter(config)


console.log(apiAdapter.fromApi({
  headers: { referrer: "http://www.americanas.com "},
  query: { size: 10, userId: 30, term: "notebook"}
}))
```
