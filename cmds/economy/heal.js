import db from '#db';

export default {
  command: ['heal', 'curar', 'pocion', 'potion'],
  category: 'economy',
  description: 'Restaura tu energía vital en la enfermería del Circo.',
  run: async ({ msg, sock, usedPrefix, command }) => {
    const chatData = db.getChat(msg.chat);
    if (chatData.adminonly || !chatData.economy) {
      return msg.reply(`╭━━━〔 🚫 𝙀𝘾𝙊𝙉𝙊𝙈𝙄𝘼 𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝘼𝘿𝘼 〕━━━⬣

¡RECHORCHOLIS! ¡La economía de nuestro maravilloso Circo Digital está clausurada en esta carpa!

Dile a tu administrador que encienda los motores de la diversión con el comando:
➜ *${usedPrefix}economy on*

╰━━━━━━━━━━━━━━━`);
    }    
    
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const bot = db.getSettings(botId);
    const currency = bot.currency || 'Coins';
    
    const who = msg.mentionedJid?.[0] || msg.quoted?.sender || null;
    let healer = db.getChatUser(msg.chat, msg.sender);
    let target = healer;
    
    if (healer.inventory && typeof healer.inventory === 'string') {
      try { healer.inventory = JSON.parse(healer.inventory); } catch { healer.inventory = {}; }
    }    
    
    if (who) {
      target = db.getChatUser(msg.chat, who);
      if (!target) return msg.reply(`╭━━━〔 ⚠️ 𝙀𝙍𝙍𝙊𝙍 𝘿𝙀 𝙍𝙀𝙂𝙄𝙎𝙏𝙍𝙊 〕━━━⬣

¡El usuario mencionado no está en nuestra base de datos circense!

╰━━━━━━━━━━━━━━━`);
    }    
    
    const targetUser = who ? db.getUser(who) : null;
    const cmd = command.toLowerCase();
    
    // Lógica de Pociones (Magia)
    if (cmd === 'pocion' || cmd === 'potion') {
      if (!healer.inventory?.pocion || healer.inventory.pocion <= 0) {
        return msg.reply(`╭━━━〔 🧪 𝙋𝙊𝘾𝙄𝙊́𝙉 𝘼𝙂𝙊𝙏𝘼𝘿𝘼 〕━━━⬣

No tienes el elixir necesario en tu inventario.

> Compra una en la tienda: *${usedPrefix}shop*

╰━━━━━━━━━━━━━━━`);
      }      
      
      const magiaActual = target.magic || 0;
      const magiaFaltante = 100 - magiaActual;
      
      if (magiaFaltante <= 0) {
        return msg.reply(who ? `╭━━━〔 ✨ 𝙈𝘼𝙂𝙄𝘼 𝘼𝙇 𝙈𝘼́𝙓𝙄𝙈𝙊 〕━━━⬣

La magia de *${targetUser?.name || who.split('@')[0]}* ya está al máximo.

╰━━━━━━━━━━━━━━━` : `╭━━━〔 ✨ 𝙈𝘼𝙂𝙄𝘼 𝘼𝙇 𝙈𝘼́𝙓𝙄𝙈𝙊 〕━━━⬣

Tu magia ya está al máximo (100/100).

╰━━━━━━━━━━━━━━━`);
      }      
      
      healer.inventory.pocion -= 1;
      if (healer.inventory.pocion <= 0) delete healer.inventory.pocion;
      db.setChatUser(msg.chat, msg.sender, 'inventory', healer.inventory);      
      
      const magiaRestaurada = Math.min(magiaFaltante, 100);
      target.magic = magiaActual + magiaRestaurada;
      db.setChatUser(msg.chat, who || msg.sender, 'magic', target.magic);      
      
      return msg.reply(`╭━━━〔 🧪 𝙀𝙇𝙄𝙓𝙄𝙍 𝘾𝙊𝙉𝙎𝙐𝙈𝙄𝘿𝙊 〕━━━⬣

¡POCIÓN CONSUMIDA! Has restaurado *${magiaRestaurada}* puntos de magia.

> Magia actual: *${target.magic}/100*

╰━━━━━━━━━━━━━━━`);
    }    
    
    // Lógica de Curación (Salud y Stamina)
    const saludActual = target.health || 0;
    const staminaActual = target.stamina || 0;
    const faltanteSalud = 100 - saludActual;
    const faltanteStamina = 100 - staminaActual;
    
    if (saludActual >= 100 && staminaActual >= 100) {
      return msg.reply(who ? `╭━━━〔 ⚕️ 𝙎𝘼𝙇𝙐𝘿 𝙋𝙀𝙍𝙁𝙀𝘾𝙏𝘼 〕━━━⬣

*${targetUser?.name || who.split('@')[0]}* está en perfectas condiciones.

╰━━━━━━━━━━━━━━━` : `╭━━━〔 ⚕️ 𝙎𝘼𝙇𝙐𝘿 𝙋𝙀𝙍𝙁𝙀𝘾𝙏𝘼 〕━━━⬣

¡Ya estás al máximo de salud y stamina!

╰━━━━━━━━━━━━━━━`);
    }    
    
    const costoS = Math.ceil(faltanteSalud > 0 ? faltanteSalud / 10 : 0) * 500;
    const costoSt = Math.ceil(faltanteStamina > 0 ? faltanteStamina / 10 : 0) * 300;
    const costoTotal = costoS + costoSt;
    const totalFondos = (healer.coins || 0) + (healer.bank || 0);    
    
    if (totalFondos < costoTotal) {
      return msg.reply(`╭━━━〔 💸 𝙁𝙊𝙉𝘿𝙊𝙎 𝙄𝙉𝙎𝙐𝙁𝙄𝘾𝙄𝙀𝙉𝙏𝙀𝙎 〕━━━⬣

¡FONDOS INSUFICIENTES! La enfermería cobra por sus servicios.

> Total necesario: *¥${costoTotal.toLocaleString()} ${currency}*

╰━━━━━━━━━━━━━━━`);
    }    
    
    // Descontar fondos
    if ((healer.coins || 0) >= costoTotal) {
      healer.coins -= costoTotal;
      db.setChatUser(msg.chat, msg.sender, 'coins', healer.coins);
    } else {
      const restante = costoTotal - (healer.coins || 0);
      healer.coins = 0;
      healer.bank = Math.max(0, (healer.bank || 0) - restante);
      db.setChatUser(msg.chat, msg.sender, 'coins', 0);
      db.setChatUser(msg.chat, msg.sender, 'bank', healer.bank);
    }    
    
    // Aplicar curación
    if (faltanteSalud > 0) { target.health = 100; db.setChatUser(msg.chat, who || msg.sender, 'health', 100); }
    if (faltanteStamina > 0) { target.stamina = 100; db.setChatUser(msg.chat, who || msg.sender, 'stamina', 100); }
    
    const info = who ? `Has curado a *${targetUser?.name || who.split('@')[0]}* hasta el máximo.` : `¡Te has curado hasta el máximo nivel!`;
    msg.reply(`╭━━━〔 🏥 𝙀𝙉𝙁𝙀𝙍𝙈𝙀𝙍𝙄́𝘼 𝘾𝙄𝙍𝘾𝙀𝙉𝙎𝙀 〕━━━⬣

${info}

> Salud actual: ${target.health}/100
> Stamina actual: ${target.stamina}/100
> Costo total: *¥${costoTotal.toLocaleString()} ${currency}*

╰━━━━━━━━━━━━━━━`);
  }
};
  
