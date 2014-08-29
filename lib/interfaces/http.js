/** Dependencies */
var express    = require('express');
var bodyParser = require('body-parser')
var fs         = require('fs');
var https      = require('https');


// Controllers
var controllers = {
  accounts:  require('../controllers/accounts.js'),
  keywords:  require('../controllers/keywords.js'),
  callbacks: require('../controllers/callbacks.js')
};


/**
 * HTTP Interface
 *
 * @constructor
 */
var HTTPInterface = function(config) {
  this.config = config;
  this.app    = express();
};

HTTPInterface.prototype = {
  
  initialize: function() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    
    // Set up routing
    this.loadRoutes();
  },
  
  
  loadRoutes: function() {
    var route_models = this.config.route_models || false;
    
    if (route_models) {
      this.app.post(  '/accounts', controllers.accounts.create );
      this.app.delete('/accounts', controllers.accounts.destroy);

      this.app.post(  '/keywords', controllers.keywords.create );
      this.app.delete('/keywords', controllers.keywords.destroy);
    }

    this.app.get( '/callback/:service', controllers.callbacks.receive);
    this.app.post('/callback/:service', controllers.callbacks.receive);
  },
  
  
  start: function() {
    var config = this.config;
    if (config.https) {
      var https_config = {
        key:  fs.readFileSync(config.ssl.key),
        cert: fs.readFileSync(config.ssl.cert)
      };
      https.createServer(https_config, this.app).listen(config.port);
    } else {
      this.app.listen(config.port);
    }
  }
  
};


/** exports */
module.exports = HTTPInterface;