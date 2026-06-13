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

    if (!global.db.groups[chat]) global.db.groups[chat] = {};
    if (!global.db.users[userId]) {
      global.db.users[userId] = {
        achievements: [],
        animeGame: { correct: 0, cooldown: 0 }
      };
    }

    const g = global.db.groups[chat];
    const u = global.db.users[userId];
    const now = Date.now();

    if (now - (u.animeGame.cooldown || 0) < 5000) {
      return sock.sendMessage(chat, { text: "⏳ Espera 5 segundos." }, { quoted: msg });
    }

    // 🎯 PREGUNTAS HARD (ACERTIJOS REALES)
    const questions = [

      // Naruto (no obvias)
      { q: "¿Qué técnica prohibida usó Itachi para sellar a Orochimaru dentro de Sasuke?", a: "sello de espada totsuka" },
      { q: "¿Qué clan fue masacrado en una sola noche por orden del Hokage?", a: "uchiha" },
      { q: "¿Qué objeto usa Pain para compartir visión entre cuerpos?", a: "rinnegan" },
      { q: "¿Cuál es el nombre real de Tobi cuando se revela su identidad?", a: "obito uchiha" },
      { q: "¿Qué bestia tiene Naruto sellada originalmente?", a: "kurama" },

      // One Piece
      { q: "¿Qué fruta del diablo permite convertirte en oscuridad absoluta?", a: "yami yami no mi" },
      { q: "¿Quién derrotó a Kaido en Wano?", a: "monkey d luffy" },
      { q: "¿Qué tipo de haki permite ver el futuro?", a: "kenbunshoku haki avanzado" },
      { q: "¿Quién creó el poneglyph del siglo vacío?", a: "antiguo reino" },
      { q: "¿Qué arma destruyó la isla Lulusia?", a: "imu arma madre flame" },

      // Jujutsu Kaisen
      { q: "¿Qué técnica permite a Gojo detener cualquier ataque infinito?", a: "infinito" },
      { q: "¿Qué es el dominio de Sukuna llamado?", a: "santuario maldito" },
      { q: "¿Quién es el recipiente original de Sukuna?", a: "yuji itadori" },
      { q: "¿Qué técnica copia Yuta Okkotsu?", a: "copia maldicion" },
      { q: "¿Qué evento libera a Gojo del sello?", a: "prision realm ruptura" },

      // Attack on Titan
      { q: "¿Qué titan tiene la capacidad de endurecer su piel como cristal?", a: "titan acorazado" },
      { q: "¿Quién heredó el titan fundador después de Frieda?", a: "eren yeager" },
      { q: "¿Qué poder activa el retumbar?", a: "titan fundador" },
      { q: "¿Quién traiciona a la humanidad en la temporada 1?", a: "reiner braun" },
      { q: "¿Qué muro fue destruido primero?", a: "muro maria" },

      // Black Clover
      { q: "¿Qué espada absorbe magia en Black Clover?", a: "demon slayer sword" },
      { q: "¿Quién es el rey mago antes de Julius?", a: "conrad leto" },
      { q: "¿Qué demonio posee a Asta?", a: "lieb e" },
      { q: "¿Qué grimorio tiene Yuno?", a: "cuatro hojas" },
      { q: "¿Qué técnica usa Noelle para forma dragón?", a: "valkyrie armor dragon" },

      // Bleach
      { q: "¿Qué espada representa la zanpakuto de Ichigo en forma final?", a: "tensa zangetsu" },
      { q: "¿Qué habilidad tiene Aizen que engaña los sentidos?", a: "kyoka suigetsu" },
      { q: "¿Quién es el rey de los Quincy?", a: "yhwach" },
      { q: "¿Qué división lidera Byakuya?", a: "division 6" },
      { q: "¿Qué técnica final usan los shinigami?", a: "bankai" },

      // Demon Slayer
      { q: "¿Qué respiración usa Tanjiro originalmente?", a: "respiracion del agua" },
      { q: "¿Quién es el demonio original?", a: "muzan kibutsuji" },
      { q: "¿Qué demonio tiene cuernos y cuerdas?", a: "akaza" },
      { q: "¿Quién entrena a los cazadores en el bosque?", a: "urokodaki" },
      { q: "¿Qué espada usan los cazadores?", a: "nichirin" },

      // Death Note
      { q: "¿Qué regla mata a alguien si no se escribe causa?", a: "parada cardiaca" },
      { q: "¿Qué shinigami deja caer el cuaderno?", a: "ryuk" },
      { q: "¿Quién descubre la identidad de Kira?", a: "l lawliet" },
      { q: "¿Qué herramienta usa L para ocultarse?", a: "alias lind l tailor" },
      { q: "¿Qué pasa si un shinigami escribe nombre humano?", a: "muere antes" },

      // Chainsaw Man
      { q: "¿Qué demonio tiene Denji dentro?", a: "pochita" },
      { q: "¿Qué contrato hace Makima?", a: "control devil" },
      { q: "¿Qué demonio representa el miedo a las armas?", a: "gun devil" },
      { q: "¿Qué poder tiene Power?", a: "sangre" },
      { q: "¿Quién revive a Denji como Chainsaw Man?", a: "pochita fusion" },

      // Digital Circus
      { q: "¿Quién controla el circo digital?", a: "caine" },
      { q: "¿Qué le pasa a los humanos dentro del circo?", a: "pierden identidad" },
      { q: "¿Qué personaje tiene sonrisa forzada constante?", a: "jax" },
      { q: "¿Quién representa la ansiedad principal?", a: "pomni" },
      { q: "¿Qué entidad mantiene el mundo virtual?", a: "caine sistema" }

    ];

    // 🧠 GAME ACTIVO
    if (g.animeActive) {

      const game = g.animeActive;
      const answer = (args.join(" ") || "").toLowerCase().trim();

      if (!answer) {
        return sock.sendMessage(chat, {
          text: "🧠 Ya hay un acertijo activo."
        }, { quoted: msg });
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

      // ✔ correcto
      if (answer === game.answer) {

        game.winners.push(userId);

        u.animeGame.correct = (u.animeGame.correct || 0) + 1;
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

      // ❌ fallo
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
