if (!global.db) global.db = {};
if (!global.db.groups) global.db.groups = {};
if (!global.db.users) global.db.users = {};

const cleanGame = (g) => {
  if (g.flagTimer) clearTimeout(g.flagTimer);
  g.flagTimer = null;
  g.flagActive = null;
};

// 🏳️ FLAGS (PUEDES AGREGAR MÁS AQUÍ)
const flags = [
  { flag: "🇯🇵", answer: "japon" }
];

export default {
  command: ['bandera'],
  category: 'game',

  run: async ({ msg, sock }) => {

    const chat = msg.chat;
    const userId = msg.sender;
    const now = Date.now();

    // 🧠 DB USER SAFE INIT
    if (!global.db.users[userId]) {
      global.db.users[userId] = {
        achievements: [],
        banderaWins: 0,
        banderaCooldown: 0
      };
    }

    const u = global.db.users[userId];

    // 🔥 FIX ANTI NaN + SAFE DATA
    u.banderaWins = Number(u.banderaWins ?? 0);
    u.banderaCooldown = u.banderaCooldown ?? 0;
    u.achievements ||= [];

    // 🧩 DB GROUP
    if (!global.db.groups[chat]) global.db.groups[chat] = {};
    const g = global.db.groups[chat];

    // 🚫 SI YA HAY JUEGO ACTIVO
    if (g.flagActive) {

      const game = g.flagActive;

      const answer = (msg.text || "")
        .replace(/^(\*|#|!|\.)?bandera\s+/i, "")
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      game.attempts ||= {};
      game.blocked ||= [];
      game.winners ||= [];

      if (game.blocked.includes(userId)) {
        return sock.sendMessage(chat, {
          text: "❌ Ya perdiste esta partida de banderas."
        }, { quoted: msg });
      }

      if (game.winners.includes(userId)) {
        return sock.sendMessage(chat, {
          text: "🏆 Ya acertaste esta bandera."
        }, { quoted: msg });
      }

      if (!game.attempts[userId]) game.attempts[userId] = 3;

      // ✅ CORRECTO
      if (answer === game.answer) {

        game.winners.push(userId);

        // 🔥 FIX ESTABLE SUMA
        u.banderaWins = (u.banderaWins || 0) + 1;

        let text =
`🏆 ¡CORRECTO!
🌍 País: ${game.answer}

🎯 Victorias: ${u.banderaWins}`;

        // 🏅 LOGRO (75 WIN)
        if (u.banderaWins >= 75 &&
          !u.achievements.find(a => a.id === "world_citizen")) {

          u.achievements.push({
            id: "world_citizen",
            name: "🌍 Ciudadano del Mundo",
            emoji: "🏆",
            description: "Ganar 75 partidas de banderas"
          });

          text += `\n\n🏆 LOGRO DESBLOQUEADO`;
        }

        cleanGame(g);

        return sock.sendMessage(chat, { text }, { quoted: msg });
      }

      // ❌ ERROR
      game.attempts[userId]--;

      if (game.attempts[userId] <= 0) {
        game.blocked.push(userId);

        cleanGame(g);

        return sock.sendMessage(chat, {
          text:
`💀 GAME OVER
❌ Sin intentos restantes

🌍 La respuesta correcta era:
👉 ${game.answer}`
        }, { quoted: msg });
      }

      return sock.sendMessage(chat, {
        text: `❌ Incorrecto
🎮 Intentos restantes: ${game.attempts[userId]}`
      }, { quoted: msg });
    }

    // 🎮 CREAR PARTIDA
    const q = flags[Math.floor(Math.random() * flags.length)];

    cleanGame(g);

    g.flagActive = {
      flag: q.flag,
      answer: q.answer,
      attempts: {},
      blocked: [],
      winners: []
    };

    g.flagTimer = setTimeout(() => {
      cleanGame(g);

      sock.sendMessage(chat, {
        text:
`⌛ TIEMPO TERMINADO

🌍 Bandera: ${q.flag}
❌ Nadie acertó`
      });

    }, 50000);

    return sock.sendMessage(chat, {
      text:
`🌍 ¿Qué país es esta bandera?

${q.flag}

🎮 3 intentos
⏱️ 50 segundos`
    }, { quoted: msg });

  }
};
