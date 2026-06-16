import db from '#db';

export default {
  command: ['dep', 'deposit', 'd', 'depositar'],
  category: 'economy',
  description: 'Asegura tus activos moviendo fondos a la Bóveda del Circo.',
  run: async ({ msg, sock, args, usedPrefix }) => {
    const chatData = db.getChat(msg.chat);
    
    // Verificación de estado del sistema
    if (chatData.adminonly || !chatData.economy) {
      return msg.reply(`《✧》 ¡RECHORCHOLIS! ¡La economía de nuestro maravilloso Circo Digital está clausurada en esta carpa!\n\nDile a tu administrador que encienda los motores de la diversión con el comando:\n» *${usedPrefix}economy on*`);
    }    
    
    const idBot = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const settings = db.getSettings(idBot);
    const monedas = settings.currency;
    const user = db.getChatUser(msg.chat, msg.sender);

    // Validación de entrada
    if (!args[0]) {
      return msg.reply(`《✧》 ¡NO SEAS IMPRUDENTE! Ingresa la cantidad de *${monedas}* que deseas mover a tu bóveda segura.\n> ✐ Ejemplo: *${usedPrefix}depositar 1000* o *${usedPrefix}depositar all*`);
    }

    // Depósito Total (ALL)
    if (args[0].toLowerCase() === 'all') {
      if (!user.coins || user.coins <= 0) {
        return msg.reply(`《✧》 ¡OH, VAYA! Tus bolsillos están más vacíos que la cabeza de Jax después de una sesión de juegos. ¡No tienes nada que depositar!`);
      }
      
      const count = user.coins;
      db.setChatUser(msg.chat, msg.sender, 'coins', 0);
      db.setChatUser(msg.chat, msg.sender, 'bank', (user.bank || 0) + count);
      
      await msg.reply(`《✧》 ¡TRANSACCIÓN COMPLETADA! Has enviado todos tus *¥${count.toLocaleString()} ${monedas}* a la Bóveda de máxima seguridad. ¡Ahora están a salvo de glitches! 🏦✨`);
      return true;
    }        

    // Validación de número
    if (!Number(args[0]) || parseInt(args[0]) < 1) {
      return msg.reply('《✧》 ¡ESO NO ES UN NÚMERO VÁLIDO! Ingresa una cifra real para procesar tu depósito.');
    }    
    
    const count = parseInt(args[0]);        
    
    // Verificación de saldo
    if (!user.coins || user.coins < count) {
      return msg.reply(`《✧》 ¡ERROR DE ESCENARIO! No tienes suficientes *${monedas}* en tu cartera para cubrir ese depósito. ¡Revisa tu balance primero!`);
    }        
    
    db.setChatUser(msg.chat, msg.sender, 'coins', (user.coins || 0) - count);
    db.setChatUser(msg.chat, msg.sender, 'bank', (user.bank || 0) + count);    
    
    await msg.reply(`《✧》 ¡ÉXITO! Has transferido *¥${count.toLocaleString()} ${monedas}* a tu cuenta bancaria. ¡Tus activos están protegidos por el código del circo! 🏦✅`);
  }
};
