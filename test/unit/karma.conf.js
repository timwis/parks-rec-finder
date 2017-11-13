// This is a karma config file. For more details see
//   http://karma-runner.github.io/0.13/config/configuration-file.html
// we are also using it with karma-webpack
//   https://github.com/webpack/karma-webpack

var webpackConfig = require('../../build/webpack.test.conf')

module.exports = function (config) {
  config.set({
    // to run in additional browsers:
    // 1. install corresponding karma launcher
    //    http://karma-runner.github.io/0.13/config/browsers.html
    // 2. add it to the `browsers` array below.
    browsers: ['PhantomJS', 'Chrome', 'Firefox', 'Safari'],
    frameworks: ['mocha', 'sinon-chai', 'phantomjs-shim'],
    reporters: ['super-dots', 'live-html'],
    files: ['./index.js'],

    preprocessors: {
      './index.js': ['webpack', 'sourcemap']
    },

    htmlLiveReporter: {
      colorScheme: 'jasmine', // light 'jasmine' or dark 'earthborn' scheme
      defaultTab: 'summary', // 'summary' or 'failures': a tab to start with

      // only show one suite and fail log at a time, with keyboard navigation
      focusMode: true,
    },

    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },

    coverageReporter: {
      dir: './coverage',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' }
      ]
    },

    browserStack: {
      username: 'dataatphilagov1',
      accessKey: 'RqcCFrLbmrV5mZzQCPfq'
    },

    customLaunchers: {
      IE9: {
        base: 'IE',
        'x-ua-compatible': 'IE=EmulateIE9'
      },
      IE8: {
        base: 'IE',
        'x-ua-compatible': 'IE=EmulateIE8'
      },
      bs_firefox_mac: {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: '21.0',
        os: 'OS X',
        os_version: 'Mountain Lion'
      },
      bs_iphone5: {
        base: 'BrowserStack',
        device: 'iPhone 5',
        os: 'ios',
        os_version: '6.0'
      }
    }
  })
}
