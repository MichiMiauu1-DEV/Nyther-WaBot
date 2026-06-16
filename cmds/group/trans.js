export default {
  command: ['trans'],
  category: 'fun',

  run: async ({ msg, sock, args }) => {

    const chat = msg.chat;
    const userId = msg.sender;

    // Obtener usuario objetivo
    let targetId = userId; // Por defecto el que usa el comando

    if (args.length > 0) {
      const mentioned =
        msg.mentionedJid?.[0] ||
        (args[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net');

      if (mentioned && mentioned.endsWith('@s.whatsapp.net')) {
        targetId = mentioned;
      }
    }

    // Generar porcentaje aleatorio
    const percentage = Math.floor(Math.random() * 101); // 0-100%

    // Comentarios según porcentaje
    let comment = "";

    if (percentage >= 90) {
      comment = "🏳️‍⚧️ ¡Nivel legendario! El trans más trans del servidor 🔥";
    } else if (percentage >= 70) {
      comment = "🏳️‍⚧️ Muy trans, se nota desde lejos 👀";
    } else if (percentage >= 50) {
      comment = "✨ Mitad y mitad, pero la balanza se inclina";
    } else if (percentage >= 30) {
      comment = "😏 Hay señales sospechosas...";
    } else if (percentage >= 10) {
      comment = "🫣 Apenas un poquito, casi imperceptible";
    } else {
      comment = "🔒 0% detectable, resultado inesperado 😂";
    }

    // Mostrar "Tú" o mencionar usuario
    const targetTag =
      targetId === userId
        ? "Tú"
        : `@${targetId.split('@')[0]}`;

    const action =
      targetId === userId
        ? "eres"
        : "es";

    const text =
`╭━━━〔 🏳️‍⚧️ TRANS METER 〕━━━⬣

${targetTag} ${action} *${percentage}%* trans

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
