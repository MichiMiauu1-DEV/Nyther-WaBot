import googleIt from 'google-it';
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

      // Configuramos google-it para buscar de forma segura e interceptar los enlaces
      const results = await googleIt({ 
        query: text, 
        'no-display': true,
        limit: 10 
      });

      if (!results || results.length === 0) {
        await msg.react('❌');
        return sock.sendMessage(chat, {
          text: '《✧》 ¡VAYA, VAYA! ¡Parece que los servidores de la gran red han escondido sus tesoros! No se encontró ninguna información o imagen para tu búsqueda.'
        }, { quoted: msg });
      }

      // Filtramos las respuestas para buscar enlaces que apunten directamente a extensiones de imágenes
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
      let imageUrl = null;
      let title = 'Imagen Encontrada';

      // Buscamos en los resultados un enlace directo a archivo de imagen o links de plataformas de imágenes
      for (const result of results) {
        const linkLower = result.link.toLowerCase();
        if (imageExtensions.some(ext => linkLower.includes(ext)) || linkLower.includes('images') || linkLower.includes('photo')) {
          imageUrl = result.link;
          title = result.title || text;
          break;
        }
      }

      // Si ningún link tenía formato de imagen directo, tomamos el primer enlace del resultado de Google como fallback
      if (!imageUrl) {
        imageUrl = results[0].link;
        title = results[0].title || text;
      }

      const captionText = `《✧》 *¡ESPECTACULAR!* Aquí tienes el enlace directo extraído de los confines de la red:\n\n` +
                          `• *Título ›* ${title}\n` +
                          `• *Enlace ›* ${imageUrl}`;

      // Enviamos el mensaje con el link o la imagen renderizada si la URL es directa
      await sock.sendMessage(chat, {
        image: { url: imageUrl },
        caption: captionText
      }, { quoted: msg });

      await msg.react('✔️');

    } catch (e) {
      // Registramos el error real en la consola de DuckCloud/Opik de forma discreta
      console.error('Anomalía en el comando de imágenes registrada en la consola principal:', e);
      await msg.react('✖️');

      // Si el raspado es bloqueado o falla, Kinger toma el control del chat
      return sock.sendMessage(chat, {
        text: '《✧》 ...¿Donde esta kinger?'
      }, { quoted: msg });
    }
  }
};
