import db from '#db';

export default {
  command: ['cazar', 'hunt'],
  category: 'economy',
  description: 'Adéntrate en la espesura del Circo para cazar presas digitales.',
  run: async ({ msg, sock, usedPrefix, text }) => {
    const chat = db.getChat(msg.chat);
    
    // Verificación de estado económico
    if (chat.adminonly || !chat.economy) {
      return msg.reply(`《✧》 ¡RECHORCHOLIS! ¡La economía de nuestro maravilloso Circo Digital está clausurada en esta carpa!\n\nDile a tu administrador que encienda los motores de la diversión con el comando:\n» *${usedPrefix}economy on*`);
    }
    
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const settings = db.getSettings(botId);
    const currency = settings.currency || 'Coins';
    
    db.setCreate('chat_users', [msg.chat, msg.sender], 'weapons', {});
    db.setCreate('chat_users', [msg.chat, msg.sender], 'lasthunt', 0);    
    
    let user = db.getChatUser(msg.chat, msg.sender);
    if (user.weapons && typeof user.weapons === 'string') {
      try { user.weapons = JSON.parse(user.weapons); } catch { user.weapons = {}; }
    }    
    
    const staminaConsumed = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
    if (user.stamina < staminaConsumed) {
      return msg.reply(`《✧》 ¡ESTÁS AGOTADO! Necesitas descansar antes de ir a cazar.\n> Usa *${usedPrefix}heal* para recuperar energía.`);
    }    
    
    if (!user.weapons?.arco) {
      return msg.reply(`《✧》 ¡NO TIENES ARCO! ¿Cómo pretendes cazar con las manos?\n> Compra uno en la tienda con: *${usedPrefix}buy arco*`);
    }    
    
    if (user.weapons.arco.durability <= 10) {
      delete user.weapons.arco;
      db.setChatUser(msg.chat, msg.sender, 'weapons', user.weapons);
      return msg.reply(`《✧》 ¡CRASH! Tu arco se ha hecho añicos. ¡Ya no sirve de nada!\n> Compra uno nuevo con: *${usedPrefix}buy arco*`);
    }    
    
    if (Date.now() < user.lasthunt) {
      const restante = user.lasthunt - Date.now();
      return msg.reply(`《✧》 ¡LAS PRESAS SE ESTÁN ESCONDIENDO! Espera *${msToTime(restante)}* para volver a cazar.`);
    }    
    
    user.stamina -= staminaConsumed;
    db.setChatUser(msg.chat, msg.sender, 'stamina', user.stamina);    
    
    const rand = Math.random();
    const durabilityConsumed = Math.floor(Math.random() * (15 - 1 + 1)) + 1;
    let cantidad = 0;
    let message;    
    
    // Lógica de éxito
    if (rand < 0.4) {
      user.weapons.arco.durability -= durabilityConsumed;
      if (user.weapons.arco.durability <= 10) delete user.weapons.arco;
      db.setChatUser(msg.chat, msg.sender, 'weapons', user.weapons);      
      
      cantidad = Math.floor(Math.random() * (13000 - 10000 + 1)) + 10000;
      user.coins += cantidad;
      db.setChatUser(msg.chat, msg.sender, 'coins', user.coins);      
      
      message = pickRandom(successMessages).replace('{c}', cantidad.toLocaleString()).replace('{curr}', currency);
    } 
    // Lógica de fallo
    else if (rand < 0.7) {
      user.weapons.arco.durability -= durabilityConsumed;
      if (user.weapons.arco.durability <= 10) delete user.weapons.arco;
      db.setChatUser(msg.chat, msg.sender, 'weapons', user.weapons);      
      
      cantidad = Math.floor(Math.random() * (8000 - 6000 + 1)) + 6000;
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
      
      message = pickRandom(failMessages).replace('{c}', cantidad.toLocaleString()).replace('{curr}', currency);
    } 
    // Lógica neutral
    else {
      message = pickRandom(neutralMessages);
    }
    
    db.setChatUser(msg.chat, msg.sender, 'lasthunt', Date.now() + 15 * 60 * 1000);
    await sock.sendMessage(msg.chat, { text: `*《✧》 RESULTADO DE CAZA* 🏹\n\n${message}` }, { quoted: msg });
  }
};

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  if (minutes === 0) return `${seconds} segundo${seconds > 1 ? 's' : ''}`;
  return `${minutes} minuto${minutes > 1 ? 's' : ''}, ${seconds} segundo${seconds > 1 ? 's' : ''}`;
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

const successMessages = [
  '¡Con gran valentía, lograste cazar un Oso con tu Arco! Ganaste *¥{c} {curr}*.',
  '¡Has cazado un Tigre feroz! Tras una persecución electrizante, ganaste *¥{c} {curr}*.',
  'Lograste cazar un Elefante con astucia, ganaste *¥{c} {curr}*.',
  '¡Has cazado un Panda! La caza fue tranquila, ganaste *¥{c} {curr}*.',
  'Cazaste un Jabalí tras un rastreo emocionante, ganaste *¥{c} {curr}*.',
  'Con gran destreza, atrapaste un Cocodrilo, ganaste *¥{c} {curr}*.',
  '¡Has cazado un Ciervo robusto! Ganaste *¥{c} {curr}*.',
  'Con paciencia lograste cazar un Zorro plateado, ganaste *¥{c} {curr}*.',
  'Localizaste un grupo de peces en el río, ganaste *¥{c} {curr}*.',
  'Te internaste en la niebla y cazaste un jabalí salvaje, ganaste *¥{c} {curr}*.'
];

const failMessages = [
  '¡Tu presa se transformó en píxeles y huyó! Perdiste *¥{c} {curr}*.',
  'Tropezaste con un cable del servidor y la presa escapó, perdiste *¥{c} {curr}*.',
  'Un rugido digital te distrajo y perdiste el tiro, perdiste *¥{c} {curr}*.',
  'Tu arco se rompió justo en el momento crucial, perdiste *¥{c} {curr}*.',
  'Un error de renderizado arruinó tu ruta de caza, perdiste *¥{c} {curr}*.',
  '¡Un jabalí te embistió y tuviste que huir perdiendo el botín!, perdiste *¥{c} {curr}*.',
  'Un tigre te sorprendió y escapaste con daños en tu equipo, perdiste *¥{c} {curr}*.'
];

const neutralMessages = [
  'Pasaste la tarde observando cómo los animales se movían entre los árboles de código.',
  'El bosque estuvo tranquilo y los animales se mostraron esquivos a tu presencia.',
  'Tu jornada de caza fue serena, los animales se acercaban pero no lograste atrapar nada.',
  'Las criaturas fueron cautelosas, pero la experiencia de caza fue agradable.',
  'Exploraste nuevas rutas y descubriste huellas frescas de algo que no lograste ver.'
];
