const knex = require('knex');

const environment = process.env.NODE_ENV || 'development';
console.log(`\n\nCurrently in '${environment}' environment\n\n`);
const config = require('../knexfile.js')[environment];

module.exports = knex(config);
