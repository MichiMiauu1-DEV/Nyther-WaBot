import db from '#db';

export default {
  command: ['rt', 'roulette', 'ruleta'],
  category: 'economy',
  description: 'Apuesta tus fondos en la ruleta del Circo Digital.',
  run: async ({ msg, sock, args, usedPrefix, text }) => {
    const chatId = msg.chat;
    const senderId = msg.sender;
    const chatData = db.getChat(chatId);
    
    // ==========================================
    // 🎪 ESTADO ECONÓMICO DEL CIRCO
    // ==========================================
    if (chatData.adminonly || !chatData.economy) {
      return msg.reply(`╭━━━〔 🎪 𝙍𝙐𝙇𝙀𝙏𝘼 𝘿𝙀𝙇 𝘾𝙄𝙍𝘾𝙊 〕━━━⬣
《✧》 ¡RECHORCHOLIS!
La economía de nuestro maravilloso Circo Digital está clausurada en esta carpa.

Dile a tu administrador que la active con:
» *${usedPrefix}economy on*
╰━━━━━━━━━━━━━━━`);
    }
    
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const botSettings = db.getSettings(botId);
    const currency = botSettings.currency || 'Monedas';    
    
    db.setCreate('chat_users', [chatId, senderId], 'lastroulette', 0);    
    const user = db.getChatUser(chatId, senderId);    
    const cooldown = 30 * 1000;    
    
    // ==========================================
    // ⏱️ CONTROL DEL RELOJ DEL CIRCO
    // ==========================================
    if (Date.now() < user.lastroulette) {
      const restante = user.lastroulette - Date.now();
      return msg.reply(`╭━━━〔 ⏳ 𝘾𝙊𝙊𝙇𝘿𝙊𝙒𝙉 𝙍𝙐𝙇𝙀𝙏𝘼 〕━━━⬣
《✧》 ¡MÁS DESPACIO, VELOCISTA DEL AZAR!
La máquina aún se está enfriando.

⏱ Tiempo restante: *${msToTime(restante)}*
╰━━━━━━━━━━━━━━━`);
    }
    
    if (args.length < 2) {
      return msg.reply(`╭━━━〔 🎰 𝙍𝙐𝙇𝙀𝙏𝘼 𝙀𝙍𝙍𝙊𝙍 〕━━━⬣
《✧》 ¡FALTAN DATOS!

Debes ingresar:
💰 Cantidad
🎨 Color (red, black, green)

✐ Ejemplo: *${usedPrefix}ruleta 2000 black*
╰━━━━━━━━━━━━━━━`);
    }    
    
    let amount, color;    
    if (!isNaN(parseInt(args[0]))) {
      amount = parseInt(args[0]);
      color = args[1].toLowerCase();
    } else if (!isNaN(parseInt(args[1]))) {
      color = args[0].toLowerCase();
      amount = parseInt(args[1]);
    } else {
      return msg.reply(`╭━━━〔 🎰 𝙁𝙊𝙍𝙈𝘼𝙏𝙊 𝙄𝙉𝘾𝙊𝙍𝙍𝙀𝘾𝙏𝙊 〕━━━⬣
《✧》 ¡ERROR DE ENTRADA!
Usa el formato correcto:

» *${usedPrefix}ruleta 2000 black*
╰━━━━━━━━━━━━━━━`);
    }    
    
    const validColors = ['red', 'black', 'green'];

    if (isNaN(amount) || amount < 200) {
      return msg.reply(`╭━━━〔 💰 𝘼𝙋𝙐𝙀𝙎𝙏𝘼 𝙈𝙐𝙔 𝘽𝘼𝙅𝘼 〕━━━⬣
《✧》 ¡INSUFICIENTE!

Mínimo permitido:
💰 200 ${currency}
╰━━━━━━━━━━━━━━━`);
    }

    if (!validColors.includes(color)) {
      return msg.reply(`╭━━━〔 🎨 𝘾𝙊𝙇𝙊𝙍 𝙄𝙉𝙑Á𝙇𝙄𝘿𝙊 〕━━━⬣
《✧》 Color no permitido.

🎨 Opciones:
• red
• black
• green
╰━━━━━━━━━━━━━━━`);
    }    
    
    if (user.coins < amount) {
      return msg.reply(`╭━━━〔 💸 𝙎𝙄𝙉 𝙁𝙊𝙉𝘿𝙊𝙎 〕━━━⬣
《✧》 No tienes suficientes ${currency}.

💰 Necesitas: ${amount}
💰 Tienes: ${(user.coins || 0)}
╰━━━━━━━━━━━━━━━`);
    }    
    
    // Aplicamos cooldown
    db.setChatUser(chatId, senderId, 'lastroulette', Date.now() + cooldown);    
    
    const random = Math.floor(Math.random() * 37);
    let resultColor;    
    if (random < 9) resultColor = 'green';
    else if (random < 23) resultColor = 'red';
    else resultColor = 'black';
    
    // ==========================================
    // 🎲 RESULTADO FINAL
    // ==========================================
    if (resultColor === color) {
      const reward = amount * (resultColor === 'green' ? 5 : 2);
      db.setChatUser(chatId, senderId, 'coins', (user.coins || 0) + reward);

      await sock.sendMessage(chatId, {
        text: `╭━━━〔 🎉 𝙍𝙐𝙇𝙀𝙏𝘼 𝙂𝘼𝙉𝘼𝘿𝙊𝙍𝘼 〕━━━⬣
🎡 El destino se detuvo en: *${resultColor.toUpperCase()}*

🎉 ¡VICTORIA ABSOLUTA!

💰 Recompensa:
➜ +¥${reward.toLocaleString()} ${currency}

🎪 El Circo Digital celebra tu suerte
╰━━━━━━━━━━━━━━━`,
        mentions: [senderId]
      }, { quoted: msg });

    } else {
      db.setChatUser(chatId, senderId, 'coins', (user.coins || 0) - amount);

      await sock.sendMessage(chatId, {
        text: `╭━━━〔 💥 𝙍𝙐𝙇𝙀𝙏𝘼 𝘿𝙀𝙍𝙍𝙊𝙏𝘼 〕━━━⬣
🎡 Cayó en: *${resultColor.toUpperCase()}*
🎯 Tu apuesta: *${color.toUpperCase()}*

💸 Resultado:
➜ -¥${amount.toLocaleString()} ${currency}

🎭 El circo se ríe en silencio...
╰━━━━━━━━━━━━━━━`,
        mentions: [senderId]
      }, { quoted: msg });
    }
  }
};

function msToTime(duration) {
  const seconds = Math.ceil(duration / 1000);
  return `${seconds} segundo${seconds !== 1 ? 's' : ''}`;
}
