require ("dotenv").config();

const connectDB = require('./config/db');

const testConn = async () => {
    const db = await connectDB();
    console.log('Database connection test successful!');
    // process.exit(0);
}

testConn();