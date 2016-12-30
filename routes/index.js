var express = require('express');
var request = require('request');
var fs = require('fs');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

router.get('/getRecipes', function(req, res, next) {
    console.log(req.query.recipe);
    fs.appendFile('searches.txt', "Date: " + Date() + ", search: " + req.query.recipe + "\n", function (err) {});
   request.get('http://localhost:5000/getRecipes?recipe=' + req.query.recipe, function(err, response, body){
        if (err) {
            res.send("Error: " + err);
        }
    res.send(body);
    });
});

router.get('/getIngredients', function(req, res, next) {
    console.log(req.query.url);
   request.get('http://localhost:5000/getIngredients?url=' + req.query.url, function(err, response, body){
        if (err) {
            res.send("Error: " + err);
        }
    res.send(body);
    });
});

module.exports = router;
