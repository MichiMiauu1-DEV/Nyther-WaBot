import db from '#db';

export default {
  command: ['adventure', 'aventura'],
  category: 'economy',
  description: 'Adentrarse en las zonas inexploradas del Circo para buscar tesoros.',
  run: async ({ msg, sock, usedPrefix, command, text }) => {
    const chat = db.getChat(msg.chat);
    
    // Si la economía está en mantenimiento dentro del simulador
    if (chat.adminonly || !chat.economy) {
      return sock.reply(msg.chat, `《✧》 ¡RECHORCHOLIS! ¡La economía de nuestro maravilloso Circo Digital está clausurada en esta carpa!\n\nDile a tu administrador que encienda los motores de la diversión con el comando:\n» *${usedPrefix}economy on*`, msg);
    }    

    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const settings = db.getSettings(botId);
    const currency = settings.currency;
    db.setCreate('chat_users', [msg.chat, msg.sender], 'weapons', {});
    db.setCreate('chat_users', [msg.chat, msg.sender], 'lastadventure', 0);    
    let user = db.getChatUser(msg.chat, msg.sender);

    if (user.weapons && typeof user.weapons === 'string') {
      try { user.weapons = JSON.parse(user.weapons); } catch { user.weapons = {}; }
    }

    const staminaConsumed = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
    if (user.stamina < staminaConsumed) {
      return msg.reply(`《✧》 ¡ALTO AHÍ, AGOTADO EXCURSIONISTA! Tu nivel de stamina está por los suelos. No puedes hacer piruetas en el foso digital en este estado.\n> Usa *${usedPrefix}heal* o toma un descanso en tu camerino.`);
    }    

    let usingMagic = false;
    let usingWeapon = false;    

    // Verificación de la espada de utilería
    if (user.weapons?.espada) {
      if (user.weapons.espada.durability <= 10) {
        delete user.weapons.espada;
        db.setChatUser(msg.chat, msg.sender, 'weapons', user.weapons);
        return msg.reply(`《✧》 ¡PUM! Tu Espada de Juguete se ha desintegrado en polvillo digital debido al exceso de uso.\n> Puedes pasar por la taquilla y adquirir una nueva con: *${usedPrefix}buy espada*`);
      }
      usingWeapon = true;
    } else {
      // Si no hay arma, se consume estabilidad mágica
      const magicConsumed = Math.floor(Math.random() * (12 - 1 + 1)) + 1;
      if (user.magic < magicConsumed) {
        return msg.reply(`《✧》 ¡ADVERTENCIA EXISTENCIAL! Tu estabilidad mágica está vacía y no cargas con ningún arma de utilería. ¡Salir así sería una abstracción segura!\n> Bebe una poción para recuperar tu magia o compra protección con: *${usedPrefix}buy espada*`);
      }
      usingMagic = true;
      user.magic -= magicConsumed;
      db.setChatUser(msg.chat, msg.sender, 'magic', user.magic);
    }    

    if (user.health < 5) {
      return msg.reply(`《✧》 ¡CUIDADO, FRÁGIL AMIGO BIOLÓGICO! Tu barra de salud está parpadeando en rojo. Un paso en falso y quedarás fuera del show.\n> Usa *${usedPrefix}heal* para restaurar tus puntos antes de marcharte.`);
    }    

    const remainingTime = user.lastadventure - Date.now();
    if (remainingTime > 0) {
      return sock.reply(msg.chat, `《✧》 ¡NO TAN RÁPIDO, INTREPIDO ACROBÁTA! El portal holográfico se está reiniciando. Debes esperar *${msToTime(remainingTime)}* antes de saltar a otra aventura.`, msg);
    }    

    user.stamina -= staminaConsumed;
    db.setChatUser(msg.chat, msg.sender, 'stamina', user.stamina);    

    const rand = Math.random();
    let cantidad = 0;
    let salud = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
    let durabilityConsumed = Math.floor(Math.random() * (15 - 1 + 1)) + 1;
    let message;    

    // ==========================================
    // ESCENARIO: ¡ÉXITO ROTUNDO! (40% Probabilidad)
    // ==========================================
    if (rand < 0.4) {
      if (usingWeapon) {
        user.weapons.espada.durability -= durabilityConsumed;
        if (user.weapons.espada.durability <= 10) {
          delete user.weapons.espada;
        }
        db.setChatUser(msg.chat, msg.sender, 'weapons', user.weapons);
      }
      cantidad = Math.floor(Math.random() * (18000 - 14000 + 1)) + 14000;
      user.coins += cantidad;
      user.health -= salud;
      db.setChatUser(msg.chat, msg.sender, 'coins', user.coins);
      db.setChatUser(msg.chat, msg.sender, 'health', user.health);      

      const successMessages = [
        `¡Lograste limpiar una infestación masiva de Gloinks en los sótanos del circo! La gerencia te recompensa con *¥${cantidad.toLocaleString()} ${currency}*.`,
        `¡Te convertiste en el acróbata estrella del trapecio flotante de Valoria! La audiencia te arrojó *¥${cantidad.toLocaleString()} ${currency}*.`,
        `¡Encontraste un manuscrito perdido bajo la almohada de Kinger y pudiste cambiarlo por *¥${cantidad.toLocaleString()} ${currency}*!`,
        `¡Rescataste a unos maniquíes de utilería atrapados en las corrientes de datos del lago digital! Ganaste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `¡Derrotaste a una inteligencia artificial salvaje en los acantilados del mapa! Te embolsaste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `¡Encontraste una máscara de la comedia intacta en las ruinas virtuales y la vendiste por *¥${cantidad.toLocaleString()} ${currency}*!`,
        `¡Ganaste un duelo de miradas contra un ciempiés gigante en los pasillos oscuros! Te llevas un botín de *¥${cantidad.toLocaleString()} ${currency}*.`,
        `¡Sobreviviste a una ronda de chistes pesados de Jax y el público te premió con *¥${cantidad.toLocaleString()} ${currency}* por tu paciencia!`,
        `¡Te infiltraste exitosamente en la bóveda de Bubble y recuperaste un alijo secreto de *¥${cantidad.toLocaleString()} ${currency}*!`,
        `¡Resolviste el acertijo del espejo flotante del Vacío y materializaste un tesoro de *¥${cantidad.toLocaleString()} ${currency}*!`
      ];
      message = pickRandom(successMessages);

    // ==========================================
    // ESCENARIO: ¡CATASTROFE Y PÉRDIDA! (30% Probabilidad)
    // ==========================================
    } else if (rand < 0.7) {
      if (usingWeapon) {
        user.weapons.espada.durability -= durabilityConsumed;
        if (user.weapons.espada.durability <= 10) {
          delete user.weapons.espada;
        }
        db.setChatUser(msg.chat, msg.sender, 'weapons', user.weapons);
      }
      cantidad = Math.floor(Math.random() * (11000 - 9000 + 1)) + 9000;
      const total = (user.coins || 0) + (user.bank || 0);

      if (total >= cantidad) {
        if (user.coins >= cantidad) {
          user.coins -= cantidad;
          db.setChatUser(msg.chat, msg.sender, 'coins', user.coins);
        } else {
          const restante = cantidad - user.coins;
          user.coins = 0;
          user.bank -= restante;
          db.setChatUser(msg.chat, msg.sender, 'coins', 0);
          db.setChatUser(msg.chat, msg.sender, 'bank', user.bank);
        }
      } else {
        cantidad = total;
        user.coins = 0;
        user.bank = 0;
        db.setChatUser(msg.chat, msg.sender, 'coins', 0);
        db.setChatUser(msg.chat, msg.sender, 'bank', 0);
      }

      user.health -= salud;
      if (user.health < 0) user.health = 0;
      db.setChatUser(msg.chat, msg.sender, 'health', user.health);      

      const failMessages = [
        `¡Caíste de lleno en una zona sin texturas del Vacío! El formateo de emergencia te costó *¥${cantidad.toLocaleString()} ${currency}*.`,
        `¡Una horda de Gloinks te emboscó en las carpas traseras y saquearon tus bolsillos llevándose *¥${cantidad.toLocaleString()} ${currency}*!`,
        `¡Un glitch de gravedad te hizo rebotar contra el techo del circo, dejándote aturdido y sin *¥${cantidad.toLocaleString()} ${currency}*!`,
        `¡Intentaste domar a una criatura abstracta pero te persiguió por todo el mapa obligándote a tirar *¥${cantidad.toLocaleString()} ${currency}* para distraerla!`,
        `¡Te perdiste en el laberinto de espejos distorsionados y tuviste que pagar un rescate de *¥${cantidad.toLocaleString()} ${currency}* para salir!`,
        `¡Bubble limpió el escenario mientras estabas parado en él y barrió accidentalmente *¥${cantidad.toLocaleString()} ${currency}* de tus fondos!`,
        `¡Un error de renderizado te dejó atrapado en una pared durante horas, perdiendo una valiosa oportunidad y *¥${cantidad.toLocaleString()} ${currency}*!`
      ];
      message = pickRandom(failMessages);

    // ==========================================
    // ESCENARIO: AVENTURA NEUTRAL (30% Probabilidad)
    // ==========================================
    } else {
      const neutralMessages = [
        `Exploraste los límites de la carpa principal y encontraste divertidos fallos visuales que no hacen nada.`,
        `Seguiste el rastro de un supuesto tesoro pero resultó ser solo otro de los sombreros perdidos de Caine.`,
        `Acompañaste a Pomni a buscar una salida del circo... obviamente pasaron tres horas caminando en círculos.`,
        `Te sentaste a escuchar una conferencia de Zooble sobre arte abstracto y terminaste sumamente confundido.`,
        `Recorriste los campos de flores digitales del exterior disfrutando de un agradable paisaje simulado.`
      ];
      message = pickRandom(neutralMessages);
    }    

    db.setChatUser(msg.chat, msg.sender, 'lastadventure', Date.now() + 20 * 60 * 1000);
    await sock.sendMessage(msg.chat, { text: `《✧》 ${message}` }, { quoted: msg });
  }
};

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const min = minutes < 10 ? '0' + minutes : minutes;
  const sec = seconds < 10 ? '0' + seconds : seconds;
  return min === '00' ? `${sec} segundo${sec > 1 ? 's' : ''}` : `${min} minuto${min > 1 ? 's' : ''}, ${sec} segundo${sec > 1 ? 's' : ''}`;
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}
