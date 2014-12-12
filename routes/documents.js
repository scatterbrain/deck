var express = require('express'), 
    router = express.Router(),
    util = require('util'),
    //Temporarily use the WriteStore on the server side as well
    WriteStore = require('../public/javascripts/stores/write_store.js'), 
    GitDocument = require('../models/git_document'), 
    React = require('react'), 
    uuid = require('node-uuid');

var editor = React.createFactory(require('./../public/javascripts/components/markdown_editor.jsx'));

router.get('/new', function(req, res) {
    var props = {};
    var editorContents = React.renderToString(editor(props));
    res.render('new_document', { title: 'Express', editor : editorContents });
});

router.get('/random', function(req, res) {
    var props = {};
    var editorContents = React.renderToString(editor(props));
    res.render('document', { title: 'Express', editor : editorContents });
});

router.get('/:id', function(req, res) {
    var props = {};
    var editorContents = React.renderToString(editor(props));
    res.render('document', { title: 'Express', editor : editorContents });
});

router.get('/', function(req, res) {
    var replyDoc = WriteStore.getDocument();

    if (req.body.id) {
        var gitDoc = GitDocument.connect();
        gitDoc.on("data", function(data) {
          data = JSON.parse(data);
          
          if (data.result === 0) {
            replyDoc.text = data.doc; 
          } else {
            console.log(util.inspect(data));
          } 

          res.setHeader('Content-Type', 'application/json');    
          res.send(JSON.stringify(replyDoc));
        });
        gitDoc.get();
    } else {
        throw new Error('GET doesnt include id');    
    }
});

router.post('/', function(req, res) {
    var validatedDocument, rabbitDoc, remote, gitDoc, id;
    gitDoc = GitDocument.connect();
    WriteStore.receiveDocument(req.body);
    validatedDocument = WriteStore.getDocument(); 
    gitDoc.commit(validatedDocument);
   
    res.setHeader('Content-Type', 'application/json');   
    res.send(JSON.stringify(validatedDocument));
});

module.exports = router;

