const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { BRAND } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('portfolio')
    .setDescription('Browse The Edit Lab portfolio & past work'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(BRAND.color)
      .setTitle('🎨  The Edit Lab — Portfolio')
      .setDescription(
        `Take a look at our work. We deliver quality on every project.\n\n` +
        `📂 **Browse by category:**`
      )
      .addFields(
        {
          name: '🎬  Video Edits',
          value: 'Reels, YouTube videos, cinematic cuts, and brand films.\nHead to **#video-edits-showcase** to see examples.',
          inline: false,
        },
        {
          name: '📸  Photo Edits',
          value: 'Product photography, model retouching, portfolio edits.\nSee **#photo-edits-showcase**.',
          inline: false,
        },
        {
          name: '🖼️  YouTube Thumbnails',
          value: 'Custom thumbnails designed to maximize CTR.\nBrowse **#thumbnails-showcase**.',
          inline: false,
        },
        {
          name: '🎨  Posters & Designs',
          value: 'Event posters, social media graphics, banners.\nSee **#posters-showcase**.',
          inline: false,
        },
        {
          name: '💬  Ready to order?',
          value: 'Use `/order` to open a private ticket and get started!',
          inline: false,
        },
      )
      .setFooter({ text: BRAND.footer })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
