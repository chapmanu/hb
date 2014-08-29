/**
 * Disk Adapter
 */
module.exports = {
  module: require('sails-disk'),
  
  connection: function() {
    return { adapter: 'disk' };
  }
};