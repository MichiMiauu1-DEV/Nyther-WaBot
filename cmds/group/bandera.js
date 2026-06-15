if (!global.db) global.db = {};
if (!global.db.groups) global.db.groups = {};
if (!global.db.users) global.db.users = {};

const cleanGame = (g) => {
  if (g.banderaTimer) clearTimeout(g.banderaTimer);
  g.banderaTimer = null;
  g.banderaActive = null;
};

const countries = [
  { flag: "🇯🇵", answer: "japon" } // ← Agrega aquí los demás países
];

export default {
  command: ['bandera'],
  category: 'game',

  run: async ({ msg, sock }) => {

    const chat = msg.chat;
    const userId = msg.sender;
    const now = Date.now();

    if (!global.db.users[userId]) {
      global.db.users[userId] = {
        achievements: [],
        banderaWins: 0,
        banderaCooldown: 0
      };
    }

    const u = global.db.users[userId];

    if (!global.db.groups[chat]) global.db.groups[chat] = {};
    const g = global.db.groups[chat];

    // Cooldown de 5 segundos
    if (now - (u.banderaCooldown || 0) < 5000) {
      return sock.sendMessage(chat, {
        text: "⏳ Espera 5 segundos antes de iniciar otra partida."
      }, { quoted: msg });
    }

    // RESPONDER
    if (g.banderaActive) {

      const game = g.banderaActive;
      const answer = (msg.text || "")
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      game.attempts ||= {};
      game.blocked ||= [];
      game.winners ||= [];

      if (game.blocked.includes(userId)) {
        return sock.sendMessage(chat, {
          text:
`╭━━━〔 💀 GAME OVER 〕━━━⬣

❌ Ya perdiste esta ronda.

╰━━━━━━━━━━━━━━━`
        }, { quoted: msg });
      }

      if (game.winners.includes(userId)) {
        return sock.sendMessage(chat, {
          text:
`╭━━━〔 🏆 YA ACERTASTE 〕━━━⬣

❌ Ya respondiste correctamente.

╰━━━━━━━━━━━━━━━`
        }, { quoted: msg });
      }

      if (!game.attempts[userId]) game.attempts[userId] = 3;

      if (answer === game.answer) {

        game.winners.push(userId);

        u.banderaWins++;
        u.banderaCooldown = now;

        let text =
`╭━━━〔 🌍 CORRECTO 〕━━━⬣

🏆 Victorias: ${u.banderaWins}

╰━━━━━━━━━━━━━━━`;

        // TEMPORAL: da el logro a la primera victoria
        if (u.banderaWins >= 1 &&
          !u.achievements.find(a => a.id === "world_citizen")) {

          u.achievements.push({
            id: "world_citizen",
            name: "🌍 Ciudadano del Mundo",
            emoji: "🏆",
            description: "Ganar 75 partidas de banderas"
          });

          text += `

🏆 LOGRO DESBLOQUEADO
🌍 Ciudadano del Mundo`;
        }

        cleanGame(g);

        return sock.sendMessage(chat, { text }, { quoted: msg });
      }

      game.attempts[userId]--;

      if (game.attempts[userId] <= 0) {

        game.blocked.push(userId);

        const ans = game.answer;

        cleanGame(g);

        return sock.sendMessage(chat, {
          text:
`╭━━━〔 💀 GAME OVER 〕━━━⬣

❌ Sin intentos restantes.

🌍 La respuesta correcta era:
➤ ${ans}

╰━━━━━━━━━━━━━━━`
        }, { quoted: msg });
      }

      return sock.sendMessage(chat, {
        text:
`╭━━━〔 ❌ INCORRECTO 〕━━━⬣

🎮 Intentos restantes:
➤ ${game.attempts[userId]}/3

╰━━━━━━━━━━━━━━━`
      }, { quoted: msg });
    }

    // CREAR PARTIDA
    const q = countries[Math.floor(Math.random() * countries.length)];

    cleanGame(g);

    g.banderaActive = {
      answer: q.answer,
      flag: q.flag,
      attempts: {},
      blocked: [],
      winners: []
    };

    g.banderaTimer = setTimeout(() => {

      const ans = q.answer;

      cleanGame(g);

      sock.sendMessage(chat, {
        text:
`╭━━━〔 ⌛ TIEMPO AGOTADO 〕━━━⬣

🌍 Bandera:
➤ ${q.flag}

🏳️ País correcto:
➤ ${ans}

╰━━━━━━━━━━━━━━━`
      });

    }, 50000);

    return sock.sendMessage(chat, {
      text:
`╭━━━〔 🌍 BANDERA GAME 〕━━━⬣

🚩 ¿Qué país es esta bandera?

➤ ${q.flag}

🎮 3 intentos
⏳ 50 segundos

╰━━━━━━━━━━━━━━━`
    }, { quoted: msg });

  }
};
