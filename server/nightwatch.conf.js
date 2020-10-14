// http://nightwatchjs.org/gettingstarted#settings-file
// 具体的配置项可以去nightwatch的官网查看
// chromedriver 地址
// http://chromedriver.storage.googleapis.com/index.html
module.exports = {
  src_folders: [],
  output_folder: '',
  test_settings: {
    default: {
      launch_url: 'https://nightwatchjs.org'
    },

    selenium: {
      selenium: {
        start_process: true,
        port: 4444,
        server_path: require('selenium-server').path,
        cli_args: {
          'webdriver.chrome.driver': require('chromedriver').path
        }
      },
      webdriver: {
        start_process: false
      }
    },

    'selenium.chrome': {
      extends: 'selenium',
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          w3c: false
        }
      }
    }
  }
}
