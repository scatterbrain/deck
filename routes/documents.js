var express = require('express'), 
    router = express.Router(),
    util = require('util'),
    //Temporarily use the WriteStore on the server side as well
    WriteStore = require('../public/javascripts/stores/write_store.js'), 
    GitDocument = require('../models/git_document'), 
    Remote = require('../libs/remote');
    

router.get('/', function(req, res) {
    var remote, cmd, replyDoc;
    //Read from git
    cmd = { cmd : "read" };
    remote = Remote.createRemote('doc.request');
    //Remote connection established, write request
    remote.on('ready', function() {
        remote.write(JSON.stringify(cmd));
    });
    //When we receive reply data
    remote.on('data', function(data) {
      data = JSON.parse(data);
      replyDoc = WriteStore.getDocument();       
      if (data.result === 0) {
        replyDoc.text = data.doc; 
      } else {
        console.log(util.inspect(data));
      } 

      res.setHeader('Content-Type', 'application/json');    
      res.send(JSON.stringify(replyDoc));
      remote.close();
    });

    remote.on('error', function(error) {
        console.log("Error occurred" + error);
        remote.close();
    });

    remote.connect();
});

router.post('/', function(req, res) {
    var validatedDocument, rabbitDoc, remote;
    WriteStore.receiveDocument(req.body);
    validatedDocument = WriteStore.getDocument(); 
    res.setHeader('Content-Type', 'application/json');   
    GitDocument.commit(validatedDocument);
    res.send(JSON.stringify(validatedDocument));
    
});

module.exports = router;

