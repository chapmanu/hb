/** Dependencies */
var Switchboard = require('../switchboard.js');
var hb          = require('../hb.js');


// Models
var Account = hb.models.Account;
var Keyword = hb.models.Keyword;


// Handle errors
function whatError(error) {
  if (error.BadQuery || error.ValidationError) {
    return "Bad Request: Request parameters are malformed.";
  } else
  if (error.ModelExists) {
    return "Conflict: Model already exists with these attributes.";
  } else
  if (error.ModelExists===false) {
    return "Conflict: Model does not exist.";
  } else {
    return "Internal Server Error";
  }
};



/**
 * Method Interface
 */
module.exports = {
    
  /** Keywords */
  keywords: {
    
    /**
     * Add Keyword
     *
     * @param {string} service - The service to track
     * @param {string} phrase  - Phrase of the keyword
     */
    add: function(service, phrase) {
      Keyword.create({ service: service, phrase: phrase})
      .then(function(keyword) {
        // delegate and respond
        Switchboard.delegateKeyword('add', keyword.condensed());
        return true;
      })
      .fail(function(error) {
        hb.errors.emit('error', whatError(error.originalError));
        return false;
      });
    },
    
    
    /**
     * Delete Keyword
     *
     * @param {string} service - The service to track
     * @param {string} phrase  - Phrase of the keyword
     */
    remove: function(service, phrase) {
      Keyword.destroy({ service: service, phrase: phrase}, function(err) {
        // error
        if (err) {
          hb.errors.emit('error', whatError(err));
          return false;
        }

        // cool beans
        Switchboard.delegateKeyword('remove', { service: service, phrase: phrase});
        return true;
      });
    }
    
  },
  
  
  
  /** Accounts */
  accounts: {
    
    /**
     * Add Account
     *
     * @param {string} service    - Service account exists on
     * @param {string} service_id - ID of account on that service
     * @param {string} auth_token - Auth token if account requires it for tracking (instagram, facebook)
     */
    add: function(service, service_id, auth_token) {
      Account.create({service: service, service_id: service_id, auth_token: auth_token})
      .then(function(account) {
        // cool beans
        Switchboard.delegateAccount('add', account.condensed());
        return true;
      })
      .fail(function(error) {
        hb.errors.emit('error', whatError(error.originalError));
        return false;
      });
    },
    
    
    /**
     * Remove Account
     *
     * @param {string} service    - Service account exists on
     * @param {string} service_id - ID of account on that service
     */
    remove: function(service, service_id) {
      Account.destroy(req.body, function(err) {
        // Error
        if (err) {
          hb.errors.emit('error', whatError(err));
          return false;
        }
    
        Switchboard.delegateAccount('remove', {service: service, service_id: service_id});
        return true;
      });
    }
    
  }
  
  
};