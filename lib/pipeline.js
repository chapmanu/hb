var async  = require('async');
var Queue  = require('./queue.js');
var hb     = require('./hb.js');

/**
 * Pipeline
 */
var Pipeline = function() {};


Pipeline.prototype = {
  
  post: function(post) {
    if (hb.plugins.length > 0) {
      async.reduce(hb.plugins, post, function(memo, item, callback) {
        item(memo, function(err, p) {
          callback(null, memo);
        });
      }, function(err, final_post) {
        if (err) {
          hb.emit('error', err);
        } else {
          hb.emit('post', final_post.formatted());
        }
      });
    } else {
      hb.emit('post', post.formatted());
    }  
  },
  
  
  
  update: function(update) {
    // No update yet
  },
  
  
  
  delete: function(delete_request) {
    // perform some action to delete request
    
    hb.emit('delete', delete_request);
  }
  
};



/** EXPORT */
module.exports = Pipeline = new Pipeline();