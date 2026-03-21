require('dotenv').config();
const pool = require('./src/db');
pool.query('SELECT * FROM wards').then(r => console.log(r.rows)).catch(console.error).finally(() => pool.end());
