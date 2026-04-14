const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString);

module.exports = sql;
