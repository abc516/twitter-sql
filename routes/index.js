'use strict';
var express = require('express');
var router = express.Router();
var tweetBank = require('../tweetBank');
var pgClient = require('../db');

module.exports = function makeRouterWithSockets (io) {

  // a reusable function
  function respondWithAllTweets (req, res, next){
    pgClient.query('Select *,name from tweets t inner join users u on u.id = t.user_id', function (err, result) {
      if(err) return next(err); //pass error to express
      var tweets = result.rows;
      res.render('index', {title: 'Twitter.js', tweets: tweets, showForm: true})
    })

  }

  // here we basically treet the root view and tweets view as identical
  router.get('/', respondWithAllTweets);
  router.get('/tweets', respondWithAllTweets);

  // single-user page
  router.get('/users/:username', function(req, res, next){

    pgClient.query('Select *,name from tweets t inner join users u on u.id = t.user_id where u.name =$1',[req.params.username] ,function (err, result) {
      if(err) return next(err); //pass error to express
      var tweets = result.rows;
      res.render('index', {title: 'Twitter.js', tweets: tweets, showForm: true})
    })

  });

  // single-tweet page
  router.get('/tweets/:id', function(req, res, next){
    pgClient.query('Select *,name from tweets t inner join users u on u.id = t.user_id where t.id =$1',[req.params.id] ,function (err, result) {
      if(err) return next(err); //pass error to express
      var tweets = result.rows;
      res.render('index', {title: 'Twitter.js', tweets: tweets, showForm: true})
    })

  });

  // create a new tweet
  router.post('/tweets', function(req, res, next){
    //
    console.log(pgClient.query('Select * from users where users.name = $1', [req.body.name]))
    if (pgClient.query('Select * from users where users.name = $1', [req.body.name]).rows === undefined) {
        pgClient.query('INSERT INTO users (name, picture_url) values ($1, $2 )',[req.body.name, 'www.placeholder.com'])
      }
        pgClient.query('INSERT INTO tweets (user_id, content) select id, $2 from users where users.name = $1', [req.body.name, req.body.text], function (err, data) {
        if(err) return next(err); //pass error to express
        //io.sockets.emit('new_tweet', newTweet);
        res.redirect('/');
        })

    //})

    // var newTweet = tweetBank.add(req.body.name, req.body.text);
    // io.sockets.emit('new_tweet', newTweet);
    // res.redirect('/');
  });

  // // replaced this hard-coded route with general static routing in app.js
  // router.get('/stylesheets/style.css', function(req, res, next){
  //   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
  // });

  return router;
}
