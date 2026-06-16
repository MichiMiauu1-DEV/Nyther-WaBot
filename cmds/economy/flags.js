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
  g.flagTimer = null;
  g.flagActive = null;
};

const flags = [
  { flag: "🇦🇷", answer: "argentina" }, { flag: "🇧🇷", answer: "brasil" }, { flag: "🇨🇦", answer: "canada" },
  { flag: "🇨🇱", answer: "chile" }, { flag: "🇨🇴", answer: "colombia" }, { flag: "🇲🇽", answer: "mexico" },
  { flag: "🇵🇪", answer: "peru" }, { flag: "🇺🇾", answer: "uruguay" }, { flag: "🇻🇪", answer: "venezuela" },
  { flag: "🇪🇸", answer: "españa" }, { flag: "🇺🇸", answer: "estados unidos" }, { flag: "🇫🇷", answer: "francia" },
  { flag: "🇩🇪", answer: "alemania" }, { flag: "🇮🇹", answer: "italia" }, { flag: "🇵🇹", answer: "portugal" },
  { flag: "🇬🇧", answer: "reino unido" }, { flag: "🇮🇪", answer: "irlanda" }, { flag: "🇳🇱", answer: "paises bajos" },
  { flag: "🇧🇪", answer: "belgica" }, { flag: "🇨🇭", answer: "suiza" }, { flag: "🇦🇹", answer: "austria" },
  { flag: "🇸🇪", answer: "suecia" }, { flag: "🇳🇴", answer: "noruega" }, { flag: "🇫🇮", answer: "finlandia" },
  { flag: "🇩🇰", answer: "dinamarca" }, { flag: "🇵🇱", answer: "polonia" }, { flag: "🇺🇦", answer: "ucrania" },
  { flag: "🇷🇺", answer: "rusia" }, { flag: "🇬🇷", answer: "grecia" }, { flag: "🇹🇷", answer: "turquia" },
  { flag: "🇰🇷", answer: "corea del sur" }, { flag: "🇨🇳", answer: "china" }, { flag: "🇮🇳", answer: "india" },
  { flag: "🇯🇵", answer: "japon" }, { flag: "🇦🇺", answer: "australia" }, { flag: "🇳🇿", answer: "nueva zelanda" },
  { flag: "🇪🇬", answer: "egipto" }, { flag: "🇿🇦", answer: "sudafrica" }, { flag: "🇸🇦", answer: "arabia saudita" },
  { flag: "🇶🇦", answer: "qatar" }, { flag: "🇨🇷", answer: "costa rica" }, { flag: "🇵🇦", answer: "panama" },
  { flag: "🇩🇴", answer: "republica dominicana" }, { flag: "🇯🇲", answer: "jamaica" }, { flag: "🇮🇸", answer: "islandia" },
  { flag: "🇨🇿", answer: "republica checa" }, { flag: "🇭🇺", answer: "hungria" }, { flag: "🇷🇴", answer: "rumania" },
  { flag: "🇰🇵", answer: "corea del norte" }, { flag: "🇹🇭", answer: "tailandia" }, { flag: "🇻🇳", answer: "vietnam" },
  { flag: "🇵🇭", answer: "filipinas" }, { flag: "🇸🇬", answer: "singapur" }, { flag: "🇲🇾", answer: "malasia" },
  { flag: "🇲🇦", answer: "marruecos" }, { flag: "🇮🇱", answer: "israel" }, { flag: "🇰🇪", answer: "kenia" },
  { flag: "🇪🇹", answer: "etiopia" }, { flag: "🇹🇳", answer: "tunez" }, { flag: "🇬🇭", answer: "ghana" }
];

export default {
  command: ['bandera'],
  category: 'game',
  run: async ({ msg, sock }) => {
    const chat = msg.chat;
    const userId = msg.sender;

    if (!global.db.users[userId]) global.db.users[userId] = { flagWins: 0, coins: 0 };
    const u = global.db.users[userId];
    u.coins = (u.coins || 0) + 0; 
    u.flagWins = Number(u.flagWins) || 0;

    if (!global.db.groups[chat]) global.db.groups[chat] = {};
    const g = global.db.groups[chat];

    if (g.flagActive) {
      const game = g.flagActive;
      const answer = normalize(msg.text || "");
      const correct = normalize(game.answer);

      if (game.blocked.includes(userId) || game.winners.includes(userId)) return;
      if (!game.attempts[userId]) game.attempts[userId] = 3;

      if (answer === correct || answer.includes(correct) || correct.includes(answer)) {
        game.winners.push(userId);
        u.flagWins += 1;
        u.coins += 5000;

        const text = `《✧》 ¡CORRECTO!\n\nPaís: ${game.answer}\nRecompensa: +5000 Coins\nVictorias: ${u.flagWins}`;
        cleanGame(g);
        return sock.sendMessage(chat, { text }, { quoted: msg });
      }

      game.attempts[userId]--;
      if (game.attempts[userId] <= 0) {
        game.blocked.push(userId);
        return sock.sendMessage(chat, { text: `《✧》 FALLASTE. La respuesta era: ${game.answer}` }, { quoted: msg });
      }
      return sock.sendMessage(chat, { text: `《✧》 INCORRECTO. Intentos restantes: ${game.attempts[userId]}` }, { quoted: msg });
    }

    const q = flags[Math.floor(Math.random() * flags.length)];
    cleanGame(g);
    g.flagActive = { flag: q.flag, answer: q.answer, attempts: {}, winners: [], blocked: [] };
    g.flagTimer = setTimeout(() => {
      if (!g.flagActive) return;
      cleanGame(g);
      sock.sendMessage(chat, { text: `《✧》 TIEMPO AGOTADO. La respuesta era: ${q.answer}` });
    }, 50000);

    return sock.sendMessage(chat, { text: `《✧》 ADIVINA LA BANDERA\n\n${q.flag}\n\nTienes 50 segundos.` }, { quoted: msg });
  }
};
