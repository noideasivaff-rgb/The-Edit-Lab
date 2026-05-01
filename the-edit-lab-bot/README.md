# 🎬 Edit Lab Bot — The Edit Lab

A fully custom Discord bot for The Edit Lab with ticket system, auto-replies, slash commands, order management, and role assignment.

---

## ✅ Features

| Feature | Details |
|---|---|
| 👋 Welcome system | Auto DM + channel message when someone joins |
| 💬 Auto replies | Responds to keywords like `price`, `order`, `hi` |
| `/price` | Full pricing embed |
| `/portfolio` | Portfolio overview with channel links |
| `/order` | Opens an order ticket with a form |
| `/status` | Update order status (staff only) |
| `/promote` | Assign Client / Premium Client role |
| `/orders` | List all orders with filter |
| `/setup` | Post the order panel button (admin only) |
| 🎫 Ticket system | Private channel per order, auto-logs |
| 📋 Order form | Service, budget, deadline, reference fields |
| 🏅 Role system | Auto Client role on order completion |

---

## 🛠️ Step-by-Step Setup

### Step 1 — Install Node.js

Download and install Node.js from: https://nodejs.org  
Choose the **LTS** version. Install it like a normal program.

To check it worked, open a terminal / command prompt and run:
```
node -v
```
You should see something like `v20.x.x`

---

### Step 2 — Create your Discord Bot

1. Go to: https://discord.com/developers/applications
2. Click **New Application** → Name it `Edit Lab Bot` → Create
3. Click **Bot** in the left menu
4. Click **Reset Token** → Copy the token (save it somewhere safe — you'll need it)
5. Scroll down and **enable these Privileged Intents:**
   - ✅ Server Members Intent
   - ✅ Message Content Intent
6. Click **Save Changes**

---

### Step 3 — Invite the Bot to Your Server

1. In the Developer Portal, go to **OAuth2 → URL Generator**
2. Under **Scopes**, check: `bot` and `applications.commands`
3. Under **Bot Permissions**, check:
   - ✅ Manage Channels
   - ✅ Manage Roles
   - ✅ Send Messages
   - ✅ Read Messages / View Channels
   - ✅ Embed Links
   - ✅ Read Message History
4. Copy the generated URL at the bottom → open it in your browser → invite the bot to your server

---

### Step 4 — Get Your IDs from Discord

Enable Developer Mode in Discord:
- **User Settings → Advanced → Developer Mode → ON**

Now right-click to copy IDs:
- **Server ID** (right-click your server name → Copy Server ID)
- **Client/Application ID** (found in Developer Portal → your app → General Information)
- **Channel IDs** (right-click each channel → Copy Channel ID)
- **Role IDs** (Server Settings → Roles → right-click role → Copy Role ID)

You need:
- Your bot token
- Client/Application ID
- Server (Guild) ID
- Welcome channel ID
- Ticket category ID (create a category called "Orders" in your server)
- Orders log channel ID
- Client role ID
- Premium Client role ID
- Admin role ID
- Staff role ID

---

### Step 5 — Set Up the Project

1. Download or unzip this bot folder
2. Open a terminal in the `the-edit-lab-bot` folder
3. Run:
```
npm install
```
4. Copy `.env.example` and rename it to `.env`:
```
cp .env.example .env
```
5. Open `.env` in any text editor (Notepad, VS Code) and fill in all your IDs:
```
BOT_TOKEN=paste_your_bot_token_here
CLIENT_ID=paste_your_application_id_here
GUILD_ID=paste_your_server_id_here
WELCOME_CHANNEL_ID=paste_channel_id_here
TICKET_CATEGORY_ID=paste_category_id_here
ORDERS_LOG_CHANNEL_ID=paste_channel_id_here
CLIENT_ROLE_ID=paste_role_id_here
PREMIUM_CLIENT_ROLE_ID=paste_role_id_here
ADMIN_ROLE_ID=paste_role_id_here
STAFF_ROLE_ID=paste_role_id_here
```

---

### Step 6 — Deploy Slash Commands

Run this **once** to register all slash commands with Discord:
```
npm run deploy
```
You should see: `✅ All slash commands deployed successfully!`

---

### Step 7 — Start the Bot

```
npm start
```
You should see:
```
✅  Edit Lab Bot is online!
📌  Logged in as: Edit Lab Bot#1234
```

Your bot is now running! 🎉

---

## 📁 Project Structure

```
the-edit-lab-bot/
├── index.js              ← Main bot entry point
├── deploy-commands.js    ← Run once to register slash commands
├── .env                  ← Your secret config (never share this)
├── .env.example          ← Template for .env
├── package.json
├── commands/
│   ├── price.js          ← /price command
│   ├── portfolio.js      ← /portfolio command
│   ├── order.js          ← /order command (opens ticket)
│   ├── status.js         ← /status (update order status)
│   ├── promote.js        ← /promote (assign roles)
│   ├── orders.js         ← /orders (list all orders)
│   └── setup.js          ← /setup (post order panel)
├── events/
│   ├── ready.js          ← Bot startup event
│   ├── guildMemberAdd.js ← Welcome new members
│   ├── messageCreate.js  ← Auto-reply system
│   └── interactionCreate.js ← Buttons, modals, commands router
├── utils/
│   ├── embeds.js         ← Shared brand embeds
│   └── orderStore.js     ← Order storage (JSON file)
└── data/
    └── orders.json       ← Auto-created, stores all orders
```

---

## 🎨 Customization

### Change brand color
Open `utils/embeds.js` and change:
```js
color: 0x5865F2,  // Change to your hex color e.g. 0xFF6B00 for orange
```

### Change pricing
Open `commands/price.js` and edit the prices in the `addFields()` section.

### Add more auto-replies
Open `events/messageCreate.js` and add entries to the `AUTO_REPLIES` object:
```js
const AUTO_REPLIES = {
  'your keyword': () => yourEmbedFunction(),
  ...
};
```

### Keep the bot running 24/7
Use **PM2** (free):
```
npm install -g pm2
pm2 start index.js --name "the-edit-lab-bot"
pm2 startup
pm2 save
```
Or host on **Railway.app** or **Render.com** for free cloud hosting.

---

## ⚠️ Important Notes

- Never share your `.env` file or bot token publicly
- The bot must have a role **higher than** Client/Premium Client roles in the server role hierarchy for role assignment to work
- Run `npm run deploy` again whenever you add new slash commands
- Orders are saved in `data/orders.json` — back this up regularly

---

## 🆘 Common Issues

**Bot not responding to slash commands?**
→ Run `npm run deploy` again and wait 1–2 minutes for Discord to update.

**"Missing Permissions" error?**
→ Check the bot's role is above the roles it's trying to assign in Server Settings → Roles.

**Ticket channel not created?**
→ Make sure `TICKET_CATEGORY_ID` is set correctly and the bot has "Manage Channels" permission.

**Bot goes offline when I close the terminal?**
→ Use PM2 (see above) to keep it running.

---

Made with ❤️ for The Edit Lab
