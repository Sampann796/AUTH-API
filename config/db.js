require ("dotenv").config();

const mongoose = require('mongoose');


const connectDB = async () => {
    try { 
        const db = await mongoose.connect("mongodb://aroraujjwal796_db_user:doctorBackendApp@ac-xm6bb8j-shard-00-00.rdorgxr.mongodb.net:27017,ac-xm6bb8j-shard-00-01.rdorgxr.mongodb.net:27017,ac-xm6bb8j-shard-00-02.rdorgxr.mongodb.net:27017/?ssl=true&replicaSet=atlas-fbbnzv-shard-0&authSource=admin&appName=Cluster0")
        console.log('MongoDB Connected...');
        return db;
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }     
}

connectDB();

module.exports = connectDB;