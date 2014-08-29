/** Dependencies */
var sugar    = require('sugar');
var logger   = require('./logger.js');
var Pipeline = require('./pipeline.js');
var hb       = require('./hb.js');


/**
 * Services
 * @constructor
 */
var Services = function() {
  this._services = {};
};



/**
 * Proxy command to service
 */
Services.prototype.command = function(service, params) {
  this._services[service].command(params.model, params.action, params.param);
}



/**
 * Load services
 * Attaches service responder
 */
Services.prototype.load = function(service) {
  var s = require('./services/'+service);
  this._services[service] = s;
  this.connect(s);
};



/**
 * Initialize accounts and keywords
 * Old school synchrony boo yah
 */
Services.prototype.initialize = function(service, cb) {
  logger.info('Initializing service information...');
  
  hb.models.Account.find({}, function(err, accounts) {
    hb.models.Keyword.find({}, function(err, keywords) {
      cb(accounts, keywords);
    });
  });
};



/**
 * Attach event listeners to service hose
 */
Services.prototype.connect = function(service) {
  service.hose.on('post',   function(post)    { Pipeline.post(post)      });
  service.hose.on('update', function(update)  { Pipeline.update(update)  });
  service.hose.on('delete', function(del_req) { Pipeline.delete(del_req) });
};



/**
 * Boot services
 * Run Service.boot() with creds, accts, keywords
 */
Services.prototype.boot = function(service, credentials) {
  var self = this;
  this.initialize(service, function(accounts, keywords) {
    logger.info('Booting service...');
    try {
      self._services[service].boot({
        credentials: credentials || {},
        accounts: self.filterModel(accounts, service),
        keywords: self.filterModel(keywords, service)
      });
    } catch (e) {
      logger.error(e.toString());
    }
  });
};



/**
 * Reduce/filter model to service, returning condensed version
 */
Services.prototype.filterModel = function(model, service) {
  return model.filter(function(n) {
    return n.service===service
  }).map(function(n) {
    return n.condensed() 
  });
};



/** EXPORT */
module.exports = Services = new Services();