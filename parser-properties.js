const ObjectPath = require("object-path")

parseProperties = (props, data, opts = {}) => {
 const newResponse = {}
 
 for(const prop of props ) {
   const { to, value, from , properties , middleware = [], required, self } = prop

   let value2

   if (properties) {
     const Root = ObjectPath.get(data, from)

     value2 = Root.map(el => (
       parseProperties(properties, el)
     ))

     
   } else {
     value2 = from ? ObjectPath.get(data, from) : value

     if(!value2 && required)
       throw new Error(`${to} is required`)

     middleware.forEach(funcName => {
       value2 = (opts.middleware[funcName] || global[funcName])(value2)
     })
   }

   if(self)
     ObjectPath.set(data, self, value2)
   else
     ObjectPath.set(newResponse, to, value2)
 }

 return newResponse
}

module.exports = parseProperties