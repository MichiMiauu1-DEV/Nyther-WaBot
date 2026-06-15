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
  { flag: "🇦🇷", answer: "argentina" },
{ flag: "🇧🇷", answer: "brasil" },
{ flag: "🇨🇦", answer: "canada" },
{ flag: "🇨🇱", answer: "chile" },
{ flag: "🇨🇴", answer: "colombia" },
{ flag: "🇨🇺", answer: "cuba" },
{ flag: "🇲🇽", answer: "mexico" },
{ flag: "🇵🇪", answer: "peru" },
{ flag: "🇺🇾", answer: "uruguay" },
{ flag: "🇻🇪", answer: "venezuela" },

{ flag: "🇺🇸", answer: "estados unidos" },
{ flag: "🇪🇸", answer: "españa" },
{ flag: "🇫🇷", answer: "francia" },
{ flag: "🇩🇪", answer: "alemania" },
{ flag: "🇮🇹", answer: "italia" },
{ flag: "🇵🇹", answer: "portugal" },
{ flag: "🇬🇧", answer: "reino unido" },
{ flag: "🇮🇪", answer: "irlanda" },
{ flag: "🇳🇱", answer: "paises bajos" },
{ flag: "🇧🇪", answer: "belgica" },

{ flag: "🇨🇭", answer: "suiza" },
{ flag: "🇦🇹", answer: "austria" },
{ flag: "🇸🇪", answer: "suecia" },
{ flag: "🇳🇴", answer: "noruega" },
{ flag: "🇫🇮", answer: "finlandia" },
{ flag: "🇩🇰", answer: "dinamarca" },
{ flag: "🇵🇱", answer: "polonia" },
{ flag: "🇺🇦", answer: "ucrania" },
{ flag: "🇷🇺", answer: "rusia" },
{ flag: "🇬🇷", answer: "grecia" },

{ flag: "🇹🇷", answer: "turquia" },
{ flag: "🇰🇷", answer: "corea del sur" },
{ flag: "🇰🇵", answer: "corea del norte" },
{ flag: "🇨🇳", answer: "china" },
{ flag: "🇮🇳", answer: "india" },
{ flag: "🇹🇭", answer: "tailandia" },
{ flag: "🇻🇳", answer: "vietnam" },
{ flag: "🇵🇭", answer: "filipinas" },
{ flag: "🇸🇬", answer: "singapur" },
{ flag: "🇲🇾", answer: "malasia" },

{ flag: "🇦🇺", answer: "australia" },
{ flag: "🇳🇿", answer: "nueva zelanda" },
{ flag: "🇪🇬", answer: "egipto" },
{ flag: "🇿🇦", answer: "sudafrica" },
{ flag: "🇳🇬", answer: "nigeria" },
{ flag: "🇲🇦", answer: "marruecos" },
{ flag: "🇩🇿", answer: "argelia" },
{ flag: "🇸🇦", answer: "arabia saudita" },
{ flag: "🇦🇪", answer: "emiratos arabes unidos" },
{ flag: "🇮🇱", answer: "israel" },

{ flag: "🇶🇦", answer: "qatar" },
{ flag: "🇰🇪", answer: "kenia" },
{ flag: "🇪🇹", answer: "etiopia" },
{ flag: "🇹🇳", answer: "tunez" },
{ flag: "🇬🇭", answer: "ghana" },
{ flag: "🇨🇷", answer: "costa rica" },
{ flag: "🇵🇦", answer: "panama" },
{ flag: "🇩🇴", answer: "republica dominicana" },
{ flag: "🇯🇲", answer: "jamaica" },
{ flag: "🇭🇹", answer: "haiti" },

{ flag: "🇮🇸", answer: "islandia" },
{ flag: "🇨🇿", answer: "republica checa" },
{ flag: "🇭🇺", answer: "hungria" },
{ flag: "🇷🇴", answer: "rumania" },
{ flag: "🇸🇰", answer: "eslovaquia" },
{ flag: "🇭🇷", answer: "croacia" },
{ flag: "🇷🇸", answer: "serbia" },
{ flag: "🇧🇬", answer: "bulgaria" },
{ flag: "🇵🇾", answer: "paraguay" },
{ flag: "🇧🇴", answer: "bolivia" },
{ flag: "🇪🇨", answer: "ecuador" },
{ flag: "🇬🇹", answer: "guatemala" },
{ flag: "🇭🇳", answer: "honduras" },
{ flag: "🇳🇮", answer: "nicaragua" }
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
