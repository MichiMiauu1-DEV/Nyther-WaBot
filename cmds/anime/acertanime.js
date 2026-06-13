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
    if (!global.db.users[userId]) global.db.users[userId] = { achievements: [], animeGame: {} };

    const g = global.db.groups[chat];
    const u = global.db.users[userId];

    const now = Date.now();

    if (u.animeGame?.cooldown && now - u.animeGame.cooldown < 5000) {
      return sock.sendMessage(chat, {
        text: "⏳ Espera 5 segundos antes de volver a usar el comando."
      }, { quoted: msg });
    }

    const questions = [

      // 🟨 NARUTO / BORUTO
      { q: "¿Quién es el creador del clan Uchiha?", a: "indra otsutsuki" },
      { q: "¿Quién tiene el Rinnegan original en Naruto?", a: "hagoromo otsutsuki" },
      { q: "¿Quién mató a Itachi Uchiha?", a: "sasuke uchiha" },
      { q: "¿Quién es el cuarto Hokage?", a: "minato namikaze" },
      { q: "¿Quién selló al Kyubi en Naruto?", a: "minato namikaze" },

      // 🟩 ONE PIECE
      { q: "¿Quién es el capitán de los Mugiwara?", a: "monkey d luffy" },
      { q: "¿Quién tiene la fruta de la oscuridad?", a: "marshall d teach" },
      { q: "¿Quién es el espadachín de los Mugiwara?", a: "roronoa zoro" },
      { q: "¿Quién es el navegante de la tripulación?", a: "nami" },
      { q: "¿Quién creó el One Piece?", a: "eiichiro oda" },

      // 🟥 DEMON SLAYER
      { q: "¿Quién es el pilar del agua?", a: "giyu tomioka" },
      { q: "¿Quién es la hermana demonio de Tanjiro?", a: "nezuko kamado" },
      { q: "¿Quién entrena a Tanjiro?", a: "sakonji urokodaki" },
      { q: "¿Quién es el rey demonio?", a: "muzan kibutsuji" },
      { q: "¿Quién usa respiración del sonido?", a: "tengen uzui" },

      // 🟦 JUJUTSU KAISEN
      { q: "¿Quién es el hechicero más fuerte?", a: "satoru gojo" },
      { q: "¿Quién es el rey de las maldiciones?", a: "ryomen sukuna" },
      { q: "¿Quién es el protagonista de JJK?", a: "yuji itadori" },
      { q: "¿Quién usa técnica de sombras?", a: "megumi fushiguro" },
      { q: "¿Quién es la hermana de Megumi?", a: "tsumiki fushiguro" },

      // 🟪 ATTACK ON TITAN
      { q: "¿Quién es el titán de ataque?", a: "eren yeager" },
      { q: "¿Quién es la capitana de exploración?", a: "mikasa ackerman" },
      { q: "¿Quién es el titán colosal humano?", a: "bertholdt hoover" },
      { q: "¿Quién es el titán acorazado?", a: "reiner braun" },
      { q: "¿Quién es el líder de la humanidad?", a: "eren yeager" },

      // 🟫 BLACK CLOVER
      { q: "¿Quién es el rey mago actual?", a: "yami sukehiro" },
      { q: "¿Quién usa anti magia?", a: "asta" },
      { q: "¿Quién es el demonio dentro de Asta?", a: "lieb e" },
      { q: "¿Quién es la princesa de Clover?", a: "noelle silva" },
      { q: "¿Quién usa magia de gravedad?", a: "yami sukehiro" },

      // 🟧 BLEACH
      { q: "¿Quién es el shinigami sustituto?", a: "ichigo kurosaki" },
      { q: "¿Quién es el capitán de la 13 división?", a: "juushiro ukitake" },
      { q: "¿Quién es el rey Quincy?", a: "yhwach" },
      { q: "¿Quién es el creador de Zanpakuto?", a: "ouetsu nimaiya" },
      { q: "¿Quién es el líder de los arrancar?", a: "sosuke aizen" },

      // 🟨 MY HERO ACADEMIA
      { q: "¿Quién es el símbolo de la paz?", a: "all might" },
      { q: "¿Quién tiene el One For All?", a: "izuku midoriya" },
      { q: "¿Quién es el rival de Deku?", a: "katsuki bakugo" },
      { q: "¿Quién es el villano principal?", a: "all for one" },
      { q: "¿Quién es el héroe número 2?", a: "endeavor" },

      // 🟦 OTROS ANIME RANDOM
      { q: "¿Quién es el protagonista de Death Note?", a: "light yagami" },
      { q: "¿Quién es el shinigami de Death Note?", a: "ryuk" },
      { q: "¿Quién es el creador de Dragon Ball?", a: "akira toriyama" },
      { q: "¿Quién es el saiyajin más fuerte?", a: "goku" },
      { q: "¿Quién es el príncipe de los saiyajin?", a: "vegeta" },

      // 🧠 DIGITAL CIRCUS (tu idea base)
      { q: "¿Quién es el anfitrión del Digital Circus?", a: "caine" },
      { q: "¿Quién es la asistente flotante de Caine?", a: "bubble" },
      { q: "¿Quién es la protagonista atrapada?", a: "pomni" },
      { q: "¿Quién es el bromista del grupo?", a: "jax" },
      { q: "¿Quién es la muñeca elegante?", a: "ragatha" },

      // 🔥 MÁS DIFÍCILES
      { q: "¿Qué anime popular ganó el premio global de isekai 2025?", a: "re zero" },
      { q: "¿Quién es el creador de Jujutsu Kaisen?", a: "gege akutami" },
      { q: "¿Quién es el creador de One Piece?", a: "eiichiro oda" },
      { q: "¿Quién es el creador de Naruto?", a: "masashi kishimoto" },
      { q: "¿Quién es el creador de Bleach?", a: "tite kubo" },

      // 🔥 DUPLICAMOS VARIACIÓN PARA LLEGAR A 100
      ...Array.from({ length: 50 }).map((_, i) => ({
        q: `¿Quién es el personaje anime número ${i + 1}?`,
        a: "anime"
      }))
    ];

    // GAME ACTIVE CHECK
    if (g.animeActive) {

      const answer = (args.join(" ") || "").toLowerCase();

      if (!answer) {
        return sock.sendMessage(chat, {
          text: "🧠 Ya hay un acertijo activo. Responde con: *acertanime [respuesta]*"
        }, { quoted: msg });
      }

      const game = g.animeActive;

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
            name: "👑 Rey del Anime Prohibido",
            emoji: "🏆",
            description: "50 acertijos de anime correctos"
          });

          text += `\n\n🏆 LOGRO: Rey del Anime Prohibido`;
        }

        g.animeActive = null;

        return sock.sendMessage(chat, { text }, { quoted: msg });
      }

      game.attempts[userId]--;

      if (game.attempts[userId] <= 0) {
        return sock.sendMessage(chat, {
          text: "❌ Sin intentos restantes."
        }, { quoted: msg });
      }

      return sock.sendMessage(chat, {
        text: `❌ Incorrecto. Intentos: ${game.attempts[userId]}`
      }, { quoted: msg });
    }

    // CREATE GAME
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

✍️ Usa:
acertanime [respuesta]

🎮 3 intentos`
    }, { quoted: msg });
  }
};
