import db from '#db';

export default {
  command: ['withdraw', 'with', 'retirar'],
  category: 'economy',
  description: 'Retirar tus coins de la Bóveda de Seguridad.',
  run: async ({ msg, sock, args, usedPrefix, command }) => {
    const chatId = msg.chat;
    const senderId = msg.sender;
    const chatData = db.getChat(chatId);

    // Si la economía está apagada, ¡Caine hace el anuncio dramático!
    if (chatData.adminonly || !chatData.economy) {
      return msg.reply(`《✧》 ¡RECHORCHOLIS! ¡La economía de nuestro maravilloso Circo Digital está clausurada en esta carpa!\n\nDile a tu administrador que encienda los motores de la diversión con el comando:\n» *${usedPrefix}economy on*`);
    }

    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const botSettings = db.getSettings(botId);
    const currency = botSettings.currency;
    const user = db.getChatUser(chatId, senderId);    

    if (!args[0]) {
      return msg.reply(`《✧》 ¡ALTO AHÍ! ¡Para abrir las compuertas de mi gran tesoro debes especificar qué cantidad de *${currency}* deseas materializar en tus bolsillos virtuales!`);
    }    

    if (args[0].toLowerCase() === 'all') {
      if ((user.bank || 0) <= 0) {
        return msg.reply(`《✧》 ¡VAYA, VAYA! Tu cuenta en mi Bóveda está tan vacía como el mismísimo Gran Vacío. ¡No hay ni una sola moneda de *${currency}* para retirar!`);
      }
      const amount = user.bank;
      db.setChatUser(chatId, senderId, 'bank', 0);
      db.setChatUser(chatId, senderId, 'coins', (user.coins || 0) + amount);
      return msg.reply(`《✧》 *¡EXTRACCIÓN ESPECTACULAR!* Has vaciado tu cuenta retirando *¥${amount.toLocaleString()} ${currency}*. Ahora están sueltas en tu inventario... ¡Ten cuidado, o ciertos conejos morados con manos largas podrían arrebatártelas!`);
    }    

    const count = parseInt(args[0]);
    if (isNaN(count) || count < 1) {
      return msg.reply(`《✧》 ¡CATASTRÓFICO ERROR NUMÉRICO! Debes ingresar una cantidad matemática válida.\n\n> Ejemplo 1 » *${usedPrefix + command} 25000*\n> Ejemplo 2 » *${usedPrefix + command} all*`);
    }    

    if ((user.bank || 0) < count) {
      return msg.reply(`《✧》 ¡ALERTA DE INSUFICIENCIA! No tienes suficientes *${currency}* protegidas en tus fondos para esa asombrosa suma.\n\n> Actualmente solo posees *¥${user.bank.toLocaleString()} ${currency}* bajo mi llave digital.`);
    }    

    db.setChatUser(chatId, senderId, 'bank', user.bank - count);
    db.setChatUser(chatId, senderId, 'coins', (user.coins || 0) + count);    
    await msg.reply(`《✧》 *¡TRANSACCIÓN EXITOSA!* Has retirado *¥${count.toLocaleString()} ${currency}* de la Bóveda de Seguridad. ¡Ya puedes gastarlas en mis maravillosos juegos, pero recuerda que en los pasillos del circo nadie está a salvo de un asalto!`);
  }
};
