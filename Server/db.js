const { MongoClient } = require('mongodb');

const url = "mongodb+srv://bilalsaad711:BilalManav123@cheer.prwipjl.mongodb.net/"
const client = new MongoClient(url);
let dbConnection;

const connectDB = async () => {
    try {
        await client.connect();
        console.log('Database connected');
        dbConnection = client.db('Cheerful');
        return dbConnection;
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
};

module.exports = { connectDB, getDb: () => dbConnection };