export default {
  command: ['therian'],
  category: 'fun',

  run: async ({ msg, sock, args }) => {

    const chat = msg.chat;
    const userId = msg.sender;

    // Obtener usuario objetivo
    let targetId = userId;

    if (args.length > 0) {
      const mentioned =
        msg.mentionedJid?.[0] ||
        (args[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net');

      if (mentioned && mentioned.endsWith('@s.whatsapp.net')) {
        targetId = mentioned;
      }
    }

    // Generar porcentaje aleatorio
    const percentage = Math.floor(Math.random() * 101);

    // Comentarios según porcentaje
    let comment = "";

    if (percentage >= 90) {
      comment = "🐾 Tu conexión con tu lado animal es legendaria. La naturaleza te llama 🌕";
    } else if (percentage >= 70) {
      comment = "🦊 Tienes una energía therian bastante fuerte 👀";
    } else if (percentage >= 50) {
      comment = "🌲 Parece que tu espíritu animal intenta despertar";
    } else if (percentage >= 30) {
      comment = "🐺 Aún estás explorando tu conexión interior";
    } else if (percentage >= 10) {
      comment = "🍃 Quizás necesites pasar más tiempo en la naturaleza";
    } else {
      comment = "🐾 Tu lado humano domina por ahora 😂";
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
`╭━━━〔 🐾 THERIAN METER 〕━━━⬣

${targetTag} ${action} *${percentage}%* Therian

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
