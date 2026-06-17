// es lo ultimo que hare antes de irme.
if (!global.db) global.db = {};
if (!global.db.groups) global.db.groups = {};
if (!global.db.users) global.db.users = {};

const normalize = (text = "") => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const cleanGame = (g) => {
  if (g.flagTimer) clearTimeout(g.flagTimer);
  if (g.flagInterval) clearInterval(g.flagInterval);
  g.flagTimer = null;
  g.flagInterval = null;
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
  { flag: "🇳🇮", answer: "nicaragua" },
  { flag: "🇯🇵", answer: "japon" },
  { flag: "🇸🇻", answer: "el salvador" },
  { flag: "🇵🇷", answer: "puerto rico" },
  { flag: "🇧🇧", answer: "barbados" },
  { flag: "🇧🇸", answer: "bahamas" },
  { flag: "🇹🇹", answer: "trinidad y tobago" },
  { flag: "🇧🇿", answer: "belice" },
  { flag: "🇱🇺", answer: "luxemburgo" },
  { flag: "🇲🇹", answer: "malta" },
  { flag: "🇨🇾", answer: "chipre" },
  { flag: "🇱🇻", answer: "letonia" },
  { flag: "🇱🇹", answer: "lituania" },
  { flag: "🇪🇪", answer: "estonia" },
  { flag: "🇸🇮", answer: "eslovenia" },
  { flag: "🇲🇪", answer: "montenegro" },
  { flag: "🇦🇱", answer: "albania" },
  { flag: "🇧🇦", answer: "bosnia y herzegovina" },
  { flag: "🇲🇰", answer: "macedonia del norte" },
  { flag: "🇲🇩", answer: "moldavia" },
  { flag: "🇧🇾", answer: "bielorrusia" },
  { flag: "🇮🇩", answer: "indonesia" },
  { flag: "🇵🇰", answer: "pakistan" },
  { flag: "🇧🇩", answer: "bangladesh" },
  { flag: "🇱🇰", answer: "sri lanka" },
  { flag: "🇰🇿", answer: "kazajistan" },
  { flag: "🇺🇿", answer: "uzbekistan" },
  { flag: "🇰🇬", answer: "kirguistan" },
  { flag: "🇹🇯", answer: "tayikistan" },
  { flag: "🇹🇲", answer: "turkmenistan" },
  { flag: "🇮🇷", answer: "iran" },
  { flag: "🇮🇶", answer: "iraq" },
  { flag: "🇯🇴", answer: "jordania" },
  { flag: "🇱🇧", answer: "libano" },
  { flag: "🇸🇾", answer: "siria" },
  { flag: "🇰🇼", answer: "kuwait" },
  { flag: "🇴🇲", answer: "oman" },
  { flag: "🇾🇪", answer: "yemen" },
  { flag: "🇲🇳", answer: "mongolia" },
  { flag: "🇳🇵", answer: "nepal" },
  { flag: "🇧🇹", answer: "butan" },
  { flag: "🇲🇲", answer: "myanmar" },
  { flag: "🇰🇭", answer: "camboya" },
  { flag: "🇱🇦", answer: "laos" },
  { flag: "🇲🇬", answer: "madagascar" },
  { flag: "🇨🇲", answer: "camerun" },
  { flag: "🇸🇳", answer: "senegal" },
  { flag: "🇨🇮", answer: "costa de marfil" },
  { flag: "🇿🇼", answer: "zimbabue" },
  { flag: "🇺🇬", answer: "uganda" },
  { flag: "🇹🇿", answer: "tanzania" },
  { flag: "🇷🇼", answer: "ruanda" },
  { flag: "🇦🇴", answer: "angola" },
  { flag: "🇿🇲", answer: "zambia" },
  { flag: "🇲🇿", answer: "mozambique" },
  { flag: "🇳🇦", answer: "namibia" },
  { flag: "🇧🇼", answer: "botsuana" }
];

