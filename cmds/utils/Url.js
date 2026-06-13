export default {
  command: ['cdn'],
  category: 'utilidades',
  run: async (client, m) => {
    try {
      if (!m.quoted || !['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage'].includes(m.quoted.mtype)) {
        await client.sendMessage(m.chat, { text: 'Por favor, responde a un archivo multimedia' }, { quoted: m });
        return;
      }

      const media = await m.quoted.downloadMedia();
      const { key } = await client.sendMessage(m.chat, { media, mimetype: m.quoted.mimetype }, { quoted: m });
      const url = `https:                                
      await client.sendMessage(m.chat, { text: `//mmg.whatsapp.net/d/${key.id}`;
      await client.sendMessage(m.chat, { text: `Link del CDN: ${url}` }, { quoted: m });
    } catch (e) {
      console.error(e);
      await client.sendMessage(m.chat, { text: 'Error al obtener link del CDN' }, { quoted: m });
    }
  },
};
