const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://cluster0.pdsuyov.mongodb.net/ecommerce-system';
const client = new MongoClient(uri);

async function testConnection() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
    } finally {
        await client.close();
    }
}

testConnection();