import axios from 'axios'
import * as cheerio from 'cheerio'

export default {
  command: ['url'],
  category: 'tools',

  run: async ({ msg, sock, text, args }) => {

    let url = text || args.join(' ') || msg.body || ''

    // Si el usuario escribió: ™url https://...
    if (url.includes(' ')) {
      url = url.split(/ +/).slice(1).join(' ')
    }

    url = url.trim()

    if (!url || !/^https?:\/\//i.test(url)) {
      return msg.reply(
        `⚠️ *USO INCORRECTO*\n\n` +
        `✏️ Ejemplo:\n` +
        `™url https://pin.it/xxxxx`
      )
    }

    try {
      await msg.reply(`🔍 *Analizando enlace de Pinterest...*`)

      const headers = {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept':
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }

      const response = await axios.get(url, {
        headers,
        maxRedirects: 10,
        timeout: 20000,
        validateStatus: () => true
      })

      if (response.status >= 400) {
        return msg.reply(
          `❌ *ERROR*\n\nNo pude acceder al enlace de Pinterest.`
        )
      }

      const finalUrl =
        response.request?.res?.responseUrl ||
        response.request?._redirectable?._currentUrl ||
        response.config?.url ||
        url

      const $ = cheerio.load(response.data)

      let imageUrl =
        $('meta[property="og:image"]').attr('content') ||
        $('meta[name="twitter:image"]').attr('content') ||
        $('link[rel="image_src"]').attr('href')

      if (imageUrl) {
        imageUrl = imageUrl.split('?')[0]

        // Mejorar calidad
        imageUrl = imageUrl.replace(/\/\d+x\//, '/736x/')
      }

      if (!imageUrl) {
        return msg.reply(
          `❌ *No pude encontrar una imagen válida para este Pin.*`
        )
      }

      await sock.sendMessage(
        msg.chat,
        {
          text:
            `✅ *URL ENCONTRADA*\n\n` +
            `🖼️ *Imagen:*\n${imageUrl}\n\n` +
            `🔗 *Link original expandido:*\n${finalUrl}`
        },
        { quoted: msg }
      )

    } catch (e) {
      console.error('[URL Pinterest Error]', e)

      return msg.reply(
        `❌ *ERROR*\n\n` +
        `No pude procesar ese enlace de Pinterest o Pinterest bloqueó la solicitud.`
      )
    }
  }
}            // Realiza la petición y sigue los redireccionamientos (pin.it -> pinterest.com)
            const response = await axios.get(url, {
                headers,
                maxRedirects: 10
            })

            // Captura de forma segura la URL final después de los acortadores
            const finalUrl = response.request._redirectable?._currentUrl || response.config.url || url

            // Carga el HTML en Cheerio
            const $ = cheerio.load(response.data)

            // Busca la imagen en las etiquetas Meta principales
            let imageUrl = $('meta[property="og:image"]').attr('content') || 
                           $('meta[name="twitter:image"]').attr('content') ||
                           $('link[rel="image_src"]').attr('href')

            if (imageUrl) {
                // Limpia los parámetros de consulta (?b=true, etc.)
                imageUrl = imageUrl.split('?')[0]

                // Reemplaza tamaños pequeños por una resolución alta estándar (736x) 
                // Evitamos '/originals/' en algunos servidores ya que suele tirar AccessDenied si no hay cookies activas
                imageUrl = imageUrl.replace(/\/\d+x\//, '/736x/')
            }

            if (!imageUrl) {
                return m.reply(`❌ *No pude encontrar una imagen válida para este Pin.*`)
            }

            // Envía el resultado al chat
            await client.sendMessage(m.chat, {
                text: `✅ *URL ENCONTRADA*\n\n🖼️ *Imagen:* \n${imageUrl}\n\n🔗 *Link original expandido:* \n${finalUrl}`
            }, { quoted: m })

        } catch (e) {
            console.error(e)
            m.reply(`❌ *ERROR*\n\nNo pude procesar ese link de Pinterest o el servidor denegó el acceso.`)
        }
    }
}
