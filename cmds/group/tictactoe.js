import db from '#db';

function checkWin(board, p) {
  const win = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  return win.some(c => c.every(i => board[i] === p));
}

function getBestMove(board) {
  const available = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
  for (let move of available) { let b = [...board]; b[move] = "⭕"; if (checkWin(b, "⭕")) return move; }
  for (let move of available) { let b = [...board]; b[move] = "❌"; if (checkWin(b, "❌")) return move; }
  if (board[4] === null) return 4;
  return available[Math.floor(Math.random() * available.length)];
}

export default {
  command: ['tic'],
  category: 'game',

  run: async ({ msg, sock, args }) => {
    const chat = msg.chat;
    const userId = msg.sender;

    // Inicialización de DB de juegos si no existe
    if (!global.db.games) global.db.games = {};
    if (!global.db.games.tic) global.db.games.tic = {};
    const g = global.db.games.tic[chat];

    // Asegurar que el usuario existe en la DB del chat
    let user = db.getChatUser(chat, userId);
    if (!user) {
        db.setChatUser(chat, userId, 'coins', 0);
        db.setChatUser(chat, userId, 'achievements', []);
        db.setChatUser(chat, userId, 'ticStreak', 0);
        user = db.getChatUser(chat, userId);
    }

    const normalize = (t) => (t || "").toLowerCase().trim();

    // 🤖 MODO BOT
    if (normalize(args[0]) === "bot") {
      const bet = parseInt(args[1]);
      if (isNaN(bet) || bet < 1) return sock.reply(chat, "╭━━━〔 ❌ 𝙀𝙍𝙍𝙊𝙍 〕━━━⬣\n\nUsa: *tic bot [apuesta]*\n\n╰━━━━━━━━━━━━━━━", msg);
      if ((user.coins || 0) < bet) return sock.reply(chat, "╭━━━〔 💸 𝙁𝙊𝙉𝘿𝙊𝙎 𝙄𝙉𝙎𝙐𝙁𝙄𝘾𝙄𝙀𝙉𝙏𝙀𝙎 〕━━━⬣\n\nNo tienes suficientes digitales.\n\n╰━━━━━━━━━━━━━━━", msg);
      
      db.setChatUser(chat, userId, 'coins', user.coins - bet);
      global.db.games.tic[chat] = { type: "bot", player1: userId, bet: bet, board: Array(9).fill(null) };
      return sock.sendMessage(chat, { text: "╭━━━〔 🤖 𝙋𝘼𝙍𝙏𝙄𝘿𝘼 𝙑𝙎 𝘽𝙊𝙏 〕━━━⬣\n\n¡La IA está lista para destruirte!\n*tic [1-9]* para mover.\n\n╰━━━━━━━━━━━━━━━" }, { quoted: msg });
    }

    // ⚔️ RETO CON APUESTA (PVP)
    if (msg.mentionedJid?.length) {
      const bet = parseInt(args[1]);
      if (isNaN(bet) || bet < 1) return sock.reply(chat, "╭━━━〔 ❌ 𝙀𝙍𝙍𝙊𝙍 〕━━━⬣\n\nEjemplo: *tic @usuario 100*\n\n╰━━━━━━━━━━━━━━━", msg);
      if ((user.coins || 0) < bet) return sock.reply(chat, "╭━━━〔 💸 𝙁𝙊𝙉𝘿𝙊𝙎 𝙄𝙉𝙎𝙐𝙁𝙄𝘾𝙄𝙀𝙉𝙏𝙀𝙎 〕━━━⬣", msg);

      const opponent = msg.mentionedJid[0];
      let op = db.getChatUser(chat, opponent);
      if (!op) { db.setChatUser(chat, opponent, 'coins', 0); op = db.getChatUser(chat, opponent); }
      if ((op.coins || 0) < bet) return sock.reply(chat, "╭━━━〔 💸 𝙁𝙊𝙉𝘿𝙊𝙎 𝙄𝙉𝙎𝙐𝙁𝙄𝘾𝙄𝙀𝙉𝙏𝙀𝙎 〕━━━⬣\n\nTu oponente no tiene suficientes digitales.\n\n╰━━━━━━━━━━━━━━━", msg);

      global.db.games.tic[chat] = { type: "request", player1: userId, player2: opponent, bet: bet, board: Array(9).fill(null), turn: null };
      return sock.sendMessage(chat, { text: `╭━━━〔 ⚔️ 𝘿𝙀𝙎𝘼𝙁𝙄́𝙊 𝙏𝙄𝘾 𝙏𝘼𝘾 𝙏𝙊𝙀 〕━━━⬣\n\n👤 @${userId.split('@')[0]} desafía a @${opponent.split('@')[0]} por *${bet} digitales*.\n\n🎮 Usa: *tic aceptar* o *tic rechazar*\n\n╰━━━━━━━━━━━━━━━`, mentions: [userId, opponent] }, { quoted: msg });
    }

    // 🟢 ACEPTAR
    if (normalize(args[0]) === "aceptar") {
      if (!g || g.type !== "request" || msg.sender !== g.player2) return;
      let p1 = db.getChatUser(chat, g.player1);
      let p2 = db.getChatUser(chat, g.player2);
      db.setChatUser(chat, g.player1, 'coins', p1.coins - g.bet);
      db.setChatUser(chat, g.player2, 'coins', p2.coins - g.bet);
      g.type = "game";
      g.turn = g.player1;
      return sock.sendMessage(chat, { text: "╭━━━〔 🎮 𝙋𝘼𝙍𝙏𝙄𝘿𝘼 𝙄𝙉𝙄𝘾𝙄𝘼𝘿𝘼 〕━━━⬣\n\n¡Apuestas bloqueadas!\n\n╰━━━━━━━━━━━━━━━", mentions: [g.player1, g.player2] }, { quoted: msg });
    }

    // 🔴 RECHAZAR / CANCELAR
    if (normalize(args[0]) === "rechazar" || normalize(args[0]) === "cancel") {
      if (!g) return;
      if (g.type === "game") return sock.reply(chat, "╭━━━〔 🛑 𝙀𝙍𝙍𝙊𝙍 〕━━━⬣\n\n¡No puedes cancelar una partida en curso!\n\n╰━━━━━━━━━━━━━━━", msg);
      delete global.db.games.tic[chat];
      return sock.reply(chat, "╭━━━〔 💔 𝘿𝙀𝙎𝘼𝙁𝙄́𝙊 𝙍𝙀𝘾𝙃𝘼𝙕𝘼𝘿𝙊 〕━━━⬣\n\nDesafío cancelado.\n\n╰━━━━━━━━━━━━━━━", msg);
    }

    if (!g || (g.type !== "game" && g.type !== "bot")) return;

    const board = g.board;
    const pos = parseInt(args[0]) - 1;

    if (isNaN(pos) || pos < 0 || pos > 8 || board[pos]) return sock.reply(chat, "╭━━━〔 ❌ 𝙀𝙍𝙍𝙊𝙍 〕━━━⬣\n\nCasilla inválida u ocupada.\n\n╰━━━━━━━━━━━━━━━", msg);
    if (g.type === "game" && g.turn !== msg.sender) return sock.reply(chat, "╭━━━〔 ⏳ 𝙀𝙎𝙋𝙀𝙍𝘼 〕━━━⬣\n\nNo es tu turno.\n\n╰━━━━━━━━━━━━━━━", msg);

    board[pos] = "❌";

    // 🏆 VICTORIA
    if (checkWin(board, "❌")) {
      const prize = g.bet * 2;
      let uWin = db.getChatUser(chat, userId);
      db.setChatUser(chat, userId, 'coins', (uWin.coins || 0) + prize);

      if (g.type === "game") {
        const loserId = userId === g.player1 ? g.player2 : g.player1;
        let uLose = db.getChatUser(chat, loserId);
        
        const h1 = (uWin.achievements || []).some(a => a.id === "tic_streak_15");
        const h2 = (uWin.achievements || []).some(a => a.id === "tic_legend_100");
        const l1 = (uLose.achievements || []).some(a => a.id === "tic_streak_15");

        if (!l1) db.setChatUser(chat, loserId, 'ticStreak', 0);
        db.setChatUser(chat, userId, 'ticStreak', (uWin.ticStreak || 0) + 1);
        let newStreak = (uWin.ticStreak || 0) + 1;

        let msgLogro = "";
        if (newStreak === 15 && !h1) {
          let ach = uWin.achievements || [];
          ach.push({ id: "tic_streak_15", name: "🔥 Dominio Mental", emoji: "🏆", description: "15 victorias seguidas" });
          db.setChatUser(chat, userId, 'achievements', ach);
          msgLogro += "\n\n🏆 *¡LOGRO DESBLOQUEADO: DOMINIO MENTAL!* 🏆";
        }
        if (newStreak === 100 && h1 && !h2) {
          let ach = uWin.achievements || [];
          ach.push({ id: "tic_legend_100", name: "👑 Leyenda del Tablero", emoji: "👑", description: "100 victorias totales" });
          db.setChatUser(chat, userId, 'achievements', ach);
          msgLogro += "\n\n👑 *¡LOGRO DESBLOQUEADO: LEYENDA DEL TABLERO!* 👑";
        }
        delete global.db.games.tic[chat];
        return sock.sendMessage(chat, { text: `╭━━━〔 🏆 𝙂𝘼𝙉𝘼𝘿𝙊𝙍 〕━━━⬣\n\n🎉 <@${userId.split('@')[0]}> ganó *${prize} digitales*!\n${h1 ? "📊 Victorias totales: " : "🔥 Racha actual: "} *${newStreak}*${msgLogro}\n\n╰━━━━━━━━━━━━━━━`, mentions: [userId] }, { quoted: msg });
      } else {
        delete global.db.games.tic[chat];
        return sock.reply(chat, "╭━━━〔 🏆 𝙂𝘼𝙉𝘼𝘿𝙊𝙍 〕━━━⬣\n\n¡IMPOSIBLE! Has vencido al bot.\n\n╰━━━━━━━━━━━━━━━", msg);
      }
    }

    // 🤝 EMPATE
    if (!board.includes(null)) {
      if (g.type === "game") {
        let p1 = db.getChatUser(chat, g.player1);
        let p2 = db.getChatUser(chat, g.player2);
        db.setChatUser(chat, g.player1, 'coins', p1.coins + g.bet);
        db.setChatUser(chat, g.player2, 'coins', p2.coins + g.bet);
      }
      delete global.db.games.tic[chat];
      return sock.reply(chat, "╭━━━〔 ⚖️ 𝙀𝙈𝙋𝘼𝙏𝙀 〕━━━⬣\n\n¡Nadie ganó! Se han devuelto las apuestas.\n\n╰━━━━━━━━━━━━━━━", msg);
    }

    // TURNO BOT
    if (g.type === "bot") {
      const botMove = getBestMove(board);
      board[botMove] = "⭕";
      if (checkWin(board, "⭕")) {
        delete global.db.games.tic[chat];
        return sock.reply(chat, "╭━━━〔 🤖 𝘽𝙊𝙏 𝙒𝙄𝙉 〕━━━⬣\n\nEl bot te ha derrotado.\n\n╰━━━━━━━━━━━━━━━", msg);
      }
    } else {
      g.turn = g.turn === g.player1 ? g.player2 : g.player1;
    }

    const draw = () => board.map((v, i) => v ? v : (i + 1) + "️⃣").join(" ");
    sock.reply(chat, `╭━━━〔 🎮 𝙏𝙄𝘾 𝙏𝘼𝘾 𝙏𝙊𝙀 〕━━━⬣\n${board[0]} ${board[1]} ${board[2]}\n${board[3]} ${board[4]} ${board[5]}\n${board[6]} ${board[7]} ${board[8]}\n\n🎯 ${g.type === "bot" ? "Tu turno." : "Turno: <@" + g.turn.split('@')[0] + ">"}\n╰━━━━━━━━━━━━━━━`, msg);
  }
};
