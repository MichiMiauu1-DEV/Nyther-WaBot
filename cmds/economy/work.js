import db from '#db';

export default {
  command: ['w', 'work', 'chambear', 'trabajar'],
  category: 'economy',
  description: 'Ganar coins en mis maravillosas aventuras.',

  run: async ({ msg, sock, usedPrefix, command, text }) => {

    const chat = db.getChat(msg.chat);

    // Si la economía está apagada, ¡Caine lo anuncia!
    if (chat.adminonly || !chat.economy) {
      return msg.reply(
`╭━━━〔 🎪 𝘿𝙄𝙂𝙄𝙏𝘼𝙇 𝘾𝙄𝙍𝘾𝙐𝙎 〕━━━⬣

🚫 ¡RECHORCHOLIS! ECONOMÍA CERRADA

📌 Este espectáculo no está activo en esta carpa

💡 Actívalo con:
» ${usedPrefix}economy on

╰━━━━━━━━━━━━━━━`
      );
    }

    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const settings = db.getSettings(botId);
    const monedas = settings.currency;

    db.setCreate('chat_users', [msg.chat, msg.sender], 'lastwork', 0);
    const user = db.getChatUser(msg.chat, msg.sender);

    const cooldown = 3 * 60 * 1000;

    if (Date.now() < user.lastwork) {
      const tiempoRestante = formatTime(user.lastwork - Date.now());

      return sock.reply(
        msg.chat,
`╭━━━〔 ⏳ 𝘾𝙊𝙊𝙇𝘿𝙊𝙒𝙉 〕━━━⬣

🎭 ¡ALTO AHÍ, ESTRELLA DIGITAL!

⏱️ Aún estás recuperándote del show anterior

📌 Tiempo restante:
➜ ${tiempoRestante}

╰━━━━━━━━━━━━━━━`,
        msg
      );
    }

    const rsl = Math.floor(Math.random() * (4000 - 2000 + 1)) + 2000;

    db.setChatUser(msg.chat, msg.sender, 'lastwork', Date.now() + cooldown);
    db.setChatUser(msg.chat, msg.sender, 'coins', (user.coins || 0) + rsl);

    // ¡El pago por la proeza en el circo!
    await sock.sendMessage(msg.chat, {
      text:
`╭━━━〔 🎪 𝙒𝙊𝙍𝙆 𝙎𝙃𝙊𝙒 〕━━━⬣

✨ ${pickRandom(trabajo)}

💰 Recompensa:
➜ +${rsl.toLocaleString()} ${monedas}

🎭 El Circo Digital te observa...

╰━━━━━━━━━━━━━━━`
    }, { quoted: msg });

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

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// ¡LA LISTA MÁS ESPECTACULAR DE AVENTURAS DEL CIRCO DIGITAL!
const trabajo = [
  "Ayudaste a Kinger a reconstruir su fuerte de almohadas y como agradecimiento te dio",
  "Atrapaste a 3 Gloinks traviesos que se robaban las luces del escenario y recibiste",
  "Sobreviviste a una degustación culinaria preparada por Bubble y como compensación por los daños te pagaron",
  "Arreglaste un glitch visual en los dientes de la entrada principal y ganaste",
  "Le recordaste a Pomni su nuevo nombre 50 veces seguidas para que no enloqueciera y recibiste",
  "Paseaste por el Terreno de Aventuras sin acercarte al Gran Vacío y encontraste",
  "Lustraste mis fabulosos ojos flotantes y como propina te di",
  "Ayudaste a Jax a NO molestar a Gangle por 5 minutos (¡un verdadero milagro!) y el sistema te premió con",
  "Recogiste las cintas de comedia rotas de Gangle del piso y obtuviste",
  "Participaste como muñeco de prueba en el asombroso desfile de Caine y recibiste",
  "Rescataste las piezas de Zooble de ser desarmadas por enésima vez y ganaste",
  "Programaste un nuevo y completamente inofensivo NPC para el circo y te pagaron",
  "Evitaste mirar directamente al Sol y a la Luna discutiendo por un día entero y ganaste",
  "Desinfectaste la carpa después de que Bubble explotara por todas partes y recibiste",
  "Esquivaste exitosamente la Puerta de Salida falsa sin llorar en el suelo y te premiaron con",
  "Atrapaste a mi fiel WackyWatch antes de que su temporizador llegara a cero y ganaste",
  "Soportaste el humor negro de Jax durante todo un mini-juego y por tus daños psicológicos recibiste",
  "Pintaste los cielos digitales con colores mucho más vibrantes y obtuviste",
  "Alimentaste a la criatura del pozo de caramelo sin perder una extremidad y recibiste",
  "Organizaste mi gloriosa colección de varitas mágicas y te recompensé con",
  "Salvaste a un maniquí de chocar contra la pared invisible y el servidor te otorgó",
  "Ganaste una carrera de obstáculos flotantes totalmente segura (ignorando los pinchos) y obtuviste",
  "Hiciste de árbitro en una pelea entre Kaufmo y una pared (antes de... ya sabes) y te pagaron",
  "Lograste que el escenario principal no colapsara bajo su propio peso en bytes y recibiste"
];
