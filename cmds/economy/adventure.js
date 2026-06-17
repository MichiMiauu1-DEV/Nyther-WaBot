import db from '#db';

export default {
  command: ['adventure', 'aventura'],
  category: 'economy',
  description: 'Adentrarse en las zonas inexploradas del Circo para buscar tesoros.',
  run: async ({ msg, sock, usedPrefix, command, text }) => {
    const chat = db.getChat(msg.chat);
    
    // Si la economía está en mantenimiento
    if (chat.adminonly || !chat.economy) {
      return sock.reply(msg.chat, `╭━━━〔 🚫 𝙀𝘾𝙊𝙉𝙊𝙈𝙄𝘼 𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝘼𝘿𝘼 〕━━━⬣

¡RECHORCHOLIS! ¡La economía de nuestro maravilloso Circo Digital está clausurada en esta carpa!

Dile a tu administrador que encienda los motores de la diversión con el comando:
➜ *${usedPrefix}economy on*

╰━━━━━━━━━━━━━━━`, msg);
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
      return msg.reply(`╭━━━〔 ⚡ 𝙀𝙉𝙀𝙍𝙂𝙄́𝘼 𝘽𝘼𝙅𝘼 〕━━━⬣

¡ALTO AHÍ, AGOTADO EXCURSIONISTA! Tu nivel de stamina está por los suelos. No puedes hacer piruetas en el foso digital en este estado.

> Usa *${usedPrefix}heal* o toma un descanso en tu camerino.

╰━━━━━━━━━━━━━━━`);
    }    

    let usingMagic = false;
    let usingWeapon = false;    

    // Verificación de arma
    if (user.weapons?.espada) {
      if (user.weapons.espada.durability <= 10) {
        delete user.weapons.espada;
        db.setChatUser(msg.chat, msg.sender, 'weapons', user.weapons);
        return msg.reply(`╭━━━〔 ⚔️ 𝘼𝙍𝙈𝘼 𝙍𝙊𝙏𝘼 〕━━━⬣

¡PUM! Tu Espada de Juguete se ha desintegrado en polvillo digital debido al exceso de uso.

> Puedes pasar por la taquilla y adquirir una nueva con: *${usedPrefix}buy espada*

╰━━━━━━━━━━━━━━━`);
      }
      usingWeapon = true;
    } else {
      const magicConsumed = Math.floor(Math.random() * (12 - 1 + 1)) + 1;
      if (user.magic < magicConsumed) {
        return msg.reply(`╭━━━〔 ⚠️ 𝘼𝘿𝙑𝙀𝙍𝙏𝙀𝙉𝘾𝙄𝘼 〕━━━⬣

¡Tu estabilidad mágica está vacía y no cargas con ningún arma de utilería! ¡Salir así sería una abstracción segura!

> Bebe una poción para recuperar tu magia o compra protección con: *${usedPrefix}buy espada*

╰━━━━━━━━━━━━━━━`);
      }
      usingMagic = true;
      user.magic -= magicConsumed;
      db.setChatUser(msg.chat, msg.sender, 'magic', user.magic);
    }    

    if (user.health < 5) {
      return msg.reply(`╭━━━〔 🏥 𝙎𝘼𝙇𝙐𝘿 𝘾𝙍𝙄́𝙏𝙄𝘾𝘼 〕━━━⬣

¡CUIDADO, FRÁGIL AMIGO BIOLÓGICO! Tu barra de salud está parpadeando en rojo. Un paso en falso y quedarás fuera del show.

> Usa *${usedPrefix}heal* para restaurar tus puntos antes de marcharte.

╰━━━━━━━━━━━━━━━`);
    }    

    const remainingTime = user.lastadventure - Date.now();
    if (remainingTime > 0) {
      return sock.reply(msg.chat, `╭━━━〔 ⏳ 𝙋𝙊𝙍𝙏𝘼𝙇 𝙀𝙉 𝙍𝙀𝙋𝙊𝙎𝙊 〕━━━⬣

¡NO TAN RÁPIDO, INTREPIDO ACROBÁTA! El portal holográfico se está reiniciando. Debes esperar *${msToTime(remainingTime)}* antes de saltar a otra aventura.

╰━━━━━━━━━━━━━━━`, msg);
    }    

    user.stamina -= staminaConsumed;
    db.setChatUser(msg.chat, msg.sender, 'stamina', user.stamina);    

    const rand = Math.random();
    let cantidad = 0;
    let salud = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
    let durabilityConsumed = Math.floor(Math.random() * (15 - 1 + 1)) + 1;
    let message;    

    if (rand < 0.4) { // ÉXITO
      if (usingWeapon) {
        user.weapons.espada.durability -= durabilityConsumed;
        if (user.weapons.espada.durability <= 10) delete user.weapons.espada;
        db.setChatUser(msg.chat, msg.sender, 'weapons', user.weapons);
      }
      cantidad = Math.floor(Math.random() * (18000 - 14000 + 1)) + 14000;
      user.coins += cantidad;
      user.health -= salud;
      db.setChatUser(msg.chat, msg.sender, 'coins', user.coins);
      db.setChatUser(msg.chat, msg.sender, 'health', user.health);      

      message = pickRandom([
        `¡Lograste limpiar una infestación masiva de Gloinks! La gerencia te recompensa con *¥${cantidad.toLocaleString()} ${currency}*.`,
        `¡Te convertiste en el acróbata estrella del trapecio flotante! La audiencia te arrojó *¥${cantidad.toLocaleString()} ${currency}*.`,
        `¡Encontraste un manuscrito perdido bajo la almohada de Kinger y lo cambiaste por *¥${cantidad.toLocaleString()} ${currency}*!`,
        `¡Rescataste a unos maniquíes atrapados en corrientes de datos! Ganaste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `¡Derrotaste a una IA salvaje en los acantilados! Te embolsaste *¥${cantidad.toLocaleString()} ${currency}*.`
      ]);

    } else if (rand < 0.7) { // CATASTROFE
      if (usingWeapon) {
        user.weapons.espada.durability -= durabilityConsumed;
        if (user.weapons.espada.durability <= 10) delete user.weapons.espada;
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
        db.setChatUser(msg.chat, msg.sender, 'coins', 0);
        db.setChatUser(msg.chat, msg.sender, 'bank', 0);
      }
      user.health = Math.max(0, user.health - salud);
      db.setChatUser(msg.chat, msg.sender, 'health', user.health);      

      message = pickRandom([
        `¡Caíste en una zona sin texturas del Vacío! El formateo de emergencia te costó *¥${cantidad.toLocaleString()} ${currency}*.`,
        `¡Una horda de Gloinks saquearon tus bolsillos llevándose *¥${cantidad.toLocaleString()} ${currency}*!`,
        `¡Un glitch de gravedad te hizo rebotar, dejándote aturdido y sin *¥${cantidad.toLocaleString()} ${currency}*!`,
        `¡Perdiste el rastro en el laberinto de espejos y tuviste que pagar un rescate de *¥${cantidad.toLocaleString()} ${currency}*!`,
        `¡Bubble barrió accidentalmente *¥${cantidad.toLocaleString()} ${currency}* de tus fondos!`
      ]);

    } else { // NEUTRAL
      message = pickRandom([
        `Exploraste los límites de la carpa y encontraste divertidos fallos visuales sin valor.`,
        `Seguiste un tesoro pero resultó ser otro de los sombreros perdidos de Caine.`,
        `Acompañaste a Pomni a buscar una salida... obviamente caminaron en círculos tres horas.`,
        `Recorriste los campos de flores digitales disfrutando de un paisaje simulado.`
      ]);
    }    

    db.setChatUser(msg.chat, msg.sender, 'lastadventure', Date.now() + 20 * 60 * 1000);
    await sock.sendMessage(msg.chat, { text: `╭━━━〔 🗺️ 𝘼𝙑𝙀𝙉𝙏𝙐𝙍𝘼 〕━━━⬣\n\n${message}\n\n╰━━━━━━━━━━━━━━━` }, { quoted: msg });
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
