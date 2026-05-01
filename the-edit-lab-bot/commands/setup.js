const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const { BRAND } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Post the Order Panel button in this channel (admin only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(BRAND.color)
      .setTitle('🎬  The Edit Lab — Place Your Order')
      .setDescription(
        `Welcome! Click **Create Order** below to start your project.\n\n` +
        `A private ticket channel will be created just for you.\n\n` +
        `**What we offer:**\n` +
        `🎬 Video Editing  |  📸 Photo Editing\n` +
        `🖼️ Thumbnails  |  🎨 Posters & Designs\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `✅ Fast response  |  🔒 Private & secure  |  💯 Quality guaranteed`
      )
      .setFooter({ text: BRAND.footer });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('create_order')
        .setLabel('Create Order')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('📋'),
    );

    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: '✅ Order panel posted!', ephemeral: true });
  },
};
