if (!global.db) global.db = {};
if (!global.db.groups) global.db.groups = {};
if (!global.db.users) global.db.users = {};

const cleanGame = (g) => {
  if (g.peliTimer) clearTimeout(g.peliTimer);
  g.peliTimer = null;
  g.peliActive = null;
};

const movies = {
  facil: [
    { emoji: "🦁👑", answer: "el rey leon" },
    { emoji: "🟢👹", answer: "shrek" },
    { emoji: "🐼🥋", answer: "kung fu panda" },
    { emoji: "❄️👸", answer: "frozen" },
    { emoji: "🐠🔍", answer: "buscando a nemo" },
    { emoji: "🚗🏁", answer: "cars" },
    { emoji: "🏠🎈", answer: "up" },
    { emoji: "🚀🧸", answer: "toy story" },
    { emoji: "🐭👠", answer: "cenicienta" },
    { emoji: "🍎😴", answer: "blancanieves" },
    { emoji: "🐺👧", answer: "caperucita roja" },
    { emoji: "🐘🎪", answer: "dumbo" },
    { emoji: "🪵👦", answer: "pinocho" },
    { emoji: "🧜‍♀️🌊", answer: "la sirenita" },
    { emoji: "👸🌹", answer: "la bella y la bestia" },
    { emoji: "🐧🏄", answer: "happy feet" },
    { emoji: "🧞‍♂️🪔", answer: "aladdin" },
    { emoji: "🐉⚔️", answer: "como entrenar a tu dragon" },
    { emoji: "🚗💨", answer: "cars 2" },
    { emoji: "🧸🚀", answer: "toy story 2" },
    { emoji: "🦖🌴", answer: "jurassic park" },
    { emoji: "🧊🚢", answer: "titanic" },
    { emoji: "🕷️👨", answer: "spiderman" },
    { emoji: "🦇🃏", answer: "batman" },
    { emoji: "🐠🌊", answer: "buscando a nemo 2" }
  ],

  medio: [
    { emoji: "🧊🚢💔", answer: "titanic" },
    { emoji: "🦖🏞️", answer: "jurassic park" },
    { emoji: "🧙💍🌋", answer: "el señor de los anillos" },
    { emoji: "🤖🌎", answer: "wall e" },
    { emoji: "👻🚫", answer: "los cazafantasmas" },
    { emoji: "🦍🏢", answer: "king kong" },
    { emoji: "🦈🌊", answer: "tiburon" },
    { emoji: "🧑‍🚀🌌", answer: "interestelar" },
    { emoji: "🧟‍♂️🏚️", answer: "resident evil" },
    { emoji: "🚀👽", answer: "alien" },
    { emoji: "🦸‍♂️🛡️", answer: "capitan america" },
    { emoji: "🔨⚡", answer: "thor" },
    { emoji: "🟢💪", answer: "hulk" },
    { emoji: "🦇🏙️", answer: "batman begins" },
    { emoji: "🏹🔥", answer: "los juegos del hambre" },
    { emoji: "🧙‍♂️⚡", answer: "harry potter" },
    { emoji: "🦸‍♂️🌌", answer: "guardians de la galaxia" },
    { emoji: "🤠🚀", answer: "toy story 3" },
    { emoji: "🐲🔥", answer: "godzilla" },
    { emoji: "🧠💊", answer: "matrix" },
    { emoji: "👨‍🚀🌕", answer: "apolo 13" },
    { emoji: "🧪⚡", answer: "spiderman 2" },
    { emoji: "🧛‍♂️🌑", answer: "dracula" },
    { emoji: "🦇🔥", answer: "dark knight rises" },
    { emoji: "🧊👑", answer: "frozen 2" },
    { emoji: "🦸‍♂️⚡🌌", answer: "avengers endgame" },
    { emoji: "🧬🦍", answer: "el planeta de los simios" },
    { emoji: "🧠⚔️", answer: "inception" },
    { emoji: "🚢🧊💀", answer: "titanic 2 teoria" },
    { emoji: "🧙‍♂️💍", answer: "hobbit" },
    { emoji: "🦸‍♂️🕶️", answer: "man of steel" },
    { emoji: "🧟‍♀️🔫", answer: "world war z" },
    { emoji: "🧠💀", answer: "matrix reloaded" },
    { emoji: "🚗💨🔥", answer: "cars 3" },
    { emoji: "🧊🌊🐻", answer: "life of pi" },
    { emoji: "🧬⚠️", answer: "jurassic world" },
    { emoji: "👻📼", answer: "ring" },
    { emoji: "🦸‍♂️🌌⚡", answer: "thor ragnarok" }
  ],

  dificil: [
    { emoji: "🦇🃏", answer: "batman el caballero de la noche" },
    { emoji: "🧑‍🚀🌌🕳️", answer: "interestelar" },
    { emoji: "🌪️👠", answer: "el mago de oz" },
    { emoji: "🕸️🕷️🌌", answer: "spiderman un nuevo universo" },
    { emoji: "🐲⚔️🔥", answer: "como entrenar a tu dragon 2" },
    { emoji: "🧛‍♂️🩸", answer: "twilight" },
    { emoji: "🧠🔪", answer: "shutter island" },
    { emoji: "🚢🧊💔", answer: "titanic alternativo" },
    { emoji: "🧟‍♀️🏙️", answer: "world war z" },
    { emoji: "🧬🦍", answer: "planeta de los simios origen" },
    { emoji: "🧙‍♂️💍🔥", answer: "el retorno del rey" },
    { emoji: "🦇🏙️🔥", answer: "the dark knight rises" },
    { emoji: "🧠💊🌌", answer: "matrix revolutions" },
    { emoji: "👽🚀", answer: "arrival" },
    { emoji: "⏳🚪", answer: "tenet" },
    { emoji: "🧬⚠️🦖", answer: "jurassic world fallen kingdom" },
    { emoji: "🦸‍♂️⚡💀", answer: "justice league" },
    { emoji: "🧛‍♂️🌑🔥", answer: "underworld" },
    { emoji: "🧠🌀", answer: "donnie darko" },
    { emoji: "👁️🌌", answer: "interstellar vision" }
  ],

  imposible: [
    { emoji: "🦾🤖🔥", answer: "terminator 2" },
    { emoji: "🕶️💊🖥️", answer: "matrix reloaded final" },
    { emoji: "🧠🌀🌌", answer: "inception nivel 3" },
    { emoji: "👁️⚠️", answer: "arrival final cut" },
    { emoji: "⏳🧠", answer: "tenet paradoja" },
    { emoji: "🧬🦍🌍", answer: "planeta de los simios guerra" },
    { emoji: "🧊🧠💀", answer: "inception final dream" },
    { emoji: "🧠🚪🌌", answer: "coherence multiverse" },
    { emoji: "🧬⚠️🔥", answer: "jurassic world dominion" },
    { emoji: "🦇🔥⚡", answer: "dark knight trilogy" },

    { emoji: "🧠💊🌑", answer: "matrix resurrection" },
    { emoji: "🧬🧠⚡", answer: "lucy evolution" },
    { emoji: "🧟‍♀️🌍🔥", answer: "world war z extended" },
    { emoji: "🧙‍♂️💍🌋⚡", answer: "el señor de los anillos extended" },
    { emoji: "🧠⏳🌌", answer: "predestination loop" },
    { emoji: "🧬🌌🔥", answer: "prometheus origin" },
    { emoji: "🧊🚢💀🔥", answer: "titanic extended cut" },
    { emoji: "🧟‍♂️📼🔥", answer: "rec 2" },
    { emoji: "🧬🦍⚡", answer: "king kong skull island" },
    { emoji: "🦇⚡🌌", answer: "batman multiverse" },

    { emoji: "🧠🧩🔥", answer: "inception true ending" },
    { emoji: "🧬⚡🌑", answer: "xmen apocalypse" },
    { emoji: "🧟‍♂️🌍⚠️", answer: "the walking dead movie" },
    { emoji: "🧙‍♂️💍🌋🔥", answer: "hobbit battle of five armies" },
    { emoji: "🧠⏳⚡", answer: "time paradox movie" },
    { emoji: "🧬🌌⚠️", answer: "prometheus covenant" },
    { emoji: "🧊🚢🔥⚡", answer: "titanic alternate ending" },
    { emoji: "🧟‍♀️📼⚡", answer: "rec 3 genesis" },
    { emoji: "🧬🦍🔥⚡", answer: "kong skull island extended" },
    { emoji: "🦇⚡🔥🌌", answer: "dc multiverse crisis" },
    { emoji: "🧠💊⚡🌑", answer: "matrix infinite loop" },
    { emoji: "🧬🧠🔥⚡", answer: "lucy 2 evolution" },
    { emoji: "🧟‍♀️🌍🔥⚡", answer: "world war z apocalypse cut" },
    { emoji: "🧙‍♂️💍🌋⚡🔥", answer: "lotr extended return king ultimate" },
    { emoji: "🧠⏳🌌🔥", answer: "predestination final loop" },
    { emoji: "🧬🌌🔥⚡", answer: "prometheus final cut" },
    { emoji: "🧊🚢💀🔥⚡", answer: "titanic final director cut" },
    { emoji: "🧟‍♂️📼🔥⚡", answer: "rec ultimate chapter" },
    { emoji: "🧬🦍⚡🔥", answer: "king kong final battle" },
    { emoji: "🦇⚡🌌🔥", answer: "batman beyond multiverse" }
  ]
};

