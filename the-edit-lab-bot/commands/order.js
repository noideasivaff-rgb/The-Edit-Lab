const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { BRAND } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('order')
    .setDescription('Place a new order with The Edit Lab'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(BRAND.color)
      .setTitle('📩  Place Your Order — The Edit Lab')
      .setDescription(
        `Click **Create Order** below to open your private order ticket.\n\n` +
        `You'll be asked to fill in:\n` +
        `> 🛠️ Service needed\n` +
        `> 💰 Your budget\n` +
        `> ⏱️ Your deadline\n` +
        `> 📝 Reference / project details\n\n` +
        `Our team will review and respond within **a few hours**.\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `✅ Fast response  |  🔒 Private  |  💯 Quality guaranteed`
      )
      .addFields(
        { name: '⏱️ Typical Turnaround', value: '24–72 hours depending on complexity', inline: true },
        { name: '💳 Payment', value: 'After quote confirmation', inline: true },
      )
      .setFooter({ text: BRAND.footer })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('create_order')
        .setLabel('Create Order')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('📋'),
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  },
};
