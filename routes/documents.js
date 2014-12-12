var express = require('express'), 
    router = express.Router(),
    util = require('util'),
    //Temporarily use the WriteStore on the server side as well
    WriteStore = require('../public/javascripts/stores/write_store.js'), 
    GitDocument = require('../models/git_document'), 
    Remote = require('../libs/remote');
    

router.get('/', function(req, res) {
    var gitDoc = GitDocument.connect();
    gitDoc.on("data", function(data) {
      data = JSON.parse(data);
      replyDoc = WriteStore.getDocument();       
      if (data.result === 0) {
        replyDoc.text = data.doc; 
      } else {
        console.log(util.inspect(data));
      } 

      res.setHeader('Content-Type', 'application/json');    
      res.send(JSON.stringify(replyDoc));
    });
    gitDoc.get();
});

router.post('/', function(req, res) {
    var validatedDocument, rabbitDoc, remote, gitDoc;
    gitDoc = GitDocument.connect();
    WriteStore.receiveDocument(req.body);
    validatedDocument = WriteStore.getDocument(); 
    res.setHeader('Content-Type', 'application/json');   
    gitDoc.commit(validatedDocument);
    res.send(JSON.stringify(validatedDocument));
    
});

module.exports = router;

