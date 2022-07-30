const http = require('http'); // HTTP server
const app = require('./app'); // Import the app

const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Get the port from an environment variable or set to 3000
const port = normalizePort(process.env.PORT || '3000'); 
app.set('port', port); // Set the port

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
}; 

// Create a server
const server = http.createServer(app);

server.on('error', errorHandler); 
// Listen on the port
server.on('listening', () => {
  const address = server.address(); // Get the address of the server
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port; // Get the port
  console.log('Listening on ' + bind); // Log the port
});  

server.listen(port);

