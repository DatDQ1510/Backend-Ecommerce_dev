// server.js
const express = require('express');
const app = express();
const port = 3000;

app.get('/chat', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    const lines = [
        "Xin chào bạn!",
        "Tôi là ChatGPT 😄",
        "Hôm nay bạn cần giúp gì nè?",
        "Cảm ơn bạn đã ghé qua 💬"
    ];

    let i = 0;
    const interval = setInterval(() => {
        if (i >= lines.length) {
            res.end(); // đóng stream
            clearInterval(interval);
        } else {
            res.write(lines[i] + '\n');
            i++;
        }
    }, 1000); // gửi mỗi dòng sau 1 giây
});

app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
