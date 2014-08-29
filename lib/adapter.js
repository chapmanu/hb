/** Dependencies */
var Waterline = require('waterline');


/**
 * Hummingbird: Adapter
 * Manages connection to data store
 * 
 * @constructor
 */
var Adapter = function() {
  this._waterline = new Waterline();
  
  // Adapters
  this._adapters = {
    memory: require('./adapters/memory.js'),
    disk:   require('./adapters/disk.js'),
    redis:  require('./adapters/redis.js')
  };
  
  // Models
  this._models = {
    account: Waterline.Collection.extend(require('./models/account.js')),
    keyword: Waterline.Collection.extend(require('./models/keyword.js'))
  };
};



/** API */
Adapter.prototype = {
  
  /**
   * Configure adapter connection
   *
   * @param {object} config - Adapter configuration
   */
  configure: function(config) {
    this._config = this._defaultConfig();
    if (!config) return true;
    
    var datastore;
    
    switch(config.adapter) {
    case 'disk':
      datastore = this._adapters.disk.connection();
      break;
      
    case 'redis':
      datastore = this._adapters.redis.connection(config.redis);
      break;
      
    case 'memory':
    default:
      return true; // Memory adapter by default
    }
    
    // Set connection
    this._config.connections.datastore = datastore;
    return true;
  },
  
  
  /**
   * Initialize the connection
   */
  initialize: function(hb, cb) {
    this._loadCollections();
    
    // Start Waterline
    var self = this;
    this._waterline.initialize(self.config, function(err, waterline) {
      if(err) throw err;
      
      hb.models = {
        Account: waterline.collections['accounts-'+hb.env],
        Keyword: waterline.collections['keywords-'+hb.env]
      };
      
      cb();
    });
  }
  
};


/**
 * Default waterline configuration
 */
Adapter.prototype._defaultConfig = function() {
  return {
    adapters: {
      'default': this._adapters.memory.module,
       memory:   this._adapters.memory.module,
       disk:     this._adapters.disk.module,
       redis:    this._adapters.redis.module
    },
    connections: {
      datastore: this._adapters.memory.connection()
    },
    defaults: {
      connection: 'datastore'
    }
  };
};


/**
 * Load the collections into waterline
 */
Adapter.prototype._loadCollections = function() {
  var self = this;
  this._waterline.loadCollection(self.models.account);
  this._waterline.loadCollection(self.models.keyword);
};


/** Export */
module.exports = Adapter = new Adapter();
