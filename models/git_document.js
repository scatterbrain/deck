var  Remote = require('../libs/remote');

var GitDocument = {
  commit : function(validatedDocument) {
    //Save to git
    rabbitDoc = { cmd : "commit", doc : validatedDocument};
    remote = Remote.createRemote('doc.request');
    //Remote connection established, write request
    remote.on('ready', function() {
        remote.write(JSON.stringify(rabbitDoc));
    });
    remote.on('error', function(error) {
        console.log("Error occurred" + error);
        remote.close();      
    });
    //When we receive reply data
    remote.on('data', function(data) {
        remote.close();
    });
    remote.connect();
  }
};

module.exports = GitDocument;


