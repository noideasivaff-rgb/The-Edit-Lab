const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { BRAND, successEmbed, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('promote')
    .setDescription('Promote a user to Client or Premium Client (staff only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption(opt =>
      opt.setName('user').setDescription('The user to promote').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('role')
        .setDescription('Which role to assign')
        .setRequired(true)
        .addChoices(
          { name: '🟢 Client',         value: 'client' },
          { name: '⭐ Premium Client',  value: 'premium' },
        )
    ),

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const roleType = interaction.options.getString('role');

    const roleId = roleType === 'premium'
      ? process.env.PREMIUM_CLIENT_ROLE_ID
      : process.env.CLIENT_ROLE_ID;

    if (!roleId) {
      await interaction.reply({
        embeds: [errorEmbed('Role Not Configured', `The ${roleType} role ID is not set in \`.env\`. Please add it.`)],
        ephemeral: true,
      });
      return;
    }

    try {
      await target.roles.add(roleId);

      const label = roleType === 'premium' ? '⭐ Premium Client' : '🟢 Client';
      const embed = new EmbedBuilder()
        .setColor(roleType === 'premium' ? BRAND.colorGold : BRAND.colorGreen)
        .setTitle(`${label} Role Assigned`)
        .setDescription(`${target} has been promoted to **${label}**!`)
        .addFields(
          { name: 'Promoted by', value: `${interaction.user}`, inline: true },
          { name: 'Role',        value: label,                 inline: true },
        )
        .setFooter({ text: BRAND.footer })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error('Promote error:', err);
      await interaction.reply({
        embeds: [errorEmbed('Failed to assign role', 'Make sure the bot role is above the target role in server settings.')],
        ephemeral: true,
      });
    }
  },
};
