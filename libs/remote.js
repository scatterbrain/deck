var util = require('util'), 
    EventEmitter = require('events').EventEmitter;

function RemoteConnection(queue) {
  //this.url = url; #Should be fetched from config
  this.queue = queue;
}

util.inherits(RemoteConnection, EventEmitter);

RemoteConnection.prototype.connect = function() {
  var self = this;
  var context = require('rabbit.js').createContext(); //this.url);
  context.on('ready', function() {
    var request = context.socket('REQ');
    self.request = request;
    request.on("data", function(message) {
      self.emit('data', message);
    });
    
    request.on("error", function(error) {
      self.emit('error', error);
    });

    request.connect(self.queue, function() {
      self.emit('ready');
    });
  });
};

RemoteConnection.prototype.write = function(msg) {
  this.request.write(msg, 'utf8');
};

RemoteConnection.prototype.close = function() {
  var self = this;
  //There's a bug in rabbit.js that requires that the close not to happen
  //immediately after 'data' read
  process.nextTick(function() {
    self.request.close();
  });
};

var Remote = {
  createRemote : function(queue) {
    return new RemoteConnection(queue);
  }
};

module.exports = Remote;
