// Backup of previous index.js before ticket bot integration
import { Client, IntentsBitField } from "discord.js";
import path from "node:path";
import fs from "node:fs";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ],
});

client.login(process.env.DISCORD_TOKEN);
