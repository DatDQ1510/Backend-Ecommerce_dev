
'use strict'
const { log } = require('console');
const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECOND = 5000;
const countConnect = () => {
    const numConnection = mongoose.connections.length;
    console.log(`Number of connections: ${numConnection}`);
}
const checkOverload = () => {
    setInterval(() => {

        const numConnection = mongoose.connections.length;
        const numCpu = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        const maxConnection = numCpu * 5;
        console.log(`active connections : ${numConnection}`)
        console.log(`memory usage :: ${memoryUsage / 1024 / 1024} MB`)
        console.log(numCpu)
        if (numConnection > maxConnection) console.log("server overloaded !");


    }, _SECOND);

}

module.exports = { countConnect, checkOverload };
