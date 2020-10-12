const { exec } = require('child_process')
const express = require('express')
const path = require('path')
const url = require('url')
const proxy = require('express-http-proxy')

function cleanExit() { process.exit() }

class Client {
  constructor(port, projectName, mockServerUrl) {
    this.port = port // this port should be selected automatically
    this.projectName = projectName
    this.mockServerUrl = mockServerUrl
    this.app = express()
    this.server = null
    this.app.use(express.static(__dirname + `/projects/${projectName}/dist`))
    this.app.use('/api/*', proxy(mockServerUrl, {
      proxyReqPathResolver: req => {
        console.log(`Redirecting ${req.baseUrl} to ${mockServerUrl}${req.baseUrl}`)
        return url.parse(req.baseUrl).path
      }
    }))
    this.app.get('/', function (req, res) {
      res.sendFile(path.resolve(__dirname, `projects/${projectName}/dist/index.html`))
    })
    this.running = false
  }

  start() {
    if (!this.running) {
      return new Promise((resolve, reject) => {
        this.server = this.app.listen(this.port, function() {
          console.log(`Project ${this.projectName} running on port ${this.port}, redirect to ${this.mockServerUrl}`)
          this.running = true
          resolve()
        }.bind(this))
      })
    }
  }

  close() {
    if (this.server && this.running) {
      this.server.close(function() {
        console.log(`Project ${this.projectName} closed`)
        this.running = false
        this.server = null
      }.bind(this))
    }
  }

  async test() {
    const nightWatchConfig = require('./nightwatch.conf.js')
    nightWatchConfig.src_folders = [`server/projects/${this.projectName}/tests`]
    nightWatchConfig.output_folder = `server/projects/${this.projectName}/reports`
    const date = new Date()
    nightWatchConfig.dateString = `${date.getFullYear()}_${date.getMonth()+1}_${date.getDate()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`
    nightWatchConfig.mockServerUrl = this.mockServerUrl

    const fs = require('fs')
    const writeStream = fs.createWriteStream(`server/projects/${this.projectName}/nightwatch.conf.js`)
    await new Promise((resolve, reject) => {
      writeStream.write('module.exports = ')
      writeStream.write(JSON.stringify(nightWatchConfig))
      writeStream.on('finish', () => {
        console.log('Nightwatch Config file created')
        resolve()
      })
      writeStream.end()
    })

    await new Promise((resolve, reject) => {
      const instance = `node server/run.js --config server/projects/${this.projectName}/nightwatch.conf.js`
      const child = exec(instance, err => {
        if (err) reject(err)
        fs.unlink(`server/projects/${this.projectName}/nightwatch.conf.js`, err => {
          if (err) reject(err)
          console.log('Cleaned up Nightwatch config file')
          resolve()
        })
        child.kill()
        this.close()
      })

      child.stdout.on('data', (data) => {
        console.log(data.toString())
      })
      child.stderr.on('data', (data) => {
        console.log(data.toString())
      })

      process.on('SIGINT', cleanExit)
      process.on('SIGTERM', cleanExit)
      process.on('exit', () => {
        console.log('Server Stopped')
        child.kill()
        this.close()
      })
    })
  }
}

module.exports = Client
