import db from '#db';

export default {
  command: ['robar', 'steal', 'rob'],
  category: 'economy',
  description: 'Intentar saquear las coins de otro habitante del circo.',
  run: async ({ msg, sock, usedPrefix, command }) => {
    const chatData = db.getChat(msg.chat);
    
    // Si la economía está en mantenimiento dentro del simulador
    if (chatData.adminonly || !chatData.economy) {
      return msg.reply(`《✧》 ¡RECHORCHOLIS! ¡La economía de nuestro maravilloso Circo Digital está clausurada en esta carpa!\n\nDile a tu administrador que encienda los motores de la diversión con el comando:\n» *${usedPrefix}economy on*`);
    }    

    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const bot = db.getSettings(botId);
    const currency = bot.currency;
    db.setCreate('chat_users', [msg.chat, msg.sender], 'laststeal', 0);
    const user = db.getChatUser(msg.chat, msg.sender);    

    // Verificación del WackyWatch para el tiempo de espera
    if (Date.now() < user.laststeal) {
      const restante = user.laststeal - Date.now();
      return sock.reply(msg.chat, `《✧》 ¡ALTO AHÍ, MANOS LARGAS! Las alarmas siguen encendidas. Debes esperar *${formatTime(restante)}* antes de planear tu próximo golpe criminal en los pasillos.`, msg);
    }    

    const who = msg.mentionedJid?.[0] || msg.quoted?.sender || null;
    if (!who) {
      return sock.reply(msg.chat, `《✧》 ¡VAYA, VAYA! ¿A quién pretendes saquear? ¡Debes mencionar o responder al mensaje de un habitante real para intentar hurgar en sus bolsillos!`, msg);
    }   

    const target = db.getChatUser(msg.chat, who);
    if (!target) {
      return sock.reply(msg.chat, `《✧》 ¡ALERTA DE ERROR! Esa entidad biológica no se encuentra registrada en los índices de mi base de datos. ¡No puedo robarle a un fantasma!`, msg);
    }    

    const name = (db.getUser(who))?.name || who.split('@')[0];
    const lastCmd = target.lastCmd || 0;
    const tiempoInactivo = Date.now() - lastCmd;    

    // Regla de inactividad de una hora
    if (tiempoInactivo < 3600000) {
      return sock.reply(msg.chat, `《✧》 ¡INFILTRACIÓN FALLIDA! *${name}* está completamente despierto y vigilando sus pertenencias. ¡Solo puedes robarle si pasa más de 1 hora inactivo o vagando por el Gran Vacío!`, msg);
    }

    const chance = Math.random();
    
    // ¡EL ROBO SALE MAL! (30% de probabilidad)
    if (chance < 0.3) {
      let loss = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;
      const total = (user.coins || 0) + (user.bank || 0);      

      if (total >= loss) {
        if (user.coins >= loss) {
          db.setChatUser(msg.chat, msg.sender, 'coins', (user.coins || 0) - loss);
        } else {
          const restanteLoss = loss - (user.coins || 0);
          db.setChatUser(msg.chat, msg.sender, 'coins', 0);
          db.setChatUser(msg.chat, msg.sender, 'bank', Math.max(0, (user.bank || 0) - restanteLoss));
        }
      } else {
        loss = total;
        db.setChatUser(msg.chat, msg.sender, 'coins', 0);
        db.setChatUser(msg.chat, msg.sender, 'bank', 0);
      }      

      db.setChatUser(msg.chat, msg.sender, 'laststeal', Date.now() + 3600000);
      return sock.reply(msg.chat, `《✧》 ¡TE ATRAPÉ CON LAS MANOS EN LA MASA! El plan salió terriblemente mal, tropezaste con un Gloink ruidoso y tuviste que pagar una multa de *¥${loss.toLocaleString()} ${currency}* por alterar el orden público.`, msg);
    }    

    // ¡EL ROBO ES UN ÉXITO!
    const rob = Math.floor(Math.random() * (9000 - 3000 + 1)) + 3000;    

    if ((target.coins || 0) < rob) {
      return sock.reply(msg.chat, `《✧》 ¡VALOR INSUFICIENTE! Has registrado los bolsillos de *${name}*, pero no tiene suficientes *${currency}* fuera de la Bóveda como para que valga la pena el botín. ¡Qué decepción!`, msg, { mentions: [who] });
    }    

    // Ejecutamos la transferencia ilícita de fondos
    db.setChatUser(msg.chat, msg.sender, 'coins', (user.coins || 0) + rob);
    db.setChatUser(msg.chat, who, 'coins', (target.coins || 0) - rob);
    db.setChatUser(msg.chat, msg.sender, 'laststeal', Date.now() + 3600000);    

    sock.reply(msg.chat, `《✧》 *¡UN SAQUEO ABSOLUTAMENTE ESPECTACULAR!* Te has deslizado como Jax en las sombras y le has arrebatado *¥${rob.toLocaleString()} ${currency}* a *${name}* sin que se diera cuenta. ¡A disfrutar del botín!`, msg, { mentions: [who] });
  }
};

function formatTime(ms) {
  const totalSec = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  const parts = [];
  if (hours) parts.push(`${hours} hora${hours !== 1 ? 's' : ''}`);
  if (minutes) parts.push(`${minutes} minuto${minutes !== 1 ? 's' : ''}`);
  parts.push(`${seconds} segundo${seconds !== 1 ? 's' : ''}`);
  return parts.join(' ');
}
