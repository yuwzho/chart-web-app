const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
const path = require('path');
 
const app = express();
 
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
    res.redirect('/');
});
 
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Broadcast to all. 
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      try {
        console.log('sending data ' + data);
        client.send(data);
      }catch(e) {
        console.error(e);
      }
    }
  });
};

wss.on('connection', function connection(ws) {
  const location = url.parse(ws.upgradeReq.url, true);
  // You might use location.query.access_token to authenticate or share sessions 
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312) 
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    wss.broadcast(JSON.stringify({messageId: 1, temperature: 2, humidity: 3, time: (new Date()).toISOString}));
  });
 

});

// setTimeout(function() {
//   wss.broadcast(JSON.stringify({messageId: 1, temperature: 2, humidity: 3, time: (new Date()).toISOString}));
// }, 10000);

var port = normalizePort(process.env.PORT || '3000');
server.listen(port, function listening() {
  console.log('Listening on %d', server.address().port);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}