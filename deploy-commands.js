// deploy-commands.js
import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import 'dotenv/config'; // if using .env

const commands = [];
const commandsPath = path.join(process.cwd(), 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Load command data
for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.log(`[WARNING] The command at ${file} is missing "data" or "execute".`);
  }
}

// Register commands globally or for one guild
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// Option A: Register commands for one test guild
// await rest.put(
//   Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
//   { body: commands }
// );

// Option B: Register globally (takes up to 1 hour to update)
await rest.put(
  Routes.applicationCommands(process.env.CLIENT_ID),
  { body: commands }
);

console.log(`✅ Successfully registered ${commands.length} commands.`);
