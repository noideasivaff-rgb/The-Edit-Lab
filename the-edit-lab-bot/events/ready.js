const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`\n✅  Edit Lab Bot is online!`);
    console.log(`📌  Logged in as: ${client.user.tag}`);
    console.log(`🌐  Serving ${client.guilds.cache.size} server(s)\n`);

    client.user.setPresence({
      activities: [
        {
          name: '🎬 The Edit Lab | /order',
          type: ActivityType.Watching,
        },
      ],
      status: 'online',
    });
  },
};
