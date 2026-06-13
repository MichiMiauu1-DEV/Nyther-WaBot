if (!global.db) global.db = {};
if (!global.db.groups) global.db.groups = {};
if (!global.db.users) global.db.users = {};

export default {
  command: ['acertanime'],
  category: 'game',

  run: async ({ msg, sock, args }) => {

    const chat = msg.chat;
    const userId = msg.sender;

    if (!global.db.groups[chat]) global.db.groups[chat] = {};
    if (!global.db.users[userId]) global.db.users[userId] = {
      achievements: [],
      animeGame: {}
    };

    const g = global.db.groups[chat];
    const u = global.db.users[userId];
    const now = Date.now();

    // ⏳ anti spam global
    if (u.animeGame?.cooldown && now - u.animeGame.cooldown < 5000) {
      return sock.sendMessage(chat, {
        text: "⏳ Espera 5 segundos antes de usar el comando."
      }, { quoted: msg });
    }

    const questions = [
      { q: "¿Quién creó el Rinnegan original?", a: "hagoromo otsutsuki" },
      { q: "¿Quién es el Cuarto Hokage?", a: "minato namikaze" },
      { q: "¿Quién mató a Itachi Uchiha?", a: "sasuke uchiha" },
      { q: "¿Quién es Naruto jinchuriki del Kyubi?", a: "naruto uzumaki" },
      { q: "¿Quién lidera Akatsuki (Pain)?", a: "nagato" },

      { q: "¿Quién es Luffy?", a: "monkey d luffy" },
      { q: "¿Quién usa la Yami Yami no Mi?", a: "marshall d teach" },
      { q: "¿Quién es el espadachín de One Piece?", a: "roronoa zoro" },
      { q: "¿Quién creó One Piece?", a: "eiichiro oda" },
      { q: "¿Quién es el médico de los Mugiwara?", a: "tony tony chopper" },

      { q: "¿Quién es Muzan?", a: "muzan kibutsuji" },
      { q: "¿Quién es Tanjiro hermana?", a: "nezuko kamado" },
      { q: "¿Quién es pilar del agua?", a: "giyu tomioka" },
      { q: "¿Quién entrena Tanjiro?", a: "sakonji urokodaki" },
      { q: "¿Quién usa respiración del sonido?", a: "tengen uzui" },

      { q: "¿Quién es Gojo?", a: "satoru gojo" },
      { q: "¿Quién es Sukuna?", a: "ryomen sukuna" },
      { q: "¿Quién es Yuji?", a: "yuji itadori" },
      { q: "¿Quién usa sombras?", a: "megumi fushiguro" },
      { q: "¿Quién creó JJK?", a: "gege akutami" },

      { q: "¿Quién es Eren?", a: "eren yeager" },
      { q: "¿Quién es Mikasa?", a: "mikasa ackerman" },
      { q: "¿Quién es Reiner?", a: "reiner braun" },
      { q: "¿Quién es Colossal Titan?", a: "bertholdt hoover" },
      { q: "¿Quién creó AoT?", a: "hajime isayama" },

      { q: "¿Quién usa anti magia?", a: "asta" },
      { q: "¿Quién es demonio de Asta?", a: "lieb e" },
      { q: "¿Quién es rey mago?", a: "yami sukehiro" },
      { q: "¿Quién usa agua magia?", a: "noelle silva" },
      { q: "¿Quién creó Black Clover?", a: "yuki tabata" },

      { q: "¿Quién es Ichigo?", a: "ichigo kurosaki" },
      { q: "¿Quién es Aizen?", a: "sosuke aizen" },
      { q: "¿Quién es Quincy King?", a: "yhwach" },
      { q: "¿Quién creó Bleach?", a: "tite kubo" },
      { q: "¿Quién crea Zanpakuto?", a: "ouetsu nimaiya" },

      { q: "¿Quién es All Might?", a: "all might" },
      { q: "¿Quién tiene One For All?", a: "izuku midoriya" },
      { q: "¿Quién es Bakugo?", a: "katsuki bakugo" },
      { q: "¿Quién es All For One?", a: "all for one" },
      { q: "¿Quién es Endeavor?", a: "endeavor" },

      { q: "¿Quién es Kira?", a: "light yagami" },
      { q: "¿Quién es Ryuk?", a: "ryuk" },
      { q: "¿Quién es L?", a: "l lawliet" },

      { q: "¿Quién es Caine?", a: "caine" },
      { q: "¿Quién es Bubble?", a: "bubble" },
      { q: "¿Quién es Pomni?", a: "pomni" },
      { q: "¿Quién es Jax?", a: "jax" },
      { q: "¿Quién es Ragatha?", a: "ragatha" },
      { q: "¿Quién es Gangle?", a: "gangle" },
      { q: "¿Quién es Zooble?", a: "zooble" },
      { q: "¿Quién es Kinger?", a: "kinger" }
    ];

    // 🧠 GAME ACTIVO
    if (g.animeActive) {

      const answer = (args.join(" ") || "").toLowerCase().trim();
      const game = g.animeActive;

      if (!answer) {
        return sock.sendMessage(chat, {
          text: "🧠 Ya hay un acertijo activo.\n✍️ Usa: acertanime [respuesta]"
        }, { quoted: msg });
      }

      if (!game.attempts[userId]) game.attempts[userId] = 3;

      if (game.users.includes(userId)) {
        return sock.sendMessage(chat, {
          text: "❌ Ya respondiste este acertijo."
        }, { quoted: msg });
      }

      game.users.push(userId);

      if (answer === game.answer) {

        if (g.animeTimer) clearTimeout(g.animeTimer);
        g.animeTimer = null;

        u.animeGame.correct = (u.animeGame.correct || 0) + 1;
        const score = u.animeGame.correct;

        let text = `✅ CORRECTO!\n🏆 Acertadas: ${score}`;

        if (score === 50 && !u.achievements.find(a => a.id === "anime_king")) {
          u.achievements.push({
            id: "anime_king",
            name: "👑 Rey Prohibido del Anime",
            emoji: "🏆",
            description: "50 acertijos correctos"
          });

          text += `\n\n🏆 LOGRO: Rey Prohibido del Anime`;
        }

        g.animeActive = null;
        u.animeGame.cooldown = now;

        return sock.sendMessage(chat, { text }, { quoted: msg });
      }

      game.attempts[userId]--;

      if (game.attempts[userId] <= 0) {

        if (g.animeTimer) clearTimeout(g.animeTimer);
        g.animeTimer = null;
        g.animeActive = null;

        return sock.sendMessage(chat, {
          text: "❌ Te quedaste sin intentos."
        }, { quoted: msg });
      }

      return sock.sendMessage(chat, {
        text: `❌ Incorrecto. Intentos: ${game.attempts[userId]}`
      }, { quoted: msg });
    }

    // 🎯 CREAR ACERTIJO
    const q = questions[Math.floor(Math.random() * questions.length)];

    if (g.animeTimer) clearTimeout(g.animeTimer);

    g.animeActive = {
      question: q.q,
      answer: q.a,
      users: [],
      attempts: {},
      createdBy: userId
    };

    // ⏱️ TIMER 50s
    g.animeTimer = setTimeout(() => {

      if (!g.animeActive) return;

      const oldQ = g.animeActive.question;

      g.animeActive = null;
      g.animeTimer = null;

      sock.sendMessage(chat, {
        text:
`⌛ TIEMPO AGOTADO

❓ ${oldQ}

❌ Nadie respondió a tiempo.`
      });

    }, 50000);

    return sock.sendMessage(chat, {
      text:
`🧠 ACERTIJO ANIME

❓ ${q.q}

✍️ Responde:
acertanime [respuesta]

🎮 3 intentos
⏱️ 50 segundos`
    }, { quoted: msg });
  }
};
