const express = require('express')
const bodyParser = require('body-parser')
const Client = require('./Client')

const server = express()
server.use(bodyParser.json())
server.post('/project/:projectName', async (req, res) => {
  const { port, mockServerUrl } = req.body
  const project = new Client(port, req.params.projectName, mockServerUrl)
  await project.start()
  await project.test()
  res.sendStatus(200)
})

server.listen(8080, function() {
  console.log('AcuTest started on port 8080')
})