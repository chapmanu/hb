/** Dependencies */
var async  = require('async');
var utils  = require('utils');
var events = require('events');


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

  
};


/**
 * Initialize Hummingbird
 */
Hummingbird.prototype._initialize = function() {
  var self = this;
  async.series([
  ], function(err, hb) {
    
  });
};



/** Export */
module.exports = Hummingbird;