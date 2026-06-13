if (!global.db) global.db = {};
if (!global.db.groups) global.db.groups = {};
if (!global.db.users) global.db.users = {};

const cleanGame = (g) => {
  if (g.peliTimer) clearTimeout(g.peliTimer);
  g.peliTimer = null;
  g.peliActive = null;
};

const movies = {
  facil: [ // 25
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

  medio: [ // 40
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
    { emoji: "🦸‍♂️🌌", answer: "guardians of the galaxy" },
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

  dificil: [ // 50
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
    { emoji: "👁️🌌", answer: "interstellar vision" },

    { emoji: "🧟‍♂️📼", answer: "rec" },
    { emoji: "🧊🧠", answer: "inception dream" },
    { emoji: "🧬🧪", answer: "spiderman multiverse" },
    { emoji: "🦇🩸", answer: "dracula untold" },
    { emoji: "🧙‍♂️🌌", answer: "harry potter final" },
    { emoji: "🧠⚔️🔥", answer: "inception 2 teoria" },
    { emoji: "🚢🌑", answer: "ghost ship" },
    { emoji: "🧟‍♀️🧪", answer: "resident evil apocalypse" },
    { emoji: "🧬🦍🔥", answer: "king kong 2005" },
    { emoji: "🦸‍♂️🌌🔥", answer: "avengers infinity war" },
    { emoji: "🧛‍♂️🧊", answer: "blade" },
    { emoji: "🧠💀🔥", answer: "saw" },
    { emoji: "🧬⚡", answer: "x men days of future past" },
    { emoji: "🧟‍♂️🌍", answer: "the walking dead pelicula" },
    { emoji: "🧙‍♂️💍🌋", answer: "hobbit desolation of smaug" },
    { emoji: "🧠🚪", answer: "coherence" },
    { emoji: "🧬🧠", answer: "lucy" },
    { emoji: "🧟‍♀️🔥", answer: "train to busan" },
    { emoji: "🧠⏳", answer: "predestination" },
    { emoji: "🧬🌌", answer: "prometheus" },
    { emoji: "🦇⚡", answer: "batman v superman" }
  ],

  imposible: [ // 50
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
    { emoji: "🦇⚡🌌", answer: "batman multiverse" }
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

      if (!answer) {
        return sock.sendMessage(chat, { text: "🎬 Ya hay una partida activa." }, { quoted: msg });
      }

      game.attempts ||= {};
      game.blocked ||= [];
      game.winners ||= [];

      if (game.blocked.includes(userId)) {
        return sock.sendMessage(chat, { text: "❌ Ya perdiste esta ronda." }, { quoted: msg });
      }

      if (game.winners.includes(userId)) {
        return sock.sendMessage(chat, { text: "❌ Ya acertaste esta ronda." }, { quoted: msg });
      }

      if (!game.attempts[userId]) game.attempts[userId] = 3;

      if (answer === game.answer) {

        game.winners.push(userId);
        u.peliWins += 1;
        u.peliCooldown = now;

        let text = `🎬 CORRECTO!\n🏆 Wins: ${u.peliWins}`;

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
        game.blocked.push(userId);
        cleanGame(g);
        return sock.sendMessage(chat, { text: "❌ Sin intentos. Ronda terminada." }, { quoted: msg });
      }

      return sock.sendMessage(chat, {
        text: `❌ Incorrecto. Intentos: ${game.attempts[userId]}`
      }, { quoted: msg });
    }

    // CREAR PARTIDA
    const pool = Object.keys(movies);
    const difficulty = pool[Math.floor(Math.random() * pool.length)];
    const q = movies[difficulty][Math.floor(Math.random() * movies[difficulty].length)];

    cleanGame(g);

    g.peliActive = {
      answer: q.answer,
      emoji: q.emoji,
      attempts: {},
      winners: [],
      blocked: [],
      difficulty
    };

    g.peliTimer = setTimeout(() => {
      cleanGame(g);
      sock.sendMessage(chat, {
        text: `⌛ Tiempo terminado!\n🎬 ${q.emoji}\n\nNadie acertó.`
      });
    }, 50000);

    return sock.sendMessage(chat, {
      text:
`🎬 PELI GAME

🎯 Adivina la película:
${q.emoji}

⏱️ 50 segundos
🎮 3 intentos
🔥 Dificultad: ${difficulty}`
    }, { quoted: msg });
  }
};
