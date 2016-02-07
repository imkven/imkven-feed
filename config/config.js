var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development',
    ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'imkven-feed'
    },
    port: process.env.OPENSHIFT_NODEJS_PORT || 3000,
    db: 'sqlite://' + ip + '/imkven-feed-development',
    storage: rootPath + '/data/imkven-feed-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'imkven-feed'
    },
    port: process.env.OPENSHIFT_NODEJS_PORT || 3000,
    db: 'sqlite://' + ip + '/imkven-feed-test',
    storage: rootPath + '/data/imkven-feed-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'imkven-feed'
    },
    port: process.env.OPENSHIFT_NODEJS_PORT || 3000,
    db: 'sqlite://' + ip + '/imkven-feed-production',
    storage: rootPath + 'data/imkven-feed-production'
  }
};

module.exports = config[env];
