import db from '#db';

export default {
  command: ['crime', 'crimen'],
  category: 'economy',
  description: 'Cometer una travesura ilegal o un glitch financiero para ganar coins rápido.',
  run: async ({ msg, sock, usedPrefix, text }) => {
    const chat = db.getChat(msg.chat);
    
    // Si la economía está en mantenimiento
    if (chat.adminonly || !chat.economy) {
      return msg.reply(`╭━━━〔 🚫 𝙀𝘾𝙊𝙉𝙊𝙈𝙄𝘼 𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝘼𝘿𝘼 〕━━━⬣

¡RECHORCHOLIS! ¡La economía de nuestro maravilloso Circo Digital está clausurada en esta carpa!

Dile a tu administrador que encienda los motores de la diversión con el comando:
➜ *${usedPrefix}economy on*

╰━━━━━━━━━━━━━━━`);
    }

    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const monedas = (db.getSettings(botId)).currency;
    
    db.setCreate('chat_users', [msg.chat, msg.sender], 'lastcrime', 0);   
    const user = db.getChatUser(msg.chat, msg.sender);
    const remainingTime = user.lastcrime - Date.now();
    
    if (remainingTime > 0) {
      return msg.reply(`╭━━━〔 ⏳ 𝙎𝙄𝙎𝙏𝙀𝙈𝘼 𝘿𝙀 𝙎𝙀𝙂𝙐𝙍𝙄𝘿𝘼𝘿 〕━━━⬣

¡ALTO AHÍ, MENTE CRIMINAL! Los sistemas de seguridad de la carpa te tienen bajo la mira. 

Espera *${msToTime(remainingTime)}* antes de planear otro golpe.

╰━━━━━━━━━━━━━━━`);
    }

    const éxito = Math.random() < 0.4;
    let cantidad;

    if (éxito) {
      cantidad = Math.floor(Math.random() * (7500 - 5500 + 1)) + 5500;
      db.setChatUser(msg.chat, msg.sender, 'coins', (user.coins || 0) + cantidad);
    } else {
      cantidad = Math.floor(Math.random() * (6000 - 4000 + 1)) + 4000;
      const total = (user.coins || 0) + (user.bank || 0);
      
      if (total >= cantidad) {
        if (user.coins >= cantidad) {
          db.setChatUser(msg.chat, msg.sender, 'coins', (user.coins || 0) - cantidad);
        } else {
          const restante = cantidad - (user.coins || 0);
          db.setChatUser(msg.chat, msg.sender, 'coins', 0);
          db.setChatUser(msg.chat, msg.sender, 'bank', (user.bank || 0) - restante);
        }
      } else {
        cantidad = total;
        db.setChatUser(msg.chat, msg.sender, 'coins', 0);
        db.setChatUser(msg.chat, msg.sender, 'bank', 0);
      }
    }        
    
    db.setChatUser(msg.chat, msg.sender, 'lastcrime', Date.now() + 7 * 60 * 1000);

    const successMessages = [
      `¡Te infiltraste en el Reino de Caramelo y asaltaste un camión cargado de fudge de chocolate! Lograste venderlo en el mercado negro por *¥${cantidad.toLocaleString()} ${monedas}*.`,
      `¡Le robaste las llaves de la carpa trasera a Ragatha mientras estaba distraída y saqueaste la caja de utilería, ganando *¥${cantidad.toLocaleString()} ${monedas}*!`,
      `¡Hackeaste la base de datos de Bubble y desviaste un paquete de datos financieros directo a tu cartera! Conseguiste *¥${cantidad.toLocaleString()} ${monedas}*!`,
      `¡Te escabulliste en la Mansión Spooky y lograste sustraer una de las valiosas reliquias góticas sin despertar a los fantasmas! Ganaste *¥${cantidad.toLocaleString()} ${monedas}*!`,
      `¡Aprovechaste que Kinger estaba teniendo un ataque de pánico sobre su torre de ajedrez para quitarle un fajo de billetes digitales! Obtuviste *¥${cantidad.toLocaleString()} ${monedas}*!`,
      `¡Le vendiste a un maniquí ingenuo un mapa falso que supuestamente llevaba a "La Salida" del circo! Te pagó *¥${cantidad.toLocaleString()} ${monedas}*!`,
      `¡Ayudaste a Jax a sabotear las habitaciones de los demás y te dio una jugosa parte del botín: *¥${cantidad.toLocaleString()} ${monedas}*!`,
      `¡Encontraste un glitch de duplicación en las máquinas expendedoras de dulces de la Reina Lulilalu y extrajiste *¥${cantidad.toLocaleString()} ${monedas}*!`,
      `¡Falsificaste pases VIP para el próximo gran show del circo y los habitantes te pagaron un total de *¥${cantidad.toLocaleString()} ${monedas}*!`,
      `¡Rompiste un jarrón antiguo en los pasillos infinitos y para tu sorpresa estaba lleno de códigos de valor por *¥${cantidad.toLocaleString()} ${monedas}*!`
    ];

    const failMessages = [
      `¡Intentaste robarle un ojo flotante a Caine, pero sus dentaduras te descubrieron in fraganti! La multa del sistema te costó *¥${cantidad.toLocaleString()} ${monedas}*.`,
      `¡Trataste de asaltar la bóveda del Reino de Caramelo, pero la Reina Lulilalu te mandó a sus guardias de gominola! Perdiste *¥${cantidad.toLocaleString()} ${monedas}*.`,
      `¡Le hiciste una broma pesada a Zooble, pero se armó con una de sus piezas sueltas y te obligó a pagarle *¥${cantidad.toLocaleString()} ${monedas}* por los daños!`,
      `¡Intentaste hackear el servidor central desde el Vacío, pero el antivirus del circo te aplicó un formateo de fondos de *¥${cantidad.toLocaleString()} ${monedas}*.`,
      `¡Te metiste en la Mansión Spooky a saquear tumbas, pero Kinger apareció de la nada con una escopeta y te quitó *¥${cantidad.toLocaleString()} ${monedas}* del susto!`,
      `¡Le quitaste la máscara de la comedia a Gangle, pero Jax te vio y te extorsionó cobrándote *¥${cantidad.toLocaleString()} ${monedas}* para no acusarte!`,
      `¡El portal al que entraste para escapar de la escena del crimen se congeló por un error de renderizado y dejaste caer *¥${cantidad.toLocaleString()} ${monedas}*!`,
      `¡Pomni entró en crisis nerviosa justo cuando le estabas quitando su cartera, llamando la atención de todo el elenco! Tuviste que tirar *¥${cantidad.toLocaleString()} ${monedas}* para huir.`
    ];

    const message = éxito ? pickRandom(successMessages) : pickRandom(failMessages);
    
    await sock.sendMessage(msg.chat, { text: `╭━━━〔 🎭 𝙍𝙀𝙎𝙐𝙇𝙏𝘼𝘿𝙊 𝘿𝙀𝙇 𝘾𝙍𝙄𝙈𝙀𝙉 〕━━━⬣

${message}

╰━━━━━━━━━━━━━━━` }, { quoted: msg });
  }
};

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const min = minutes < 10 ? '0' + minutes : minutes;
  const sec = seconds < 10 ? '0' + seconds : seconds;
  return min === '00' ? `${sec} segundo${sec > 1 ? 's' : ''}` : `${min} minuto${min > 1 ? 's' : ''}, ${sec} segundo${sec > 1 ? 's' : ''}`;
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}
