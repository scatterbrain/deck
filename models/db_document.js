var couchbase = require('couchbase');
var cluster = new couchbase.Cluster();
var bucket = cluster.openBucket('default');

var DBDocument = {
  new : function() {
  
  }
};

module.exports=DBDocument;
