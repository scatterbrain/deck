var express = require('express'),
    router = express.Router(), 
    React = require('react'), 
    util = require('util');

// so that you are able to require() jsx files
var jsx = require('node-jsx');
jsx.install({extension: '.jsx'});

var editor = React.createFactory(require('./../public/javascripts/components/markdown_editor.jsx'));

/* GET home page. */
router.get('/', function(req, res) {
    var props = {};
    var editorContents = React.renderToString(editor(props));
    res.render('index', { title: 'Express', editor : editorContents });
});

module.exports = router;