export default {
  command: ['bandera'],
  category: 'game',

  run: async ({ msg, sock }) => {

    const chat = msg.chat;
    const userId = msg.sender;

    if (!global.db.users[userId]) {
      global.db.users[userId] = {
        flagWins: 0,
        achievements: []
      };
    }

    const u = global.db.users[userId];

    u.flagWins = Number(u.flagWins);
    if (isNaN(u.flagWins)) u.flagWins = 0;

    if (!global.db.groups[chat]) global.db.groups[chat] = {};
    const g = global.db.groups[chat];

    if (g.flagActive) {

      const game = g.flagActive;

      const answer = normalize(msg.text || "");
      const correct = normalize(game.answer);

      const isCorrect =
        answer === correct ||
        answer.includes(correct) ||
        correct.includes(answer);

      game.attempts ||= {};
      game.blocked ||= [];
      game.winners ||= [];

      if (game.blocked.includes(userId)) {
        return sock.sendMessage(chat, {
          text:
`╭━━━〔 💀 𝙂𝘼𝙈𝙀 𝙊𝙑𝙀𝙍 〕━━━⬣

❌ Ya perdiste esta partida
🌍 La respuesta era: ${game.answer}

╰━━━━━━━━━━━━━━━`
        }, { quoted: msg });
      }

      if (game.winners.includes(userId)) {
        return sock.sendMessage(chat, {
          text:
`╭━━━〔 🏆 𝙔𝘼 𝘾𝙊𝙍𝙍𝙀𝘾𝙏𝙊 〕━━━⬣

❌ Ya acertaste esta bandera

╰━━━━━━━━━━━━━━━`
        }, { quoted: msg });
      }

      if (!game.attempts[userId]) game.attempts[userId] = 3;

      if (isCorrect) {

        game.winners.push(userId);

        u.flagWins = (Number(u.flagWins) || 0) + 1;

        const wins = u.flagWins;

        let text =
`╭━━━〔 🏆 𝘾𝙊𝙍𝙍𝙀𝘾𝙏𝙊 〕━━━⬣

🌍 País: ${game.answer}

🎯 Victorias: ${wins}

╰━━━━━━━━━━━━━━━`;

        // FIX LOGRO (RESTORED + SAFE CHECK)
        if (wins === 75 && !u.achievements.some(a => a.id === "flag_starter")) {
          if (!Array.isArray(u.achievements)) u.achievements = [];

          u.achievements.push({
            id: "flag_starter",
            name: "🌍 Explorador Global",
            emoji: "🏆",
            description: "Ganar 75 partida de banderas"
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
`╭━━━〔 💀 𝙂𝘼𝙈𝙀 𝙊𝙑𝙀𝙍 〕━━━⬣

❌ Perdiste esta partida
🌍 La respuesta era: ${game.answer}

╰━━━━━━━━━━━━━━━`
        }, { quoted: msg });
      }

      return sock.sendMessage(chat, {
        text:
`╭━━━〔 ❌ 𝙄𝙉𝘾𝙊𝙍𝙍𝙀𝘾𝙏𝙊 〕━━━⬣

🎮 Intentos restantes: ${game.attempts[userId]}

╰━━━━━━━━━━━━━━━`
      }, { quoted: msg });
    }

    const q = flags[Math.floor(Math.random() * flags.length)];

    cleanGame(g);

    g.flagActive = {
      flag: q.flag,
      answer: q.answer,
      attempts: {},
      winners: [],
      blocked: []
    };

    g.flagTimer = setTimeout(() => {
      if (!g.flagActive) return;

      cleanGame(g);

      sock.sendMessage(chat, {
        text:
`╭━━━〔 ⌛ 𝙏𝙄𝙀𝙈𝙋𝙊 𝙁𝙄𝙉𝘼𝙇𝙄𝙕𝘼𝘿𝙊 〕━━━⬣

🌍 ${q.flag}
❌ Nadie acertó
🌎 Respuesta: ${q.answer}

╰━━━━━━━━━━━━━━━`
      });
    }, 50000);

    return sock.sendMessage(chat, {
      text:
`╭━━━〔 🌍 𝘽𝘼𝙉𝘿𝙀𝙍𝘼𝙎 〕━━━⬣

${q.flag}

🎮 Adivina el país
⏱️ 50s | 🎯 3 intentos

╰━━━━━━━━━━━━━━━`
    }, { quoted: msg });
  }
};
  
