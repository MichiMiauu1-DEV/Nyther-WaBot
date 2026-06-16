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

📌 Debes responder a un sticker animado

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

      // 📡 ENVIAR A API
      const res = await axios.post(
        'https://api.vreden.web.id/api/webp-to-gif',
        {
          image: buffer.toString('base64')
        }
      );

      const gifUrl = res.data?.result;

      if (!gifUrl) {
        return sock.sendMessage(chat, {
          text:
`╭━━━〔 ❌ 𝙀𝙍𝙍𝙊𝙍 〕━━━⬣

🚫 No se pudo convertir a GIF

╰━━━━━━━━━━━━━━━`
        }, { quoted: msg });
      }

      // 📤 enviar GIF
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

⚠️ No se pudo procesar el sticker

╰━━━━━━━━━━━━━━━`
      }, { quoted: msg });
    }
  }
};
