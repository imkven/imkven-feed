var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'imkven-feed'
    },
    port: 3000,
    db: 'sqlite://localhost/imkven-feed-development',
    storage: rootPath + '/data/imkven-feed-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'imkven-feed'
    },
    port: 3000,
    db: 'sqlite://localhost/imkven-feed-test',
    storage: rootPath + '/data/imkven-feed-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'imkven-feed'
    },
    port: 3000,
    db: 'sqlite://localhost/imkven-feed-production',
    storage: rootPath + 'data/imkven-feed-production'
  }
};

module.exports = config[env];
