'use strict'

const loggerService = require('../loggers/discord.log.v2')

const pustToLogDiscord = async (req, res, next) => {
    try {
        res.on('finish', () => {
            loggerService.sentToFormatMessage({
                code: res.statusCode, // Lấy đúng mã HTTP sau khi response hoàn thành
                message: `Host: ${req.get('host')}\nURL: ${req.originalUrl}`,
                data: {
                    title: 'Request',
                    description: 'Request to the server',
                    color: (res.statusCode !== 500) ? 0x00ff00 : 0xff0000, // Xanh nếu 200, đỏ nếu lỗi
                    fields: [
                        { name: 'Method', value: req.method, inline: true },
                        { name: 'Path', value: req.originalUrl, inline: true },
                        { name: 'Host', value: req.get('host'), inline: true },
                        { name: 'Body', value: `\`\`\`json\n${JSON.stringify(req.body, null, 2)}\`\`\``, inline: false }
                    ],
                    timestamp: new Date()
                }
            });
        })
        return next()
    } catch (error) {
        console.log(error)
        next()
    }
}
module.exports = {
    pustToLogDiscord
}


