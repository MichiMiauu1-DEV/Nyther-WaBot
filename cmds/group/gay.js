export default {
  command: ['gay'],
  category: 'fun',

  run: async ({ msg, sock, args }) => {

    const chat = msg.chat;
    const userId = msg.sender;

    // Obtener usuario objetivo
    let targetId = userId; // Por defecto el que usa el comando

    if (args.length > 0) {
      const mentioned =
        msg.mentionedJid?.[0] ||
        (args[0].replace('@', '') + '@s.whatsapp.net');

      if (mentioned && mentioned.endsWith('@s.whatsapp.net')) {
        targetId = mentioned;
      }
    }

    // Generar porcentaje aleatorio
    const percentage = Math.floor(Math.random() * 101); // 0-100%

    // Comentarios según porcentaje
    let comment = "";

    if (percentage >= 90) {
      comment = "🏳️‍🌈 ¡Legendario total! El gay más gay del servidor 🔥";
    } else if (percentage >= 70) {
      comment = "🌈 Muy gay, se nota desde lejos 👀";
    } else if (percentage >= 50) {
      comment = "🏳️‍🌈 Mitad y mitad, pero tira más para el arcoíris";
    } else if (percentage >= 30) {
      comment = "😏 Un poquito gay, no lo niegues";
    } else if (percentage >= 10) {
      comment = "🫣 Solo un toque de gay, casi hetero";
    } else {
      comment = "🏳️ Casi 0%, el heterosexual del grupo 😂";
    }

    // Mostrar "Tú" o mencionar usuario
    const targetTag =
      targetId === userId
        ? "Tú"
        : `@${targetId.split('@')[0]}`;

    const text =
`╭━━━〔 🏳️‍🌈 GAY METER 〕━━━⬣

${targetTag} eres *${percentage}%* gay

${comment}

╰━━━━━━━━━━━━━━━`;

    return sock.sendMessage(
      chat,
      {
        text,
        mentions: targetId === userId ? [] : [targetId]
      },
      { quoted: msg }
    );
  }
};
