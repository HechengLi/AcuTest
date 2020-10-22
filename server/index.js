const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const AdmZip = require('adm-zip')
const rmdir = require('rimraf')
const Client = require('./Client')
const basicRequestHandler = require('./handlers/basicRequestHandler')

const server = express()
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const projectPath = path.join(__dirname, `projects/${req.params.projectName || req.body.projectName}`)
    if (!req.params.projectName) {
      fs.mkdir(projectPath, err => {
        if (err) {
          if (err.code === 'EEXIST') cb({
            message: 'Project Already Exists.',
            err
          })
          else cb(err)
        }
      })
    }
    cb(null, projectPath)
  },
  filename: (req, file, cb) => {
    cb(null, 'bundle.zip')
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

server.get('/api/project/:projectName', basicRequestHandler((req, res) => {
  const { projectName } = req.params
  const nconf = require('nconf')
  nconf.argv()
    .env()
    .file({ file: path.join(__dirname, `projects/${projectName}/config.json`) })
  const serverUrl = nconf.get('serverUrl')
  res.status(200).send({ projectName, serverUrl })
}))

server.post('/api/project', basicRequestHandler(async (req, res) => {
  await new Promise((resolve, reject) => {
    upload.single('bundle')(req, res, err => {
      if (err) reject(err)
      else resolve()
    })
  })

  const { projectName, serverUrl } = req.body

  try {
    const zip = new AdmZip(path.join(__dirname, `projects/${projectName}/bundle.zip`))
    zip.extractAllTo(path.join(__dirname, `projects/${projectName}/dist`), true)
  } catch (err) {
    rmdir(path.join(__dirname, `projects/${projectName}`), err => {
      console.log('Cleaned up project folder')
    })
    throw err
  }

  await new Promise((resolve, reject) => {
    fs.unlink(path.join(__dirname, `projects/${projectName}/bundle.zip`), err => {
      if (err) reject(err)
      console.log('Cleaned up bundle.zip')
      resolve()
    })
  })

  await new Promise((resolve, reject) => {
    fs.mkdir(path.join(__dirname, `projects/${projectName}/tests`), err => {
      if (err) reject(err)
      resolve()
    })
  })

  await new Promise((resolve, reject) => {
    fs.writeFileSync(path.join(__dirname, `projects/${projectName}/config.json`), '{}')
    const nconf = require('nconf')
    nconf.argv()
      .env()
      .file({ file: path.join(__dirname, `projects/${projectName}/config.json`) })
    nconf.set('serverUrl', serverUrl)
    nconf.save(err => {
      if (err) reject(err)
      resolve()
    })
  })

  res.sendStatus(200)
}))

server.put('/api/project/:projectName', basicRequestHandler(async (req, res) => {
  await new Promise((resolve, reject) => {
    upload.single('bundle')(req, res, err => {
      if (err) reject(err)
      else resolve()
    })
  })

  const { projectName } = req.params
  const { serverUrl } = req.body

  try {
    if (fs.existsSync(path.join(__dirname, `projects/${projectName}/bundle.zip`))) {
      const zip = new AdmZip(path.join(__dirname, `projects/${projectName}/bundle.zip`))
      zip.extractAllTo(path.join(__dirname, `projects/${projectName}/dist`), true)
      await new Promise((resolve, reject) => {
        fs.unlink(path.join(__dirname, `projects/${projectName}/bundle.zip`), err => {
          if (err) reject(err)
          console.log('Cleaned up bundle.zip')
          resolve()
        })
      })
    }
  } catch (err) {
    rmdir(path.join(__dirname, `projects/${projectName}`), err => {
      console.log('Cleaned up project folder')
    })
    throw err
  }

  await new Promise((resolve, reject) => {
    const nconf = require('nconf')
    nconf.argv()
      .env()
      .file({ file: path.join(__dirname, `projects/${projectName}/config.json`) })
    nconf.set('serverUrl', serverUrl)
    nconf.save(err => {
      if (err) reject(err)
      resolve()
    })
  })

  res.sendStatus(200)
}))

server.patch('/api/project/:projectName/status', basicRequestHandler(async (req, res) => {
  const { projectName } = req.params
  const { serverUrl } = JSON.parse(fs.readFileSync(path.join(__dirname, `projects/${projectName}/config.json`)).toString())
  const project = new Client(projectName, serverUrl)
  await project.start()
  await project.test()
  res.sendStatus(200)
}))

server.delete('/api/project/:projectName', basicRequestHandler(async (req, res) => {
  const { projectName } = req.params
  await new Promise((resolve, reject) => {
    rmdir(path.join(__dirname, `projects/${projectName}`), err => {
      if (err) reject(err)
      resolve()
    })
  })
  res.sendStatus(200)
}))

/*
server.patch('/api/project/:projectName/test', basicRequestHandler(async (req, res) => {
  const { port, mockServerUrl } = req.body
  const project = new Client(port, req.params.projectName, mockServerUrl)
  await project.start()
  // await project.test()
  res.sendStatus(200)
}))
*/

server.listen(3001, function() {
  console.log('AcuTest started on port 3001')
})