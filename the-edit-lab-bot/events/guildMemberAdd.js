const { EmbedBuilder } = require('discord.js');
const { BRAND } = require('../utils/embeds');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    const channelId = process.env.WELCOME_CHANNEL_ID;
    if (!channelId) return;

    const channel = member.guild.channels.cache.get(channelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(BRAND.color)
      .setTitle('🎬  Welcome to The Edit Lab!')
      .setDescription(
        `Hey ${member}, we're glad you're here! 👋\n\n` +
        `**The Edit Lab** is a professional creative editing studio.\n` +
        `We craft cinematic videos, stunning thumbnails, and eye-catching designs.\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `**🚀 Get Started**\n` +
        `> 📋 Read <#${process.env.WELCOME_CHANNEL_ID}> for rules\n` +
        `> 💼 Use \`/price\` to see our service rates\n` +
        `> 🎨 Use \`/portfolio\` to browse our work\n` +
        `> 📩 Use \`/order\` to place an order\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `We deliver quality. Let's create something great. ✨`
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: BRAND.footer })
      .setTimestamp();

    await channel.send({ content: `Welcome ${member}!`, embeds: [embed] });

    // Also DM the new member
    try {
      const dmEmbed = new EmbedBuilder()
        .setColor(BRAND.color)
        .setTitle(`👋 Welcome to The Edit Lab, ${member.user.username}!`)
        .setDescription(
          `Thanks for joining our server!\n\n` +
          `We offer professional editing services:\n` +
          `🎬 Video Editing  |  📸 Photo Editing\n` +
          `🖼️ Thumbnails  |  🎨 Posters & Designs\n\n` +
          `Type \`/price\` in the server to see our rates.\n` +
          `Ready to order? Use \`/order\` anytime.\n\n` +
          `— The Edit Lab Team`
        )
        .setFooter({ text: BRAND.footer });

      await member.send({ embeds: [dmEmbed] });
    } catch {
      // User has DMs disabled — that's fine
    }
  },
};
