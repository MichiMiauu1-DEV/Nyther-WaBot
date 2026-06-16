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

      // INTENTO 1: La puerta principal de Google (Sin parámetros obsoletos)
      const googleUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(text)}`;
      const googleRes = await fetch(googleUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
        }
      });

      if (googleRes.ok) {
        const html = await googleRes.text();
        
        // Magia de expresiones regulares para extraer los enlaces en alta definición
        const highResRegex = /\["(https:\/\/[^"]+?\.(?:jpg|jpeg|png))",\d+,\d+\]/i;
        const highResMatch = html.match(highResRegex);
        
        if (highResMatch && highResMatch[1] && !highResMatch[1].includes('gstatic')) {
          imageUrl = highResMatch[1];
        }

        // Si la alta definición falla, buscamos las miniaturas directas de Google
        if (!imageUrl) {
          const thumbRegex = /(https:\/\/encrypted-tbn0\.gstatic\.com\/images\?q=tbn:[^"&]+)/;
          const thumbMatch = html.match(thumbRegex);
          if (thumbMatch && thumbMatch[1]) {
            imageUrl = thumbMatch[1];
          }
        }
      }

      // INTENTO 2: ¡La gran red de seguridad de Bing Imágenes!
      if (!imageUrl) {
        const bingUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(text)}`;
        const bingRes = await fetch(bingUrl, {
          headers: { 
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36' 
          }
        });

        if (bingRes.ok) {
          const bingHtml = await bingRes.text();
          // Extracción profunda del código de Bing
          const bingRegex = /murl&quot;:&quot;(https:\/\/[^&]+?\.(?:jpg|jpeg|png))&quot;/;
          const bingMatch = bingHtml.match(bingRegex);
          if (bingMatch && bingMatch[1]) {
            imageUrl = bingMatch[1];
          }
        }
      }

      // Si después de toda esta acrobacia seguimos sin nada
      if (!imageUrl) {
        await msg.react('❌');
        return sock.sendMessage(chat, {
          text: '《✧》 ¡VAYA, VAYA! ¡Parece que los servidores de la gran red han escondido sus tesoros! No se encontró ninguna información o imagen para tu búsqueda.'
        }, { quoted: msg });
      }

      const captionText = `《✧》 *¡ESPECTACULAR!* Aquí tienes el enlace directo extraído de los confines de la red:\n\n` +
                          `• *Título ›* ${text}\n` +
                          `• *Enlace ›* ${imageUrl}`;

      // ¡Mandamos el resultado final al escenario!
      await sock.sendMessage(chat, {
        image: { url: imageUrl },
        caption: captionText
      }, { quoted: msg });

      await msg.react('✔️');

    } catch (e) {
      // Registramos el desastre en las pantallas de administración
      console.error('Anomalía en el comando de imágenes registrada en la consola principal:', e);
      await msg.react('✖️');

      // ¡Que entre nuestro personaje favorito a tapar el hueco existencial!
      return sock.sendMessage(chat, {
        text: '《✧》 ...¿Donde esta kinger?'
      }, { quoted: msg });
    }
  }
};
