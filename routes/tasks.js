var express = require('express');
var router = express.Router();
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
var inputText = "World War II, also known as the Second World War, was a global war that lasted from 1939 to 1945. World War I was a global war originating in Europe that lasted from 28 July 1914 to 11 November 1918."
var stem = natural.PorterStemmer.stem("horses");
var array = tokenizer.tokenize(inputText);
var item = array[0];  
//this.output = item;

//Get all tasks
router.get('/tasks', function(req, res, next){
    res.json(array);
});

//get single
router.get('/task', function(req, res, next){
    res.json(item);
});

module.exports = router;