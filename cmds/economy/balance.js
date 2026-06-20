import db from '#db';

export default {
  command: ['balance', 'bal', 'coins', 'bank'],
  category: 'economy',
  description: 'Ver los fondos digitales de un habitante en el circo.',
  run: async ({ msg, sock, usedPrefix }) => {
    const chatId = msg.chat;
    const chatData = db.getChat(chatId);
    const botId = sock.user.id.split(':')[0] + "@s.whatsapp.net";
    const botSettings = db.getSettings(botId);
    const monedas = botSettings?.currency || 'Coins';

    if (chatData.adminonly || !chatData.economy) {
      return msg.reply(`╭━━━〔 🚫 𝙀𝘾𝙊𝙉𝙊𝙈𝙄𝘼 𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝘼𝘿𝘼 〕━━━⬣\n\n¡RECHORCHOLIS! ¡La economía está clausurada!\n➜ *${usedPrefix}economy on*\n╰━━━━━━━━━━━━━━━`);
    }    

    // Función para formatear números largos
    const formatear = (num) => {
      if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
      if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
      if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
      if (num >= 1e3) return (num / 1e3).toFixed(2) + 'k';
      return num.toString();
    };

    const who = msg.mentionedJid?.[0] || msg.quoted?.sender || msg.sender;
    const user = db.getChatUser(chatId, who);

    if (!user) {
      return msg.reply(`╭━━━〔 🛑 𝙀𝙍𝙍𝙊𝙍 𝘿𝙀 𝙀𝙎𝘾𝙀𝙉𝘼𝙍𝙄𝙊 〕━━━⬣\n\nEl usuario no está registrado en las bitácoras.\n╰━━━━━━━━━━━━━━━`);
    }

    const users = db.getUser(who);
    const total = (user.coins || 0) + (user.bank || 0);

    const bal = `╭━━━〔 🎪 𝙀𝙎𝙏𝘼𝘿𝙊 𝘿𝙀 𝘾𝙐𝙀𝙉𝙏𝘼 〕━━━⬣

» Habitante ➜ *${users?.name || who.split('@')[0]}*

🪙 Cartera Virtual ➜ *¥${formatear(user.coins || 0)} ${monedas}*
🏦 Bóveda del Circo ➜ *¥${formatear(user.bank || 0)} ${monedas}*
💎 Activos Totales ➜ *¥${formatear(total)} ${monedas}*

╰━━━━━━━━━━━━━━━

> 🛅 ¡Protege tus fondos usando *${usedPrefix}deposit*!`;

    await sock.sendMessage(chatId, { text: bal }, { quoted: msg });
  }
};
