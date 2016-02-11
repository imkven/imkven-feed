var express = require('express');
var router = express.Router();
var db = require('../models');
var request = require('request');
var pie = require('nodepie');
var async = require('async');
var cors = require('cors');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', cors(), function (req, res, next) {
  return res.status(200).json({
    ok: true
  });
});

router.get('/feed', cors(), function (req, res, next) {
  var url = 'http://imkven.github.io/feed.xml';
  var hasNewArticle = true;
  async.waterfall([
    function(cb) {
      db.Feed.findOrCreate({
        where: {
          url: url
        }
      })
      .spread(function(found, created) {
        cb(null, found);
      }, function(err) {
        cb(err)
      });
    },

    function(feed, cb) {
      request.head(feed.url, function(err, r) {
        if (err) return cb(err);
        if (feed.lastModified === r.headers['last-modified']) {
          db.Article.findAll({
            order: [['date', 'DESC']]
          })
          .then(function(articles) {
            cb(true, feed, articles)
          }, function(err) {
            cb(err)
          });
        } else {
          hasNewArticle = true;
          feed.set('lastModified', r.headers['last-modified']);
          feed.save()
            .then(function(updated) {
              cb(null, updated);
            }, function(err) {
              cb(err);
            });
        }
      });
    },

    function(feed, cb) {
      request.get(feed.url, function(err, r, body) {
        if (err) return cb(err);
        var feedPie = new pie(body);
        feedPie.init();

        feed.set('title', feedPie.getTitle());
        feed.save()
          .then(function() {
            var articles = [];
            async.eachSeries(feedPie.getItems(), function(el, nextEach) {
              db.Article.findOrCreate({
                where: {
                  url: el.getPermalink()
                },
                defaults: {
                  title: el.getTitle(),
                  date: el.getDate(),
                  content: el.getContents(),
                }
              })
              .spread(function(found, created) {
                articles.push({
                  url: found.url,
                  title: found.title,
                  date: found.date,
                  content: found.content,
                });
                nextEach();
              }, function(err) {
                nextEach(err)
              });
            }, function(err) {
              cb(err, feed, articles);
            });
          }, function(err) {
            cb(err);
          });
      });
    }
  ], function(err, feed, articles) {
    var statusCode = 200;
    if (err) {
      console.log('err', err);
      statusCode = 400;
    }

    return res.status(statusCode).json({
      ok: (statusCode === 200),
      url: feed.url,
      lastModified: feed.lastModified,
      hasNewArticle: hasNewArticle,
      title: feed.title,
      articles: articles
    });
  });
});
