/**
 * Redis Adapter
 */
module.exports = {
  module: require('sails-redis'),
  
  connection: function(config) {
    return {
      adapter: 'redis',
      host:     config.host || '127.0.0.1',
      port:     config.port ||  6379
    };
  }
};