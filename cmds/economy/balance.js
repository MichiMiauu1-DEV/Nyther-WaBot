import db from '#db';

export default {
  command: ['balance', 'bal', 'coins', 'bank'],
  category: 'economy',
  description: 'Ver los fondos digitales de un habitante en el circo.',
  run: async ({ msg, sock, usedPrefix, text }) => {
    const chatId = msg.chat;
    const chatData = db.getChat(chatId);
    const botId = sock.user.id.split(':')[0] + "@s.whatsapp.net";
    const botSettings = db.getSettings(botId);
    const monedas = botSettings.currency;

    // Si la economía está en mantenimiento dentro del simulador
    if (chatData.adminonly || !chatData.economy) {
      return msg.reply(`╭━━━〔 🚫 𝙀𝘾𝙊𝙉𝙊𝙈𝙄𝘼 𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝘼𝘿𝘼 〕━━━⬣

¡RECHORCHOLIS! ¡La economía de nuestro maravilloso Circo Digital está clausurada en esta carpa!

Dile a tu administrador que encienda los motores de la diversión con el comando:
➜ *${usedPrefix}economy on*

╰━━━━━━━━━━━━━━━`);
    }    

    const who = msg.mentionedJid?.[0] || msg.quoted?.sender || msg.sender;
    const user = db.getChatUser(chatId, who);

    if (!user) {
      return msg.reply(`╭━━━〔 🛑 𝙀𝙍𝙍𝙊𝙍 𝘿𝙀 𝙀𝙎𝘾𝙀𝙉𝘼𝙍𝙄𝙊 〕━━━⬣

¡ERROR DE ESCENARIO! El usuario especificado no parece estar registrado en las bitácoras de esta carpa.

╰━━━━━━━━━━━━━━━`);
    }

    const users = db.getUser(who);
    const total = (user.coins || 0) + (user.bank || 0);

    const bal = `╭━━━〔 🎪 𝙀𝙎𝙏𝘼𝘿𝙊 𝘿𝙀 𝘾𝙐𝙀𝙉𝙏𝘼 〕━━━⬣

» Habitante ➜ *${users?.name || who.split('@')[0]}*

🪙 Cartera Virtual ➜ *¥${user.coins?.toLocaleString() || 0} ${monedas}*
🏦 Bóveda del Circo ➜ *¥${user.bank?.toLocaleString() || 0} ${monedas}*
💎 Activos Totales ➜ *¥${total.toLocaleString()} ${monedas}*

╰━━━━━━━━━━━━━━━

> 🛅 ¡Protege tus fondos de los glitches usando el comando *${usedPrefix}deposit*!`;

    await sock.sendMessage(chatId, { text: bal }, { quoted: msg });
  }
};
