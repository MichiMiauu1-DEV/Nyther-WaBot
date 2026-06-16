import db from '#db';

export default {
  command: ['weekly', 'semanal'],
  category: 'economy',
  description: 'Reclamar tu fabuloso bono de supervivencia semanal.',
  run: async ({ msg, sock, usedPrefix }) => {
    const chat = db.getChat(msg.chat);
    
    // Si la economía está en mantenimiento dentro del simulador
    if (chat.adminonly || !chat.economy) {
      return msg.reply(`《✧》 ¡RECHORCHOLIS! ¡La economía de nuestro maravilloso Circo Digital está clausurada en esta carpa!\n\nDile a tu administrador que encienda los motores de la diversión con el comando:\n» *${usedPrefix}economy on*`);
    }        

    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const bot = db.getSettings(botId);
    const currency = bot.currency;
    db.setCreate('users', msg.sender, 'weeklyStreak', 0);
    db.setCreate('users', msg.sender, 'lastWeeklyGlobal', 0);
    db.setCreate('chat_users', [msg.chat, msg.sender], 'lastweekly', 0);
    const users = db.getUser(msg.sender);
    const user = db.getChatUser(msg.chat, msg.sender);
    const gap = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    // Si el usuario viene a pedir monedas antes de tiempo
    if (now < user.lastweekly) {
      const wait = formatTime(Math.floor((user.lastweekly - now) / 1000));
      return sock.reply(msg.chat, `《✧》 ¡ALTO AHÍ, MI IMPACIENTE AMIGO! ¡Los giros de mi WackyWatch indican que ya has vaciado la caja de esta semana!\n\n> Podrás audicionar para tu siguiente bono en: *${wait}*`, msg);
    }

    let currentStreak = users.weeklyStreak;
    const lost = users.weeklyStreak >= 1 && now - users.lastWeeklyGlobal > gap * 1.5;
    
    // ¡Oh no! El humano olvidó su racha semanal
    if (lost) {
      currentStreak = 0;
      db.setUser(msg.sender, 'weeklyStreak', 0);
    }

    const canClaimWeeklyGlobal = now - users.lastWeeklyGlobal >= gap;
    if (canClaimWeeklyGlobal) {
      currentStreak = Math.min(currentStreak + 1, 30);
      db.setUser(msg.sender, 'weeklyStreak', currentStreak);
      db.setUser(msg.sender, 'lastWeeklyGlobal', now);
    }

    const coins = Math.min(40000 + (currentStreak - 1) * 5000, 185000);
    db.setChatUser(msg.chat, msg.sender, 'coins', (user.coins || 0) + coins);
    db.setChatUser(msg.chat, msg.sender, 'lastweekly', now + gap);

    let nextReward = Math.min(40000 + currentStreak * 5000, 185000).toLocaleString();
    let caption = `> Próximo Acto (Semana *${currentStreak + 1}*) » *+¥${nextReward} ${currency}*`;
    
    if (lost) {
      caption += `\n> 《✧》 ¡SANTOS CIELOS! ¡Has descuidado tus obligaciones circenses y perdiste tu racha de semanas por completo!`;
    }

    // ¡Anuncio estruendoso del premio!
    sock.reply(msg.chat, `《✧》 ¡ESPECTACULAR! ¡Has sobrevivido otros 7 días en este maravilloso entorno virtual! Aquí tienes tu gran premio semanal de *¥${coins.toLocaleString()} ${currency}* (Función Número *${currentStreak}*)\n\n${caption}`, msg);
  }
};

function formatTime(t) {
  const d = Math.floor(t / 86400);
  const h = Math.floor((t % 86400) / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  if (d) return `${d} día${d !== 1 ? 's' : ''} ${h} hora${h !== 1 ? 's' : ''} ${m} minuto${m !== 1 ? 's' : ''}`;
  if (h) return `${h} hora${h !== 1 ? 's' : ''} ${m} minuto${m !== 1 ? 's' : ''} ${s} segundo${s !== 1 ? 's' : ''}`;
  if (m) return `${m} minuto${m !== 1 ? 's' : ''} ${s} segundo${s !== 1 ? 's' : ''}`;
  return `${s} segundo${s !== 1 ? 's' : ''}`;
}
