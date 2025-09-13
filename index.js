
import { Client, IntentsBitField } from "discord.js";
import path from "node:path";
import fs from "node:fs";
import dotenv from "dotenv";
dotenv.config();




import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import { Client, GatewayIntentBits, Partials } from 'discord.js';

// ---------- CONFIG ----------
const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID; // application id
const GUILD_ID = process.env.GUILD_ID;
const LOG_CHANNEL_ID = process.env.LOG_CHANNEL_ID; // ticket-logs channel
const TICKET_CATEGORY_ID = process.env.TICKET_CATEGORY_ID; // category for ticket threads

if (!TOKEN || !CLIENT_ID || !GUILD_ID || !LOG_CHANNEL_ID || !TICKET_CATEGORY_ID) {
    console.error('Missing environment variables. See header comments.');
    process.exit(1);
}

// Replace these with your server's role IDs
const ROLES = {
    marketing: process.env.ROLE_MARKETING || 'ROLE_MARKETING_ID',
    people: process.env.ROLE_PEOPLE || 'ROLE_PEOPLE_ID',
    competitive: process.env.ROLE_COMPETITIVE || 'ROLE_COMPETITIVE_ID',
    finance: process.env.ROLE_FINANCE || 'ROLE_FINANCE_ID',
    facilities: process.env.ROLE_FACILITIES || 'ROLE_FACILITIES_ID',
    external: process.env.ROLE_EXTERNAL || 'ROLE_EXTERNAL_ID',
    ops: process.env.ROLE_OPS || 'ROLE_OPS_ID',
    president: process.env.ROLE_PRES || 'ROLE_PRES_ID'
};

// Ticket naming
const TICKET_COUNTER_FILE = path.join(process.cwd(), 'ticket_counter.json');
let counterData = { last: 0 };
if (fs.existsSync(TICKET_COUNTER_FILE)) {
    try { counterData = JSON.parse(fs.readFileSync(TICKET_COUNTER_FILE,'utf8')); } catch(e) {}
}
function nextTicketNumber(){ counterData.last++; fs.writeFileSync(TICKET_COUNTER_FILE, JSON.stringify(counterData)); return String(counterData.last).padStart(4,'0'); }

// In-memory ticket store (for demo). For production, persist to a database.
const tickets = new Map(); // threadId => { dept, type, ownerId, createdAt, autoCloseTimeoutId }

// ---------- SETUP CLIENT ----------
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers], partials: [Partials.Channel] });

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// ---------- PANEL DEFINITION ----------
// Each button customId = dept|type_key (e.g. marketing|graphics)
const PANELS = [
    {
        id: 'panel_marketing', title: 'Marketing', description: 'Use this for graphics, social posts, broadcast assets, and brand approvals.', role: ROLES.marketing,
        // ...panel config continues...
    }
    // Add other panels as needed
];

// --- INTEGRATION STOPPED HERE ---
// Please continue pasting the rest of your ticket bot code here to complete the integration.

client.login(TOKEN);

