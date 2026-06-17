import db from '#db';

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

    if (!global.db.users[userId]) {
      global.db.users[userId] = { coins: 0, achievements: [], ticStreak: 0 };
    }

    // 🤖 MODO BOT (Integrado como opción inicial sin quitar nada de lo anterior)
    if (normalize(args[0]) === "bot") {
      const bet = parseInt(args[1]);
      if (isNaN(bet) || bet < 1) return sock.reply(chat, "╭━━━〔 ❌ 𝙀𝙍𝙍𝙊𝙍 〕━━━⬣\n\nDebes ingresar una cantidad válida.\nEjemplo: *tic bot 100*\n\n╰━━━━━━━━━━━━━━━", msg);
      if ((global.db.users[userId].coins || 0) < bet) return sock.reply(chat, "╭━━━〔 💸 𝙁𝙊𝙉𝘿𝙊𝙎 𝙄𝙉𝙎𝙐𝙁𝙄𝘾𝙄𝙀𝙉𝙏𝙀𝙎 〕━━━⬣\n\nNo tienes suficientes digitales.\n\n╰━━━━━━━━━━━━━━━", msg);
      
      global.db.users[userId].coins -= bet;
      global.db.games.tic[chat] = { type: "bot", player1: userId, bet: bet, board: Array(9).fill(null) };
      return sock.sendMessage(chat, { text: "╭━━━〔 🤖 𝙋𝘼𝙍𝙏𝙄𝘿𝘼 𝙑𝙎 𝘽𝙊𝙏 〕━━━⬣\n\n¡La IA está lista para destruirte!\n*tic [1-9]* para mover.\n\n╰━━━━━━━━━━━━━━━" }, { quoted: msg });
    }

    // ⚔️ RETO CON APUESTA (PVP ORIGINAL)
    if (msg.mentionedJid?.length) {
      const bet = parseInt(args[1]);
      if (isNaN(bet) || bet < 1) return sock.reply(chat, "╭━━━〔 ❌ 𝙀𝙍𝙍𝙊𝙍 〕━━━⬣\n\nDebes ingresar una cantidad válida (mínimo 1 digital).\nEjemplo: *tic @usuario 100*\n\n╰━━━━━━━━━━━━━━━", msg);
      
      const user = global.db.users[userId];
      if ((user.coins || 0) < bet) return sock.reply(chat, "╭━━━〔 💸 𝙁𝙊𝙉𝘿𝙊𝙎 𝙄𝙉𝙎𝙐𝙁𝙄𝘾𝙄𝙀𝙉𝙏𝙀𝙎 〕━━━⬣\n\nNo tienes suficientes digitales para esta apuesta.\n\n╰━━━━━━━━━━━━━━━", msg);

      const opponent = msg.mentionedJid[0];
      if (!global.db.users[opponent]) global.db.users[opponent] = { coins: 0, achievements: [], ticStreak: 0 };
      if ((global.db.users[opponent].coins || 0) < bet) return sock.reply(chat, "╭━━━〔 💸 𝙁𝙊𝙉𝘿𝙊𝙎 𝙄𝙉𝙎𝙐𝙁𝙄𝘾𝙄𝙀𝙉𝙏𝙀𝙎 〕━━━⬣\n\nTu oponente no tiene suficientes digitales.\n\n╰━━━━━━━━━━━━━━━", msg);

      global.db.games.tic[chat] = { type: "request", player1: userId, player2: opponent, bet: bet, board: Array(9).fill(null), turn: null };

      return sock.sendMessage(chat, {
        text: `╭━━━〔 ⚔️ 𝘿𝙀𝙎𝘼𝙁𝙄́𝙊 𝙏𝙄𝘾 𝙏𝘼𝘾 𝙏𝙊𝙀 〕━━━⬣\n\n👤 @${userId.split('@')[0]} ha desafiado a @${opponent.split('@')[0]} por *${bet} digitales*.\n\n🎮 Usa:\n👉 *tic aceptar\n👉 *tic rechazar\n\n╰━━━━━━━━━━━━━━━`,
        mentions: [userId, opponent]
      }, { quoted: msg });
    }

    // 🟢 ACEPTAR (PVP ORIGINAL)
    if (normalize(args[0]) === "aceptar") {
      if (!g || g.type !== "request" || msg.sender !== g.player2) return;
      global.db.users[g.player1].coins -= g.bet;
      global.db.users[g.player2].coins -= g.bet;
      g.type = "game";
      g.turn = g.player1;
      return sock.sendMessage(chat, { text: "╭━━━〔 🎮 𝙋𝘼𝙍𝙏𝙄𝘿𝘼 𝙄𝙉𝙄𝘾𝙄𝘼𝘿𝘼 〕━━━⬣\n\n¡Apuestas bloqueadas! La partida ha comenzado.\n\n╰━━━━━━━━━━━━━━━", mentions: [g.player1, g.player2] }, { quoted: msg });
    }

    // 🔴 RECHAZAR / CANCELAR (PVP ORIGINAL)
    if (normalize(args[0]) === "rechazar" || normalize(args[0]) === "cancel") {
      if (!g) return;
      if (g.type === "game") return sock.reply(chat, "╭━━━〔 🛑 𝙀𝙍𝙍𝙊𝙍 〕━━━⬣\n\n¡No puedes cancelar una partida en curso!\n\n╰━━━━━━━━━━━━━━━", msg);
      delete global.db.games.tic[chat];
      return sock.reply(chat, "╭━━━〔 💔 𝘿𝙀𝙎𝘼𝙁𝙄́𝙊 𝙍𝙀𝘾𝙃𝘼𝙕𝘼𝘿𝙊 〕━━━⬣\n\nDesafío cancelado.\n\n╰━━━━━━━━━━━━━━━", msg);
    }

    if (!g || (g.type !== "game" && g.type !== "bot")) return;

    const board = g.board;
    const pos = parseInt(args[0]) - 1;

    if (isNaN(pos) || pos < 0 || pos > 8) return sock.reply(chat, "╭━━━〔 ❌ 𝙀𝙍𝙍𝙊𝙍 〕━━━⬣\n\nUsa: *tic [1-9]* para moverte.\n\n╰━━━━━━━━━━━━━━━", msg);
    if (board[pos]) return sock.reply(chat, "╭━━━〔 ❌ 𝘾𝘼𝙎𝙄𝙇𝙇𝘼 𝙊𝘾𝙐𝙋𝘼𝘿𝘼 〕━━━⬣\n\nIntenta con otro número.\n\n╰━━━━━━━━━━━━━━━", msg);
    if (g.type === "game" && g.turn !== msg.sender) return sock.reply(chat, "╭━━━〔 ⏳ 𝙀𝙎𝙋𝙀𝙍𝘼 〕━━━⬣\n\nNo es tu turno.\n\n╰━━━━━━━━━━━━━━━", msg);

    board[pos] = "❌";

    // 🏆 VICTORIA (PVP Y BOT)
    if (checkWin(board, "❌")) {
      const prize = g.bet * 2;
      
      if (g.type === "game") {
        const winner = msg.sender;
        const loser = winner === g.player1 ? g.player2 : g.player1;
        const uWin = global.db.users[winner];
        const uLose = global.db.users[loser];

        const winnerHasLogro1 = uWin.achievements.some(a => a.id === "tic_streak_15");
        const winnerHasLogro2 = uWin.achievements.some(a => a.id === "tic_legend_100");
        const loserHasLogro1 = uLose.achievements.some(a => a.id === "tic_streak_15");

        if (!loserHasLogro1) uLose.ticStreak = 0;
        uWin.ticStreak = (uWin.ticStreak || 0) + 1;

        let msgLogro = "";
        if (uWin.ticStreak === 15 && !winnerHasLogro1) {
          uWin.achievements.push({ id: "tic_streak_15", name: "🔥 Dominio Mental", emoji: "🏆", description: "Ganar 15 partidas seguidas" });
          msgLogro += "\n\n🏆 *¡LOGRO DESBLOQUEADO: DOMINIO MENTAL!* 🏆";
        }
        if (uWin.ticStreak === 100 && winnerHasLogro1 && !winnerHasLogro2) {
          uWin.achievements.push({ id: "tic_legend_100", name: "👑 Leyenda del Tablero", emoji: "👑", description: "100 victorias totales" });
          msgLogro += "\n\n👑 *¡LOGRO DESBLOQUEADO: LEYENDA DEL TABLERO!* 👑";
        }
        uWin.coins += prize;
        delete global.db.games.tic[chat];
        return sock.sendMessage(chat, { text: `╭━━━〔 🏆 𝙂𝘼𝙉𝘼𝘿𝙊𝙍 〕━━━⬣\n\n🎉 <@${winner.split('@')[0]}> ganó *${prize} digitales*!\n${winnerHasLogro1 ? "📊 Victorias totales: " : "🔥 Racha actual: "} *${uWin.ticStreak}*${msgLogro}\n\n╰━━━━━━━━━━━━━━━`, mentions: [winner] }, { quoted: msg });
      } else {
        global.db.users[userId].coins += prize;
        delete global.db.games.tic[chat];
        return sock.reply(chat, "╭━━━〔 🏆 𝙂𝘼𝙉𝘼𝘿𝙊𝙍 〕━━━⬣\n\n¡IMPOSIBLE! Has vencido al bot.\n\n╰━━━━━━━━━━━━━━━", msg);
      }
    }

    // 🤝 EMPATE
    if (!board.includes(null)) {
      if (g.type === "game") {
        global.db.users[g.player1].coins += g.bet;
        global.db.users[g.player2].coins += g.bet;
      }
      delete global.db.games.tic[chat];
      return sock.sendMessage(chat, { text: "╭━━━〔 ⚖️ 𝙀𝙈𝙋𝘼𝙏𝙀 〕━━━⬣\n\n¡Nadie ganó! Se han devuelto las apuestas.\n\n╰━━━━━━━━━━━━━━━" });
    }

    // TURNO BOT
    if (g.type === "bot") {
      const botMove = getBestMove(board);
      board[botMove] = "⭕";
      if (checkWin(board, "⭕")) {
        delete global.db.games.tic[chat];
        return sock.sendMessage(chat, { text: "╭━━━〔 🤖 𝘽𝙊𝙏 𝙒𝙄𝙉 〕━━━⬣\n\nEl bot te ha derrotado.\n\n╰━━━━━━━━━━━━━━━" });
      }
    } else {
      g.turn = g.turn === g.player1 ? g.player2 : g.player1;
    }

    const draw = () => { const b = board.map((v, i) => v ? v : (i + 1) + "️⃣"); return `\n${b[0]} ${b[1]} ${b[2]}\n${b[3]} ${b[4]} ${b[5]}\n${b[6]} ${b[7]} ${b[8]}\n`; };
    return sock.sendMessage(chat, { text: `╭━━━〔 🎮 𝙏𝙄𝘾 𝙏𝘼𝘾 𝙏𝙊𝙀 〕━━━⬣${draw()}\n🎯 ${g.type === "bot" ? "Tu turno." : "Turno: <@" + g.turn.split('@')[0] + ">"}\n╰━━━━━━━━━━━━━━━`, mentions: g.type === "game" ? [g.player1, g.player2] : [] }, { quoted: msg });
  }
};

function checkWin(board, p) {
  const win = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  return win.some(c => c.every(i => board[i] === p));
}

function getBestMove(board) {
  const available = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
  for (let move of available) { let b = [...board]; b[move] = "⭕"; if (checkWin(b, "⭕")) return move; }
  for (let move of available) { let b = [...board]; b[move] = "❌"; if (checkWin(b, "❌")) return move; }
  if (board[4] === null) return 4;
  return available[Math.floor(Math.random() * available.length)];
                                               }
      
