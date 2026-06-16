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
  { flag: "🇬🇧", answer: "reino unido" }, { flag: "🇯🇵", answer: "japon" }, { flag: "🇨🇳", answer: "china" },
  { flag: "🇷🇺", answer: "rusia" }, { flag: "🇹🇷", answer: "turquia" }, { flag: "🇰🇷", answer: "corea del sur" }
];

export default {
  command: ['bandera'],
  category: 'game',
  run: async ({ msg, sock }) => {
    const chat = msg.chat;
    const userId = msg.sender;

    // Asegurar estructura del usuario
    if (!global.db.users[userId]) {
      global.db.users[userId] = { flagWins: 0, coins: 0 };
    }
    
    const u = global.db.users[userId];

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
        
        // Suma de dinero y victorias como en tu sistema de trabajo
        u.flagWins = (u.flagWins || 0) + 1;
        u.coins = (u.coins || 0) + 500;

        const text = `《✧》 ¡CORRECTO!\n\nPaís: ${game.answer}\nRecompensa: +500 Coins\nTotal: ${u.coins} Coins`;
        
        cleanGame(g);
        return sock.sendMessage(chat, { text }, { quoted: msg });
      }

      game.attempts[userId]--;
      if (game.attempts[userId] <= 0) {
        game.blocked.push(userId);
        return sock.sendMessage(chat, { text: `《✧》 FALLASTE. La respuesta era: ${game.answer}` }, { quoted: msg });
      }
      return sock.sendMessage(chat, { text: `《✧》 INCORRECTO. Intentos: ${game.attempts[userId]}` }, { quoted: msg });
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
