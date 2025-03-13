const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
// const router = require('./routers/index.js');
require('dotenv').config();
// Khởi tạo middleware
app.use(morgan('dev')); // Ghi log các yêu cầu
app.use(helmet()); // Bảo mật HTTP headers
app.use(compression()); // Nén phản hồi
app.use(express.json());  // 🔥 Quan trọng! Xử lý JSON body
app.use(express.urlencoded({ extended: true })); // (Tùy chọn) Hỗ trợ form data
// kết nối dbs
require('./dbs/initMongoDb.lv2.js');
const initRedis = require('./dbs/initRedis.js');

initRedis.initRedis();
// kiểm tra kết nối redis


const { countConnect, checkOverload } = require('./helpers/check.Connect.js');
countConnect();
checkOverload();
// Định nghĩa routes cho ứng dụng
// app.use("/", router);

app.get('/', (req, res) => {
    const strCompress = 'Hello World';
    return res.status(200).json({
        message: 'Welcome to the API',
        data: strCompress.repeat(100000),
    });
});
app.use('/', require('./routers/index.js'));
// Middleware xử lý lỗi
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
