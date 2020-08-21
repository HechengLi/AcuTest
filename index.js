const express = require('express')
const path = require('path')
const url = require('url')
const proxy = require('express-http-proxy')
const port = process.env.PORT || 5000
const app = express()

const apiProxy = proxy('http://localhost:8000', {
  proxyReqPathResolver: req => url.parse(req.baseUrl).path
})

app.use(express.static(__dirname + '/projects/aculink820'))

app.use('/api/*', apiProxy)

app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname, 'projects/aculink820/index.html'))
})

app.listen(port)
console.log("server started on port " + port)