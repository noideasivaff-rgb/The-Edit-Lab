const { EmbedBuilder } = require('discord.js');
const { BRAND } = require('../utils/embeds');

// Keyword → reply map
const AUTO_REPLIES = {
  price: () => priceEmbed(),
  pricing: () => priceEmbed(),
  rates: () => priceEmbed(),
  'how much': () => priceEmbed(),
  order: () => orderGuideEmbed(),
  'place order': () => orderGuideEmbed(),
  portfolio: () => portfolioEmbed(),
  work: () => portfolioEmbed(),
  services: () => servicesEmbed(),
  hello: () => helloEmbed(),
  hi: () => helloEmbed(),
  hey: () => helloEmbed(),
};

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    const content = message.content.toLowerCase().trim();

    for (const [keyword, embedFn] of Object.entries(AUTO_REPLIES)) {
      if (content === keyword || content.startsWith(keyword + ' ') || content.includes(` ${keyword}`)) {
        const embed = embedFn();
        await message.reply({ embeds: [embed] });
        return;
      }
    }
  },
};

function helloEmbed() {
  return new EmbedBuilder()
    .setColor(BRAND.color)
    .setTitle('👋 Hey there!')
    .setDescription(
      `Welcome to **The Edit Lab**!\n\n` +
      `Here's what you can do:\n` +
      `> \`/price\` — View our service rates\n` +
      `> \`/portfolio\` — Browse our work\n` +
      `> \`/order\` — Place an order\n\n` +
      `Our team is here to help. Let's create something amazing! 🎬`
    )
    .setFooter({ text: BRAND.footer })
    .setTimestamp();
}

function priceEmbed() {
  return new EmbedBuilder()
    .setColor(BRAND.color)
    .setTitle('💼 The Edit Lab — Pricing')
    .setDescription(
      `> All prices are **starting rates**. Final quote depends on complexity.\n\n` +
      `**🎬 Video Editing**\n` +
      `\`Reels / Shorts\` ─────────── from ₹299\n` +
      `\`YouTube (up to 10 min)\` ──── from ₹499\n` +
      `\`YouTube (10–30 min)\` ─────── from ₹799\n` +
      `\`Cinematic / Brand Video\` ─── from ₹999\n` +
      `\`Ad / Promo Video\` ─────────── from ₹699\n\n` +
      `**📸 Photo Editing**\n` +
      `\`Basic Retouching\` ──────────── from ₹99\n` +
      `\`Product Photography\` ─────── from ₹149\n` +
      `\`Portfolio / Model Edit\` ────── from ₹199\n\n` +
      `**🖼️ YouTube Thumbnails**\n` +
      `\`Standard\` ──────────────────── from ₹149\n` +
      `\`Premium / Illustrated\` ─────── from ₹299\n\n` +
      `**🎨 Posters & Graphic Designs**\n` +
      `\`Social Media Post\` ─────────── from ₹149\n` +
      `\`Event Poster / Flyer\` ─────── from ₹249\n` +
      `\`Banner / Cover Design\` ──── from ₹299\n\n` +
      `📦 Bundle deals available! Use \`/order\` to get a custom quote.`
    )
    .setFooter({ text: BRAND.footer })
    .setTimestamp();
}

function orderGuideEmbed() {
  return new EmbedBuilder()
    .setColor(BRAND.color)
    .setTitle('📩 How to Place an Order')
    .setDescription(
      `Use the \`/order\` command or click **Create Order** in the orders channel.\n\n` +
      `**Steps:**\n` +
      `1️⃣ Use \`/order\`\n` +
      `2️⃣ A private ticket channel is created\n` +
      `3️⃣ Fill in your order details\n` +
      `4️⃣ Our team sends you a quote\n` +
      `5️⃣ Confirm & pay → work begins\n` +
      `6️⃣ Receive your files 🎉\n\n` +
      `⏱️ Turnaround: **24–72 hours** depending on complexity.`
    )
    .setFooter({ text: BRAND.footer })
    .setTimestamp();
}

function portfolioEmbed() {
  return new EmbedBuilder()
    .setColor(BRAND.color)
    .setTitle('🎨 The Edit Lab — Portfolio')
    .setDescription(
      `Browse our latest work in the **#portfolio** channel!\n\n` +
      `We showcase:\n` +
      `🎬 Video edits & reels\n` +
      `📸 Photo retouching\n` +
      `🖼️ YouTube thumbnails\n` +
      `🎨 Posters & graphic designs\n\n` +
      `Like what you see? Use \`/order\` to get started!`
    )
    .setFooter({ text: BRAND.footer })
    .setTimestamp();
}

function servicesEmbed() {
  return new EmbedBuilder()
    .setColor(BRAND.color)
    .setTitle('🛠️ The Edit Lab — Services')
    .setDescription(
      `Here's everything we offer:\n\n` +
      `**🎬 Video Editing**\nYouTube, Reels, Cinematic, Brand & Ad videos\n\n` +
      `**📸 Photo Editing**\nRetouching, product photography, portfolio edits\n\n` +
      `**🖼️ Thumbnails**\nCustom-designed YouTube thumbnails that get clicks\n\n` +
      `**🎨 Posters & Designs**\nSocial media posts, event posters, banners\n\n` +
      `Use \`/price\` to see rates or \`/order\` to start your project!`
    )
    .setFooter({ text: BRAND.footer })
    .setTimestamp();
}
