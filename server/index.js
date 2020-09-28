const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Client = require('./Client')
const basicRequestHandler = require('./handlers/basicRequestHandler')

const server = express()
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const projectPath = path.join(__dirname, `projects/${req.body.projectName}`)
    fs.mkdir(projectPath, err => {
      if (err) {
        if (err.code === 'EEXIST') cb({
          message: 'Project Already Exists.',
          err
        })
        else cb(err)
      }
    })
    cb(null, projectPath)
  },
  filename: (req, file, cb) => {
    cb(null, 'test.txt')
  }
})
const upload = multer({ storage })

server.get('/api/project', basicRequestHandler((req, res) => {
  fs.readdir(path.join(__dirname, 'projects'), (err, files) => {
    if (err) {
      throw new Error(`Unable to Scan Project Directory: ${err}.`)
    }
    res.status(200).send(files)
  })
}))

server.post('/api/project', basicRequestHandler(async (req, res) => {
  await new Promise((resolve, reject) => {
    upload.single('bundle')(req, res, err => {
      if (err) reject(err)
      else resolve()
    })
  })
  res.sendStatus(200)
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