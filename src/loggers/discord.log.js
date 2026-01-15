'use strict'

const { Client, GatewayIntentBits } = require('discord.js')
require('dotenv').config()
const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)
    console.log('Bot is ready')
})


const token_discord = process.env.DISCORD_TOKEN

client.login(token_discord)
console.log('Bot is logging in...')
client.on('messageCreate', (message) => {
    if (message.author.bot) return

    console.log(message.content)

    if (message.content === 'hello') {
        message.reply('hi! How can I help you?')
    }
})