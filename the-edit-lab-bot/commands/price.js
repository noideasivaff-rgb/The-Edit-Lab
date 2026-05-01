const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { BRAND } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('price')
    .setDescription('View The Edit Lab service pricing'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(BRAND.color)
      .setTitle('💼  The Edit Lab — Service Pricing')
      .setDescription('> All prices are **starting rates**. Final quote depends on complexity & length.\n> Use `/order` to get a custom estimate.')
      .addFields(
        {
          name: '🎬  Video Editing',
          value:
            '`Reels / Shorts` ────────── from ₹299\n' +
            '`YouTube (up to 10 min)` ─── from ₹499\n' +
            '`YouTube (10–30 min)` ────── from ₹799\n' +
            '`Cinematic / Brand Video` ── from ₹999\n' +
            '`Ad / Promo Video` ──────── from ₹699',
          inline: false,
        },
        {
          name: '📸  Photo Editing',
          value:
            '`Basic Retouching` ───────── from ₹99\n' +
            '`Product Photography` ────── from ₹149\n' +
            '`Portfolio / Model Edit` ──── from ₹199',
          inline: false,
        },
        {
          name: '🖼️  YouTube Thumbnails',
          value:
            '`Standard` ──────────────── from ₹149\n' +
            '`Premium / Illustrated` ───── from ₹299',
          inline: false,
        },
        {
          name: '🎨  Posters & Graphic Designs',
          value:
            '`Social Media Post` ─────── from ₹149\n' +
            '`Event Poster / Flyer` ────── from ₹249\n' +
            '`Banner / Cover Design` ──── from ₹299',
          inline: false,
        },
        {
          name: '📦  Extras',
          value: '`Rush Delivery` — additional fee applies\n`Bundle Packages` — open a ticket for custom pricing',
          inline: false,
        },
      )
      .setFooter({ text: BRAND.footer })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
