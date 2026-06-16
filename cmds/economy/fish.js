import db from '#db';

export default {
  command: ['pescar', 'fish'],
  category: 'economy',
  description: 'Intenta atrapar criaturas digitales en el lago del Circo.',
  run: async ({ msg, sock, usedPrefix, text }) => {
    const chat = db.getChat(msg.chat);
    if (chat.adminonly || !chat.economy) {
      return msg.reply(`《✧》 ¡RECHORCHOLIS! ¡La economía de nuestro maravilloso Circo Digital está clausurada en esta carpa!\n\nDile a tu administrador que encienda los motores de la diversión con el comando:\n» *${usedPrefix}economy on*`);
    }    
    
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const settings = db.getSettings(botId);
    const currency = settings.currency || 'Coins';
    
    db.setCreate('chat_users', [msg.chat, msg.sender], 'tools', {});
    db.setCreate('chat_users', [msg.chat, msg.sender], 'lastfish', 0);    
    
    let user = db.getChatUser(msg.chat, msg.sender);
    if (user.tools && typeof user.tools === 'string') {
      try { user.tools = JSON.parse(user.tools); } catch { user.tools = {}; }
    }    
    
    const staminaConsumed = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
    if (user.stamina < staminaConsumed) {
      return msg.reply(`《✧》 ¡ESTÁS AGOTADO! Necesitas descansar antes de ir al lago.\n> Usa *${usedPrefix}heal* para recuperar energía.`);
    }    
    
    if (!user.tools?.caña) {
      return msg.reply(`《✧》 ¡NO TIENES CAÑA! ¿Cómo piensas pescar en este caos digital?\n> Compra una en la tienda: *${usedPrefix}buy caña*`);
    }    
    
    if (user.tools.caña.durability <= 10) {
      delete user.tools.caña;
      db.setChatUser(msg.chat, msg.sender, 'tools', user.tools);
      return msg.reply(`《✧》 ¡CRASH! Tu caña se ha roto por el uso intensivo.\n> Compra una nueva: *${usedPrefix}buy caña*`);
    }    
    
    const remainingTime = user.lastfish - Date.now();
    if (remainingTime > 0) {
      return msg.reply(`《✧》 ¡LOS PECES SE ESTÁN OCULTANDO! Debes esperar *${msToTime(remainingTime)}* para volver a lanzar el anzuelo.`);
    }    
    
    user.stamina -= staminaConsumed;
    db.setChatUser(msg.chat, msg.sender, 'stamina', user.stamina);    
    
    const rand = Math.random();
    const durabilityConsumed = Math.floor(Math.random() * (15 - 1 + 1)) + 1;
    let cantidad = 0;
    let message;    
    
    // Lógica de éxito
    if (rand < 0.4) {
      user.tools.caña.durability -= durabilityConsumed;
      if (user.tools.caña.durability <= 10) delete user.tools.caña;
      db.setChatUser(msg.chat, msg.sender, 'tools', user.tools);      
      
      cantidad = Math.floor(Math.random() * (8000 - 6000 + 1)) + 6000;
      user.coins += cantidad;
      db.setChatUser(msg.chat, msg.sender, 'coins', user.coins);      
      
      message = pickRandom(successMessages).replace('{c}', cantidad.toLocaleString()).replace('{curr}', currency);
    } 
    // Lógica de fallo
    else if (rand < 0.7) {
      user.tools.caña.durability -= durabilityConsumed;
      if (user.tools.caña.durability <= 10) delete user.tools.caña;
      db.setChatUser(msg.chat, msg.sender, 'tools', user.tools);      
      
      cantidad = Math.floor(Math.random() * (6500 - 5000 + 1)) + 5000;
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
    
    db.setChatUser(msg.chat, msg.sender, 'lastfish', Date.now() + 8 * 60 * 1000);
    await sock.sendMessage(msg.chat, { text: `*《✧》 RESULTADO DE PESCA* 🎣\n\n${message}` }, { quoted: msg });
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
  '¡Atrapaste un Salmón glitch! Ganaste *¥{c} {curr}*.',
  '¡Una Trucha de colores surgió del lago! Ganaste *¥{c} {curr}*.',
  '¡Capturaste un Tiburón pixelado! Ganaste *¥{c} {curr}*.',
  '¡Una Ballena inmensa se enganchó a tu caña! Ganaste *¥{c} {curr}*.',
  '¡Un Pez Payaso bromista cayó en tus redes! Ganaste *¥{c} {curr}*.',
  '¡Atrapaste una Anguila Dorada muy rara! Ganaste *¥{c} {curr}*.',
  '¡Un Mero Gigante de datos puros! Ganaste *¥{c} {curr}*.',
  '¡Un Pulpo azul digital te entregó tesoros! Ganaste *¥{c} {curr}*.',
  '¡Sacaste una Carpa Real del sistema! Ganaste *¥{c} {curr}*.',
  '¡Capturaste un legendario Pez Dragón! Ganaste *¥{c} {curr}*.'
];

const failMessages = [
  '¡El anzuelo se enredó en un virus y perdiste *¥{c} {curr}*!',
  'Una corriente de datos arrastró tu caña al vacío, perdiste *¥{c} {curr}*.',
  'Un pez enorme rompió tu línea y dañó tu equipo, perdiste *¥{c} {curr}*.',
  '¡Tu bote virtual chocó contra un firewall! Perdiste *¥{c} {curr}*.',
  'El pez escapó, rompiendo tu red y parte de tu caña, perdiste *¥{c} {curr}*.',
  'El anzuelo se atascó en una roca digital, perdiste *¥{c} {curr}*.',
  '¡Tu cubeta se volcó en el lago digital! Perdiste *¥{c} {curr}*.'
];

const neutralMessages = [
  'Pasaste la tarde pescando y observando cómo los peces nadaban entre códigos.',
  'El agua estuvo extrañamente tranquila y los peces se mantuvieron fuera de tu alcance.',
  'Tu jornada fue serena, pero los peces fueron demasiado rápidos hoy.',
  'Los peces observaron tu anzuelo con sospecha, nadie picó hoy.',
  'Exploraste una zona nueva del lago, pero solo encontraste burbujas de datos.'
];
