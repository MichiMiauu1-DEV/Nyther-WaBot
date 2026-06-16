import yts from 'yt-search'
import ytdl from '@distube/ytdl-core'

// Definimos el objeto cmd
const cmd = {
  command: ['play2', 'mp4', 'ytmp4', 'ytvideo', 'prueba'],
  category: 'downloads',
  description: 'Descargar un vídeo de YouTube.',

  run: async ({ msg, sock, args, usedPrefix, command }) => {
    try {
      if (!args[0]) return msg.reply('《✧》Por favor, menciona el nombre o URL del video')

      const input = args.join(' ')
      let url = input
      
      // Validamos si es URL, si no, buscamos
      if (!ytdl.validateURL(input)) {
        const search = await yts(input)
        if (!search.videos.length) return msg.reply('《✧》No se encontró el video.')
        url = search.videos[0].url
      }

      await msg.reply('《✧》Procesando solicitud, espera un momento...')

      // Obtenemos la info
      const info = await ytdl.getInfo(url)
      
      // Elegimos el mejor formato MP4 (itag 18 es el más compatible para bots)
      const format = ytdl.chooseFormat(info.formats, { quality: '18', filter: 'videoandaudio' })
      
      if (!format) return msg.reply('《✧》Error: No se pudo procesar el formato de video.')

      // Mensaje de respuesta
      const caption = `乂 *Video Descargado*

> ❒ Título › *${info.videoDetails.title}*
> ❒ Canal › *${info.videoDetails.author.name}*
> ❒ Duración › *${formatDuration(info.videoDetails.lengthSeconds)}*
> ❒ Calidad › *360p*`

      // Envío del video
      await sock.sendMessage(msg.chat, {
        video: { url: format.url },
        caption: caption,
        mimetype: 'video/mp4',
        fileName: `${info.videoDetails.title.replace(/[^a-zA-Z0-9 ]/g, '')}.mp4`,
        contextInfo: {
          externalAdReply: {
            title: info.videoDetails.title,
            body: 'YouTube Downloader',
            thumbnailUrl: info.videoDetails.thumbnails[0].url,
            mediaType: 1,
            showAdAttribution: true
          }
        }
      }, { quoted: msg })

    } catch (e) {
      console.error(e) // Para ver el error exacto en tu consola
      await msg.reply(`> Hubo un error al descargar el video:\n> ${e.message}`)
    }
  }
}

// Función auxiliar para formato de tiempo
function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`
}

// ESTO ES LO QUE HACE QUE EL BOT CARGUE EL COMANDO
export default cmd
  
