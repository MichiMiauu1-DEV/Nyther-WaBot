if (!global.db) global.db = {};
if (!global.db.groups) global.db.groups = {};
if (!global.db.users) global.db.users = {};

const cleanGame = (g) => {
  if (g.peliTimer) clearTimeout(g.peliTimer);
  g.peliTimer = null;
  g.peliActive = null;
};

export default {
  command: ['peli'],
  category: 'game',

  run: async ({ msg, sock, args }) => {

    const chat = msg.chat;
    const userId = msg.sender;
    const now = Date.now();

    // 🧠 DB SAFE
    if (!global.db.users[userId]) {
      global.db.users[userId] = {
        achievements: [],
        peliGame: { wins: 0, cooldown: 0 }
      };
    }

    const u = global.db.users[userId];
    u.peliGame ||= { wins: 0, cooldown: 0 };

    if (!global.db.groups[chat]) global.db.groups[chat] = {};
    const g = global.db.groups[chat];

    // ⏳ cooldown anti spam
    if (now - (u.peliGame.cooldown || 0) < 5000) {
      return sock.sendMessage(chat, {
        text: "⏳ Espera 5 segundos antes de jugar otra partida."
      }, { quoted: msg });
    }

    // 🎬 50 PELÍCULAS EXACTAS
    const movies = [
      { emoji: "🦁👑", answer: "el rey leon" },
      { emoji: "🧊🚢💔", answer: "titanic" },
      { emoji: "🦖🏞️", answer: "jurassic park" },
      { emoji: "🧙💍🌋", answer: "el señor de los anillos" },
      { emoji: "🕷️👨", answer: "spiderman" },
      { emoji: "🟢👹", answer: "shrek" },
      { emoji: "🐼🥋", answer: "kung fu panda" },
      { emoji: "🚀🤠🧸", answer: "toy story" },
      { emoji: "❄️👸", answer: "frozen" },
      { emoji: "🐠🔍", answer: "buscando a nemo" },

      { emoji: "🤖🌎🚀", answer: "wall e" },
      { emoji: "🏠🎈👴", answer: "up" },
      { emoji: "🚗🏁", answer: "cars" },
      { emoji: "👻🚫", answer: "los cazafantasmas" },
      { emoji: "🦇🃏", answer: "batman el caballero de la noche" },
      { emoji: "🧑‍🚀🌌🕳️", answer: "interestelar" },
      { emoji: "🦍🏢", answer: "king kong" },
      { emoji: "🦈🌊", answer: "tiburon" },
      { emoji: "🤠👽", answer: "toy story" },
      { emoji: "🐉🫏👸", answer: "shrek" },

      { emoji: "🧞‍♂️🪔", answer: "aladdin" },
      { emoji: "👸🌹🦁", answer: "la bella y la bestia" },
      { emoji: "🧜‍♀️🌊", answer: "la sirenita" },
      { emoji: "🐘🎪", answer: "dumbo" },
      { emoji: "🪵👦🤥", answer: "pinocho" },
      { emoji: "🐺👧🧺", answer: "caperucita roja" },
      { emoji: "🐭👸👠", answer: "cenicienta" },
      { emoji: "🍎👸😴", answer: "blancanieves" },
      { emoji: "🐲⚔️", answer: "como entrenar a tu dragon" },
      { emoji: "🐧🏄", answer: "happy feet" },

      { emoji: "🕸️🕷️🌌", answer: "spiderman un nuevo universo" },
      { emoji: "🟩💪", answer: "hulk" },
      { emoji: "🛡️⭐", answer: "capitan america" },
      { emoji: "🔨⚡", answer: "thor" },
      { emoji: "🤖❤️", answer: "el hombre bicentenario" },
      { emoji: "🦾🤖🔥", answer: "terminator" },
      { emoji: "🧬🦍🐴", answer: "el planeta de los simios" },
      { emoji: "🚢🧊", answer: "titanic" },
      { emoji: "🌪️🧙‍♀️👠", answer: "el mago de oz" },
      { emoji: "🦎🏙️", answer: "godzilla" },

      { emoji: "🕶️💊🖥️", answer: "matrix" },
      { emoji: "👨‍🚀🌕", answer: "apolo 13" },
      { emoji: "🦸‍♂️⚡", answer: "shazam" },
      { emoji: "🧹⚡🧙", answer: "harry potter" },
      { emoji: "🐒🗿", answer: "el planeta de los simios" },
      { emoji: "👨‍🔬🧪🟢", answer: "el increible hulk" },
      { emoji: "🦸‍♂️🦇", answer: "batman" },
      { emoji: "⚔️🏛️", answer: "gladiador" },
      { emoji: "🏹🔥", answer: "los juegos del hambre" },
      { emoji: "👻🎃🎄", answer: "el extraño mundo de jack" }
    ];

    // 🧠 GAME ACTIVO
    if (g.peliActive) {

      const game = g.peliActive;
      const answer = (args.join(" ") || "").toLowerCase().trim();

      if (!answer) {
        return sock.sendMessage(chat, {
          text: "🎬 Ya hay una película activa."
        }, { quoted: msg });
      }

      game.attempts ||= {};
      game.blocked ||= [];
      game.winners ||= [];

      if (game.winners.includes(userId)) {
        return sock.sendMessage(chat, {
          text: "❌ Ya acertaste esta película."
        }, { quoted: msg });
      }

      if (game.blocked.includes(userId)) {
        return sock.sendMessage(chat, {
          text: "❌ Ya perdiste esta partida."
        }, { quoted: msg });
      }

      if (!game.attempts[userId]) game.attempts[userId] = 3;

      if (answer === game.answer) {

        game.winners.push(userId);

        u.peliGame.wins += 1;
        u.peliGame.cooldown = now;

        let text =
`🎉 ¡CORRECTO!
🎬 Película: ${game.answer}
🏆 Victorias: ${u.peliGame.wins}`;

        // 🏆 LOGRO
        if (u.peliGame.wins === 50 && !u.achievements.find(a => a.id === "maestro_septimo_arte")) {
          u.achievements.push({
            id: "maestro_septimo_arte",
            name: "🎞️ Maestro del Séptimo Arte",
            emoji: "🏆",
            description: "Adivina correctamente 50 películas por emojis."
          });

          text += `\n\n🏆 LOGRO DESBLOQUEADO`;
        }

        cleanGame(g);

        return sock.sendMessage(chat, { text }, { quoted: msg });
      }

      game.attempts[userId]--;

      if (game.attempts[userId] <= 0) {
        game.blocked.push(userId);
        return sock.sendMessage(chat, {
          text: "❌ Sin intentos. Te quedaste fuera de esta partida."
        }, { quoted: msg });
      }

      return sock.sendMessage(chat, {
        text: `❌ Incorrecto. Intentos restantes: ${game.attempts[userId]}`
      }, { quoted: msg });
    }

    // 🎬 CREAR PARTIDA
    const movie = movies[Math.floor(Math.random() * movies.length)];

    cleanGame(g);

    g.peliActive = {
      emoji: movie.emoji,
      answer: movie.answer,
      attempts: {},
      blocked: [],
      winners: []
    };

    g.peliTimer = setTimeout(() => {
      cleanGame(g);

      sock.sendMessage(chat, {
        text: `⌛ Tiempo terminado\n\n🎬 La película era: ${movie.answer}`
      });

    }, 45000);

    return sock.sendMessage(chat, {
      text:
`╭━━━〔 🎬 PELI GAME 〕━━━⬣
┃
┃ 🎭 Adivina la película:
┃
┃ ${movie.emoji}
┃
┃ 🎮 Intentos: 3
┃ ⏱️ Tiempo: 45s
┃
┃ ✏️ Usa: peli [respuesta]
╰━━━━━━━━━━━━━━━━⬣`
    }, { quoted: msg });
  }
};
