var Remote = require('../libs/remote'),
    EventEmitter = require('events').EventEmitter, 
    util = require('util');

function RemoteGitDocument() {
  this.remote = Remote.createRemote('doc.request');
}

util.inherits(RemoteGitDocument, EventEmitter);

RemoteGitDocument.prototype.get = function() {
    var cmd, replyDoc, self;
    self = this;
    //Read from git
    cmd = { cmd : "read" };
    //Remote connection established, write request
    this.remote.on('ready', function() {
        self.remote.write(JSON.stringify(cmd));
    });
    //When we receive reply data
    this.remote.on('data', function(data) {
        self.emit("data", data);
        self.remote.close();      
    });
    this.remote.on('error', function(error) {
        console.log("Error occurred" + error);
        self.remote.close();
    });

    this.remote.connect();   
}; 

RemoteGitDocument.prototype.commit = function(validatedDocument) {
    var rabbitDoc, self;
    self = this;    
    //Save to git
    rabbitDoc = { cmd : "commit", doc : validatedDocument};
    //Remote connection established, write request
    this.remote.on('ready', function() {
        self.remote.write(JSON.stringify(rabbitDoc));
    });
    //When we receive reply data
    this.remote.on('data', function(data) {
        self.remote.close();
    });
    this.remote.on('error', function(error) {
        console.log("Error occurred" + error);
        self.remote.close();      
    });

    this.remote.connect();
};

var GitDocument = {
  connect : function() {
    return new RemoteGitDocument();
  }
};

module.exports = GitDocument;


