var mongoose =  require('mongoose');
var Schema = mongoose.Schema;

var express  = require('express');
var router = express.Router();






// invoked for any requested passed to this router
router.use(function(req, res, next) {
    var interesstsSchema = new Schema({
        name:String
    });
    
    var newInteresst = mongoose.model('interesst',interesstsSchema);
  next();
});

// will handle any request that ends in /events
// depends on where the router is "use()'d"
router.get('/events', function(req, res, next) {
  // ..
});

module.export = newInteresst;