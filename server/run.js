process.env.NODE_ENV = 'testing'
let opts = process.argv.slice(2)
if (opts.indexOf('--config') === -1) {
  // opts = opts.concat(['--config', 'nightwatch.conf.js'])
  throw new Error('No Nightwatch config file')
}

if (opts.indexOf('--env') === -1) {
  opts = opts.concat(['--env', 'selenium.chrome'])
}

//跨平台执行
const spawn = require('cross-spawn')

//调用 spawn 函数时，自动根据当前的运行平台，来决定是否生成一个 shell 来执行所给的命令。
const runner = spawn('./node_modules/.bin/nightwatch', opts, { stdio: 'inherit' })

runner.on('exit', function (code) {
  process.exit(code)
})

runner.on('error', function (err) {
  throw err
})