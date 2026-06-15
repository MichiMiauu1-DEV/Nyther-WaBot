if (!global.db) global.db = {};
if (!global.db.groups) global.db.groups = {};
if (!global.db.users) global.db.users = {};

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

  run: async ({ msg, sock, args }) => {

    const chat = msg.chat;
    const userId = msg.sender;
    const now = Date.now();

    if (!global.db.users[userId]) {
      global.db.users[userId] = {
        achievements: [],
        flagWins: 0,
        flagCooldown: 0
      };
    }

    const u = global.db.users[userId];

    if (!global.db.groups[chat]) global.db.groups[chat] = {};
    const g = global.db.groups[chat];

    // si ya hay partida
    if (g.flagActive) {
      const game = g.flagActive;
      const answer = (msg.text || "").toLowerCase().trim();

      game.attempts ||= {};
      game.blocked ||= [];
      game.winners ||= [];

      if (game.blocked.includes(userId)) {
        return sock.sendMessage(chat, { text: "❌ Ya perdiste esta ronda." }, { quoted: msg });
      }

      if (game.winners.includes(userId)) {
        return sock.sendMessage(chat, { text: "❌ Ya acertaste esta bandera." }, { quoted: msg });
      }

      if (!game.attempts[userId]) game.attempts[userId] = 3;

      if (answer === game.answer) {

        game.winners.push(userId);
        u.flagWins += 1;

        let text =
`🏆 ¡CORRECTO!
🌍 País: ${game.answer}

🎯 Victorias: ${u.flagWins}`;

        // LOGRO (cámbialo luego a 75 cuando ya pruebes)
        if (u.flagWins === 1 && !u.achievements.find(a => a.id === "flag_master")) {
          u.achievements.push({
            id: "flag_master",
            name: "🏆 Ciudadano del Mundo",
            emoji: "🌍",
            description: "Ganar 75 partidas de banderas"
          });

          text += `\n\n🏆 LOGRO DESBLOQUEADO`;
        }

        cleanGame(g);
        return sock.sendMessage(chat, { text }, { quoted: msg });
      }

      game.attempts[userId]--;

      if (game.attempts[userId] <= 0) {
        game.blocked.push(userId);
        cleanGame(g);

        return sock.sendMessage(chat, {
          text:
`💀 GAME OVER
❌ Sin intentos restantes.

🌍 La respuesta correcta era:
➤ ${game.answer}`
        }, { quoted: msg });
      }

      return sock.sendMessage(chat, {
        text: `❌ Incorrecto. Intentos: ${game.attempts[userId]}`
      }, { quoted: msg });
    }

    // crear partida
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

🌍 Nadie acertó: ${q.flag}
➤ ${q.answer}`
      });
    }, 50000);

    return sock.sendMessage(chat, {
      text:
`🌍 ¿Qué país es esta bandera?

${q.flag}

🎮 3 intentos
⏳ 50 segundos`
    }, { quoted: msg });
  }
};
