import db from '#db';

export default {
  command: ['dungeon', 'mazmorra'],
  category: 'economy',
  description: 'Explora los niveles caóticos de la mazmorra digital.',
  run: async ({ msg, sock, usedPrefix, text }) => {
    const chat = db.getChat(msg.chat);
    
    // Verificación de estado del sistema
    if (chat.adminonly || !chat.economy) {
      return msg.reply(`╭━━━〔 🚫 𝙀𝘾𝙊𝙉𝙊𝙈𝙄𝘼 𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝘼𝘿𝘼 〕━━━⬣

¡RECHORCHOLIS! ¡La economía de nuestro maravilloso Circo Digital está clausurada en esta carpa!

Dile a tu administrador que encienda los motores de la diversión con el comando:
➜ *${usedPrefix}economy on*

╰━━━━━━━━━━━━━━━`);
    }    

    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const settings = db.getSettings(botId);
    const currency = settings.currency;
    
    db.setCreate('chat_users', [msg.chat, msg.sender], 'weapons', {});
    db.setCreate('chat_users', [msg.chat, msg.sender], 'lastdungeon', 0);    
    
    let user = db.getChatUser(msg.chat, msg.sender);
    if (user.weapons && typeof user.weapons === 'string') {
      try { user.weapons = JSON.parse(user.weapons); } catch { user.weapons = {}; }
    }    
    
    const staminaConsumed = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
    if (user.stamina < staminaConsumed) {
      return msg.reply(`╭━━━〔 ⚡ 𝙀𝙎𝙏𝘼́𝙎 𝘼𝙂𝙊𝙏𝘼𝘿𝙊 〕━━━⬣

¡No tienes suficiente stamina para enfrentarte a los horrores de la mazmorra!

> ✐ Usa *${usedPrefix}heal* para recargar tus energías.

╰━━━━━━━━━━━━━━━`);
    }    
    
    let usingMagic = false;
    let usingWeapon = false;    
    
    if (user.weapons?.hacha) {
      if (user.weapons.hacha.durability <= 10) {
        delete user.weapons.hacha;
        db.setChatUser(msg.chat, msg.sender, 'weapons', user.weapons);
        return msg.reply(`╭━━━〔 🛠️ 𝘼𝙍𝙈𝘼 𝙍𝙊𝙏𝘼 〕━━━⬣

¡CRACK! Tu Hacha se ha hecho pedazos por el uso extremo y ha sido eliminada. 

¡Compra una nueva en la tienda con *${usedPrefix}buy hacha*!

╰━━━━━━━━━━━━━━━`);
      }
      usingWeapon = true;
    } else {
      const magicConsumed = Math.floor(Math.random() * (12 - 1 + 1)) + 1;
      if (user.magic < magicConsumed) {
        return msg.reply(`╭━━━〔 ✨ 𝙈𝘼𝙂𝙄𝘼 𝘼𝙂𝙊𝙏𝘼𝘿𝘼 〕━━━⬣

No tienes arma equipada y tu esencia mágica está seca.

> ✐ Compra un arma con *${usedPrefix}buy hacha* o recupérate.

╰━━━━━━━━━━━━━━━`);
      }
      usingMagic = true;
      user.magic -= magicConsumed;
      db.setChatUser(msg.chat, msg.sender, 'magic', user.magic);
    }    
    
    if (user.health < 5) {
      return msg.reply(`╭━━━〔 ⚕️ 𝙎𝘼𝙇𝙐𝘿 𝘾𝙍𝙄́𝙏𝙄𝘾𝘼 〕━━━⬣

¡CUIDADO! Tu salud es demasiado baja para arriesgarte en la mazmorra.

> ✐ Usa *${usedPrefix}heal* antes de que te conviertas en un error de sistema.

╰━━━━━━━━━━━━━━━`);
    }    
    
    if (Date.now() < user.lastdungeon) {
      const restante = user.lastdungeon - Date.now();
      return msg.reply(`╭━━━〔 ⏳ 𝙈𝘼𝙕𝙈𝙊𝙍𝙍𝘼 𝙍𝙀𝙊𝙍𝙂𝘼𝙉𝙄𝙕𝘼́𝙉𝘿𝙊𝙎𝙀 〕━━━⬣

¡MÁS DESPACIO! La mazmorra se está reorganizando. 
Espera *${msToTime(restante)}* para volver a entrar.

╰━━━━━━━━━━━━━━━`);
    }    
    
    user.stamina -= staminaConsumed;
    db.setChatUser(msg.chat, msg.sender, 'stamina', user.stamina);    
    
    const rand = Math.random();
    let cantidad = 0;
    let salud = Math.floor(Math.random() * (15 - 1 + 1)) + 1;
    let durabilityConsumed = Math.floor(Math.random() * (15 - 1 + 1)) + 1;
    let message;    
    
    // VICTORIA
    if (rand < 0.4) {
      if (usingWeapon) {
        user.weapons.hacha.durability -= durabilityConsumed;
        if (user.weapons.hacha.durability <= 10) delete user.weapons.hacha;
        db.setChatUser(msg.chat, msg.sender, 'weapons', user.weapons);
      }
      cantidad = Math.floor(Math.random() * (15000 - 12000 + 1)) + 12000;
      user.coins += cantidad;
      user.health -= salud;
      db.setChatUser(msg.chat, msg.sender, 'coins', user.coins);
      db.setChatUser(msg.chat, msg.sender, 'health', user.health);      
      
      const successMessages = [
        `¡Derrotaste al guardián glitch y reclamaste datos antiguos, ganando *¥${cantidad.toLocaleString()} ${currency}*!`,
        `¡Descifraste los símbolos rúnicos de la Mansión Spooky y obtuviste un alijo de *¥${cantidad.toLocaleString()} ${currency}*!`,
        `¡Te encontraste con el espíritu de una reina ancestral en el Reino de Caramelo, quien te bendijo con *¥${cantidad.toLocaleString()} ${currency}*!`,
        `¡Superaste la prueba de los espejos rotos de Caine y recibiste una recompensa de *¥${cantidad.toLocaleString()} ${currency}*!`,
        `¡Derrotaste a un gólem de texturas inestables y recuperaste un botín de *¥${cantidad.toLocaleString()} ${currency}*!`,
        `¡Salvaste a un NPC perdido y te recompensaron con *¥${cantidad.toLocaleString()} ${currency}* de su tesoro personal!`,
        `¡Lograste purificar un altar corrompido en el Vacío y recibiste una bendición digital de *¥${cantidad.toLocaleString()} ${currency}*!`
      ];
      message = pickRandom(successMessages);

    // FRACASO
    } else if (rand < 0.7) {
      if (usingWeapon) {
        user.weapons.hacha.durability -= durabilityConsumed;
        if (user.weapons.hacha.durability <= 10) delete user.weapons.hacha;
        db.setChatUser(msg.chat, msg.sender, 'weapons', user.weapons);
      }
      cantidad = Math.floor(Math.random() * (9000 - 7500 + 1)) + 7500;
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
      
      user.health -= salud;
      if (user.health < 0) user.health = 0;
      db.setChatUser(msg.chat, msg.sender, 'health', user.health);      
      
      const failMessages = [
        `¡Un espectro maldito te drenó energía en los pasillos de la Mansión Spooky! Perdiste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `¡Un basilisco glitch te sorprendió en la cámara oculta! Huyes herido y perdiste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `¡Una criatura informe te robó parte de tu botín en la oscuridad del Vacío! Perdiste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `¡Fracasaste al invocar un portal de salida y quedaste atrapado entre dimensiones! Perdiste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `¡Perdiste el control de una reliquia inestable y provocaste tu propia caída! Perdiste *¥${cantidad.toLocaleString()} ${currency}*.`,
        `¡Un grupo de sombras te rodeó y te obligó a soltar tu tesoro para poder escapar! Perdiste *¥${cantidad.toLocaleString()} ${currency}*.`
      ];
      message = pickRandom(failMessages);
    } else {
      const neutralMessages = [
        `¡Activaste una trampa, pero lograste esquivar el daño con un movimiento digno de Pomni!`,
        `¡La sala cambió de forma y terminaste explorando en círculos durante horas!`,
        `¡Caíste en una ilusión visual, pero fortaleciste tu mente digital!`,
        `¡Exploraste pasadizos ocultos que solo conducen a paredes sin textura!`,
        `¡Encontraste un mural antiguo que solo revela secretos... que ya sabías!`
      ];
      message = pickRandom(neutralMessages);
    }    
    
    db.setChatUser(msg.chat, msg.sender, 'lastdungeon', Date.now() + 17 * 60 * 1000);
    await sock.sendMessage(msg.chat, { text: `╭━━━〔 🏰 𝙍𝙀𝙎𝙐𝙇𝙏𝘼𝘿𝙊 𝘿𝙀 𝙈𝘼𝙕𝙈𝙊𝙍𝙍𝘼 〕━━━⬣

${message}

╰━━━━━━━━━━━━━━━` }, { quoted: msg });
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
