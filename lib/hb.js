/** Dependencies */
var events = require('events');


/**
 * HB Instance
 */
var HB = function() {
  this.env = process.env['NODE_ENV'] || 'development';
  
  this.models  = {};
  this.plugins = [];
  
  // Event Emitters
  this.errors  = new events.EventEmitter();
  this.posts   = new events.EventEmitter();
  this.deletes = new events.EventEmitter();
  
  // queue
  this.queue = null;
  
};


HB.prototype = {
  
  /**
   * Tell HB to also emit to the redis queue
   */
  useQueue: function() {
    this.queue = require('./queue.js');
  },
  
  
  /**
   * Emit a stream payload
   */
  emit: function(type, payload) {
    switch(type) {
    case 'post':
      this.posts.emit('post', payload);
      if (this.queue) this.queue.post(payload);
      break;
    case 'delete':
      this.deletes.emit('delete', payload);
      if (this.queue) this.queue.delete(payload);
      break;
    case 'error':
      this.errors.emit('error', payload);
      break;
    }
  },
  
  
  /**
   * Add a plugin to the pipeline
   */
  addPlugin: function(plugin) {
    this.plugins.push(plugin);
  },
  
  
  /**
   * Add a model to use
   */
  addModel: function(name, model) {
    this.models[name] = model;
  }
  
};






module.exports = HB = new HB();