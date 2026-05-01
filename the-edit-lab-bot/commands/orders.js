const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { BRAND, infoEmbed } = require('../utils/embeds');
const { getAllOrders } = require('../utils/orderStore');

const STATUS_EMOJI = {
  Pending:       '🟡',
  'In Progress': '🔵',
  Completed:     '🟢',
  Cancelled:     '🔴',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('orders')
    .setDescription('View all active orders (staff only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addStringOption(opt =>
      opt.setName('filter')
        .setDescription('Filter by status')
        .addChoices(
          { name: 'All',          value: 'all' },
          { name: 'Pending',      value: 'Pending' },
          { name: 'In Progress',  value: 'In Progress' },
          { name: 'Completed',    value: 'Completed' },
          { name: 'Cancelled',    value: 'Cancelled' },
        )
    ),

  async execute(interaction) {
    const filter = interaction.options.getString('filter') || 'all';
    const allOrders = getAllOrders();
    let orders = Object.values(allOrders);

    if (filter !== 'all') {
      orders = orders.filter(o => o.status === filter);
    }

    if (orders.length === 0) {
      await interaction.reply({
        embeds: [infoEmbed('No Orders Found', `No orders found${filter !== 'all' ? ` with status **${filter}**` : ''}.`)],
        ephemeral: true,
      });
      return;
    }

    // Build a compact list (max 10 per embed to avoid hitting limits)
    const shown = orders.slice(0, 10);
    const lines = shown.map((o, i) => {
      const emoji = STATUS_EMOJI[o.status] || '📋';
      const date = new Date(o.createdAt).toLocaleDateString('en-IN');
      return `**${i + 1}.** ${emoji} \`${o.status}\` — <#${o.channelId}>\n` +
             `> 👤 ${o.username}  |  🛠️ ${o.service}  |  📅 ${date}`;
    }).join('\n\n');

    const embed = new EmbedBuilder()
      .setColor(BRAND.color)
      .setTitle(`📊  Orders — ${filter === 'all' ? 'All' : filter} (${orders.length})`)
      .setDescription(lines + (orders.length > 10 ? `\n\n_...and ${orders.length - 10} more_` : ''))
      .setFooter({ text: BRAND.footer })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
