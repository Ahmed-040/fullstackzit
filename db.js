const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
    user: process.env.db_user,
    password: process.env.password,
    host: process.env.host,
    port: process.env.port_db,
    database: process.env.database
});

module.exports = pool;
