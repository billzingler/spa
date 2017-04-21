/*
 * app.js - Express server with basic auth
*/

/*jslint         node    : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global */

// ------------ BEGIN MODULE SCOPE VARIABLES --------------
'use strict';
var
  http    = require( 'http'    ),
  express = require( 'express' ),
  morgan  = require( 'morgan' ),
  bodyParser = require( 'body-parser' ),
  methodOverride = require( 'method-override' ),
  basicAuth = require( 'express-basic-auth' ),
  errorHandler = require( 'errorhandler' ),
  routes  = require( './routes' ),

  loggerFmt = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]',
  env = process.env.NODE_ENV || 'development',

  app     = express(),
  server  = http.createServer( app );
// ------------- END MODULE SCOPE VARIABLES ---------------

// ------------- BEGIN SERVER CONFIGURATION ---------------
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended : true } ) );
app.use( methodOverride() );
app.use(basicAuth( {
  users: { 'user': 'spa' },
  challenge: true
  } ) );
app.use( express.static( __dirname + '/public' ) );

if ('development' == env) {
  app.use( morgan( loggerFmt ) );
  app.use( errorHandler({
    dumpExceptions : true,
    showStack      : true
  }));
}

if ('production' == env) {
  app.use( errorHandler() );
}

routes.configRoutes( app, server );
// -------------- END SERVER CONFIGURATION ----------------

// ----------------- BEGIN START SERVER -------------------
server.listen( 3000 );
console.log(
  'Express server listening on port %d in %s mode',
   server.address().port, app.settings.env
);
// ------------------ END START SERVER --------------------
