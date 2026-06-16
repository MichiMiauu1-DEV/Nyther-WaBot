export default {
  command: ['toimg', 'toimage'],
  category: 'tools',

  run: async ({ msg, sock }) => {

    const chat = msg.chat;

    const quoted = msg.quoted;

    if (!quoted) {
      return sock.sendMessage(chat, {
        text:
`╭━━━〔 ⚠️ 𝙏𝙊𝙄𝙈𝙂 〕━━━⬣

📌 Debes responder a un sticker

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

      await sock.sendMessage(chat, {
        image: buffer,
        caption:
`╭━━━〔 🖼️ 𝙏𝙊𝙄𝙈𝙂 〕━━━⬣

✨ Sticker convertido a imagen

╰━━━━━━━━━━━━━━━`
      }, { quoted: msg });

      await msg.react('✔️');

    } catch (e) {
      console.error(e);

      await msg.react('❌');

      return sock.sendMessage(chat, {
        text:
`╭━━━〔 🚫 𝙀𝙍𝙍𝙊𝙍 〕━━━⬣

⚠️ Ocurrió un problema al convertir

╰━━━━━━━━━━━━━━━`
      }, { quoted: msg });
    }
  }
};
