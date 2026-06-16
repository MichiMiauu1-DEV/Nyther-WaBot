import { delay } from 'baileys';
import db from '#db';

let buatall = 1;
export default {
  command: ['apostar', 'casino'],
  category: 'economy',
  description: 'Apostar tus preciados fondos en el asombroso Casino del Circo Digital.',
  run: async ({ msg, sock, args, usedPrefix, command, text }) => {
    const chatData = db.getChat(msg.chat);
    
    // Si la economía está apagada
    if (chatData.adminonly || !chatData.economy) {
      return msg.reply(`《✧》 ¡RECHORCHOLIS! ¡La economía de nuestro maravilloso Circo Digital está clausurada en esta carpa!\n\nDile a tu administrador que encienda los motores de la diversión con el comando:\n» *${usedPrefix}economy on*`);
    }        

    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const bot = db.getSettings(botId);
    const currency = bot.currency;
    const botname = bot.botname;    
    
    db.setCreate('chat_users', [msg.chat, msg.sender], 'lastApuesta', 0);
    const user = db.getChatUser(msg.chat, msg.sender);    
    
    // ¡El Casino siempre tiene la ventaja! (Bot: 0-100, Usuario: 0-54)
    let Aku = Math.floor(Math.random() * 101);
    let Kamu = Math.floor(Math.random() * 55);
    let count = args[0];
    const users = db.getUser(msg.sender);
    const userName = users?.name || msg.sender.split('@')[0];
    
    const tiempoEspera = 30 * 1000;
    const ahora = Date.now();        
    
    if (user.lastApuesta && ahora - user.lastApuesta < tiempoEspera) {
      const restante = user.lastApuesta + tiempoEspera - ahora;
      const tiempoRestante = formatTime(restante);
      return sock.reply(msg.chat, `《✧》 ¡MÁS DESPACIO, VELOCISTA DEL AZAR! La máquina tragaperras se está enfriando. Espera *${tiempoRestante}* antes de volver a tirar de la palanca.`, msg);
    }        
    
    db.setChatUser(msg.chat, msg.sender, 'lastApuesta', ahora);
    
    if (count && /all/i.test(count)) {
      count = Math.floor(user.coins / buatall);
    } else if (args[0]) {
      count = parseInt(args[0]);
    } else {
      count = 1;
    }        
    
    count = Math.max(1, count);
    if (args.length < 1) {
      return sock.reply(msg.chat, `《✧》 ¡PASEN Y VEAN! Debes ingresar la cantidad de *${currency}* que deseas arriesgar contra el insuperable *${botname}*\n> ✐ Ejemplo: *${usedPrefix + command} 100*`, msg);
    }
    
    if (user.coins >= count) {
      db.setChatUser(msg.chat, msg.sender, 'coins', user.coins - count);
      let resultado = '';
      let ganancia = 0;
      
      if (Aku > Kamu) {
        resultado = `> 🎭 ¡MALA SUERTE, ${userName}! *La casa gana y tú pierdes ¥${formatNumber(count)} ${currency}*. ¡Inténtalo de nuevo!`;
      } else if (Aku < Kamu) {
        ganancia = count * 2;
        db.setChatUser(msg.chat, msg.sender, 'coins', (user.coins - count) + ganancia);
        resultado = `> 🎉 ¡SANTOS CIELOS, ${userName}! *Has reventado la banca y ganado ¥${formatNumber(ganancia)} ${currency}*.`;
      } else {
        ganancia = count;
        db.setChatUser(msg.chat, msg.sender, 'coins', (user.coins - count) + ganancia);
        resultado = `> ⚖️ ¡EMPATE DIGITAL, ${userName}! *Te devuelvo tus ¥${formatNumber(ganancia)} ${currency}*... esta vez.`;
      }
      
      let { key } = await sock.sendMessage(msg.chat, { text: "《✧》 ¡LA RULETA COMIENZA A GIRAR! ¡Las apuestas están cerradas, mis queridos amigos! 🎰" }, { quoted: msg });
      await delay(2000);
      
      await sock.sendMessage(msg.chat, { text: "《✧》 ¡Los engranajes cuánticos están procesando tu destino! 🎪", edit: key }, { quoted: msg });
      await delay(2000);
      
      const replyMsg = `*《✧》 ¡LOS RESULTADOS HAN SIDO RENDERIZADOS!* \`🎲\`\n\n➠ Cifras de *${botname}* › ${Aku}\n➠ Cifras de *${userName}* › ${Kamu}\n\n${resultado}`;
      await sock.sendMessage(msg.chat, { text: replyMsg.trim(), edit: key }, { quoted: msg });
      
    } else {
      sock.reply(msg.chat, `《✧》 ¡UPS! Parece que alguien tiene los bolsillos vacíos. ¡No tienes *¥${formatNumber(count)} ${currency}* para sostener esta apuesta!`, msg);
    }
  }
};

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatTime(ms) {
  if (ms <= 0 || isNaN(ms)) return 'Ahora';
  const totalSec = Math.ceil(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  const partes = [];
  if (min) partes.push(`${min} minuto${min !== 1 ? 's' : ''}`);
  partes.push(`${sec} segundo${sec !== 1 ? 's' : ''}`);
  return partes.join(' ');
}
