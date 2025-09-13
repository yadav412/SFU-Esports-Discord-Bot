const {Client ,IntentsBitField}= require ("discord.js");
const path = require("node:path");
const fs = require("node:fs");
require("dotenv").config();

const client = new Client({
    intents: [IntentsBitField.Flags.Guilds.GuildMessages, IntentsBitField.Flags.MessageContent],
});

client.login(process.env.DISCORD_TOKEN);

