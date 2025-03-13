'use strict'
const mongose = require('mongoose');

const connectString = process.env.LOCAL_HOST_MONGO

mongose.connect(connectString).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Error connecting to MongoDB', err);
});

//
if (1 === 1) {
    mongose.set("debug", true);
    mongose.set("debug", { color: true });
}

module.exports = mongose;