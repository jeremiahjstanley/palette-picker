const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile.js')[environment];

module.export = require('knex')(configuration);