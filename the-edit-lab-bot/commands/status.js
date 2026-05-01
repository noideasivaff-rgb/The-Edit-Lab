const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { BRAND, successEmbed, errorEmbed } = require('../utils/embeds');
const { getOrder, updateOrderStatus } = require('../utils/orderStore');

const STATUS_COLORS = {
  Pending:     0xF1C40F,
  'In Progress': 0x3498DB,
  Completed:   0x2ECC71,
  Cancelled:   0xE74C3C,
};

const STATUS_EMOJIS = {
  Pending:       '🟡',
  'In Progress': '🔵',
  Completed:     '🟢',
  Cancelled:     '🔴',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Update the status of an order (staff only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addStringOption(opt =>
      opt.setName('status')
        .setDescription('New order status')
        .setRequired(true)
        .addChoices(
          { name: '🟡 Pending',      value: 'Pending' },
          { name: '🔵 In Progress',  value: 'In Progress' },
          { name: '🟢 Completed',    value: 'Completed' },
          { name: '🔴 Cancelled',    value: 'Cancelled' },
        )
    ),

  async execute(interaction) {
    const newStatus = interaction.options.getString('status');
    const channelId = interaction.channelId;
    const order = getOrder(channelId);

    if (!order) {
      await interaction.reply({
        embeds: [errorEmbed('Not an Order Ticket', 'This command only works inside an active order ticket channel.')],
        ephemeral: true,
      });
      return;
    }

    updateOrderStatus(channelId, newStatus);

    const color = STATUS_COLORS[newStatus] || BRAND.color;
    const emoji = STATUS_EMOJIS[newStatus] || '📋';

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(`${emoji}  Order Status Updated`)
      .addFields(
        { name: 'Previous Status', value: order.status,  inline: true },
        { name: 'New Status',      value: newStatus,     inline: true },
        { name: 'Updated by',      value: `${interaction.user}`, inline: true },
        { name: 'Service',         value: order.service, inline: true },
        { name: 'Client',          value: `<@${order.userId}>`, inline: true },
      )
      .setFooter({ text: BRAND.footer })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    // If completed, assign Client role
    if (newStatus === 'Completed') {
      const clientRoleId = process.env.CLIENT_ROLE_ID;
      if (clientRoleId) {
        try {
          const member = await interaction.guild.members.fetch(order.userId);
          if (member && !member.roles.cache.has(clientRoleId)) {
            await member.roles.add(clientRoleId);
            await interaction.channel.send({
              embeds: [
                new EmbedBuilder()
                  .setColor(BRAND.colorGreen)
                  .setTitle('🎉 Order Completed!')
                  .setDescription(
                    `<@${order.userId}> your order has been completed!\n\n` +
                    `You've been given the **Client** role. 🏅\n` +
                    `Please leave a review in **#client-reviews**!\n\n` +
                    `Thank you for choosing **The Edit Lab**. 🖤`
                  )
                  .setFooter({ text: BRAND.footer }),
              ],
            });
          }
        } catch (err) {
          console.error('Failed to assign Client role:', err);
        }
      }
    }
  },
};
