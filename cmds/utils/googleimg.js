import { format } from 'util';

export default {
  command: ['imagen', 'img', 'googleimg'],
  category: 'tools',

  run: async ({ msg, sock, text, isOwner }) => {
    const chat = msg.chat;

    // Validación de la esencia según el rol del usuario
    const userTitle = isOwner ? 'mi estimado dueño' : 'Estimado humano.';

    if (!text.trim()) {
      return sock.sendMessage(chat, {
        text: `《✧》 ¡RECHORCHOLIS! ¡No puedo buscar en el gran vacío digital si no me proporcionas un término! ¡Dime qué imagen deseas materializar en este plano virtual, ${userTitle}!`
      }, { quoted: msg });
    }

    try {
      await msg.react('🕒');

      // Consultamos a una API espejo de imágenes de código abierto de alta definición (libre de bloqueos de IP)
      const response = await fetch(`https://api.unsplash.com/search/photos?page=1&query=${encodeURIComponent(text)}&client_id=Source`);
      
      let imageUrl = null;
      let title = text;

      if (response.ok) {
        const data = await response.json();
        if (data && data.results && data.results.length > 0) {
          // Extraemos la versión regular/completa de la primera imagen encontrada
          imageUrl = data.results[0].urls.regular;
          title = data.results[0].alt_description || text;
        }
      }

      // FALLBACK DE EMERGENCIA: Si Unsplash no responde o viene vacío, usamos el motor espejo de Lexica Art
      if (!imageUrl) {
        const fallbackRes = await fetch(`https://lexica.art/api/v1/search?q=${encodeURIComponent(text)}`);
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          if (fallbackData && fallbackData.images && fallbackData.images.length > 0) {
            imageUrl = fallbackData.images[0].src;
          }
        }
      }

      // Si después de ambos intentos seguimos en el vacío absoluto
      if (!imageUrl) {
        await msg.react('❌');
        return sock.sendMessage(chat, {
          text: '《✧》 ¡VAYA, VAYA! ¡Parece que los servidores de la gran red han escondido sus tesoros! No se encontró ninguna información o imagen para tu búsqueda.'
        }, { quoted: msg });
      }

      const captionText = `《✧》 *¡ESPECTACULAR!* Aquí tienes el enlace directo extraído de los confines de la red:\n\n` +
                          `• *Título ›* ${title}\n` +
                          `• *Enlace ›* ${imageUrl}`;

      // Enviamos la imagen y el texto al chat de WhatsApp
      await sock.sendMessage(chat, {
        image: { url: imageUrl },
        caption: captionText
      }, { quoted: msg });

      await msg.react('✔️');

    } catch (e) {
      // Mandamos el verdadero error técnico a la consola del panel de control
      console.error('Anomalía en el comando de imágenes registrada en la consola principal:', e);
      await msg.react('✖️');

      // Si los servidores se caen por completo, el rey del tablero toma el escenario
      return sock.sendMessage(chat, {
        text: '《✧》 ...¿Donde esta kinger?'
      }, { quoted: msg });
    }
  }
};
