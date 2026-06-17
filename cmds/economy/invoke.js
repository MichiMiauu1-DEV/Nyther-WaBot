import db from '#db';

export default {
  command: ['ritual', 'invoke', 'invocar'],
  category: 'economy',
  description: 'Realiza un rito arcano para extraer riquezas del vacío.',
  run: async ({ msg, sock, usedPrefix }) => {
    const chat = db.getChat(msg.chat);
    
    // Verificación de estado del sistema
    if (chat.adminonly || !chat.economy) {
      return msg.reply(`╭━━━〔 🚫 𝙀𝘾𝙊𝙉𝙊𝙈𝙄𝘼 𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝘼𝘿𝘼 〕━━━⬣

¡RECHORCHOLIS! ¡La economía de nuestro maravilloso Circo Digital está clausurada en esta carpa!

Dile a tu administrador que encienda los motores de la diversión con el comando:
➜ *${usedPrefix}economy on*

╰━━━━━━━━━━━━━━━`);
    }
    
    const botId = sock?.user?.id.split(':')[0] + '@s.whatsapp.net';
    const botSettings = db.getSettings(botId);
    const monedas = botSettings?.currency || 'Coins';
    
    db.setCreate('chat_users', [msg.chat, msg.sender], 'inventory', {});
    db.setCreate('chat_users', [msg.chat, msg.sender], 'lastinvoke', 0);    
    
    let user = db.getChatUser(msg.chat, msg.sender);
    if (user.inventory && typeof user.inventory === 'string') {
      try { user.inventory = JSON.parse(user.inventory); } catch { user.inventory = {}; }
    }    
    
    // Verificación de recursos vitales
    if (user.stamina < 10 || user.magic < 10 || user.health < 10) {
      return msg.reply(`╭━━━〔 ⚠️ 𝙎𝙏𝘼𝙏𝙎 𝘽𝘼𝙅𝙊𝙎 〕━━━⬣

¡TU CUERPO NO AGUANTA MÁS! Un ritual requiere estabilidad total.

> Verifica tu *Stamina, Magia y Salud* (Mínimo 10 en cada uno).
> Usa *${usedPrefix}heal* o *${usedPrefix}pocion* para estabilizarte.

╰━━━━━━━━━━━━━━━`);
    }    
    
    if (!user.inventory?.totem || user.inventory.totem <= 0) {
      return msg.reply(`╭━━━〔 🔮 𝙁𝘼𝙇𝙏𝘼 𝙏𝙊𝙏𝙀𝙈 〕━━━⬣

¡NO TIENES TÓTEM! ¿Cómo pretendes estabilizar el vacío sin un conductor?

> Compra uno en la tienda con: *${usedPrefix}buy totem*

╰━━━━━━━━━━━━━━━`);
    }    
    
    const remaining = user.lastinvoke - Date.now();
    if (remaining > 0) {
      return msg.reply(`╭━━━〔 ⏳ 𝙋𝙊𝙍𝙏𝘼𝙇 𝙄𝙉𝙀𝙎𝙏𝘼𝘽𝙇𝙀 〕━━━⬣

¡EL PORTAL ESTÁ INESTABLE! Debes esperar *${msToTime(remaining)}* para volver a canalizar energía.

╰━━━━━━━━━━━━━━━`);
    }    
    
    // Consumo de recursos
    user.stamina -= Math.floor(Math.random() * (5 - 1 + 1)) + 1;
    user.magic -= Math.floor(Math.random() * (12 - 1 + 1)) + 1;
    user.health -= Math.floor(Math.random() * (15 - 1 + 1)) + 1;
    user.inventory.totem -= 1;
    
    db.setChatUser(msg.chat, msg.sender, 'stamina', user.stamina);
    db.setChatUser(msg.chat, msg.sender, 'magic', user.magic);
    db.setChatUser(msg.chat, msg.sender, 'health', user.health);
    db.setChatUser(msg.chat, msg.sender, 'inventory', user.inventory);    
    
    user.lastinvoke = Date.now() + 12 * 60 * 1000;
    db.setChatUser(msg.chat, msg.sender, 'lastinvoke', user.lastinvoke);    
    
    // Lógica de recompensa
    const roll = Math.random();
    let reward = 0;
    let narration = '';
    let bonusMsg = '';    
    
    if (roll < 0.05) {
      reward = Math.floor(Math.random() * (13000 - 11000 + 1)) + 11000;
      narration = `¡GLITCH LEGENDARIO! ${pickRandom(legendaryInvocations)}`;
      bonusMsg = '\n¡RECOMPENSA ÉPICA OBTENIDA!';
    } else {
      reward = Math.floor(Math.random() * (11000 - 8000 + 1)) + 8000;
      narration = `${pickRandom(normalInvocations)}`;
      if (Math.random() < 0.15) {
        const bonus = Math.floor(Math.random() * (4500 - 2500 + 1)) + 2500;
        reward += bonus;
        bonusMsg = `\n¡ENERGÍA ARBITRARIA! Ganaste *+${bonus.toLocaleString()} ${monedas}* adicionales.`;
      }
    }    
    
    user.coins += reward;
    db.setChatUser(msg.chat, msg.sender, 'coins', user.coins);    
    
    let caption = `╭━━━〔 🌀 𝙍𝙀𝙎𝙐𝙇𝙏𝘼𝘿𝙊 𝙍𝙄𝙏𝙐𝘼𝙇 〕━━━⬣

${narration}

> 💰 Ganaste: *${reward.toLocaleString()} ${monedas}*${bonusMsg}

╰━━━━━━━━━━━━━━━`;
    
    await sock.sendMessage(msg.chat, { text: caption }, { quoted: msg });
  }
};

function msToTime(duration) {
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  if (minutes === 0) return `${seconds} segundo${seconds > 1 ? 's' : ''}`;
  return `${minutes} minuto${minutes > 1 ? 's' : ''}, ${seconds} segundo${seconds > 1 ? 's' : ''}`;
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

const normalInvocations = [
  'Tu ritual abre un portal y caen riquezas ardientes del vacío.',
  'Las velas se consumen y revelan un cofre lleno de monedas antiguas.',
  'El círculo de invocación brilla y aparecen gemas relucientes.',
  'Un espíritu menor te entrega un saco de oro como ofrenda.',
  'Los cánticos atraen un espectro que deja riquezas a tus pies.',
  'La luna ilumina tu altar y revela un tesoro escondido.',
  'Un demonio amistoso surge y te paga por tu invocación.',
  'El humo del incienso se transforma en monedas brillantes.',
  'Los símbolos arcanos vibran y materializan riquezas inesperadas.',
  'Un guardián espiritual aparece y te recompensa por tu fe.'
];

const legendaryInvocations = [
  '¡Has invocado un espíritu ancestral que te entrega un tesoro legendario!',
  'Un dragón cósmico emerge del ritual y te concede riquezas infinitas.',
  'Los dioses antiguos responden y derraman oro celestial sobre ti.',
  'Un ángel guardián desciende y coloca un cofre sagrado en tus manos.',
  'El portal dimensional se abre y un tesoro prohibido cae ante ti.',
  'La tierra tiembla y un espíritu titánico te entrega riquezas ocultas.',
  'Un fénix resucitado deja joyas ardientes como recompensa.',
  'Los astros se alinean y un tesoro cósmico aparece en tu altar.'
];
