import db from '#db';

export default {
  command: ['economyboard', 'eboard', 'baltop'],
  category: 'economy',
  description: 'Ver el ranking de los usuarios más adinerados de la carpa.',
  run: async ({ msg, sock, args, usedPrefix, command, text }) => {
    const chatId = msg.chat;
    const chatData = db.getChat(chatId);
    
    // Verificación de estado del sistema
    if (chatData.adminonly || !chatData.economy) {
      return msg.reply(`╭━━━〔 🚫 𝙀𝘾𝙊𝙉𝙊𝙈𝙄𝘼 𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝘼𝘿𝘼 〕━━━⬣

¡RECHORCHOLIS! ¡La economía de nuestro maravilloso Circo Digital está clausurada en esta carpa!

Dile a tu administrador que encienda los motores de la diversión con el comando:
➜ *${usedPrefix}economy on*

╰━━━━━━━━━━━━━━━`);
    }
    
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const botSettings = db.getSettings(botId);
    const monedas = botSettings.currency;
    
    try {
      const chatUsers = db.getChatUser(chatId, null, { limit: 1000 });
      const users = [];
      
      for (const userData of chatUsers || []) {
        const total = (userData.coins || 0) + (userData.bank || 0);
        if (total >= 1000) {
          const userInfo = db.getUser(userData.user_id);
          users.push({ ...userData, jid: userData.user_id, name: userInfo?.name || 'Usuario Anónimo' });
        }
      }      
      
      if (users.length === 0) {
        return msg.reply(`╭━━━〔 💸 𝙈𝘼𝙂𝙉𝘼𝙏𝙀𝙎 𝘼𝙐𝙎𝙀𝙉𝙏𝙀𝙎 〕━━━⬣

¡VAYA! Nadie aquí tiene suficiente capital para entrar en la lista de los magnates. ¡Toca esforzarse más!

╰━━━━━━━━━━━━━━━`);
      }      
      
      const sorted = users.sort((a, b) => ((b.coins || 0) + (b.bank || 0)) - ((a.coins || 0) + (a.bank || 0)));
      const page = parseInt(args[0]) || 1;
      const pageSize = 10;
      const totalPages = Math.ceil(sorted.length / pageSize);      
      
      if (isNaN(page) || page < 1 || page > totalPages) {
        return msg.reply(`╭━━━〔 🛑 𝙀𝙍𝙍𝙊𝙍 𝘿𝙀 𝙀𝙎𝘾𝙀𝙉𝘼𝙍𝙄𝙊 〕━━━⬣

La página *${page}* no existe. Solo tenemos *${totalPages}* páginas de pura riqueza.

╰━━━━━━━━━━━━━━━`);
      }      
      
      const start = (page - 1) * pageSize;
      const end = start + pageSize;      
      
      let mensaje = `╭━━━〔 🎪 𝙍𝘼𝙉𝙆𝙄𝙉𝙂 𝘿𝙀 𝙈𝘼𝙂𝙉𝘼𝙏𝙀𝙎 〕━━━⬣\n\n`;
      mensaje += sorted.slice(start, end).map(({ name, coins, bank }, i) => {
        const total = (coins || 0) + (bank || 0);
        return `ⴵ *${start + i + 1}*. ${name}\n   └ Total ➜ *¥${total.toLocaleString()} ${monedas}*`;
      }).join('\n\n');      
      
      mensaje += `\n\n╰━━━━━━━━━━━━━━━\n\n> ⌦ Página *${page}* de *${totalPages}*`;
      
      if (page < totalPages) {
        mensaje += `\n> Para ver más fortunas ➜ *${usedPrefix + command} ${page + 1}*`;
      }      
      
      await sock.sendMessage(chatId, { text: mensaje }, { quoted: msg });
      
    } catch (e) {
      await msg.reply(`╭━━━〔 ⚠️ 𝙀𝙍𝙍𝙊𝙍 𝘿𝙀 𝙎𝙄𝙎𝙏𝙀𝙈𝘼 〕━━━⬣

¡SANTOS GLITCHES! Ha ocurrido un error inesperado al renderizar la tabla.

> Error: *${e.message}*

╰━━━━━━━━━━━━━━━`);
    }
  }
};
