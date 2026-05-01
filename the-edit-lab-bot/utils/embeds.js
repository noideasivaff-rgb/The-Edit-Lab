const { EmbedBuilder } = require('discord.js');

const BRAND = {
  name: 'The Edit Lab',
  short: 'Edit Lab',
  color: 0x5865F2,       // Discord blurple — change to your brand color (e.g. 0xFF6B00)
  colorGreen: 0x2ECC71,
  colorRed: 0xE74C3C,
  colorGold: 0xF1C40F,
  colorBlue: 0x3498DB,
  logo: null,            // Set to your bot's avatar URL if you want it in every embed footer
  footer: 'The Edit Lab  •  Edit Lab Bot',
};

function baseEmbed() {
  return new EmbedBuilder()
    .setColor(BRAND.color)
    .setFooter({ text: BRAND.footer })
    .setTimestamp();
}

function successEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(BRAND.colorGreen)
    .setTitle(`✅  ${title}`)
    .setDescription(description)
    .setFooter({ text: BRAND.footer })
    .setTimestamp();
}

function errorEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(BRAND.colorRed)
    .setTitle(`❌  ${title}`)
    .setDescription(description)
    .setFooter({ text: BRAND.footer })
    .setTimestamp();
}

function infoEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(BRAND.colorBlue)
    .setTitle(`ℹ️  ${title}`)
    .setDescription(description)
    .setFooter({ text: BRAND.footer })
    .setTimestamp();
}

module.exports = { BRAND, baseEmbed, successEmbed, errorEmbed, infoEmbed };
