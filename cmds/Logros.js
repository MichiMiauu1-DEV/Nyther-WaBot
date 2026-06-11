if (!global.db) global.db = {};
if (!global.db.users) global.db.users = {};

export default {
  command: ['logros'],
  category: 'profile',

  run: async (client, m) => {

    const user = m.sender;

    if (!global.db.users[user]) {
      global.db.users[user] = { achievements: [] };
    }

    if (!Array.isArray(global.db.users[user].achievements)) {
      global.db.users[user].achievements = [];
    }

    const achievements = global.db.users[user].achievements;
    const total = achievements.length;

    let rango = "🌱 Despertar";
    let next = "🍃 Caminante";
    let faltan = 5 - total;

    if (total >= 5) {
      rango = "🍃 Caminante";
      next = "⚔️ Aventurero";
      faltan = 10 - total;
    }

    if (total >= 10) {
      rango = "⚔️ Aventurero";
      next = "🛡️ Guardián";
      faltan = 15 - total;
    }

    if (total >= 15) {
      rango = "🛡️ Guardián";
      next = "🔥 Conquistador";
      faltan = 25 - total;
    }

    if (total >= 25) {
      rango = "🔥 Conquistador";
      next = "💎 Maestro";
      faltan = 35 - total;
    }

    if (total >= 35) {
      rango = "💎 Maestro";
      next = "🌟 Héroe Legendario";
      faltan = 45 - total;
    }

    if (total >= 45) {
      rango = "🌟 Héroe Legendario";
      next = "👑 Rey de los Logros";
      faltan = 55 - total;
    }

    if (total >= 55) {
      rango = "👑 Rey de los Logros";
      next = "⚡ Emperador Supremo";
      faltan = 65 - total;
    }

    if (total >= 65) {
      rango = "⚡ Emperador Supremo";
      next = "🌌 Señor de las Estrellas";
      faltan = 75 - total;
    }

    if (total >= 75) {
      rango = "🌌 Señor de las Estrellas";
      next = "☄️ Devorador de Destinos";
      faltan = 85 - total;
    }

    if (total >= 85) {
      rango = "☄️ Devorador de Destinos";
      next = "🐉 Dragón Eterno";
      faltan = 95 - total;
    }

    if (total >= 95) {
      rango = "🐉 Dragón Eterno";
      next = "🏆 El Elegido";
      faltan = 100 - total;
    }

    if (total >= 100) {
      rango = "🏆 El Elegido";
      next = "MAX";
      faltan = 0;
    }

    const porcentaje = Math.min(Math.floor((total / 100) * 100), 100);

    const barra =
      "█".repeat(Math.floor(porcentaje / 10)) +
      "░".repeat(10 - Math.floor(porcentaje / 10));

    const listaLogros = achievements.length
      ? achievements.map((a, i) => {
          return (
            `╭─〔 ${i + 1} 〕\n` +
            `├ 🏆 ${a.name}\n` +
            `├ 📜 ${a.description}\n` +
            `╰────────────`
          );
        }).join("\n\n")
      : "❌ Aún no tienes logros desbloqueados.";

    const text =
`╔══════════════════════╗
      🏆 PANEL DE LOGROS 🏆
╚══════════════════════╝

👤 Usuario:
@${user.split('@')[0]}

🎖️ Rango Actual:
${rango}

━━━━━━━━━━━━━━━
📊 PROGRESO
━━━━━━━━━━━━━━━

🏅 Logros: ${total}/100
📈 Progreso: ${porcentaje}%
[${barra}]

🚀 Próximo rango:
${next}

📌 Faltan para subir:
${faltan}

━━━━━━━━━━━━━━━
📜 LOGROS DESBLOQUEADOS
━━━━━━━━━━━━━━━

${listaLogros}

━━━━━━━━━━━━━━━
💡 Sigue jugando para desbloquear
logros raros, secretos y épicos.
`;

    return client.sendMessage(m.chat, {
      text,
      mentions: [user]
    }, { quoted: m });

  }
};
