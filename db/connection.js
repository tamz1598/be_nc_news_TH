const { Pool } = require('pg');
const config = {};

//  handle using the correct environment variables here

const ENV = process.env.NODE_ENV || 'development';
const pathToEnvFile = `${__dirname}/../.env.${ENV}`;

require('dotenv').config({ path: pathToEnvFile });

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set');
}

console.log(`Running in ${ENV} environment`);
console.log('the path is', pathToEnvFile);

if (ENV === 'production') {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

module.exports = new Pool(config);
module.exports = new Pool();

