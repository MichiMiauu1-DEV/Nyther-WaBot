if (!global.db) global.db = {};
if (!global.db.groups) global.db.groups = {};
if (!global.db.users) global.db.users = {};

const normalize = (text = "") =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const cleanGame = (g) => {
  if (g.flagTimer) clearTimeout(g.flagTimer);
  g.flagTimer = null;
  g.flagActive = null;
};

const flags = [
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

    if (!global.db.users[userId]) {
      global.db.users[userId] = {
        achievements: [],
        flagWins: 0
      };
    }

    const u = global.db.users[userId];

    if (!global.db.groups[chat]) global.db.groups[chat] = {};
    const g = global.db.groups[chat];

    // 🎮 JUEGO ACTIVO
    if (g.flagActive) {
      const game = g.flagActive;

      const answer = normalize(msg.text || "");
      const correct = normalize(game.answer);

      game.attempts ||= {};
      game.blocked ||= [];
      game.winners ||= [];

      if (game.blocked.includes(userId)) {
        return sock.sendMessage(chat, {
          text:
`╭━━━〔 💀 𝙂𝘼𝙈𝙀 𝙊𝙑𝙀𝙍 〕━━━⬣

❌ Ya perdiste esta ronda

╰━━━━━━━━━━━━━━━━━━`
        }, { quoted: msg });
      }

      if (game.winners.includes(userId)) {
        return sock.sendMessage(chat, {
          text:
`╭━━━〔 🏆 𝘼𝘾𝙀𝙍𝙏𝘼𝙎𝙏𝙀 〕━━━⬣

❌ Ya respondiste correctamente

╰━━━━━━━━━━━━━━━━━━`
        }, { quoted: msg });
      }

      if (!game.attempts[userId]) game.attempts[userId] = 3;

      if (answer === correct) {

        game.winners.push(userId);
        u.flagWins += 1;

        cleanGame(g);

        return sock.sendMessage(chat, {
          text:
`╭━━━〔 🏆 𝘾𝙊𝙍𝙍𝙀𝘾𝙏𝙊 〕━━━⬣

🌍 País: ${game.answer}

🎯 Victorias: ${u.flagWins}

╰━━━━━━━━━━━━━━━━━━`
        }, { quoted: msg });
      }

      game.attempts[userId]--;

      if (game.attempts[userId] <= 0) {
        game.blocked.push(userId);
        cleanGame(g);

        return sock.sendMessage(chat, {
          text:
`╭━━━〔 💀 𝙂𝘼𝙈𝙀 𝙊𝙑𝙀𝙍 〕━━━⬣

❌ Sin intentos restantes

🌍 La respuesta correcta era:
➤ ${game.answer}

╰━━━━━━━━━━━━━━━━━━`
        }, { quoted: msg });
      }

      return sock.sendMessage(chat, {
        text:
`╭━━━〔 ❌ 𝙄𝙉𝘾𝙊𝙍𝙍𝙀𝘾𝙏𝙊 〕━━━⬣

🎮 Intentos restantes: ${game.attempts[userId]}

💡 Sigue intentando...

╰━━━━━━━━━━━━━━━━━━`
        }, { quoted: msg });
    }

    // 🎮 CREAR JUEGO
    const q = flags[Math.floor(Math.random() * flags.length)];

    cleanGame(g);

    g.flagActive = {
      answer: q.answer,
      flag: q.flag,
      attempts: {},
      winners: [],
      blocked: []
    };

    g.flagTimer = setTimeout(() => {
      cleanGame(g);
      sock.sendMessage(chat, {
        text:
`⌛ TIEMPO TERMINADO

🌍 Nadie acertó:
➤ ${q.flag}
➤ Respuesta: ${q.answer}

╰━━━━━━━━━━━━━━━━━━`
      });
    }, 50000);

    return sock.sendMessage(chat, {
      text:
`╭━━━〔 🌍 𝘽𝘼𝙉𝘿𝙀𝙍𝘼𝙎 𝙂𝘼𝙈𝙀 〕━━━⬣

❓ ¿Qué país es esta bandera?

${q.flag}

🎮 3 intentos
⏳ 50 segundos

╰━━━━━━━━━━━━━━━━━━`
    }, { quoted: msg });
  }
};
