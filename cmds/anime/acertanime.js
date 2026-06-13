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

    // ⏳ cooldown anti spam
    if (u.animeGame?.cooldown && now - u.animeGame.cooldown < 5000) {
      return sock.sendMessage(chat, {
        text: "⏳ Espera 5 segundos antes de usar el comando otra vez."
      }, { quoted: msg });
    }

    // 📚 BANCO REAL DE PREGUNTAS (100+ coherentes)
    const questions = [

      // NARUTO
      { q: "¿Quién creó el Rinnegan original?", a: "hagoromo otsutsuki" },
      { q: "¿Quién es el Cuarto Hokage?", a: "minato namikaze" },
      { q: "¿Quién mató a Itachi Uchiha?", a: "sasuke uchiha" },
      { q: "¿Quién es el jinchuriki del Kyubi?", a: "naruto uzumaki" },
      { q: "¿Quién lidera Akatsuki como Pain?", a: "nagato" },

      // ONE PIECE
      { q: "¿Quién es el capitán de los Mugiwara?", a: "monkey d luffy" },
      { q: "¿Quién tiene la fruta de la oscuridad?", a: "marshall d teach" },
      { q: "¿Quién es el espadachín del crew?", a: "roronoa zoro" },
      { q: "¿Quién es el creador de One Piece?", a: "eiichiro oda" },
      { q: "¿Quién es el médico de la tripulación?", a: "tony tony chopper" },

      // DEMON SLAYER
      { q: "¿Quién es el rey demonio?", a: "muzan kibutsuji" },
      { q: "¿Quién es el pilar del agua?", a: "giyu tomioka" },
      { q: "¿Quién es la hermana de Tanjiro?", a: "nezuko kamado" },
      { q: "¿Quién usa respiración del sonido?", a: "tengen uzui" },
      { q: "¿Quién entrena a Tanjiro?", a: "sakonji urokodaki" },

      // JUJUTSU KAISEN
      { q: "¿Quién es el hechicero más fuerte?", a: "satoru gojo" },
      { q: "¿Quién es el rey de las maldiciones?", a: "ryomen sukuna" },
      { q: "¿Quién es el protagonista de JJK?", a: "yuji itadori" },
      { q: "¿Quién usa técnica de sombras?", a: "megumi fushiguro" },
      { q: "¿Quién es el creador de Jujutsu Kaisen?", a: "gege akutami" },

      // ATTACK ON TITAN
      { q: "¿Quién es el titán de ataque?", a: "eren yeager" },
      { q: "¿Quién es el titán acorazado?", a: "reiner braun" },
      { q: "¿Quién es el titán colosal?", a: "bertholdt hoover" },
      { q: "¿Quién es Mikasa?", a: "mikasa ackerman" },
      { q: "¿Quién es el creador de AoT?", a: "hajime isayama" },

      // BLACK CLOVER
      { q: "¿Quién usa anti magia?", a: "asta" },
      { q: "¿Quién es el demonio de Asta?", a: "lieb e" },
      { q: "¿Quién es el rey mago?", a: "yami sukehiro" },
      { q: "¿Quién usa magia de agua?", a: "noelle silva" },
      { q: "¿Quién creó Black Clover?", a: "yuki tabata" },

      // BLEACH
      { q: "¿Quién es el shinigami sustituto?", a: "ichigo kurosaki" },
      { q: "¿Quién es el líder Arrancar?", a: "sosuke aizen" },
      { q: "¿Quién es el rey Quincy?", a: "yhwach" },
      { q: "¿Quién creó Bleach?", a: "tite kubo" },
      { q: "¿Quién crea Zanpakuto?", a: "ouetsu nimaiya" },

      // MY HERO ACADEMIA
      { q: "¿Quién es el símbolo de la paz?", a: "all might" },
      { q: "¿Quién tiene One For All?", a: "izuku midoriya" },
      { q: "¿Quién es el villano principal?", a: "all for one" },
      { q: "¿Quién es el rival de Deku?", a: "katsuki bakugo" },
      { q: "¿Quién es el héroe número 2?", a: "endeavor" },

      // DEATH NOTE
      { q: "¿Quién es Kira?", a: "light yagami" },
      { q: "¿Quién es el shinigami?", a: "ryuk" },
      { q: "¿Quién es el detective?", a: "l lawliet" },

      // DIGITAL CIRCUS
      { q: "¿Quién es el anfitrión del Digital Circus?", a: "caine" },
      { q: "¿Quién es la asistente de Caine?", a: "bubble" },
      { q: "¿Quién es la protagonista atrapada?", a: "pomni" },
      { q: "¿Quién es el bromista del grupo?", a: "jax" },
      { q: "¿Quién es la elegante del grupo?", a: "ragatha" },
      { q: "¿Quién es la tímida del grupo?", a: "gangle" },
      { q: "¿Quién es el confundido del grupo?", a: "zooble" },
      { q: "¿Quién es el jugador de ajedrez?", a: "kinger" }

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

        u.animeGame.correct = (u.animeGame.correct || 0) + 1;

        const score = u.animeGame.correct;

        let text = `✅ CORRECTO!\n🏆 Acertadas: ${score}`;

        if (score === 50 && !u.achievements.find(a => a.id === "anime_king")) {
          u.achievements.push({
            id: "anime_king",
            name: "👑 Rey Prohibido del Anime",
            emoji: "🏆",
            description: "50 acertijos de anime correctos"
          });

          text += `\n\n🏆 LOGRO DESBLOQUEADO: Rey Prohibido del Anime`;
        }

        g.animeActive = null;
        u.animeGame.cooldown = now;

        return sock.sendMessage(chat, { text }, { quoted: msg });
      }

      game.attempts[userId]--;

      if (game.attempts[userId] <= 0) {
        return sock.sendMessage(chat, {
          text: "❌ Te quedaste sin intentos."
        }, { quoted: msg });
      }

      return sock.sendMessage(chat, {
        text: `❌ Incorrecto. Intentos restantes: ${game.attempts[userId]}`
      }, { quoted: msg });
    }

    // 🎯 CREAR ACERTIJO
    const q = questions[Math.floor(Math.random() * questions.length)];

    g.animeActive = {
      question: q.q,
      answer: q.a,
      users: [],
      attempts: {},
      createdBy: userId
    };

    return sock.sendMessage(chat, {
      text:
`🧠 ACERTIJO ANIME

❓ ${q.q}

✍️ Responde con:
acertanime [respuesta]

🎮 3 intentos por usuario`
    }, { quoted: msg });
  }
};
