// const { exec } = require('child_process')
//
// const project_name = 'aculink820'
//
// function cleanExit() { process.exit() }
//
// function runProject() {
//   const instance = `npx serve -s projects/${project_name}`
//   const child = exec(instance, function(err) {
//     if (err) throw err
//     console.log("Server started")
//   })
//
//   child.stdout.on('data', (data) => {
//     console.log(data.toString())
//   })
//   child.stderr.on('data', (data) => {
//     console.log(data.toString())
//   })
//
//   process.on('SIGINT', cleanExit)
//   process.on('SIGTERM', cleanExit)
//   process.on('exit', function() {
//     console.log('Server Stopped')
//     child.kill()
//   })
// }
// runProject()