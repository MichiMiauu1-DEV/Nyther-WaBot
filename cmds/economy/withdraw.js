import db from '#db';

export default {
  command: ['withdraw', 'with', 'retirar'],
  category: 'economy',
  description: 'Retirar tus coins de la Bóveda de Seguridad.',

  run: async ({ msg, sock, args, usedPrefix, command }) => {

    const chatId = msg.chat;
    const senderId = msg.sender;
    const chatData = db.getChat(chatId);

    // 🎪 ECONOMY CHECK
    if (chatData.adminonly || !chatData.economy) {
      return msg.reply(
`╭━━━〔 🎪 𝘿𝙄𝙂𝙄𝙏𝘼𝙇 𝘾𝙄𝙍𝘾𝙐𝙎 〕━━━⬣

🚫 ¡RECHORCHOLIS! ECONOMÍA CERRADA

💡 Este sistema de la Bóveda está inactivo

📌 Actívalo con:
» ${usedPrefix}economy on

╰━━━━━━━━━━━━━━━`
      );
    }

    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const botSettings = db.getSettings(botId);
    const currency = botSettings.currency;

    const user = db.getChatUser(chatId, senderId);

    // ⚠️ NO ARGUMENT
    if (!args[0]) {
      return msg.reply(
`╭━━━〔 🏦 𝘽𝙊𝙑𝙀𝘿𝘼 𝘿𝙄𝙂𝙄𝙏𝘼𝙇 〕━━━⬣

⚠️ ¡ALTO AHÍ!

📌 Debes indicar una cantidad para retirar

💡 Ejemplo:
» ${usedPrefix + command} 25000
» ${usedPrefix + command} all

╰━━━━━━━━━━━━━━━`
      );
    }

    // 💰 WITHDRAW ALL
    if (args[0].toLowerCase() === 'all') {

      if ((user.bank || 0) <= 0) {
        return msg.reply(
`╭━━━〔 🚫 𝘽𝙊𝙑𝙀𝘿𝘼 𝙑𝘼𝘾𝙄𝘼 〕━━━⬣

💀 No hay fondos en tu cuenta

📌 El vacío digital lo ha consumido todo

╰━━━━━━━━━━━━━━━`
        );
      }

      const amount = user.bank;

      db.setChatUser(chatId, senderId, 'bank', 0);
      db.setChatUser(chatId, senderId, 'coins', (user.coins || 0) + amount);

      return msg.reply(
`╭━━━〔 💰 𝙍𝙀𝙏𝙄𝙍𝙊 𝙏𝙊𝙏𝘼𝙇 〕━━━⬣

✨ Extracción completada con éxito

💸 Retiraste:
➜ ¥${amount.toLocaleString()} ${currency}

⚠️ Ten cuidado… el circo siempre observa

╰━━━━━━━━━━━━━━━`
      );
    }

    const count = parseInt(args[0]);

    if (isNaN(count) || count < 1) {
      return msg.reply(
`╭━━━〔 ❌ 𝙀𝙍𝙍𝙊𝙍 𝙉𝙐𝙈𝙀́𝙍𝙄𝘾𝙊 〕━━━⬣

⚠️ Cantidad inválida

💡 Ejemplo:
» ${usedPrefix + command} 25000
» ${usedPrefix + command} all

╰━━━━━━━━━━━━━━━`
      );
    }

    if ((user.bank || 0) < count) {
      return msg.reply(
`╭━━━〔 🚫 𝙁𝙊𝙉𝘿𝙊𝙎 𝙄𝙉𝙎𝙐𝙁𝙄𝘾𝙄𝙀𝙉𝙏𝙀𝙎 〕━━━⬣

💰 No tienes suficientes fondos en la Bóveda

📌 Disponible:
➜ ¥${user.bank.toLocaleString()} ${currency}

╰━━━━━━━━━━━━━━━`
      );
    }

    db.setChatUser(chatId, senderId, 'bank', user.bank - count);
    db.setChatUser(chatId, senderId, 'coins', (user.coins || 0) + count);

    await msg.reply(
`╭━━━〔 🏦 𝙏𝙍𝘼𝙉𝙎𝘼𝘾𝘾𝙄𝙊́𝙉 𝙀𝙓𝙄𝙏𝙊𝙎𝘼 〕━━━⬣

✨ Retiro completado correctamente

💸 Cantidad:
➜ ¥${count.toLocaleString()} ${currency}

🎭 El Circo Digital registra cada movimiento...

╰━━━━━━━━━━━━━━━`
    );
  }
};
