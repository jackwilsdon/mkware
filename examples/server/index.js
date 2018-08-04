var http = require('http');

var hello = function hello(req, res, next) {
  if (req.url !== '/hello') {
    return next();
  }

  res.end('Hello, world!');
};

var crash = function crash(req, res, next) {
  if (req.url !== '/crash') {
    return next();
  }

  throw new Error('crash!');
};

var notFound = function notFound(req, res) {
  res.end('Cannot ' + req.method + ' ' + req.url);
};

var app = mkware(hello, crash, notFound);

http.createServer(app).listen(3000);
