import axios from 'axios'
import * as cheerio from 'cheerio'

export default {
  command: ['url'],
  category: 'tools',

  run: async ({ msg, sock, text, args }) => {

    const userId = msg.sender

    if (!global.db) global.db = {}
    if (!global.db.users) global.db.users = {}

    if (!global.db.users[userId]) {
      global.db.users[userId] = {
        urlCount: 0,
        achievements: []
      }
    }

    const u = global.db.users[userId]
    u.urlCount = Number(u.urlCount) || 0

    let url = text || args.join(' ') || msg.body || ''

    if (url.includes(' ')) {
      url = url.split(/ +/).slice(1).join(' ')
    }

    url = url.trim()

    if (!url || !/^https?:\/\//i.test(url)) {
      return msg.reply(
`╭━━━〔 ⚠️ *USO INCORRECTO* 〕━━━⬣
┃ ✏️ *Ejemplo:*
┃ *url https://pin.it/xxxxx
╰━━━━━━━━━━━━━━━━⬣`
      )
    }

    try {

      await msg.reply(
`╭━━━〔 📌 *PINTEREST URL* 〕━━━⬣
┃ 🔍 Analizando enlace...
╰━━━━━━━━━━━━━━━━⬣`
      )

      const headers = {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
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
╰━━━━━━━━━━━━━━━━⬣`
        )
      }

      const finalUrl =
        response.request?.res?.responseUrl ||
        response.request?._redirectable?._currentUrl ||
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
┃ No encontré imagen válida.
╰━━━━━━━━━━━━━━━━⬣`
        )
      }

      // 🔥 INCREMENTO DE USO
      u.urlCount += 1

      let logrosText = ""

      // 🏆 LOGRO 20 URLs
      if (u.urlCount >= 20 && !u.achievements.find(a => a.id === "url_master")) {

        if (!Array.isArray(u.achievements)) u.achievements = []

        u.achievements.push({
          id: "url_master",
          name: "🌐 Maestro de Enlaces",
          emoji: "🔗",
          description: "Usar 20 veces el comando url"
        })

        logrosText = `\n\n🏆 LOGRO DESBLOQUEADO: Maestro de Enlaces`
      }

      await sock.sendMessage(
        msg.chat,
        {
          text:
`╭━━━〔 ✅ *PINTEREST URL* 〕━━━⬣
┃ 🎉 *Enlace procesado*
┃
┃ 🖼️ Imagen:
┃ ${imageUrl}
┃
┃ 🔗 URL:
┃ ${finalUrl}
┃
┃ 📊 Usos: ${u.urlCount}
╰━━━━━━━━━━━━━━━━⬣${logrosText}`
        },
        { quoted: msg }
      )

    } catch (e) {
      console.error('[URL Error]', e)

      return msg.reply(
`╭━━━〔 🚫 *ERROR* 〕━━━⬣
┃ No pude procesar el enlace.
╰━━━━━━━━━━━━━━━━⬣`
      )
    }
  }
  }
