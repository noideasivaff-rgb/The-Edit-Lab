const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(__dirname, 'commands', file));
  if (command.data) {
    commands.push(command.data.toJSON());
    console.log(`  ✓ Loaded: /${command.data.name}`);
  }
}

const rest = new REST().setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log(`\n🚀 Deploying ${commands.length} slash commands to Discord...\n`);

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands },
    );

    console.log('\n✅ All slash commands deployed successfully!\n');
    console.log('Commands registered:');
    commands.forEach(c => console.log(`  //${c.name} — ${c.description}`));
    console.log('\nYou can now run: node index.js\n');
  } catch (err) {
    console.error('❌ Deployment failed:', err);
  }
})();
