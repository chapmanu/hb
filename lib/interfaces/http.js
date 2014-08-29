/** Dependencies */
var express    = require('express');
var bodyParser = require('body-parser')
var fs         = require('fs');
var https      = require('https');


/**
 * HTTP Interface
 *
 * @constructor
 */
var HTTPInterface = function(hb, config) {
  this.config = config;
  this.app    = express();
  
  // Controllers
  this.controllers = {
    accounts:  require('../controllers/accounts.js')(hb),
    keywords:  require('../controllers/keywords.js')(hb),
    callbacks: require('../controllers/callbacks.js')(hb)
  };
};

HTTPInterface.prototype = {
  
  initialize: function() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    
    // Set up routing
    this.loadRoutes();
  },
  
  
  loadRoutes: function() {
    if (this.config.route_models) {
      this.app.post(  '/accounts', this.controllers.accounts.create );
      this.app.delete('/accounts', this.controllers.accounts.destroy);

      this.app.post(  '/keywords', this.controllers.keywords.create );
      this.app.delete('/keywords', this.controllers.keywords.destroy);
    }

    this.app.get( '/callback/:service', this.controllers.callbacks.receive);
    this.app.post('/callback/:service', this.controllers.callbacks.receive);
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