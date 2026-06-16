export default {
  command: ['sans'],
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
      comment = "💀 *Megalovania empieza a sonar...* Sans estaría orgulloso 🔥";
    } else if (percentage >= 70) {
      comment = "🦴 Tienes una energía de Sans bastante fuerte 👀";
    } else if (percentage >= 50) {
      comment = "😎 Ya haces suficientes chistes malos para ser Sans";
    } else if (percentage >= 30) {
      comment = "🦴 Quizás seas un Sans en entrenamiento";
    } else if (percentage >= 10) {
      comment = "😴 Te falta dormir más para ser como Sans";
    } else {
      comment = "👶 Papyrus dice que aún te falta mucho para ser Sans 😂";
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
`╭━━━〔 💀 SANS METER 〕━━━⬣

${targetTag} ${action} *${percentage}%* Sans

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
