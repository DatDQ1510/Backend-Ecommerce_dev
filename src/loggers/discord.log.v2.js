'use strict'

const { Client, GatewayIntentBits } = require('discord.js')
require('dotenv').config()
class LoggerService {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        })
        // add channelId as a parameter
        this.channelId = process.env.DISCORD_CHANNEL_ID 
        this.token_discord = process.env.DISCORD_TOKEN

        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user.tag}`)
            console.log('Bot is ready')

            
        })

        this.client.login(this.token_discord)
        console.log('Bot is logging in...')
    }



    sentToFormatMessage({ code = 200, message = "No content", data = {} } = {}) {
        console.log(`📩 Logging HTTP ${code}`);

        if (code === 500 || code === 404) {
            console.warn(`⚠️ HTTP ${code}: ${message}`);
            return;
        }

        const channel = this.client.channels.cache.get(this.channelId);
        if (!channel) return console.log('Channel not found');

        const safeMessage = message.trim() !== "" ? message : "No content";

        if (Object.keys(data).length > 0) {
            channel.send({ content: safeMessage, embeds: [data] }).catch(err => console.log(err));
        } else {
            channel.send({ content: safeMessage }).catch(err => console.log(err));
        }
    }


}

module.exports = new LoggerService()