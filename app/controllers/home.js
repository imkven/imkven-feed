var express = require('express'),
  router = express.Router(),
  db = require('../models'),
  request = require('request'),
  pie = require('nodepie')
  async = require('async');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  return res.status(200).json({
    ok: true
  });
});

router.get('/feed', function (req, res, next) {
  var url = 'http://imkven.github.io/feed.xml';

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
          return cb(true, feed)
        }

        feed.set('lastModified', r.headers['last-modified']);
        feed.save()
          .then(function(updated) {
            cb(null, updated);
          }, function(err) {
            cb(err);
          });
      });
    },

    function(feed, cb) {
      request.get(feed.url, function(err, r, body) {
        if (err) return cb(err);
        var feedPie = new pie(body);
        feedPie.init();

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
      });
    }
  ], function(err, feed, articles) {
    if (err === true) {
      return res.status(200).json({
        ok: true,
        url: feed.url,
        lastModified: feed.lastModified
      });
    }

    if (err) {
      console.log('err', err);
      return res.status(400).json({
        ok: false
      });
    }

    return res.status(200).json({
      ok: true,
      url: feed.url,
      lastModified: feed.lastModified,
      articles: articles
    });
  });
});
