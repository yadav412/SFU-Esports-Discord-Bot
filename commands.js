import 'dotenv/config';
import { getRPSChoices } from './game.js';
import { capitalize, InstallGlobalCommands } from './utils.js';

// Get the game choices from game.js
const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

const SUPPORT_ROLES = {
  operations: ["President", "VP Ops"],
  marketing: ["VP Marketing", "Design", "Media"],
  people: ["President", "VP P&C"],
  finance: ["VP Finance", "Finance Committee"],
  competitive: ["VP Competitive", "Tournament Ops", "Coach"],
  facilities: ["Facilities Manager", "VP Ops"],
  external: ["VP External", "Marketing"],
  tech: ["Tech Leads"],
  general: ["President", "VP Ops"],
};

// short intro templates for each department
const FIRST_MESSAGES = {
  operations: "⚙️ **Operations Ticket Created**\nPlease describe your issue or request in detail below.",
  marketing: "🎨 **Marketing Ticket Created**\nPlease include purpose, deadlines, and asset details.",
  people: "🧭 **People & Culture Ticket Created**\nIf this is private, only VP P&C and President can see this.",
  finance: "💰 **Finance Ticket Created**\nPlease attach receipts, event name, and cost details.",
  competitive: "🎮 **Competitive Ticket Created**\nInclude team name, tournament, and request type.",
  facilities: "🏢 **Facilities Ticket Created**\nPlease describe booking, setup, or issue clearly.",
  external: "🤝 **External Relations Ticket Created**\nInclude partner/sponsor name and collab details.",
  tech: "💻 **Tech Ticket Created**\nProvide repo link, bug details, or feature request context.",
  general: "📨 **General Ticket Created**\nPlease describe your question or concern below.",
};

