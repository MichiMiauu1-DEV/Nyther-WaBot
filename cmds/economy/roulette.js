import db from '#db';

export default {
  command: ['rt', 'roulette', 'ruleta'],
  category: 'economy',
  description: 'Apuesta tus fondos en la ruleta del Circo Digital.',
  run: async ({ msg, sock, args, usedPrefix, text }) => {
    const chatId = msg.chat;
    const senderId = msg.sender;
    const chatData = db.getChat(chatId);
    
    // Verificación del estado económico del circo
    if (chatData.adminonly || !chatData.economy) {
      return msg.reply(`《✧》 ¡RECHORCHOLIS! ¡La economía de nuestro maravilloso Circo Digital está clausurada en esta carpa!\n\nDile a tu administrador que encienda los motores de la diversión con el comando:\n» *${usedPrefix}economy on*`);
    }
    
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const botSettings = db.getSettings(botId);
    const currency = botSettings.currency || 'Monedas';    
    
    db.setCreate('chat_users', [chatId, senderId], 'lastroulette', 0);    
    const user = db.getChatUser(chatId, senderId);    
    const cooldown = 30 * 1000;    
    
    // Control de flujo temporal
    if (Date.now() < user.lastroulette) {
      const restante = user.lastroulette - Date.now();
      return msg.reply(`《✧》 ¡MÁS DESPACIO, VELOCISTA DEL AZAR! La máquina tragaperras se está enfriando. Espera *${msToTime(restante)}* antes de volver a girar la ruleta.`);
    }
    
    if (args.length < 2) {
      return msg.reply(`《✧》 ¡NO TE OLVIDES DE LAS REGLAS! Ingresa la cantidad de *${currency}* y el color (red, black, green).\n> ✐ Ejemplo: *${usedPrefix}ruleta 2000 black*`);
    }    
    
    let amount, color;    
    if (!isNaN(parseInt(args[0]))) {
      amount = parseInt(args[0]);
      color = args[1].toLowerCase();
    } else if (!isNaN(parseInt(args[1]))) {
      color = args[0].toLowerCase();
      amount = parseInt(args[1]);
    } else {
      return msg.reply(`《✧》 ¡FORMATO ERRÓNEO! Prueba así: *${usedPrefix}ruleta 2000 black*`);
    }    
    
    const validColors = ['red', 'black', 'green'];
    if (isNaN(amount) || amount < 200) {
      return msg.reply(`《✧》 ¡LA APUESTA ES MUY BAJA! Debes arriesgar al menos *200 ${currency}* para participar.`);
    }
    if (!validColors.includes(color)) {
      return msg.reply(`《✧》 ¡ESE COLOR NO EXISTE EN MI RULETA! Elige entre: *red*, *black* o *green*.`);
    }    
    if (user.coins < amount) {
      return msg.reply(`《✧》 ¡BOLSILLOS VACÍOS! No tienes suficientes *${currency}* para sostener esta apuesta. ¡Vuelve cuando tengas más ganancias!`);
    }    
    
    // Aplicamos cooldown antes de que se procese el riesgo
    db.setChatUser(chatId, senderId, 'lastroulette', Date.now() + cooldown);    
    
    const random = Math.floor(Math.random() * 37);
    let resultColor;    
    if (random < 9) {
      resultColor = 'green';
    } else if (random < 23) {
      resultColor = 'red';
    } else {
      resultColor = 'black';
    }    
    
    // Procesamiento de resultados
    if (resultColor === color) {
      const reward = amount * (resultColor === 'green' ? 5 : 2);
      db.setChatUser(chatId, senderId, 'coins', (user.coins || 0) + reward);
      await sock.sendMessage(chatId, { text: `《✧》 ¡SANTOS CIELOS! ¡La ruleta se detuvo en el color *${resultColor.toUpperCase()}*!\n\n¡Has ganado un total de *¥${reward.toLocaleString()} ${currency}*! 🎉`, mentions: [senderId] }, { quoted: msg });
    } else {
      db.setChatUser(chatId, senderId, 'coins', (user.coins || 0) - amount);
      await sock.sendMessage(chatId, { text: `《✧》 ¡MALA SUERTE! La ruleta terminó en *${resultColor.toUpperCase()}* y tú apostaste a *${color.toUpperCase()}*.\n\nHas perdido *¥${amount.toLocaleString()} ${currency}*. ¡Mejor suerte para la próxima! 🎭`, mentions: [senderId] }, { quoted: msg });
    }
  }
};

function msToTime(duration) {
  const seconds = Math.ceil(duration / 1000);
  return `${seconds} segundo${seconds !== 1 ? 's' : ''}`;
}
