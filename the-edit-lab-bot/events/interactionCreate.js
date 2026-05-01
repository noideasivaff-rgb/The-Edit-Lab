const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { BRAND, errorEmbed } = require('../utils/embeds');
const { createOrder, getOrder, updateOrderStatus } = require('../utils/orderStore');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {

    // ── Slash commands ────────────────────────────────────────────
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction);
      } catch (err) {
        console.error(`Error in /${interaction.commandName}:`, err);
        const reply = { embeds: [errorEmbed('Something went wrong', 'An error occurred. Please try again.')], ephemeral: true };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(reply);
        } else {
          await interaction.reply(reply);
        }
      }
      return;
    }

    // ── Button: Create Order ──────────────────────────────────────
    if (interaction.isButton() && interaction.customId === 'create_order') {
      const modal = new ModalBuilder()
        .setCustomId('order_modal')
        .setTitle('📋 New Order — The Edit Lab');

      const serviceInput = new TextInputBuilder()
        .setCustomId('service')
        .setLabel('Service (e.g. YouTube Edit, Thumbnail)')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Video Editing / Photo Editing / Thumbnail / Poster')
        .setRequired(true);

      const budgetInput = new TextInputBuilder()
        .setCustomId('budget')
        .setLabel('Your Budget (in ₹)')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('e.g. ₹500 — ₹800')
        .setRequired(true);

      const deadlineInput = new TextInputBuilder()
        .setCustomId('deadline')
        .setLabel('Deadline')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('e.g. 3 days / by Dec 20')
        .setRequired(true);

      const referenceInput = new TextInputBuilder()
        .setCustomId('reference')
        .setLabel('Reference / Details')
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('Describe what you need. Share links, examples, or any specific instructions.')
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents(serviceInput),
        new ActionRowBuilder().addComponents(budgetInput),
        new ActionRowBuilder().addComponents(deadlineInput),
        new ActionRowBuilder().addComponents(referenceInput),
      );

      await interaction.showModal(modal);
      return;
    }

    // ── Modal submit: Order form ──────────────────────────────────
    if (interaction.isModalSubmit() && interaction.customId === 'order_modal') {
      await interaction.deferReply({ ephemeral: true });

      const service   = interaction.fields.getTextInputValue('service');
      const budget    = interaction.fields.getTextInputValue('budget');
      const deadline  = interaction.fields.getTextInputValue('deadline');
      const reference = interaction.fields.getTextInputValue('reference');

      const guild = interaction.guild;
      const member = interaction.member;

      // Create private ticket channel
      const categoryId = process.env.TICKET_CATEGORY_ID;
      const adminRoleId = process.env.ADMIN_ROLE_ID;
      const staffRoleId = process.env.STAFF_ROLE_ID;

      const channelName = `order-${member.user.username.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now().toString().slice(-4)}`;

      const permissionOverwrites = [
        { id: guild.id, deny: ['ViewChannel'] }, // deny everyone
        { id: member.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },
      ];
      if (adminRoleId) permissionOverwrites.push({ id: adminRoleId, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'ManageMessages'] });
      if (staffRoleId) permissionOverwrites.push({ id: staffRoleId, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] });

      let ticketChannel;
      try {
        ticketChannel = await guild.channels.create({
          name: channelName,
          parent: categoryId || null,
          permissionOverwrites,
        });
      } catch (err) {
        console.error('Failed to create ticket channel:', err);
        await interaction.editReply({ embeds: [errorEmbed('Channel Error', 'Could not create your order channel. Please contact an admin.')] });
        return;
      }

      // Save order to store
      createOrder(ticketChannel.id, {
        userId: member.user.id,
        username: member.user.tag,
        channelId: ticketChannel.id,
        service,
        budget,
        deadline,
        reference,
      });

      // Post order summary in the ticket channel
      const orderEmbed = new EmbedBuilder()
        .setColor(BRAND.colorGold)
        .setTitle('📋 New Order — The Edit Lab')
        .setDescription(`Hey ${member}! Your order ticket has been created. Our team will review and respond shortly.`)
        .addFields(
          { name: '🛠️ Service',   value: service,   inline: true },
          { name: '💰 Budget',    value: budget,    inline: true },
          { name: '⏱️ Deadline',  value: deadline,  inline: true },
          { name: '📝 Details / Reference', value: reference },
          { name: '📊 Status',    value: '🟡  **Pending**', inline: true },
          { name: '👤 Client',    value: `${member}`, inline: true },
        )
        .setFooter({ text: BRAND.footer })
        .setTimestamp();

      const closeButton = new ActionRowBuilder().addComponents(
        require('discord.js').ButtonBuilder
          ? new (require('discord.js').ButtonBuilder)()
              .setCustomId('close_ticket')
              .setLabel('Close Ticket')
              .setStyle(4) // Danger
              .setEmoji('🔒')
          : null
      ).components.filter(Boolean);

      await ticketChannel.send({
        content: `${member} ${adminRoleId ? `<@&${adminRoleId}>` : ''}`,
        embeds: [orderEmbed],
        components: closeButton.length ? [new ActionRowBuilder().addComponents(closeButton)] : [],
      });

      // Log to orders log channel
      const logChannelId = process.env.ORDERS_LOG_CHANNEL_ID;
      if (logChannelId) {
        const logChannel = guild.channels.cache.get(logChannelId);
        if (logChannel) {
          const logEmbed = new EmbedBuilder()
            .setColor(BRAND.colorGold)
            .setTitle('📬 New Order Received')
            .addFields(
              { name: 'Client',    value: `${member.user.tag}`, inline: true },
              { name: 'Service',   value: service,              inline: true },
              { name: 'Budget',    value: budget,               inline: true },
              { name: 'Channel',   value: `<#${ticketChannel.id}>` },
            )
            .setFooter({ text: BRAND.footer })
            .setTimestamp();
          await logChannel.send({ embeds: [logEmbed] });
        }
      }

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(BRAND.colorGreen)
            .setTitle('✅ Order Ticket Created!')
            .setDescription(`Your private order channel is ready: <#${ticketChannel.id}>\n\nOur team will respond within a few hours. 🎬`)
            .setFooter({ text: BRAND.footer }),
        ],
      });
      return;
    }

    // ── Button: Close Ticket ──────────────────────────────────────
    if (interaction.isButton() && interaction.customId === 'close_ticket') {
      const adminRoleId = process.env.ADMIN_ROLE_ID;
      const staffRoleId = process.env.STAFF_ROLE_ID;
      const isStaff =
        (adminRoleId && interaction.member.roles.cache.has(adminRoleId)) ||
        (staffRoleId && interaction.member.roles.cache.has(staffRoleId)) ||
        interaction.member.permissions.has('ManageChannels');

      if (!isStaff) {
        await interaction.reply({ embeds: [errorEmbed('No Permission', 'Only staff can close tickets.')], ephemeral: true });
        return;
      }

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(BRAND.colorRed)
            .setTitle('🔒 Ticket Closing')
            .setDescription('This ticket will be deleted in **5 seconds**.')
            .setFooter({ text: BRAND.footer }),
        ],
      });

      setTimeout(async () => {
        try {
          await interaction.channel.delete();
        } catch {}
      }, 5000);
    }
  },
};
