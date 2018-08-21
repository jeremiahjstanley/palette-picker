const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile.js')[environment];

module.exports = require('knex')(configuration);