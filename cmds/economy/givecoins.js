import db from '#db';

export default {
  command: ['givecoins', 'pay', 'coinsgive'],
  category: 'economy',
  description: 'Transfiere tus riquezas a otro acróbata del Circo.',
  run: async ({ msg, sock, args, usedPrefix, command }) => {
    const chatId = msg.chat;
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const botSettings = db.getSettings(botId);
    const monedas = botSettings?.currency || 'Coins';
    
    // Verificación de estado económico
    const chatData = db.getChat(chatId);
    if (chatData.adminonly || !chatData.economy) {
      return msg.reply(`╭━━━〔 🚫 𝙀𝘾𝙊𝙉𝙊𝙈𝙄𝘼 𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝘼𝘿𝘼 〕━━━⬣

¡RECHORCHOLIS! ¡La economía de nuestro maravilloso Circo Digital está clausurada en esta carpa!

Dile a tu administrador que encienda los motores de la diversión con el comando:
➜ *${usedPrefix}economy on*

╰━━━━━━━━━━━━━━━`);
    }
    
    // Identificación del receptor
    const who = msg.quoted?.sender || msg.mentionedJid?.[0] || (args[1] ? (args[1].replace(/[@ .+-]/g, '') + '@s.whatsapp.net') : null);
    if (!who) {
      return msg.reply(`╭━━━〔 ⚠️ 𝙀𝙍𝙍𝙊𝙍 𝘿𝙀 𝙇𝙊𝙂𝙄𝙎𝙏𝙄𝘾𝘼 〕━━━⬣

Debes mencionar al acróbata al que deseas transferir *${monedas}*.

> Ejemplo ➜ *${usedPrefix + command} 25k @mencion*

╰━━━━━━━━━━━━━━━`);
    }
    
    const senderData = db.getChatUser(chatId, msg.sender);
    const targetData = db.getChatUser(chatId, who);   
    
    if (!targetData) {
      return msg.reply(`╭━━━〔 👤 𝘼𝘾𝙍𝙊́𝘽𝘼𝙏𝘼 𝘿𝙀𝙎𝘾𝙊𝙉𝙊𝘾𝙄𝘿𝙊 〕━━━⬣

El usuario mencionado no está registrado en los archivos del Circo.

╰━━━━━━━━━━━━━━━`);
    }
    
    // Validación de cantidad inteligente
    const cantidadInput = args[0]?.toLowerCase();
    let cantidad = 0;

    if (cantidadInput === 'all') {
        cantidad = (senderData.bank || 0);
    } else if (cantidadInput) {
        const cleanInput = cantidadInput.replace(/\s+/g, '');
        const match = cleanInput.match(/^([\d.]+)([km]?)$/);
        
        if (match) {
            let numero = parseFloat(match[1]);
            let multiplicador = match[2];
            
            if (multiplicador === 'k') numero *= 1000;
            if (multiplicador === 'm') numero *= 1000000;
            
            cantidad = Math.floor(numero);
        }
    }
    
    if (!cantidadInput || isNaN(cantidad) || cantidad <= 0) {
      return msg.reply(`╭━━━〔 🛑 𝘾𝘼𝙉𝙏𝙄𝘿𝘼𝘿 𝙄𝙇𝙀𝙂𝘼𝙇 〕━━━⬣

Ingresa una cifra válida de *${monedas}*.
Ejemplos: *1000, 10k, 1.5k, 2M*

╰━━━━━━━━━━━━━━━`);
    }
    
    if ((senderData.bank || 0) < cantidad) {
      return msg.reply(`╭━━━〔 💸 𝙁𝙊𝙉𝘿𝙊𝙎 𝙄𝙉𝙎𝙐𝙁𝙄𝘾𝙄𝙀𝙉𝙏𝙀𝙎 〕━━━⬣

Tu banco está más vacío que una carpa sin show.

> Saldo actual: *¥${(senderData.bank || 0).toLocaleString()} ${monedas}*

╰━━━━━━━━━━━━━━━`);
    }          
    
    // Ejecución de la transferencia
    db.setChatUser(chatId, msg.sender, 'bank', (senderData.bank || 0) - cantidad);
    db.setChatUser(chatId, who, 'bank', (targetData.bank || 0) + cantidad);
    
    const userData = db.getUser(who);
    let name = userData?.name || who.split('@')[0];
    
    await sock.sendMessage(chatId, { 
      text: `╭━━━〔 💸 𝙏𝙍𝘼𝙉𝙎𝙁𝙀𝙍𝙀𝙉𝘾𝙄𝘼 𝙀𝙓𝙄𝙏𝙊𝙎𝘼 〕━━━⬣

¡TRANSFERENCIA EXITOSA! 🎪

> Has enviado *¥${cantidad.toLocaleString()} ${monedas}* a *${name}*.
> Tu nuevo saldo bancario: *¥${((senderData.bank || 0) - cantidad).toLocaleString()} ${monedas}*

╰━━━━━━━━━━━━━━━`, 
      mentions: [who] 
    }, { quoted: msg });
  }
};
