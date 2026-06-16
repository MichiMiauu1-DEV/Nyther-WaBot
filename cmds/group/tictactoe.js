export default {
  command: ['tic'],
  category: 'game',

  run: async ({ msg, sock, args }) => {

    const chat = msg.chat;
    const userId = msg.sender;

    if (!global.db) global.db = {};
    if (!global.db.users) global.db.users = {};
    if (!global.db.games) global.db.games = {};
    if (!global.db.games.tic) global.db.games.tic = {};

    const normalize = (t) => (t || "").toLowerCase().trim();
    const g = global.db.games.tic[chat];

    // 👤 INIT USER
    if (!global.db.users[userId]) {
      global.db.users[userId] = {
        achievements: [],
        ticStreak: 0
      };
    }

    // ⚔️ RETO
    if (msg.mentionedJid?.length) {

      const opponent = msg.mentionedJid[0];

      global.db.games.tic[chat] = {
        type: "request",
        player1: userId,
        player2: opponent,
        board: Array(9).fill(null),
        turn: null,
        active: false
      };

      return sock.sendMessage(chat, {
        text:
`╭━━━〔 ⚔️ DESAFÍO TIC TAC TOE 〕━━━⬣

👤 @${userId.split('@')[0]} te ha desafiado

🎮 Usa:
👉 *tic aceptar
👉 *tic rechazar

╰━━━━━━━━━━━━━━━`,
        mentions: [userId, opponent]
      }, { quoted: msg });
    }

    // 🟢 ACEPTAR
    if (normalize(args[0]) === "aceptar") {

      if (!g || g.type !== "request") return;

      if (msg.sender !== g.player2) return;

      g.type = "game";
      g.turn = g.player1;
      g.active = true;

      return sock.sendMessage(chat, {
        text:
`╭━━━〔 🎮 PARTIDA INICIADA 〕━━━⬣

👤 <@${g.player1.split('@')[0]}> vs <@${g.player2.split('@')[0]}>

📌 Tablero:

1️⃣ 2️⃣ 3️⃣
4️⃣ 5️⃣ 6️⃣
7️⃣ 8️⃣ 9️⃣

🎯 Turno: ❌ jugador 1

╰━━━━━━━━━━━━━━━`,
        mentions: [g.player1, g.player2]
      }, { quoted: msg });
    }

    // 🔴 RECHAZAR
    if (normalize(args[0]) === "rechazar") {

      if (!g || g.type !== "request") return;

      if (msg.sender !== g.player2) return;

      delete global.db.games.tic;

      return sock.sendMessage(chat, {
        text:
`╭━━━〔 ❌ DESAFÍO RECHAZADO 〕━━━⬣

💔 Partida cancelada

╰━━━━━━━━━━━━━━━`
      }, { quoted: msg });
    }

    if (!g || g.type !== "game") return;

    const board = g.board;

    const draw = () => {
      const b = board.map((v, i) => v ? v : (i + 1) + "️⃣");
      return `
${b[0]} ${b[1]} ${b[2]}
${b[3]} ${b[4]} ${b[5]}
${b[6]} ${b[7]} ${b[8]}
      `;
    };

    const checkWin = (p) => {
      const win = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
      ];
      return win.some(c => c.every(i => board[i] === p));
    };

    const pos = parseInt(args[0]) - 1;

    if (isNaN(pos) || pos < 0 || pos > 8) {
      return sock.sendMessage(chat, {
        text: "❌ Usa: *tic [1-9]"
      }, { quoted: msg });
    }

    if (board[pos]) {
      return sock.sendMessage(chat, {
        text: "❌ Casilla ocupada"
      }, { quoted: msg });
    }

    const symbol = msg.sender === g.player1 ? "❌" : "⭕";

    if (g.turn !== msg.sender) {
      return sock.sendMessage(chat, {
        text: "⏳ No es tu turno"
      }, { quoted: msg });
    }

    board[pos] = symbol;

    // 🏆 WIN
    if (checkWin(symbol)) {

      const winner = msg.sender;
      const u = global.db.users[winner];

      // 🔥 STREAK SYSTEM
      if (!u.ticStreak) u.ticStreak = 0;

      u.ticStreak += 1;

      // 🏆 ACHIEVEMENT
      if (u.ticStreak === 15 && !u.achievements.find(a => a.id === "tic_streak_15")) {
        u.achievements.push({
          id: "tic_streak_15",
          name: "🔥 Dominio Mental",
          emoji: "🏆",
          description: "Ganar 15 partidas seguidas de Tic Tac Toe"
        });
      }

      delete global.db.games.tic[chat];

      return sock.sendMessage(chat, {
        text:
`╭━━━〔 🏆 GANADOR 〕━━━⬣

${draw()}

🎉 <@${winner.split('@')[0]}> ganó

🔥 Racha: ${u.ticStreak} victorias seguidas

╰━━━━━━━━━━━━━━━`,
        mentions: [winner]
      }, { quoted: msg });
    }

    // 🔁 TURNOS
    g.turn = g.turn === g.player1 ? g.player2 : g.player1;

    return sock.sendMessage(chat, {
      text:
`╭━━━〔 🎮 TIC TAC TOE 〕━━━⬣

${draw()}

🎯 Turno: <@${g.turn.split('@')[0]}>

╰━━━━━━━━━━━━━━━`,
      mentions: [g.player1, g.player2]
    }, { quoted: msg });

  }
};
