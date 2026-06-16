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

      // Simulamos un navegador web real y moderno para engañar a los sistemas de Google
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(text)}&tbm=isch&asearch=ichunk&async=_id:rg_s,_pms:s,_fmt:pc`;
      
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3'
        }
      });

      if (!response.ok) throw new Error(`Google respondió con estado: ${response.status}`);

      const html = await response.text();

      // Expresión regular mística para cazar URLs de imágenes reales (compatibles con JPG/PNG) dentro del HTML de Google
      const regex = /"(https?:\/\/[^"]+?\.(?:jpg|jpeg|png))"/g;
      const links = [];
      let match;

      while ((match = regex.exec(html)) !== null) {
        // Evitamos capturar enlaces internos repetitivos de los servidores de Google
        if (!match[1].includes('google.com') && !match[1].includes('gstatic.com')) {
          links.push(match[1]);
        }
      }

      // Si el primer raspado estricto falla, usamos un filtro más amplio para capturar imágenes cifradas de Google
      if (links.length === 0) {
        const backupRegex = /\["https?:\/\/encrypted-tbn0\.gstatic\.com\/images\?q=tbn:[^"]+",\d+,\d+\]/g;
        const backupMatches = html.match(backupRegex);
        if (backupMatches) {
          for (const item of backupMatches) {
            const urlMatch = item.match(/"(https?:\/\/[^"]+)"/);
            if (urlMatch) links.push(urlMatch[1]);
          }
        }
      }

      // Si de verdad el array sigue completamente vacío tras los dos intentos de rastreo
      if (links.length === 0) {
        await msg.react('❌');
        return sock.sendMessage(chat, {
          text: '《✧》 ¡VAYA, VAYA! ¡Parece que los servidores de la gran red han escondido sus tesoros! No se encontró ninguna información o imagen para tu búsqueda.'
        }, { quoted: msg });
      }

      // Seleccionamos la primera imagen del glorioso desfile de resultados
      const imageUrl = links[0];

      const captionText = `《✧》 *¡ESPECTACULAR!* Aquí tienes el enlace directo extraído de los confines de la red:\n\n` +
                          `• *Título ›* ${text}\n` +
                          `• *Enlace ›* ${imageUrl}`;

      // Enviamos el paquete visual directamente a las manos del remitente
      await sock.sendMessage(chat, {
        image: { url: imageUrl },
        caption: captionText
      }, { quoted: msg });

      await msg.react('✔️');

    } catch (e) {
      // Registramos el percance en la consola principal de DuckCloud/Opik
      console.error('Anomalía en el comando de imágenes registrada en la consola principal:', e);
      await msg.react('✖️');

      // Escape de emergencia si los engranajes se rompen por completo
      return sock.sendMessage(chat, {
        text: '《✧》 ...¿Donde esta kinger?'
      }, { quoted: msg });
    }
  }
};
