import db from '#db';

export default {
  command: ['robar', 'steal', 'rob'],
  category: 'economy',
  description: 'Intentar saquear las coins de otro habitante del circo.',

  run: async ({ msg, sock, usedPrefix, command }) => {

    const chatData = db.getChat(msg.chat);

    // 🎪 ECONOMY CHECK
    if (chatData.adminonly || !chatData.economy) {
      return msg.reply(
`╭━━━〔 🎪 𝘿𝙄𝙂𝙄𝙏𝘼𝙇 𝘾𝙄𝙍𝘾𝙐𝙎 〕━━━⬣

🚫 ¡RECHORCHOLIS! ECONOMÍA CERRADA

📌 El sistema de saqueos está inactivo

💡 Actívalo con:
» ${usedPrefix}economy on

╰━━━━━━━━━━━━━━━`
      );
    }

    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const bot = db.getSettings(botId);
    const currency = bot.currency;

    db.setCreate('chat_users', [msg.chat, msg.sender], 'laststeal', 0);
    const user = db.getChatUser(msg.chat, msg.sender);

    // ⏳ COOLDOWN
    if (Date.now() < user.laststeal) {
      const restante = user.laststeal - Date.now();

      return sock.reply(
        msg.chat,
`╭━━━〔 ⏳ 𝙍𝙊𝘽𝙊 𝘾𝙊𝙊𝙇𝘿𝙊𝙒𝙉 〕━━━⬣

🎭 ¡ALTO AHÍ, MANOS LARGAS!

🚨 Sistemas de seguridad activos

⏱️ Tiempo restante:
➜ ${formatTime(restante)}

╰━━━━━━━━━━━━━━━`,
        msg
      );
    }

    const who = msg.mentionedJid?.[0] || msg.quoted?.sender || null;

    if (!who) {
      return sock.reply(
        msg.chat,
`╭━━━〔 ⚠️ 𝘼𝙇𝙀𝙍𝙏𝘼 〕━━━⬣

👤 Debes mencionar o responder a un usuario

💡 Ejemplo:
» ${usedPrefix}robar @usuario

╰━━━━━━━━━━━━━━━`,
        msg
      );
    }

    const target = db.getChatUser(msg.chat, who);

    if (!target) {
      return sock.reply(
        msg.chat,
`╭━━━〔 ❌ 𝙀𝙍𝙍𝙊𝙍 〕━━━⬣

👻 Usuario no encontrado en el sistema

╰━━━━━━━━━━━━━━━`,
        msg
      );
    }

    const name = (db.getUser(who))?.name || who.split('@')[0];
    const lastCmd = target.lastCmd || 0;
    const tiempoInactivo = Date.now() - lastCmd;

    // ⏳ INACTIVITY RULE
    if (tiempoInactivo < 3600000) {
      return sock.reply(
        msg.chat,
`╭━━━〔 🛑 𝙁𝙄𝙇𝙏𝙍𝙊 𝘿𝙀 𝙎𝙀𝙂𝙐𝙍𝙄𝘿𝘼𝘿 〕━━━⬣

👤 ${name} está activo

🚫 No puedes robarle aún

⏱️ Espera 1 hora de inactividad

╰━━━━━━━━━━━━━━━`,
        msg,
        { mentions: [who] }
      );
    }

    const chance = Math.random();

    // ❌ FAIL
    if (chance < 0.3) {

      let loss = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;
      const total = (user.coins || 0) + (user.bank || 0);

      if (total >= loss) {
        if (user.coins >= loss) {
          db.setChatUser(msg.chat, msg.sender, 'coins', (user.coins || 0) - loss);
        } else {
          const restanteLoss = loss - (user.coins || 0);
          db.setChatUser(msg.chat, msg.sender, 'coins', 0);
          db.setChatUser(msg.chat, msg.sender, 'bank', Math.max(0, (user.bank || 0) - restanteLoss));
        }
      } else {
        loss = total;
        db.setChatUser(msg.chat, msg.sender, 'coins', 0);
        db.setChatUser(msg.chat, msg.sender, 'bank', 0);
      }

      db.setChatUser(msg.chat, msg.sender, 'laststeal', Date.now() + 3600000);

      return sock.reply(
        msg.chat,
`╭━━━〔 💥 𝙍𝙊𝘽𝙊 𝙁𝘼𝙇𝙇𝙄𝘿𝙊 〕━━━⬣

😵 ¡PLAN FALLIDO!

💀 Te atraparon en el acto

💸 Pérdida:
➜ ¥${loss.toLocaleString()} ${currency}

╰━━━━━━━━━━━━━━━`,
        msg
      );
    }

    // ✅ SUCCESS
    const rob = Math.floor(Math.random() * (9000 - 3000 + 1)) + 3000;

    if ((target.coins || 0) < rob) {
      return sock.reply(
        msg.chat,
`╭━━━〔 ⚠️ 𝘽𝙊𝙏𝙄́𝙉 𝙄𝙉𝙎𝙐𝙁𝙄𝘾𝙄𝙀𝙉𝙏𝙀 〕━━━⬣

👤 ${name} no tiene suficientes fondos visibles

╰━━━━━━━━━━━━━━━`,
        msg,
        { mentions: [who] }
      );
    }

    db.setChatUser(msg.chat, msg.sender, 'coins', (user.coins || 0) + rob);
    db.setChatUser(msg.chat, who, 'coins', (target.coins || 0) - rob);
    db.setChatUser(msg.chat, msg.sender, 'laststeal', Date.now() + 3600000);

    sock.reply(
      msg.chat,
`╭━━━〔 🎭 𝙍𝙊𝘽𝙊 𝙀𝙓𝙄𝙏𝙊𝙎𝙊 〕━━━⬣

✨ ¡Saqueo completado!

👤 Objetivo:
➜ ${name}

💰 Botín:
➜ ¥${rob.toLocaleString()} ${currency}

🎪 El Circo Digital nunca duerme...

╰━━━━━━━━━━━━━━━`,
      msg,
      { mentions: [who] }
    );
  }
};

function formatTime(ms) {
  const totalSec = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  const parts = [];
  if (hours) parts.push(`${hours} hora${hours !== 1 ? 's' : ''}`);
  if (minutes) parts.push(`${minutes} minuto${minutes !== 1 ? 's' : ''}`);
  parts.push(`${seconds} segundo${seconds !== 1 ? 's' : ''}`);

  return parts.join(' ');
    }
