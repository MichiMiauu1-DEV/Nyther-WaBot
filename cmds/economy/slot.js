import { delay } from 'baileys';
import db from '#db';

export default {
  command: ['slot'],
  category: 'economy',
  description: 'Probar tu suerte en la caótica máquina tragamonedas de Caine.',
  run: async ({ msg, sock, args, usedPrefix, command, text }) => {
    const chat = db.getChat(msg.chat);
    
    // Si la economía está apagada en este sector virtual
    if (chat.adminonly || !chat.economy) {
      return msg.reply(`《✧》 ¡RECHORCHOLIS! ¡La economía de nuestro maravilloso Circo Digital está clausurada en esta carpa!\n\nDile a tu administrador que encienda los motores de la diversión con el comando:\n» *${usedPrefix}economy on*`);
    }

    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const bot = db.getSettings(botId);
    const currency = bot.currency;    
    db.setCreate('chat_users', [msg.chat, msg.sender], 'lastslot', 0);
    const user = db.getChatUser(msg.chat, msg.sender);    

    if (!args[0] || isNaN(args[0]) || parseInt(args[0]) <= 0) {
      return msg.reply(`《✧》 ¡ALTO AHÍ! Para hacer girar los rodillos de la fortuna debes ingresar una cantidad matemática válida de *${currency}* para tu apuesta.\n\n> Ejemplo » *${usedPrefix + command} 500*`);
    }    

    const apuesta = parseInt(args[0]);

    // Verificación del temporizador del WackyWatch
    if (Date.now() - user.lastslot < 30000) {
      const restante = user.lastslot + 30000 - Date.now();
      return msg.reply(`《✧》 ¡MÁS DESPACIO, ENTUSIASTA DEL AZAR! La palanca mecánica está recuperando su energía digital. Debes esperar *${formatTime(restante)}* antes de tentar a la suerte otra vez.`);
    }    

    if (apuesta < 100) {
      return msg.reply(`《✧》 ¡FONDOS INSUFICIENTES PARA LA FUNCIÓN! El requisito mínimo para activar los rodillos es de *¥100 ${currency}*.`);
    }

    if (user.coins < apuesta) {
      return msg.reply(`《✧》 ¡CATASTRÓFICO ERROR FINANCIERO! No posees suficientes *${currency}* sueltas en tus bolsillos para cubrir esa arriesgada apuesta. ¡Prueba retirando fondos de tu Bóveda!`);
    }    

    // Emojis temáticos del Circo Digital: Caine (👁️), Jax (🐰), Pomni (🎪)
    const emojis = ['👁️', '🐰', '🎪'];
    const getRandomEmojis = () => {
      const x = Array.from({ length: 3 }, () => emojis[Math.floor(Math.random() * emojis.length)]);
      const y = Array.from({ length: 3 }, () => emojis[Math.floor(Math.random() * emojis.length)]);
      const z = Array.from({ length: 3 }, () => emojis[Math.floor(Math.random() * emojis.length)]);
      return { x, y, z };
    };    

    const initialText = '《✧》| *WACKY SLOTS* \n────────────────\n¡Girando los rodillos de la carpa!...';
    let { key } = await sock.sendMessage(msg.chat, { text: initialText }, { quoted: msg });

    // ¡ANIMACIÓN ESPECTACULAR EN TIEMPO REAL!
    const animateSlots = async () => {
      for (let i = 0; i < 5; i++) {
        const { x, y, z } = getRandomEmojis();
        const animationText = `《✧》| *WACKY SLOTS* 
────────────────
   ${x[0]}  :  ${y[0]}  :  ${z[0]}
   ${x[1]}  :  ${y[1]}  :  ${z[1]}
   ${x[2]}  :  ${y[2]}  :  ${z[2]}
────────────────
¡Girando a máxima velocidad! 🎡`;
        await sock.sendMessage(msg.chat, { text: animationText, edit: key }, { quoted: msg });
        await delay(300);
      }
    };

    await animateSlots();    

    // RESULTADO FINAL
    const { x, y, z } = getRandomEmojis();
    let resultado;
    let newCoins = user.coins;    

    // Si los tres primeros rodillos de la fila superior coinciden (Línea ganadora)
    if (x[0] === y[0] && y[0] === z[0]) {
      resultado = `🎉 *¡PREMIO ABSOLUTAMENTE ESPECTACULAR!* Los astros digitales se alinearon y has ganado *¥${(apuesta * 2).toLocaleString()} ${currency}*!`;
      newCoins += apuesta;
    } else if (x[0] === y[0] || x[0] === z[0] || y[0] === z[0]) {
      resultado = `🎭 *¡CASI LO LOGRAS!* Hubo una pequeña coincidencia en la carpa. ¡Toma un premio de consolación de *¥10 ${currency}* por tu grandioso intento!`;
      newCoins += 10;
    } else {
      resultado = `💥 *¡OH, QUÉ TRAGEDIA!* Los rodillos muestran un caos total. Has perdido *¥${apuesta.toLocaleString()} ${currency}*. ¡Mejor suerte en la próxima función!`;
      newCoins -= apuesta;
    }

    db.setChatUser(msg.chat, msg.sender, 'lastslot', Date.now());
    db.setChatUser(msg.chat, msg.sender, 'coins', newCoins);

    const finalText = `《✧》| *WACKY SLOTS* 
────────────────
   ${x[0]}  :  ${y[0]}  :  ${z[0]}
   ${x[1]}  :  ${y[1]}  :  ${z[1]}
   ${x[2]}  :  ${y[2]}  :  ${z[2]}
────────────────
${resultado}`;

    await sock.sendMessage(msg.chat, { text: finalText, edit: key }, { quoted: msg });
  }
};

function formatTime(ms) {
  const totalSec = Math.ceil(ms / 1000);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  const parts = [];
  if (minutes > 0) parts.push(`${minutes} minuto${minutes !== 1 ? 's' : ''}`);
  parts.push(`${seconds} segundo${seconds !== 1 ? 's' : ''}`);
  return parts.join(' ');
}
