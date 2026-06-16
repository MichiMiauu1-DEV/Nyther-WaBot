import axios from 'axios'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

export default {
  command: ['toimg'],
  category: 'tools',

  run: async ({ msg, sock }) => {

    const chat = msg.chat;
    const quoted = msg.quoted || msg;

    const isSticker =
      quoted?.message?.stickerMessage ||
      quoted?.message?.imageMessage?.mimetype === 'image/webp';

    if (!isSticker) {
      return sock.sendMessage(chat, {
        text:
`╭━━━〔 ⚠️ TOIMG 〕━━━⬣

📌 Responde a un sticker

╰━━━━━━━━━━━━━━━`
      }, { quoted: msg });
    }

    try {

      // 📥 descargar sticker
      const buffer = await sock.downloadMediaMessage(quoted);

      if (!buffer) {
        return sock.sendMessage(chat, {
          text: "❌ No se pudo descargar el sticker"
        }, { quoted: msg });
      }

      // 🧠 convertir base64 para API
      const base64 = buffer.toString('base64');

      // 🔥 API CONVERT
      const res = await axios.post(
        'https://api.vreden.web.id/api/webp-to-png',
        { image: base64 }
      );

      const imageUrl = res.data?.result;

      if (!imageUrl) {
        return sock.sendMessage(chat, {
          text: "❌ Error en la conversión"
        }, { quoted: msg });
      }

      // 📁 crear archivo temporal
      const fileName = crypto.randomBytes(6).toString('hex') + '.png';
      const filePath = path.join('./tmp', fileName);

      // asegurar carpeta
      if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp');

      const imgBuffer = (await axios.get(imageUrl, { responseType: 'arraybuffer' })).data;

      fs.writeFileSync(filePath, imgBuffer);

      // 📤 enviar imagen
      await sock.sendMessage(chat, {
        image: fs.readFileSync(filePath),
        caption:
`╭━━━〔 🖼️ TOIMG 〕━━━⬣

✅ Sticker convertido correctamente

⏳ Se eliminará en 10 minutos

╰━━━━━━━━━━━━━━━`
      }, { quoted: msg });

      // 🧹 AUTO DELETE (10 min)
      setTimeout(() => {
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (e) {
          console.log("Error borrando archivo:", e);
        }
      }, 10 * 60 * 1000);

    } catch (e) {
      console.error(e);

      return sock.sendMessage(chat, {
        text:
`╭━━━〔 ❌ ERROR 〕━━━⬣

No se pudo convertir el sticker

╰━━━━━━━━━━━━━━━`
      }, { quoted: msg });
    }
  }
};
