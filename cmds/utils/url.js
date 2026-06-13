import axios from 'axios'
import * as cheerio from 'cheerio'

export default {
  command: ['url'],
  category: 'tools',

  run: async ({ msg, sock, text, args }) => {

    let url = text || args.join(' ') || msg.body || ''

    if (url.includes(' ')) {
      url = url.split(/ +/).slice(1).join(' ')
    }

    url = url.trim()

    if (!url || !/^https?:\/\//i.test(url)) {
      return msg.reply(
`╭━━━〔 ⚠️ *USO INCORRECTO* 〕━━━⬣
┃ ✏️ *Ejemplo:*
┃
┃ *url https://pin.it/xxxxx
┃
┃ 🔗 También acepta enlaces
┃ directos de Pinterest.
╰━━━━━━━━━━━━━━━━⬣`
      )
    }

    try {

      await msg.reply(
`╭━━━〔 📌 *PINTEREST URL* 〕━━━⬣
┃ 🔍 Analizando enlace...
┃ ⏳ Expandiendo URL
┃ 🖼️ Buscando imagen HD
╰━━━━━━━━━━━━━━━━⬣`
      )

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
`╭━━━〔 🚫 *ERROR* 〕━━━⬣
┃ No pude acceder al enlace.
┃
┃ Posibles causas:
┃ • El enlace es inválido
┃ • El Pin es privado
┃ • Pinterest bloqueó la petición
╰━━━━━━━━━━━━━━━━⬣`
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
        imageUrl = imageUrl.replace(/\/\d+x\//, '/736x/')
      }

      if (!imageUrl) {
        return msg.reply(
`╭━━━〔 ❌ *SIN RESULTADOS* 〕━━━⬣
┃ No encontré una imagen
┃ válida para este Pin.
┃
┃ 💡 Prueba con otro enlace.
╰━━━━━━━━━━━━━━━━⬣`
        )
      }

      await sock.sendMessage(
        msg.chat,
        {
          text:
`╭━━━〔 ✅ *PINTEREST URL* 〕━━━⬣
┃ 🎉 *Enlace procesado*
┃ correctamente.
┃
┃ 🖼️ *Imagen HD:*
┃ ${imageUrl}
┃
┃ 🔗 *URL expandida:*
┃ ${finalUrl}
┃
┃ ✨ Calidad optimizada
┃ para descargas.
╰━━━━━━━━━━━━━━━━⬣`
        },
        { quoted: msg }
      )

    } catch (e) {
      console.error('[Pinterest URL Error]', e)

      return msg.reply(
`╭━━━〔 🚫 *ERROR* 〕━━━⬣
┃ No pude procesar el enlace.
┃
┃ Posibles causas:
┃ • Pinterest bloqueó la petición
┃ • El enlace es inválido
┃ • El servidor no respondió
╰━━━━━━━━━━━━━━━━⬣`
      )
    }
  }
}
