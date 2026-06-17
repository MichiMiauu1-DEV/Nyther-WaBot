import db from '#db';

export default {
  command: ['ppt'],
  category: 'economy',
  description: 'Desafía al sistema en un duelo de Piedra, Papel o Tijera.',
  run: async ({ msg, sock, args, usedPrefix, command, text }) => {
    const chatId = msg.chat;
    const chatData = db.getChat(chatId);
    
    // Verificación de estado del sistema
    if (chatData.adminonly || !chatData.economy) {
      return msg.reply(`╭━━━〔 🚫 𝙀𝘾𝙊𝙉𝙊𝙈𝙄𝘼 𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝘼𝘿𝘼 〕━━━⬣

¡RECHORCHOLIS! ¡La economía de nuestro maravilloso Circo Digital está clausurada en esta carpa!

Dile a tu administrador que encienda los motores de la diversión con el comando:
➜ *${usedPrefix}economy on*

╰━━━━━━━━━━━━━━━`);
    }
    
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';    
    const botSettings = db.getSettings(botId);
    const monedas = botSettings.currency;
    const botname = botSettings.namebot;   
    
    db.setCreate('chat_users', [chatId, msg.sender], 'lastppt', 0);
    const user = db.getChatUser(chatId, msg.sender);    
    const remainingTime = user.lastppt - Date.now();    
    
    // Cooldown de seguridad
    if (remainingTime > 0) {
      return msg.reply(`╭━━━〔 ⏳ 𝙋𝘼𝘾𝙄𝙀𝙉𝘾𝙄𝘼 〕━━━⬣

¡PACIENCIA, ACROBATA! Los sistemas están procesando tu última jugada. Espera *${msToTime(remainingTime)}* para volver a desafiarme.

╰━━━━━━━━━━━━━━━`);
    }
    
    const options = ['piedra', 'papel', 'tijera'];
    const userChoice = args[0]?.trim().toLowerCase();    
    
    if (!options.includes(userChoice)) {
      return msg.reply(`╭━━━〔 🪨 𝙋𝙄𝙀𝘿𝙍𝘼 𝙋𝘼𝙋𝙀𝙇 𝙏𝙄𝙅𝙀𝙍𝘼 〕━━━⬣

¡ELÍGE TU ARMA! Usa el comando correctamente:
➜ *${usedPrefix + command} piedra*
➜ *${usedPrefix + command} papel*
➜ *${usedPrefix + command} tijera*

╰━━━━━━━━━━━━━━━`);
    }
    
    const botChoice = options[Math.floor(Math.random() * options.length)];
    const result = determineWinner(userChoice, botChoice);
    
    const reward = Math.floor(Math.random() * (5500 - 3000 + 1)) + 3000;
    const loss = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
    const tieReward = Math.floor(Math.random() * (1500 - 800 + 1)) + 800;    
    
    let newCoins = user.coins || 0;
    let newBank = user.bank || 0;    
    
    // Lógica de resultados circenses
    if (result === 'win') {
      newCoins += reward;
      db.setChatUser(chatId, msg.sender, 'coins', newCoins);
      await sock.sendMessage(chatId, { text: `╭━━━〔 🏆 𝙑𝙄𝘾𝙏𝙊𝙍𝙄𝘼 〕━━━⬣

¡INCREÍBLE! ¡Has ganado el duelo!

> 🎭 *Tú elegiste:* ${userChoice}
> 🤡 *${botname} eligió:* ${botChoice}
> 💰 *Premio:* +¥${reward.toLocaleString()} ${monedas}

╰━━━━━━━━━━━━━━━` }, { quoted: msg });
      
    } else if (result === 'lose') {
      const total = newCoins + newBank;
      const actualLoss = Math.min(loss, total);      
      
      if (newCoins >= actualLoss) {
        newCoins -= actualLoss;
        db.setChatUser(chatId, msg.sender, 'coins', newCoins);
      } else {
        const remaining = actualLoss - newCoins;
        newCoins = 0;
        newBank = Math.max(0, newBank - remaining);
        db.setChatUser(chatId, msg.sender, 'coins', 0);
        db.setChatUser(chatId, msg.sender, 'bank', newBank);
      }      
      await sock.sendMessage(chatId, { text: `╭━━━〔 💥 𝘿𝙀𝙍𝙍𝙊𝙏𝘼 〕━━━⬣

¡OH, NO! ¡Has sido derrotado por un algoritmo!

> 🎭 *Tú elegiste:* ${userChoice}
> 🤡 *${botname} eligió:* ${botChoice}
> 💸 *Pérdida:* -¥${actualLoss.toLocaleString()} ${monedas}

╰━━━━━━━━━━━━━━━` }, { quoted: msg });
      
    } else {
      newCoins += tieReward;
      db.setChatUser(chatId, msg.sender, 'coins', newCoins);
      await sock.sendMessage(chatId, { text: `╭━━━〔 ⚖️ 𝙀𝙈𝙋𝘼𝙏𝙀 〕━━━⬣

¡UN EMPATE TÉCNICO! ¡Casi como un glitch en la realidad!

> 🎭 *Tú elegiste:* ${userChoice}
> 🤡 *${botname} eligió:* ${botChoice}
> 💰 *Consuelo:* +¥${tieReward.toLocaleString()} ${monedas}

╰━━━━━━━━━━━━━━━` }, { quoted: msg });
    }
    
    // Marcamos el cooldown
    db.setChatUser(chatId, msg.sender, 'lastppt', Date.now() + 1 * 60 * 1000);
  }
};

function determineWinner(user, bot) {
  if (user === bot) return 'tie';
  if ((user === 'piedra' && bot === 'tijera') || (user === 'papel' && bot === 'piedra') || (user === 'tijera' && bot === 'papel')) {
    return 'win';
  }
  return 'lose';
}

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  return `${minutes} minuto${minutes !== 1 ? 's' : ''}, ${seconds} segundo${seconds !== 1 ? 's' : ''}`;
}
