const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const Client = require('./Client')
const basicRequestHandler = require('./handlers/basicRequestHandler')

const server = express()
server.use(bodyParser.json())

server.get('/api/project', basicRequestHandler((req, res) => {
  fs.readdir(path.join(__dirname, 'projects'), (err, files) => {
    if (err) {
      throw new Error(`Unable to scan project directory: ${err}`)
    }
    res.status(200).send(files)
  })
}))

server.patch('/api/project/:projectName/status', basicRequestHandler(async (req, res) => {
  const { port, mockServerUrl } = req.body
  const project = new Client(port, req.params.projectName, mockServerUrl)
  await project.start()
  await project.test()
  res.sendStatus(200)
}))

server.patch('/api/project/:projectName/test', basicRequestHandler(async (req, res) => {
  const { port, mockServerUrl } = req.body
  const project = new Client(port, req.params.projectName, mockServerUrl)
  await project.start()
  // await project.test()
  res.sendStatus(200)
}))

server.listen(3001, function() {
  console.log('AcuTest started on port 3001')
})