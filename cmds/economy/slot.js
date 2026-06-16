import { delay } from 'baileys';
import db from '#db';

export default {
  command: ['slot'],
  category: 'economy',
  description: 'Probar tu suerte en la caótica máquina tragamonedas de Caine.',

  run: async ({ msg, sock, args, usedPrefix, command, text }) => {
    const chat = db.getChat(msg.chat);

    // ╭━━━〔 🎪 𝙎𝙄𝙎𝙏𝙀𝙈𝘼 𝘿𝙀 𝙀𝘾𝙊𝙉𝙊𝙈𝙄𝘼 〕━━━⬣
    // ⚠️ Estado del Circo Digital
    if (chat.adminonly || !chat.economy) {
      return msg.reply(`╭━━━〔 🚫 𝙀𝘾𝙊𝙉𝙊𝙈𝙄𝘼 𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝘼𝘿𝘼 〕━━━⬣

🎪 ¡RECHORCHOLIS! La economía del Circo Digital ha sido cerrada temporalmente en esta carpa virtual.

📢 Pídele a un administrador que reactive el sistema con:
➜ *${usedPrefix}economy on*

╰━━━━━━━━━━━━━━━`);
    }

    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const bot = db.getSettings(botId);
    const currency = bot.currency;

    db.setCreate('chat_users', [msg.chat, msg.sender], 'lastslot', 0);
    const user = db.getChatUser(msg.chat, msg.sender);

    if (!args[0] || isNaN(args[0]) || parseInt(args[0]) <= 0) {
      return msg.reply(`╭━━━〔 🎰 𝙎𝙇𝙊𝙏 𝙀𝙍𝙍𝙊𝙍 〕━━━⬣

⚠️ Debes ingresar una apuesta válida de *${currency}*

📌 Ejemplo:
➜ *${usedPrefix + command} 500*

╰━━━━━━━━━━━━━━━`);
    }

    const apuesta = parseInt(args[0]);

    // ╭━━━〔 ⏳ 𝙒𝘼𝙄𝙏 𝙏𝙄𝙈𝙀𝙍 〕━━━⬣
    // Control del cooldown
    if (Date.now() - user.lastslot < 30000) {
      const restante = user.lastslot + 30000 - Date.now();

      return msg.reply(`╭━━━〔 ⏳ 𝙀𝙎𝙋𝙀𝙍𝘼 𝘿𝙀 𝙇𝘼 𝙈𝘼𝙌𝙐𝙄𝙉𝘼 〕━━━⬣

🎡 La tragamonedas aún se está reiniciando...

⏱️ Tiempo restante:
➜ *${formatTime(restante)}*

╰━━━━━━━━━━━━━━━`);
    }

    if (apuesta < 100) {
      return msg.reply(`╭━━━〔 ⚠️ 𝙈𝙄𝙉𝙄𝙈𝙊 𝙀𝙍𝙍𝙊𝙍 〕━━━⬣

💰 Apuesta mínima: *¥100 ${currency}*

╰━━━━━━━━━━━━━━━`);
    }

    if (user.coins < apuesta) {
      return msg.reply(`╭━━━〔 💸 𝙁𝙊𝙉𝘿𝙊𝙎 𝙄𝙉𝙎𝙐𝙁𝙄𝘾𝙄𝙀𝙉𝙏𝙀𝙎 〕━━━⬣

⚠️ No tienes suficientes *${currency}* para apostar.

╰━━━━━━━━━━━━━━━`);
    }

    // Emojis
    const emojis = ['👁️', '🐰', '🎪'];

    const getRandomEmojis = () => {
      const x = Array.from({ length: 3 }, () => emojis[Math.floor(Math.random() * emojis.length)]);
      const y = Array.from({ length: 3 }, () => emojis[Math.floor(Math.random() * emojis.length)]);
      const z = Array.from({ length: 3 }, () => emojis[Math.floor(Math.random() * emojis.length)]);
      return { x, y, z };
    };

    const initialText =
`╭━━━〔 🎰 𝙒𝘼𝘾𝙆𝙔 𝙎𝙇𝙊𝙏𝙎 〕━━━⬣

🎪 ¡Girando los rodillos del Circo Digital...

╰━━━━━━━━━━━━━━━`;

    let { key } = await sock.sendMessage(msg.chat, { text: initialText }, { quoted: msg });

    const animateSlots = async () => {
      for (let i = 0; i < 5; i++) {
        const { x, y, z } = getRandomEmojis();

        const animationText =
`╭━━━〔 🎰 𝙒𝘼𝘾𝙆𝙔 𝙎𝙇𝙊𝙏𝙎 〕━━━⬣

   ${x[0]}  :  ${y[0]}  :  ${z[0]}
   ${x[1]}  :  ${y[1]}  :  ${z[1]}
   ${x[2]}  :  ${y[2]}  :  ${z[2]}

🎡 Girando...

╰━━━━━━━━━━━━━━━`;

        await sock.sendMessage(msg.chat, { text: animationText, edit: key }, { quoted: msg });
        await delay(300);
      }
    };

    await animateSlots();

    const { x, y, z } = getRandomEmojis();

    let resultado;
    let newCoins = user.coins;

    if (x[0] === y[0] && y[0] === z[0]) {
      resultado = `🎉 ¡JACKPOT DEL CIRCO! Has ganado *¥${(apuesta * 2).toLocaleString()} ${currency}*!`;
      newCoins += apuesta;
    } else if (x[0] === y[0] || x[0] === z[0] || y[0] === z[0]) {
      resultado = `🎭 ¡CASI LO LOGRAS! Premio pequeño: *¥10 ${currency}*`;
      newCoins += 10;
    } else {
      resultado = `💥 ¡PERDISTE! Se esfuman *¥${apuesta.toLocaleString()} ${currency}*`;
      newCoins -= apuesta;
    }

    db.setChatUser(msg.chat, msg.sender, 'lastslot', Date.now());
    db.setChatUser(msg.chat, msg.sender, 'coins', newCoins);

    const finalText =
`╭━━━〔 🎰 𝙍𝙀𝙎𝙐𝙇𝙏𝘼𝘿𝙊 𝙁𝙄𝙉𝘼𝙇 〕━━━⬣

   ${x[0]}  :  ${y[0]}  :  ${z[0]}
   ${x[1]}  :  ${y[1]}  :  ${z[1]}
   ${x[2]}  :  ${y[2]}  :  ${z[2]}

${resultado}

╰━━━━━━━━━━━━━━━`;

    await sock.sendMessage(msg.chat, { text: finalText, edit: key }, { quoted: msg });
  }
};

function formatTime(ms) {
  const totalSec = Math.ceil(ms / 1000);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  const parts = [];
  if (minutes > 0) parts.push(`${minutes} minuto${minutes !== 1 ? 's' : ''}`);
  parts.push(`${seconds} segundo${seconds !== 1 ? 's' : ''}`);
  return parts.join(' ');
}
