import axios from 'axios'

export default {
  command: ['togif'],
  category: 'tools',

  run: async ({ msg, sock }) => {

    const chat = msg.chat;
    const quoted = msg.quoted;

    if (!quoted) {
      return sock.sendMessage(chat, {
        text:
`╭━━━〔 ⚠️ 𝙏𝙊𝙂𝙄𝙁 〕━━━⬣

📌 Responde a un sticker animado

╰━━━━━━━━━━━━━━━`
      }, { quoted: msg });
    }

    try {

      await msg.react('🕒');

      const buffer = await quoted.download();

      if (!buffer) {
        await msg.react('❌');
        return sock.sendMessage(chat, {
          text:
`╭━━━〔 ❌ 𝙀𝙍𝙍𝙊𝙍 〕━━━⬣

🚫 No se pudo descargar el sticker

╰━━━━━━━━━━━━━━━`
        }, { quoted: msg });
      }

      // 🔍 detectar animación (simple check webp)
      const isAnimated =
        buffer.toString('hex').includes('21f9') || // GIF header
        buffer.length > 100000; // heurística

      if (!isAnimated) {
        await msg.react('⚠️');

        return sock.sendMessage(chat, {
          text:
`╭━━━〔 ⚠️ 𝙏𝙊𝙂𝙄𝙁 〕━━━⬣

📌 Este sticker NO es animado

🎞️ Usa un sticker con movimiento

╰━━━━━━━━━━━━━━━`
        }, { quoted: msg });
      }

      // 📡 API CONVERT
      const res = await axios.post(
        'https://api.vreden.web.id/api/webp-to-gif',
        {
          image: buffer.toString('base64')
        }
      );

      const gifUrl = res.data?.result;

      if (!gifUrl) {
        await msg.react('❌');
        return sock.sendMessage(chat, {
          text:
`╭━━━〔 ❌ 𝙀𝙍𝙍𝙊𝙍 〕━━━⬣

🚫 La API no pudo convertir el sticker

╰━━━━━━━━━━━━━━━`
        }, { quoted: msg });
      }

      await sock.sendMessage(chat, {
        video: { url: gifUrl },
        gifPlayback: true,
        caption:
`╭━━━〔 🎞️ 𝙏𝙊𝙂𝙄𝙁 〕━━━⬣

✨ Sticker animado convertido a GIF

╰━━━━━━━━━━━━━━━`
      }, { quoted: msg });

      await msg.react('✔️');

    } catch (e) {
      console.error(e);

      await msg.react('❌');

      return sock.sendMessage(chat, {
        text:
`╭━━━〔 🚫 𝙀𝙍𝙍𝙊𝙍 〕━━━⬣

⚠️ Error inesperado al procesar

╰━━━━━━━━━━━━━━━`
      }, { quoted: msg });
    }
  }
};
