
'use strict'

const mongose = require('mongoose');


const connectString = process.env.LOCAL_HOST_MONGO

// default maxPoolSize = 100
mongose.connect(connectString, { maxPoolSize: 50 }).then(() => {
    console.log('Connected to MongoDB');
   
}).catch((err) => {
    console.log('Error connecting to MongoDB', err);
});

class Database {
    constructor() {
        this.connect();
    }

    connect(type = 'mongodb') {
        if (1 === 1) {
            mongose.set("debug", true);
            mongose.set("debug", { color: true });
        }
        mongose.connect(connectString).then(() => {
        }).catch((err) => {
            console.log('Error connecting to MongoDB', err);
        });
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new Database();
        }
        return this.instance;
    }
}
const instanceMongo = Database.getInstance();

module.exports = instanceMongo;