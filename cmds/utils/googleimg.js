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

      let imageUrl = null;
      let title = text;

      // PASARELA 1: Buscador de código abierto y repositorio multimedia global (Inmune a bloqueos de IP)
      const wikiUrl = `https://commons.wikimedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(text)}&redirects=1`;
      const wikiRes = await fetch(wikiUrl);
      
      if (wikiRes.ok) {
        const data = await wikiRes.json();
        if (data && data.query && data.query.pages) {
          const pages = data.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pageId !== '-1' && pages[pageId].original) {
            imageUrl = pages[pageId].original.source;
          }
        }
      }

      // PASARELA 2: Si el término es muy específico/moderno y no está en la enciclopedia, usamos el motor espejo libre de Pixabay/Pexels integrado
      if (!imageUrl) {
        const fallbackUrl = `https://pixabay.com/api/?key=24411137-ca90fc8a159937a07747e9b04&q=${encodeURIComponent(text)}&image_type=photo&per_page=3`;
        const fallbackRes = await fetch(fallbackUrl);
        
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          if (fallbackData && fallbackData.hits && fallbackData.hits.length > 0) {
            imageUrl = fallbackData.hits[0].largeImageURL;
            title = fallbackData.hits[0].tags || text;
          }
        }
      }

      // Si tras este despliegue de ingeniería de datos seguimos atrapados en la oscuridad
      if (!imageUrl) {
        await msg.react('❌');
        return sock.sendMessage(chat, {
          text: '《✧》 ¡VAYA, VAYA! ¡Parece que los servidores de la gran red han escondido sus tesoros! No se encontró ninguna información o imagen para tu búsqueda.'
        }, { quoted: msg });
      }

      const captionText = `《✧》 *¡ESPECTACULAR!* Aquí tienes el enlace directo extraído de los confines de la red:\n\n` +
                          `• *Título ›* ${title}\n` +
                          `• *Enlace ›* ${imageUrl}`;

      // ¡Mandamos la entidad visual al chat!
      await sock.sendMessage(chat, {
        image: { url: imageUrl },
        caption: captionText
      }, { quoted: msg });

      await msg.react('✔️');

    } catch (e) {
      // Registramos la travesía fallida en la consola principal
      console.error('Anomalía en el comando de imágenes registrada en la consola principal:', e);
      await msg.react('✖️');

      // Si todo explota, que Kinger lidie con la crisis de identidad en el chat
      return sock.sendMessage(chat, {
        text: '《✧》 ...¿Donde esta kinger?'
      }, { quoted: msg });
    }
  }
};
