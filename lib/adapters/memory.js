/**
 * Memory Adapter
 */
module.exports = {
  module: require('sails-memory'),
  
  connection: function() {
    return { adapter: 'memory' };
  }
};