import db from '#db';

export default {
  command: ['cofre', 'coffer'],
  category: 'economy',
  description: 'Reclamar tu caja de suministros diarios en la carpa.',
  run: async ({ msg, sock, usedPrefix }) => {
    const chat = db.getChat(msg.chat);
    
    // Si la economía está en mantenimiento dentro del simulador
    if (chat.adminonly || !chat.economy) {
      return msg.reply(`╭━━━〔 🚫 𝙀𝘾𝙊𝙉𝙊𝙈𝙄𝘼 𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝘼𝘿𝘼 〕━━━⬣

¡RECHORCHOLIS! ¡La economía de nuestro maravilloso Circo Digital está clausurada en esta carpa!

Dile a tu administrador que encienda los motores de la diversión con el comando:
➜ *${usedPrefix}economy on*

╰━━━━━━━━━━━━━━━`);
    }        

    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const bot = db.getSettings(botId);
    const currency = bot.currency;
    
    db.setCreate('chat_users', [msg.chat, msg.sender], 'lastcoffer', 0);
    const user = db.getChatUser(msg.chat, msg.sender);
    const now = Date.now();
    const gap = 24 * 60 * 60 * 1000;

    // Validación temporal estricta
    if (now < user.lastcoffer) {
      const restante = user.lastcoffer - now;
      return msg.reply(`╭━━━〔 ⏳ 𝘾𝙊𝙁𝙍𝙀 𝙀𝙉 𝙀𝙉𝙁𝙍𝙄𝘼𝙈𝙄𝙀𝙉𝙏𝙊 〕━━━⬣

¡ALTO AHÍ, SQUELETO AMBICIOSO! Tus manos virtuales ya saquearon un cofre hoy. El dispensador cuántico necesita enfriarse. 

Regresa en: *${msToTime(restante)}*.

╰━━━━━━━━━━━━━━━`);
    }

    const rand = Math.random();
    let reward = 0;
    let message = "";

    // ==========================================
    // ESCENARIO: COFRE NORMAL (50% Probabilidad)
    // ==========================================
    if (rand < 0.5) {
      reward = 25000;
      db.setChatUser(msg.chat, msg.sender, 'coins', (user.coins || 0) + reward);
      
      const normalMessages = [
        `¡Abriste un cofre común de utilería y esquivaste un glitch! Encontraste *¥${reward.toLocaleString()} ${currency}*.`,
        `El cofre estaba lleno de monedas brillantes tiradas por Jax, ¡así que ahora son tuyas! Ganaste *¥${reward.toLocaleString()} ${currency}*.`,
        `¡Encontraste un alijo escondido detrás del escenario principal! Recibes *¥${reward.toLocaleString()} ${currency}*.`,
        `El cofre se abrió con un divertido sonido de bocina de payaso y te otorgó *¥${reward.toLocaleString()} ${currency}*.`,
        `Revisando los restos de una atracción eliminada encontraste un contenedor con *¥${reward.toLocaleString()} ${currency}*.`,
        `¡Un regalo directo de la gerencia del circo! Disfruta de tus *¥${reward.toLocaleString()} ${currency}*.`,
        `El cofre común estaba cubierto de polvo digital, pero dentro guardaba *¥${reward.toLocaleString()} ${currency}*.`
      ];
      message = pickRandom(normalMessages);

    // ==========================================
    // ESCENARIO: COFRE LEGENDARIO (30% Probabilidad)
    // ==========================================
    } else if (rand < 0.8) {
      reward = 40000;
      db.setChatUser(msg.chat, msg.sender, 'coins', (user.coins || 0) + reward);
      
      const legendaryMessages = [
        `¡SANTOS CIELOS! ¡Has desenterrado un Cofre del Reino de Caramelo! Destila oro líquido y te otorga *¥${reward.toLocaleString()} ${currency}*.`,
        `¡El cofre legendario brillaba con la misma intensidad que mis ojos! Dentro había *¥${reward.toLocaleString()} ${currency}*.`,
        `¡Increíble! Encontraste una caja fuerte secreta en la Mansión Spooky cargada con *¥${reward.toLocaleString()} ${currency}*.`,
        `El cofre se abrió con un destello místico que casi desconfigura tu avatar. ¡Ganaste *¥${reward.toLocaleString()} ${currency}*!`,
        `¡Un cofre místico custodiado por un fantasma glitch! Lograste abrirlo y reclamar *¥${reward.toLocaleString()} ${currency}*.`,
        `¡Reventaste los códigos del servidor! Este cofre dorado contenía un botín masivo de *¥${reward.toLocaleString()} ${currency}*.`,
        `El cofre emanaba una energía tan increíble que Pomni dejó de hiperventilar por un segundo. Guarda *¥${reward.toLocaleString()} ${currency}*.`
      ];
      message = pickRandom(legendaryMessages);

    // ==========================================
    // ESCENARIO: COFRE VACÍO / GLITCH (20% Probabilidad)
    // ==========================================
    } else {
      const emptyMessages = [
        "¡OH, NO! Abriste el cofre con gran ilusión... pero Bubble se comió todo lo que había dentro.",
        "El cofre crujió al abrirse... ¡Sólo contenía una nota de Jax burlándose de ti y nada de valor!",
        "Con gran expectativa quitaste el cerrojo, pero el contenido se desvaneció debido a un error de renderizado.",
        "El cofre estaba lleno de telarañas virtuales y ojos flotantes. Nada de monedas por hoy.",
        "¡BOOM! El cofre era una ilusión óptica creada por mí para mantener el suspenso. ¡Está completamente vacío!",
        "Al abrir la tapa, el cofre emitió un eco triste... Parece que los Gloinks pasaron por aquí primero.",
        "Entraste a una zona vacía de texturas y el tesoro no se materializó. ¡Mejores códigos la próxima vez!"
      ];
      message = pickRandom(emptyMessages);
    }

    // Sellamos el cooldown justo al finalizar el proceso exitoso
    db.setChatUser(msg.chat, msg.sender, 'lastcoffer', now + gap);
    
    await msg.reply(`╭━━━〔 📦 𝙍𝙀𝙎𝙐𝙇𝙏𝘼𝘿𝙊 𝘿𝙀𝙇 𝘾𝙊𝙁𝙍𝙀 〕━━━⬣

${message}

╰━━━━━━━━━━━━━━━`);
  }
};

function msToTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const txt = [];
  if (h > 0) txt.push(`${h} hora${h !== 1 ? 's' : ''}`);
  if (m > 0 || h > 0) txt.push(`${m} minuto${m !== 1 ? 's' : ''}`);
  txt.push(`${s} segundo${s !== 1 ? 's' : ''}`);
  return txt.join(' ');
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}
