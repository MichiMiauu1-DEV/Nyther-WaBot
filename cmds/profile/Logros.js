if (!global.db) global.db = {};
if (!global.db.users) global.db.users = {};

export default {
  command: ['logros'],
  category: 'rpg',

  run: async (sock, m) => {

    const userId = m?.sender;

    if (!userId) {
      return m.reply("❌ No se pudo detectar el usuario.");
    }

    if (!global.db.users[userId]) {
      global.db.users[userId] = { achievements: [] };
    }

    const user = global.db.users[userId];

    if (!Array.isArray(user.achievements)) {
      user.achievements = [];
    }

    const total = user.achievements.length;

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

    const text =
`╭━━━〔 🏆 PERFIL DE LOGROS 〕━━━┈

👤 Usuario:
@${userId.split('@')[0]}

👑 Rango:
${rango}

🏅 Logros:
${total}/100

📊 Progreso:
[${barra}] ${porcentaje}%

━━━━━━━━━━━━━━

🚀 Próximo rango:
${next}

📌 Faltan:
${faltan}

╰━━━━━━━━━━━━━━━┈`;

    return sock.sendMessage(
      m.chat,
      {
        text,
        mentions: [userId]
      },
      { quoted: m }
    );
  }
};