export default {
  command: ['peli'],
  category: 'game',

  run: async ({ msg, sock }) => {

    const chat = msg.chat;
    const userId = msg.sender;
    const now = Date.now();

    if (!global.db.users[userId]) {
      global.db.users[userId] = {
        achievements: [],
        peliWins: 0,
        peliCooldown: 0
      };
    }

    const u = global.db.users[userId];

    if (!global.db.groups[chat]) global.db.groups[chat] = {};
    const g = global.db.groups[chat];

    if (g.peliActive) {
      const game = g.peliActive;
      const answer = (msg.text || "").toLowerCase().trim();

      game.attempts ||= {};
      game.blocked ||= {};
      game.winners ||= [];

      if (game.blocked[userId]) {
        return sock.sendMessage(chat, { text:
`╭━━━〔 💀 𝙂𝘼𝙈𝙀 𝙊𝙑𝙀𝙍 〕━━━⬣

❌ Ya perdiste esta ronda
╰━━━━━━━━━━━━━━━` }, { quoted: msg });
      }

      if (game.winners.includes(userId)) {
        return sock.sendMessage(chat, { text:
`╭━━━〔 🏆 𝙔𝘼 𝘼𝘾𝙀𝙍𝙏𝘼𝙎𝙏𝙀 〕━━━⬣

❌ Ya respondiste correcto
╰━━━━━━━━━━━━━━━` }, { quoted: msg });
      }

      if (!game.attempts[userId]) game.attempts[userId] = 3;

      if (answer === game.answer) {

        game.winners.push(userId);
        u.peliWins += 1;

        let text =
`╭━━━〔 🎉 𝘾𝙊𝙍𝙍𝙀𝘾𝙏𝙊 〕━━━⬣

🏆 Wins: ${u.peliWins}
╰━━━━━━━━━━━━━━━`;

        if (u.peliWins === 50 && !u.achievements.find(a => a.id === "peli_master")) {
          u.achievements.push({
            id: "peli_master",
            name: "🎬 Cine Dios Supremo",
            emoji: "🏆",
            description: "50 películas adivinadas"
          });

          text += `\n\n🏆 LOGRO DESBLOQUEADO`;
        }

        cleanGame(g);
        return sock.sendMessage(chat, { text }, { quoted: msg });
      }

      game.attempts[userId]--;

      if (game.attempts[userId] <= 0) {
        game.blocked[userId] = true;
        cleanGame(g);

        return sock.sendMessage(chat, { text:
`╭━━━〔 💀 𝙂𝘼𝙈𝙀 𝙊𝙑𝙀𝙍 〕━━━⬣

❌ Sin intentos restantes
🎬 La respuesta correcta era:
➤ ${game.answer}

╰━━━━━━━━━━━━━━━`
        }, { quoted: msg });
      }

      return sock.sendMessage(chat, { text:
`╭━━━〔 ❌ 𝙄𝙉𝘾𝙊𝙍𝙍𝙀𝘾𝙏𝙊 〕━━━⬣

🎮 Intentos: ${game.attempts[userId]}
╰━━━━━━━━━━━━━━━` }, { quoted: msg });
    }

    const pool = Object.keys(movies);
    const difficulty = pool[Math.floor(Math.random() * pool.length)];
    const q = movies[difficulty][Math.floor(Math.random() * movies[difficulty].length)];

    cleanGame(g);

    g.peliActive = {
      answer: q.answer,
      emoji: q.emoji,
      attempts: {},
      winners: [],
      blocked: {},
      difficulty
    };

    g.peliTimer = setTimeout(() => {
      cleanGame(g);

      sock.sendMessage(chat, {
        text:
`╭━━━〔 ⌛ 𝙏𝙄𝙀𝙈𝙋𝙊 𝙁𝙄𝙉𝘼𝙇𝙄𝙕𝘼𝘿𝙊 〕━━━⬣

🎬 Nadie acertó: ${q.emoji}
╰━━━━━━━━━━━━━━━`
      });
    }, 50000);

    return sock.sendMessage(chat, {
      text:
`╭━━━〔 🎬 𝙋𝙀𝙇𝙄 𝙂𝘼𝙈𝙀 〕━━━⬣

🎯 Adivina la película:
➤ ${q.emoji}

🔥 Dificultad: ${difficulty.toUpperCase()}
🎮 3 intentos | ⏳ 50s

╰━━━━━━━━━━━━━━━`
    }, { quoted: msg });
  }
};
