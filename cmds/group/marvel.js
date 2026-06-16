export default {
  command: ['marvel'],
  category: 'game',

  run: async ({ msg, sock, args }) => {

    const chat = msg.chat;
    const userId = msg.sender;
    const now = Date.now();

    if (!global.db) global.db = {};
    if (!global.db.groups) global.db.groups = {};
    if (!global.db.users) global.db.users = {};

    // 👤 USUARIO
    if (!global.db.users[userId]) {
      global.db.users[userId] = {
        achievements: [],
        marvelWins: 0,
        marvelCooldown: 0
      };
    }

    const u = global.db.users[userId];

    // ✅ FIX PARA EVITAR NaN
    u.marvelWins = Number(u.marvelWins) || 0;

    // ⏳ COOLDOWN
    if (now - (u.marvelCooldown || 0) < 3000) {
      return sock.sendMessage(chat, {
        text: "⏳ Espera un poco antes de volver a jugar."
      }, { quoted: msg });
    }

    u.marvelCooldown = now;

    const g = global.db.groups[chat] ||= {};

    // 🧠 NORMALIZADOR
    const normalize = (t) =>
      (t || "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");

    // 🧹 CLEAN GAME
    const cleanGame = (g) => {
      if (g.triviaTimer) clearTimeout(g.triviaTimer);
      g.triviaTimer = null;
      g.triviaActive = null;
    };

    // 🏆 LOGRO
    const checkAchievement = () => {
      if (u.marvelWins >= 75 && !u.achievements.find(a => a.id === "avengers")) {
        u.achievements.push({
          id: "avengers",
          name: "🦸 Avengers",
          emoji: "⚡",
          description: "75 trivias Marvel correctas"
        });
      }

      // Nuevo logro a 50 wins
      if (u.marvelWins >= 50 && !u.achievements.find(a => a.id === "xmen")) {
        u.achievements.push({
          id: "xmen",
          name: "X-Men",
          emoji: "🟡",
          description: "50 trivias Marvel correctas"
        });
      }

      // Nuevo logro a 100 wins
      if (u.marvelWins >= 100 && !u.achievements.find(a => a.id === "mcu-prime")) {
        u.achievements.push({
          id: "mcu-prime",
          name: "MCU Prime",
          emoji: "🌟",
          description: "100 trivias Marvel correctas"
        });
      }
    };

    // ❌ FALLA
    const onFail = () => {
      u.marvelWins = Math.max(0, u.marvelWins - 3);
    };

    // 🧠 AQUÍ VA TU LISTA DE 75 TRIVIAS
    const triviaPool = [
      { q: "¿Quién usa nanotecnología en su traje?", a: "Iron Man", o: ["Iron Man", "Hulk", "Thor"] },
      { q: "¿Quién es el dios del trueno?", a: "Thor", o: ["Thor", "Loki", "Odin"] },
      { q: "¿Quién es el alter ego de Peter Parker?", a: "Spider-Man", o: ["Spider-Man", "Deadpool", "Daredevil"] },
      { q: "¿Quién lidera los Avengers en Endgame?", a: "Captain America", o: ["Captain America", "Iron Man", "Thor"] },
      { q: "¿Qué villano usa las gemas del infinito?", a: "Thanos", o: ["Thanos", "Ultron", "Loki"] },

      { q: "¿Quién es el hechicero supremo?", a: "Doctor Strange", o: ["Doctor Strange", "Loki", "Wong"] },
      { q: "¿Qué personaje dice 'Yo soy Groot'?", a: "Groot", o: ["Groot", "Rocket", "Drax"] },
      { q: "¿Quién es el rey de Wakanda?", a: "Black Panther", o: ["Black Panther", "Killmonger", "Namor"] },
      { q: "¿Quién es el hermano de Thor?", a: "Loki", o: ["Loki", "Hela", "Odin"] },
      { q: "¿Quién es el arquero de los Avengers?", a: "Hawkeye", o: ["Hawkeye", "Falcon", "Winter Soldier"] },

      { q: "¿Quién es el súper soldado del experimento?", a: "Captain America", o: ["Captain America", "Bucky", "Falcon"] },
      { q: "¿Quién se transforma en Hulk?", a: "Bruce Banner", o: ["Bruce Banner", "Tony Stark", "Steve Rogers"] },
      { q: "¿Quién controla la mente con la gema de la mente?", a: "Vision", o: ["Vision", "Ultron", "Loki"] },
      { q: "¿Quién creó a Ultron?", a: "Tony Stark", o: ["Tony Stark", "Bruce Banner", "Hank Pym"] },
      { q: "¿Quién es el mercenario bocón?", a: "Deadpool", o: ["Deadpool", "Spider-Man", "Punisher"] },

      { q: "¿Qué personaje tiene el escudo de vibranium?", a: "Captain America", o: ["Captain America", "Black Panther", "Iron Man"] },
      { q: "¿Quién es el dios asgardiano padre de Thor?", a: "Odin", o: ["Odin", "Heimdall", "Loki"] },
      { q: "¿Quién es la hechicera roja?", a: "Scarlet Witch", o: ["Scarlet Witch", "Black Widow", "WandaVision"] },
      { q: "¿Quién es el espía de S.H.I.E.L.D?", a: "Black Widow", o: ["Black Widow", "Hawkeye", "Maria Hill"] },
      { q: "¿Qué equipo protege la tierra?", a: "Avengers", o: ["Avengers", "X-Men", "Fantastic Four"] },

      { q: "¿Quién es el mutante con garras de adamantium?", a: "Wolverine", o: ["Wolverine", "Magneto", "Cyclops"] },
      { q: "¿Quién controla el metal?", a: "Magneto", o: ["Magneto", "Storm", "Iceman"] },
      { q: "¿Quién es el líder de los X-Men?", a: "Professor X", o: ["Professor X", "Magneto", "Beast"] },
      { q: "¿Quién lanza rayos de los ojos?", a: "Cyclops", o: ["Cyclops", "Storm", "Wolverine"] },
      { q: "¿Quién puede volverse invisible?", a: "Invisible Woman", o: ["Invisible Woman", "Storm", "Mystique"] },

      { q: "¿Quién estira su cuerpo?", a: "Mr Fantastic", o: ["Mr Fantastic", "Ant-Man", "Spider-Man"] },
      { q: "¿Quién controla el fuego?", a: "Human Torch", o: ["Human Torch", "Torch Man", "Iron Man"] },
      { q: "¿Quién es la mole de roca?", a: "The Thing", o: ["The Thing", "Hulk", "Colossus"] },
      { q: "¿Quién es el villano del multiverso en Loki?", a: "Kang", o: ["Kang", "Thanos", "Loki"] },
      { q: "¿Quién es el dios de la muerte de Thor?", a: "Hela", o: ["Hela", "Loki", "Odin"] },

      { q: "¿Quién es el creador de Iron Man en los cómics?", a: "Tony Stark", o: ["Tony Stark", "Howard Stark", "Obadiah"] },
      { q: "¿Quién es el padre de Tony Stark?", a: "Howard Stark", o: ["Howard Stark", "Nick Fury", "Pepper"] },
      { q: "¿Quién es el agente de S.H.I.E.L.D tuerto?", a: "Nick Fury", o: ["Nick Fury", "Coulson", "Shield Agent"] },
      { q: "¿Quién muere en Avengers Endgame usando la gema?", a: "Iron Man", o: ["Iron Man", "Thor", "Hulk"] },
      { q: "¿Quién viaja en el tiempo con el guante?", a: "Capitán América", o: ["Capitán América", "Ant-Man", "Iron Man"] },

      { q: "¿Quién es el dios del engaño?", a: "Loki", o: ["Loki", "Thor", "Odin"] },
      { q: "¿Quién es el villano principal de Infinity War?", a: "Thanos", o: ["Thanos", "Loki", "Ultron"] },
      { q: "¿Quién tiene el martillo Mjolnir?", a: "Thor", o: ["Thor", "Captain America", "Iron Man"] },
      { q: "¿Quién es el mejor amigo de Steve Rogers?", a: "Bucky", o: ["Bucky", "Falcon", "Tony Stark"] },
      { q: "¿Quién se convierte en el nuevo Captain America?", a: "Sam Wilson", o: ["Sam Wilson", "Bucky", "Rhodey"] },

      { q: "¿Quién es el villano de Spider-Man en No Way Home?", a: "Green Goblin", o: ["Green Goblin", "Doc Ock", "Venom"] },
      { q: "¿Quién es el científico de Ant-Man?", a: "Hank Pym", o: ["Hank Pym", "Scott Lang", "Tony Stark"] },
      { q: "¿Quién es el Ant-Man actual?", a: "Scott Lang", o: ["Scott Lang", "Hank Pym", "Luis"] },
      { q: "¿Quién es la hija de Tony Stark?", a: "Morgan Stark", o: ["Morgan Stark", "Pepper", "May"] },
      { q: "¿Quién es el villano de Black Panther?", a: "Killmonger", o: ["Killmonger", "Namor", "Ulysses Klaue"] },

      { q: "¿Quién es el villano de Avengers 2?", a: "Ultron", o: ["Ultron", "Loki", "Thanos"] },
      { q: "¿Quién creó la armadura Hulkbuster?", a: "Iron Man", o: ["Iron Man", "Bruce Banner", "Stark Industries"] },
      { q: "¿Quién es el líder de Hydra infiltrado en S.H.I.E.L.D?", a: "Red Skull", o: ["Red Skull", "Zola", "Strucker"] },
      { q: "¿Quién es el enemigo de Captain America en WWII?", a: "Red Skull", o: ["Red Skull", "Hydra Soldier", "Bucky"] },
      { q: "¿Quién es el dios de la muerte egipcio en Moon Knight?", a: "Khonshu", o: ["Khonshu", "Anubis", "Ra"] },

      { q: "¿Quién es el héroe que usa telarañas?", a: "Spider-Man", o: ["Spider-Man", "Venom", "Miles Morales"] },
      { q: "¿Quién es el Spider-Man del multiverso?", a: "Miles Morales", o: ["Miles Morales", "Peter Parker", "Gwen"] },
      { q: "¿Quién es el simbionte enemigo de Spider-Man?", a: "Venom", o: ["Venom", "Carnage", "Toxin"] },
      { q: "¿Quién es el villano rojo de Spider-Man?", a: "Carnage", o: ["Carnage", "Venom", "Green Goblin"] },
      { q: "¿Quién es el hechicero del Sanctum?", a: "Doctor Strange", o: ["Doctor Strange", "Wong", "Mordo"] },

      { q: "¿Quién es el dios del trueno en Thor Ragnarok?", a: "Thor", o: ["Thor", "Hulk", "Loki"] },
      { q: "¿Quién destruye Asgard?", a: "Surtur", o: ["Hela", "Loki", "Surtur"] },
      { q: "¿Quién es el demonio de fuego gigante?", a: "Surtur", o: ["Surtur", "Hela", "Fenrir"] },
      { q: "¿Quién es el villano de WandaVision?", a: "Agatha Harkness", o: ["Agatha Harkness", "Wanda", "Vision"] },
      { q: "¿Quién es la hija de Magneto?", a: "Scarlet Witch", o: ["Scarlet Witch", "Quicksilver", "Mystique"] },

      { q: "¿Quién corre súper rápido en X-Men?", a: "Quicksilver", o: ["Quicksilver", "Flash", "Cyclops"] },
      { q: "¿Quién es el villano de Doctor Strange 2?", a: "Wanda", o: ["Wanda", "Kang", "Dormammu"] },
      { q: "¿Quién es el demonio de fuego en Doctor Strange?", a: "Dormammu", o: ["Dormammu", "Mephisto", "Kang"] },
      { q: "¿Quién es el villano de Guardians of the Galaxy 3?", a: "High Evolutionary", o: ["High Evolutionary", "Thanos", "Ronan"] },
      { q: "¿Quién es el mapache parlante?", a: "Rocket", o: ["Rocket", "Groot", "Drax"] },

      { q: "¿Quién es el dios de la guerra en Marvel?", a: "Ares", o: ["Ares", "Thor", "Hercules"] },
      { q: "¿Quién es el héroe ciego?", a: "Daredevil", o: ["Daredevil", "Punisher", "Spider-Man"] }
    ];

    // 🎮 SI YA HAY PARTIDA
    if (g.triviaActive) {

      const game = g.triviaActive;

      const answer = normalize(args.join(""));

      const map = {
        a: game.options[0],
        b: game.options[1],
        c: game.options[2]
      };

      const selected = map[answer];

      if (!selected) {
        return sock.sendMessage(chat, {
          text: "❌ Usa: *trivia a / b / c"
        }, { quoted: msg });
      }

      if (selected === game.answer) {

        u.marvelWins += 1;

        checkAchievement();

        let text =
`╭━━━〔 🏆 CORRECTO 〕━━━⬣

🎯 +1 punto
📊 Wins: ${u.marvelWins}
╰━━━━━━━━━━━━━━━`;

        cleanGame(g);

        return sock.sendMessage(chat, { text }, { quoted: msg });

      } else {

        onFail();

        let text =
`╭━━━〔 ❌ INCORRECTO 〕━━━⬣

💔 -3 puntos
📊 Wins: ${u.marvelWins}
╰━━━━━━━━━━━━━━━`;

        cleanGame(g);

        return sock.sendMessage(chat, { text }, { quoted: msg });
      }
    }

    // 🎮 CREAR TRIVIA NUEVA
    const q = triviaPool[Math.floor(Math.random() * triviaPool.length)];

    let options = [...q.o].sort(() => Math.random() - 0.5);

    g.triviaActive = {
      question: q.q,
      answer: q.a,
      options
    };

    g.triviaTimer = setTimeout(() => {
      cleanGame(g);
      sock.sendMessage(chat, {
        text: `⌛ Tiempo terminado\n\n❓ ${q.q}`
      });
    }, 45000);

    return sock.sendMessage(chat, {
      text:
`╭━━━〔 🧠 TRIVIA MARVEL 〕━━━⬣

❓ ${q.q}

A) ${options[0]}
B) ${options[1]}
C) ${options[2]}

✍️ Responde: *marvel a / b / c
⏳ 45s
╰━━━━━━━━━━━━━━━`
    }, { quoted: msg });

  }
};
