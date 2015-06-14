var webdriver = require('webdriverio');
var BroserMob = require('browsermob-proxy');
var fs = require('fs');
var os = require('os');
var path = require('path');

var BrowserMobProxy = BroserMob.Proxy;

module.exports = Metrify;

function Metrify(name, url, cb) {
  var perfMetrics = { };
  var proxy = new BrowserMobProxy({ port: 9090 });
 // var stop = proxy.stop.bind(proxy);
 // proxy.stop = function(port, cb) {
 //   setTimeout(function() { stop(port, cb); },0);
 // };

  proxy.cbHAR( { name: name, captureHeaders: true }, goToPage, afterScript);

  function afterScript(err, data) {
    if (err)
      return cb(err);

    var harName = path.resolve(os.tmpDir(), [ name , '-', Date.now()].join(''));
    fs.writeFile(harName, data, { encoding: 'utf8'}, afterWrite);
    function afterWrite(err) {
      if (err)
        return cb(err);

      cb(null, perfMetrics, harName);
    }
  }

  function goToPage(proxy, done) {
    webdriver
    .remote({ desiredCapabilities: {
        browserName: 'firefox',
        proxy: { httpProxy: proxy },
        seleniumProtocol: 'WebDriver'
        }
      })
    .init()
    .url(url)
    .execute(function() { return window.performance.timing; }, metrics)
    .end(done);
  }

   function metrics(err, response) {
      var timing = response.value;

      perfMetrics.loadTime = timing.loadEventEnd - timing.fetchStart;
      // Time spent constructing the DOM tree
      perfMetrics.domReadyTime = timing.domComplete - timing.domInteractive;
      // Time consumed preparing the new page
      perfMetrics.readyStart = timing.fetchStart - timing.navigationStart;
      // Time spent during redirection
      perfMetrics.redirectTime = timing.redirectEnd - timing.redirectStart;
      // AppCache
      perfMetrics.appcacheTime = timing.domainLookupStart - timing.fetchStart;
      // Time spent unloading documents
      perfMetrics.unloadEventTime = timing.unloadEventEnd - timing.unloadEventStart;
      // DNS query time
      perfMetrics.lookupDomainTime = timing.domainLookupEnd - timing.domainLookupStart;
      // TCP connection time
      perfMetrics.connectTime = timing.connectEnd - timing.connectStart;
      // Time spent during the request
      perfMetrics.requestTime = timing.responseEnd - timing.requestStart;
      // Request to completion of the DOM loading
      perfMetrics.initDomTreeTime = timing.domInteractive - timing.responseEnd;
      // Load event time
      perfMetrics.loadEventTime = timing.loadEventEnd - timing.loadEventStart;
  }
}

