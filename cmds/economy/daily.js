import db from '#db';

export default {
  command: ['daily', 'diario'],
  category: 'economy',
  description: 'Reclamar tu sustento diario en el Circo Digital.',
  run: async ({ msg, sock, usedPrefix }) => {
    const chat = db.getChat(msg.chat);
    
    if (chat.adminonly || !chat.economy) {
      return msg.reply(`╭━━━〔 🚫 𝙀𝘾𝙊𝙉𝙊𝙈𝙄𝘼 𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝘼𝘿𝘼 〕━━━⬣

¡RECHORCHOLIS! ¡La economía de nuestro maravilloso Circo Digital está clausurada en esta carpa!

Dile a tu administrador que encienda los motores de la diversión con el comando:
➜ *${usedPrefix}economy on*

╰━━━━━━━━━━━━━━━`);
    }
    
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const bot = db.getSettings(botId);
    const monedas = bot.currency;    
    
    db.setCreate('users', msg.sender, 'streak', 0);
    db.setCreate('users', msg.sender, 'lastDailyGlobal', 0);
    db.setCreate('chat_users', [msg.chat, msg.sender], 'lastdaily', 0);    
    
    const users = db.getUser(msg.sender);
    const user = db.getChatUser(msg.chat, msg.sender);    
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const maxStreak = 200;
    
    if (now < user.lastdaily) {
      const restante = formatRemainingTime(user.lastdaily - now);
      return msg.reply(`╭━━━〔 ⏳ 𝘾𝙄𝘾𝙇𝙊 𝙀𝙉 𝙀𝙎𝙋𝙀𝙍𝘼 〕━━━⬣

¡PACIENCIA, ACRÓBATA! Ya has reclamado tus suministros de hoy. 

La gerencia te pide que esperes *${restante}* para el siguiente ciclo.

╰━━━━━━━━━━━━━━━`);
    }
    
    let currentStreak = users.streak;
    const lost = users.streak >= 1 && now - users.lastDailyGlobal > oneDay * 1.5;
    
    if (lost) {
      currentStreak = 0;
      db.setUser(msg.sender, 'streak', 0);
    }
    
    const canClaimGlobal = now - users.lastDailyGlobal >= oneDay;
    if (canClaimGlobal) {
      currentStreak = Math.min(currentStreak + 1, maxStreak);
      db.setUser(msg.sender, 'streak', currentStreak);
      db.setUser(msg.sender, 'lastDailyGlobal', now);
    }
    
    const recompensa = Math.min(20000 + (currentStreak - 1) * 5000, 1015000);
    db.setChatUser(msg.chat, msg.sender, 'coins', (user.coins || 0) + recompensa);
    db.setChatUser(msg.chat, msg.sender, 'lastdaily', now + oneDay);
    
    const siguiente = Math.min(20000 + currentStreak * 5000, 1015000).toLocaleString();
    let footer = `\n\nⴵ Siguiente premio (Día ${currentStreak + 1}) ➜ *¥${siguiente} ${monedas}*`;
    
    if (lost) footer += `\n\n> ⚠️ ¡Oh, no! La racha se ha reiniciado por falta de asistencia. ¡A empezar de nuevo!`;
    
    await msg.reply(`╭━━━〔 🎪 𝘿𝙄́𝘼 ${currentStreak} 𝙀𝙉 𝙀𝙇 𝘾𝙄𝙍𝘾𝙊 〕━━━⬣

Has recibido una recompensa por tu lealtad: 
*¥${recompensa.toLocaleString()} ${monedas}*!${footer}

╰━━━━━━━━━━━━━━━`);
  }
};

function formatRemainingTime(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const seg = s % 60;
  const partes = [];
  if (h) partes.push(`${h} ${h === 1 ? 'hora' : 'horas'}`);
  if (m) partes.push(`${m} ${m === 1 ? 'minuto' : 'minutos'}`);
  if (seg || partes.length === 0) partes.push(`${seg} ${seg === 1 ? 'segundo' : 'segundos'}`);
  return partes.join(' ');
}
