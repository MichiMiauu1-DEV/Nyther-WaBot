import db from '#db';

export default {
  command: ['slut', 'prostituirse', 'riesgo', 'desafioextremo'],
  category: 'economy',
  description: 'Participar en los desafíos de altísimo riesgo de Caine.',
  run: async ({ msg, sock, usedPrefix, text }) => {
    const chatId = msg.chat;
    const senderId = msg.sender;
    const chatData = db.getChat(chatId);

    // 🎪 𝘾𝙄𝙍𝘾𝙊 𝘿𝙄𝙂𝙄𝙏𝘼𝙇 - ECONOMÍA
    if (chatData.adminonly || !chatData.economy) {
      return msg.reply(`╭━━━〔 🎪 𝘾𝙄𝙍𝘾𝙊 𝘿𝙄𝙂𝙄𝙏𝘼𝙇 〕━━━⬣

🚫 ¡RECHORCHOLIS!

La economía de este maravilloso espectáculo ha sido PAUSADA por el sistema del Circo Digital.

🎭 Caine ha cerrado temporalmente la función de recompensas.

💡 Pide a un administrador activar:
» *${usedPrefix}economy on*

╰━━━━━━━━━━━━━━━`);
    }

    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const botSettings = db.getSettings(botId);

    db.setCreate('chat_users', [chatId, senderId], 'lastslut', 0);
    const user = db.getChatUser(chatId, senderId);

    const cooldown = 5 * 60 * 1000;
    const now = Date.now();
    const remaining = (user.lastslut || 0) - now;
    const currency = botSettings.currency;

    // 🎪 𝘾𝘼𝙄𝙉𝙀 𝙎𝙔𝙎𝙏𝙀𝙈 - TIEMPO
    if (remaining > 0) {
      return msg.reply(`╭━━━〔 ⏱️ 𝘾𝘼𝙄𝙉𝙀 𝙎𝙔𝙎𝙏𝙀𝙈 〕━━━⬣

🚫 ¡ALTO AHÍ, TEMERARIO AVENTURERO!

Tus circuitos aún están en enfriamiento después del último espectáculo.

⏳ Debes esperar:
➜ *${msToTime(remaining)}*

🎭 El Circo Digital aún no está listo para otra función contigo...

╰━━━━━━━━━━━━━━━`);
    }

    const success = Math.random() < 0.5;

    const amount = success
      ? Math.floor(Math.random() * (6000 - 3500 + 1)) + 3500
      : Math.floor(Math.random() * (4000 - 2000 + 1)) + 2000;

    db.setChatUser(chatId, senderId, 'lastslut', now + cooldown);

    // 🎪 VICTORIAS
    const winMessages = [
      `¡Te ofreciste como voluntario para que Jax te lanzara cuchillos con los ojos vendados y sobreviviste! Ganaste *¥${amount.toLocaleString()} ${currency}*!`,
      `¡Hiciste malabares con cinco Gloinks explosivos en frente de todo el elenco sin pestañear! Ganaste *¥${amount.toLocaleString()} ${currency}*!`,
      `¡Te vestiste con un ridículo traje de bufón kawaii y bailaste sobre la cuerda floja! El público se volvió loco y ganaste *¥${amount.toLocaleString()} ${currency}*!`,
      `¡Soportaste un monólogo existencial de Kinger sobre insectos durante tres horas seguidas sin gritar! Ganaste *¥${amount.toLocaleString()} ${currency}*!`,
      `¡Le robaste la máscara de la comedia a Gangle en su propia cara y lograste escapar de sus lamentos! Ganaste *¥${amount.toLocaleString()} ${currency}*!`,
      `¡Te metiste a la jaula de los maniquíes furiosos y saliste ileso con un saco de monedas! Ganaste *¥${amount.toLocaleString()} ${currency}*!`,
      `¡Aceptaste ser el blanco de tiro en el cañón humano de Caine y aterrizaste perfectamente en una red de caramelos! Ganaste *¥${amount.toLocaleString()} ${currency}*!`,
      `¡Ganaste un concurso de miradas fijas contra la Luna gigante y la hiciste retroceder! Ganaste *¥${amount.toLocaleString()} ${currency}*!`,
      `¡Ayudaste a Zooble a reordenar todas sus piezas abstractas en un tiempo récord! Te recompensó con *¥${amount.toLocaleString()} ${currency}*!`,
      `¡Te colgaste del trapecio flotante usando solo los dientes mientras Bubble te arrojaba pasteles! Ganaste *¥${amount.toLocaleString()} ${currency}*!`,
      `¡Encontraste la salida del laberinto de espejos distorsionados antes de que tus ojos se derritieran! Ganaste *¥${amount.toLocaleString()} ${currency}*!`,
      `¡Lograste limpiar los dientes de la entrada principal del circo mientras intentaban morderte! Ganaste *¥${amount.toLocaleString()} ${currency}*!`,
      `¡Hiciste que Pomni sonriera genuinamente por primera vez en semanas gracias a tu rutina de chistes! Ganaste *¥${amount.toLocaleString()} ${currency}*!`,
      `¡Apostaste todas tus fichas en la ruleta rusa de sombreros mágicos de Caine y acertaste! Ganaste *¥${amount.toLocaleString()} ${currency}*!`
    ];

    // 🎪 DERROTAS
    const loseMessages = [
      `¡Te distrajiste mirando fijamente al Sol, tropezaste con un cable y perdiste *¥${amount.toLocaleString()} ${currency}*!`,
      `¡Jax te puso una zancadilla justo antes de terminar tu acto acrobático en el trapecio! Perdiste *¥${amount.toLocaleString()} ${currency}*.`,
      `¡Bubble se comió el pastel de utilería donde habías escondido tus ahorros! Perdiste *¥${amount.toLocaleString()} ${currency}*.`,
      `¡Tu rutina de chistes fue tan mala que los espectadores te abuchearon y te confiscaron *¥${amount.toLocaleString()} ${currency}*!`,
      `¡Intentaste domar a un Gloink gigante pero terminó usándote como pelota de ping-pong! Perdiste *¥${amount.toLocaleString()} ${currency}*.`,
      `¡El escenario digital sufrió un parpadeo de texturas en medio de tu acto y caíste al foso! Perdiste *¥${amount.toLocaleString()} ${currency}*.`,
      `¡Kinger se asustó con tu sombra, empezó a lanzar almohadas como loco y rompió tu equipo! Perdiste *¥${amount.toLocaleString()} ${currency}*.`,
      `¡Te quedaste congelado por una crisis de pánico existencial frente a la audiencia y te multaron con *¥${amount.toLocaleString()} ${currency}*!`,
      `¡Intentaste desafiarme en un duelo de magia y terminé convirtiendo tus monedas en mariposas virtuales! Perdiste *¥${amount.toLocaleString()} ${currency}*.`
    ];

    const resultText = success
      ? winMessages[Math.floor(Math.random() * winMessages.length)]
      : loseMessages[Math.floor(Math.random() * loseMessages.length)];

    const message = success
      ? `╭━━━〔 🎪 𝘿𝙀𝙎𝘼𝙁𝙄𝙊 𝙀𝙓𝙏𝙍𝙀𝙈𝙊 〕━━━⬣

✨ ${resultText}

💰 Recompensa:
➜ +${amount.toLocaleString()} ${currency}

🎭 Caine observa tu actuación...

╰━━━━━━━━━━━━━━━`
      : `╭━━━〔 🚫 𝘿𝙀𝙎𝘼𝙁𝙄𝙊 𝙁𝘼𝙇𝙇𝙄𝘿𝙊 〕━━━⬣

⚠️ ${resultText}

💸 Pérdida:
➜ -${amount.toLocaleString()} ${currency}

🎭 El Circo Digital se ríe de tu caída...

╰━━━━━━━━━━━━━━━`;

    // 💰 ECONOMÍA
    if (success) {
      db.setChatUser(chatId, senderId, 'coins', (user.coins || 0) + amount);
    } else {
      const total = (user.coins || 0) + (user.bank || 0);

      if (total >= amount) {
        if (user.coins >= amount) {
          db.setChatUser(chatId, senderId, 'coins', (user.coins || 0) - amount);
        } else {
          const remainingLoss = amount - (user.coins || 0);
          db.setChatUser(chatId, senderId, 'coins', 0);
          db.setChatUser(chatId, senderId, 'bank', (user.bank || 0) - remainingLoss);
        }
      } else {
        db.setChatUser(chatId, senderId, 'coins', 0);
        db.setChatUser(chatId, senderId, 'bank', 0);
      }
    }

    await sock.sendMessage(
      chatId,
      { text: message, mentions: [senderId] },
      { quoted: msg }
    );
  }
};

const msToTime = (duration) => {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const pad = (n) => n.toString().padStart(2, '0');

  if (minutes === 0) {
    return `${pad(seconds)} segundo${seconds !== 1 ? 's' : ''}`;
  }

  return `${pad(minutes)} minuto${minutes !== 1 ? 's' : ''}, ${pad(seconds)} segundo${seconds !== 1 ? 's' : ''}`;
};
