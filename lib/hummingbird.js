/** Dependencies */
var hb = require('./hb.js');

var _      = require('lodash');
var async  = require('async');
var utils  = require('utils');
var events = require('events');

var Pipeline = require('./pipeline.js');
var Services = require('./services.js');


/**
 * Hummingbird
 * Stupidly simple social streaming
 *
 * @constructor
 * @param {object} config - Hummingbird general configuration
 */
var Hummingbird = function(config) {
  this._config = config;
  this._name   = utils.generateName();
  
  // Event Emitters
  this.errors = new events.EventEmitter();
};


/** API */
Hummingbird.prototype = {
  
  /**
   * Add a service to be streamed
   *
   * @param {string} service     - identifier of service, 'twitter', 'instagram', etc.
   * @param {object} credentials - API credentials for the service
   */
  addService: function(service, credentials) {
    Services.load(service);
    process.nextTick(function() {
      Services.boot(service, credentials);
    }.bind(this));
  },
  
  
  /**
   * Add a plugin to the pipeline
   *
   * @param {object} plugin - The value of callig require('') on your plugin.
   */
  addPlugin: function(plugin) {
    hb.addPlugin(plugin);
  }
  
};


/**
 * Initialize Hummingbird
 */
Hummingbird.prototype._initialize = function(cv) {
  var config = this._config;
  var self = this;
  async.series([
    function(next) {
      require('./adapter.js').initialize();
      next(); 
    },
    function(next) {
      var http = require('./interfaces/http.js');
      http.initialize();
      http.start();
      next();
    },
    function(next) {
      _.extend(self.prototype, require('./interfaces/method.js'));
      next();
    },
    function(next) {
      require('./switchboard.js');
      require('./responder.js');
      next();
    },
    function(next) {
      if (config.queue && config.redis) {
        var Queue = require('./queue.js');
        Queue.connect(config.redis);
      }
      next();
    }
  ], function(err, hb) {
    if (err) throw new Error(err);
    cb(true);
  });
};



/** Export */
module.exports = Hummingbird;