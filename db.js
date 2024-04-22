const { Pool } = require('pg');

const pool = new Pool({
    user: "postgres",
    password: "Allah@786",
    host: "localhost",
    port: 5432,
    database: "fullstack"
});

module.exports = pool;
