var express = require('express');
var request = require('request-promise');
var Promise = require('bluebird');
var _ = require('lodash');
var fs = require('fs');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

router.get('/getArRecipes', function(req, res, next) {
    fs.appendFile('searches.txt', "Date: " + Date() + ", search: " + req.query.recipe + "\n", function (err) {});

    request.get('http://localhost:5000/getArRecipes?recipe=' + req.query.recipe).then(function(recipes) {
        res.send(recipes);
    }).catch(function(err) {
        res.status(500);
        res.send("Sorry, something wen't wrong");
    });
});

router.get('/getBbRecipes', function(req, res, next) {
    fs.appendFile('searches.txt', "Date: " + Date() + ", search: " + req.query.recipe + "\n", function (err) {});

    request.get('http://localhost:5000/getBbRecipes?recipe=' + req.query.recipe).then(function(recipes) {
        res.send(recipes);
    }).catch(function(err) {
        res.status(500);
        res.send("Sorry, something wen't wrong");
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