// ticket categories
const DEPARTMENTS = {
  operations: ["policy", "discord", "proposal", "feedback", "report"],
  marketing: ["graphics", "social", "broadcast", "approval"],
  people: ["hiring", "offboarding", "concern", "development"],
  finance: ["reimbursement", "prize", "budget", "grant"],
  competitive: ["tryouts", "registration", "ops", "coach"],
  facilities: ["lounge", "issue", "storage", "setup"],
  external: ["sponsorship", "collab", "deliverables", "media"],
  tech: ["bug", "feature", "deploy", "project"],
  general: ["inquiry", "contact", "urgent"],
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Open a support ticket")
    .addSubcommandGroup((group) =>
      group
        .setName("operations")
        .setDescription("Operations & Admin tickets")
        .addSubcommand((cmd) => cmd.setName("policy").setDescription("Ask about club policy"))
        .addSubcommand((cmd) => cmd.setName("discord").setDescription("Discord or IT issue"))
        .addSubcommand((cmd) => cmd.setName("proposal").setDescription("Submit a proposal"))
        .addSubcommand((cmd) => cmd.setName("feedback").setDescription("Provide feedback"))
        .addSubcommand((cmd) => cmd.setName("report").setDescription("Anonymous report (redirect)"))
    )
    .addSubcommandGroup((group) =>
      group
        .setName("marketing")
        .setDescription("Marketing & Creative tickets")
        .addSubcommand((cmd) => cmd.setName("graphics").setDescription("Request graphic assets"))
        .addSubcommand((cmd) => cmd.setName("social").setDescription("Social media post request"))
        .addSubcommand((cmd) => cmd.setName("broadcast").setDescription("Stream or OBS support"))
        .addSubcommand((cmd) => cmd.setName("approval").setDescription("Brand review or approval"))
    )
    .addSubcommandGroup((group) =>
      group
        .setName("people")
        .setDescription("People & Culture tickets")
        .addSubcommand((cmd) => cmd.setName("hiring").setDescription("Hiring or onboarding"))
        .addSubcommand((cmd) => cmd.setName("offboarding").setDescription("Leave or exit"))
        .addSubcommand((cmd) => cmd.setName("concern").setDescription("Private concern (confidential)"))
        .addSubcommand((cmd) => cmd.setName("development").setDescription("Training or mentorship"))
    )
    .addSubcommandGroup((group) =>
      group
        .setName("finance")
        .setDescription("Finance & Grants tickets")
        .addSubcommand((cmd) => cmd.setName("reimbursement").setDescription("Expense reimbursement"))
        .addSubcommand((cmd) => cmd.setName("prize").setDescription("Prize distribution plan"))
        .addSubcommand((cmd) => cmd.setName("budget").setDescription("Budget or funding check"))
        .addSubcommand((cmd) => cmd.setName("grant").setDescription("SFSS grant assistance"))
    )
    .addSubcommandGroup((group) =>
      group
        .setName("competitive")
        .setDescription("Competitive team tickets")
        .addSubcommand((cmd) => cmd.setName("tryouts").setDescription("Tryout organization"))
        .addSubcommand((cmd) => cmd.setName("registration").setDescription("Tournament registration"))
        .addSubcommand((cmd) => cmd.setName("ops").setDescription("Event ops support"))
        .addSubcommand((cmd) => cmd.setName("coach").setDescription("Coach application"))
    )
    .addSubcommandGroup((group) =>
      group
        .setName("facilities")
        .setDescription("Facilities & Logistics tickets")
        .addSubcommand((cmd) => cmd.setName("lounge").setDescription("Book lounge or access"))
        .addSubcommand((cmd) => cmd.setName("issue").setDescription("Report space/equipment issue"))
        .addSubcommand((cmd) => cmd.setName("storage").setDescription("Storage or inventory update"))
        .addSubcommand((cmd) => cmd.setName("setup").setDescription("Setup or teardown request"))
    )
    .addSubcommandGroup((group) =>
      group
        .setName("external")
        .setDescription("External relations tickets")
        .addSubcommand((cmd) => cmd.setName("sponsorship").setDescription("New sponsorship lead"))
        .addSubcommand((cmd) => cmd.setName("collab").setDescription("Partner collaboration"))
        .addSubcommand((cmd) => cmd.setName("deliverables").setDescription("Sponsor deliverables"))
        .addSubcommand((cmd) => cmd.setName("media").setDescription("Press or media inquiry"))
    )
    .addSubcommandGroup((group) =>
      group
        .setName("tech")
        .setDescription("Tech & Development tickets")
        .addSubcommand((cmd) => cmd.setName("bug").setDescription("Report bug in site/app"))
        .addSubcommand((cmd) => cmd.setName("feature").setDescription("Request new feature"))
        .addSubcommand((cmd) => cmd.setName("deploy").setDescription("Deployment or hosting issue"))
        .addSubcommand((cmd) => cmd.setName("project").setDescription("Propose a dev project"))
    )
    .addSubcommandGroup((group) =>
      group
        .setName("general")
        .setDescription("General inquiries")
        .addSubcommand((cmd) => cmd.setName("inquiry").setDescription("Ask a general question"))
        .addSubcommand((cmd) => cmd.setName("contact").setDescription("Contact a department lead"))
        .addSubcommand((cmd) => cmd.setName("urgent").setDescription("Urgent or crisis ticket"))
    ),

  async execute(interaction) {
    const group = interaction.options.getSubcommandGroup();
    const sub = interaction.options.getSubcommand();
    const user = interaction.user;

    const channelName = `ticket-${group}-${sub}-${user.username}`.toLowerCase();

    const category = interaction.guild.channels.cache.find(
      (c) => c.name.toLowerCase() === `${group}-tickets` && c.type === ChannelType.GuildCategory
    );

    const newChannel = await interaction.guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: category ? category.id : null,
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: user.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
        },
      ],
    });

    const roles = SUPPORT_ROLES[group] || [];
    const mentions = roles
      .map((r) => interaction.guild.roles.cache.find((role) => role.name === r))
      .filter(Boolean)
      .map((role) => role.toString())
      .join(" ");

    const embed = new EmbedBuilder()
      .setTitle(`🎟️ Ticket Created: ${group.toUpperCase()} > ${sub}`)
      .setDescription(FIRST_MESSAGES[group])
      .setColor(0x5865f2)
      .setFooter({ text: `Opened by ${user.tag}` })
      .setTimestamp();

    await newChannel.send({
      content: `${mentions}`,
      embeds: [embed],
    });

    await interaction.reply({
      content: `✅ Ticket created: ${newChannel}`,
      ephemeral: true,
    });
  },
};



/// these are the predefined test cases currently used for testing purposes 

function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const { Client, GatewayIntentBits, Events } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
  console.log(`✅ Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'test') {
    await interaction.reply('Hello! Your test command works 🎉');
  }
});


const CHALLENGE_COMMAND = {
  name: 'challenge',
  description: 'Challenge to a match of rock paper scissors',
  options: [
    {
      type: 3,
      name: 'object',
      description: 'Pick your object',
      required: true,
      choices: createCommandChoices(),
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
};

const ALL_COMMANDS = [TEST_COMMAND, CHALLENGE_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
