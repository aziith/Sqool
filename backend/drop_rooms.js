const {Pool} = require('pg');
require('dotenv').config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('DROP TABLE IF EXISTS rooms CASCADE')
  .then(() => { console.log('Dropped old rooms tabular'); process.exit(0); })
  .catch(e => { console.error(e); process.exit(1); });
