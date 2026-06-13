if (!global.db) global.db = {};
if (!global.db.groups) global.db.groups = {};
if (!global.db.users) global.db.users = {};

const cleanGame = (g) => {
  if (g.animeTimer) clearTimeout(g.animeTimer);
  g.animeTimer = null;
  g.animeActive = null;
};

export default {
  command: ['acertanime'],
  category: 'game',

  run: async ({ msg, sock, args }) => {

    const chat = msg.chat;
    const userId = msg.sender;
    const now = Date.now();

    if (!global.db.users[userId]) {
      global.db.users[userId] = {
        achievements: [],
        animeGame: { correct: 0, cooldown: 0 }
      };
    }

    const u = global.db.users[userId];
    u.animeGame ||= { correct: 0, cooldown: 0 };

    if (!global.db.groups[chat]) global.db.groups[chat] = {};
    const g = global.db.groups[chat];

    if (now - (u.animeGame.cooldown || 0) < 5000) {
      return sock.sendMessage(chat, { text: "⏳ Espera 5 segundos." }, { quoted: msg });
    }

    // 🎯 PREGUNTAS ORIGINALES (HARD / ACERTIJOS)
    const questions = [

      // Naruto
      { q: "¿Qué técnica usó Itachi para sellar a Orochimaru dentro de Sasuke?", a: "espada totsuka" },
      { q: "¿Qué clan fue masacrado en una sola noche?", a: "uchiha" },
      { q: "¿Qué ojos permiten usar el Rinnegan original?", a: "rinnegan" },
      { q: "¿Quién es realmente Tobi?", a: "obito uchiha" },
      { q: "¿Qué bestia tiene Naruto sellada?", a: "kurama" },

      // One Piece
      { q: "¿Qué fruta permite oscuridad absoluta?", a: "yami yami no mi" },
      { q: "¿Quién derrotó a Kaido?", a: "monkey d luffy" },
      { q: "¿Qué haki permite ver el futuro?", a: "observacion avanzada" },
      { q: "¿Qué arma destruyó Lulusia?", a: "imu arma madre" },
      { q: "¿Quién es Joy Boy en teoría?", a: "joy boy" },

      // Jujutsu Kaisen
      { q: "¿Qué técnica hace infinito el espacio de Gojo?", a: "infinito" },
      { q: "¿Cómo se llama el dominio de Sukuna?", a: "santuario malevolo" },
      { q: "¿Quién es el recipiente de Sukuna?", a: "yuji itadori" },
      { q: "¿Qué técnica copia Yuta?", a: "copia" },
      { q: "¿Qué encierra a Gojo?", a: "prision realm" },

      // Attack on Titan
      { q: "¿Qué titan endurece su cuerpo?", a: "acorazado" },
      { q: "¿Quién activa el retumbar?", a: "eren yeager" },
      { q: "¿Qué muro cae primero?", a: "muro maria" },
      { q: "¿Quién traiciona al escuadrón en S1?", a: "reiner braun" },
      { q: "¿Qué titan es el fundador?", a: "titan fundador" },

      // Black Clover
      { q: "¿Qué espada absorbe magia?", a: "demon slayer sword" },
      { q: "¿Quién es el rey mago joven?", a: "julius novachrono" },
      { q: "¿Qué demonio tiene Asta?", a: "lieb e" },
      { q: "¿Qué grimorio tiene Yuno?", a: "cuatro hojas" },
      { q: "¿Qué magia usa Noelle?", a: "agua" },

      // Bleach
      { q: "¿Cómo se llama la zanpakuto final de Ichigo?", a: "tensa zangetsu" },
      { q: "¿Qué ilusión usa Aizen?", a: "kyoka suigetsu" },
      { q: "¿Quién es el rey Quincy?", a: "yhwach" },
      { q: "¿Qué es Bankai?", a: "liberacion final" },
      { q: "¿Quién es el creador de zanpakuto?", a: "ouetsu" },

      // Demon Slayer
      { q: "¿Qué respiración usa Tanjiro?", a: "agua" },
      { q: "¿Quién es el demonio original?", a: "muzan kibutsuji" },
      { q: "¿Qué espada usan los cazadores?", a: "nichirin" },
      { q: "¿Quién entrena a Tanjiro?", a: "urokodaki" },
      { q: "¿Qué demonio es Upper Moon 3?", a: "akaza" },

      // Death Note
      { q: "¿Quién deja caer el Death Note?", a: "ryuk" },
      { q: "¿Quién es Kira?", a: "light yagami" },
      { q: "¿Quién es L?", a: "l lawliet" },
      { q: "¿Qué mata sin causa?", a: "infarto" },
      { q: "¿Qué es un shinigami?", a: "dios de la muerte" },

      // Chainsaw Man
      { q: "¿Qué demonio vive en Denji?", a: "pochita" },
      { q: "¿Qué demonio controla Makima?", a: "control" },
      { q: "¿Qué demonio es miedo a armas?", a: "gun devil" },
      { q: "¿Qué usa Power?", a: "sangre" },
      { q: "¿Quién revive a Denji?", a: "pochita fusion" },

      // Digital Circus
      { q: "¿Quién controla el circo digital?", a: "caine" },
      { q: "¿Quién es protagonista perdida?", a: "pomni" },
      { q: "¿Quién sonríe forzado siempre?", a: "jax" },
      { q: "¿Qué representa Gangle?", a: "emociones" },
      { q: "¿Qué es el circo?", a: "simulacion digital" }

    ];

    // 🧠 GAME ACTIVO
    if (g.animeActive) {

      const game = g.animeActive;
      const answer = (args.join(" ") || "").toLowerCase().trim();

      if (!answer) {
        return sock.sendMessage(chat, { text: "🧠 Ya hay un acertijo activo." }, { quoted: msg });
      }

      game.attempts ||= {};
      game.blocked ||= [];
      game.winners ||= [];

      if (game.winners.includes(userId)) {
        return sock.sendMessage(chat, { text: "❌ Ya acertaste este acertijo." }, { quoted: msg });
      }

      if (game.blocked.includes(userId)) {
        return sock.sendMessage(chat, { text: "❌ Ya perdiste este acertijo." }, { quoted: msg });
      }

      if (!game.attempts[userId]) game.attempts[userId] = 3;

      if (answer === game.answer) {

        game.winners.push(userId);

        u.animeGame.correct += 1;
        u.animeGame.cooldown = now;

        let text = `✅ CORRECTO\n🏆 Acertadas: ${u.animeGame.correct}`;

        if (u.animeGame.correct === 50 && !u.achievements.find(a => a.id === "anime_king")) {
          u.achievements.push({
            id: "anime_king",
            name: "👑 Rey Prohibido del Anime",
            emoji: "🏆",
            description: "50 acertijos correctos"
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
          text: "❌ Sin intentos. El acertijo terminó."
        }, { quoted: msg });
      }

      return sock.sendMessage(chat, {
        text: `❌ Incorrecto. Intentos: ${game.attempts[userId]}`
      }, { quoted: msg });
    }

    // 🎯 CREAR JUEGO
    const q = questions[Math.floor(Math.random() * questions.length)];

    cleanGame(g);

    g.animeActive = {
      question: q.q,
      answer: q.a,
      attempts: {},
      blocked: [],
      winners: []
    };

    g.animeTimer = setTimeout(() => {
      cleanGame(g);

      sock.sendMessage(chat, {
        text: `⌛ TIEMPO AGOTADO\n\n❓ ${q.q}`
      });

    }, 50000);

    return sock.sendMessage(chat, {
      text:
`🧠 ACERTIJO ANIME

❓ ${q.q}

✍️ acertanime [respuesta]
🎮 3 intentos
⏱️ 50s`
    }, { quoted: msg });
  }
};
