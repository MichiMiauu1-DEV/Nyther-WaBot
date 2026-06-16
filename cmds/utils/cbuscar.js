import fs from 'fs'
import path from 'path'

export default {
  command: ['cbuscar'],
  category: 'tools',

  run: async ({ msg, sock, args }) => {

    const chat = msg.chat;

    const query = args.join(' ').toLowerCase().trim();

    if (!query) {
      return sock.sendMessage(chat, {
        text:
`╭━━━〔 ⚠️ CBUSCAR 〕━━━⬣

📌 Uso:
*cbuscar bandera

🔍 Busca comandos dentro del bot

╰━━━━━━━━━━━━━━━`
      }, { quoted: msg });
    }

    const folder = './'; // raíz del bot
    const results = [];

    function scanDir(dir) {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const fullPath = path.join(dir, file);

        if (fs.statSync(fullPath).isDirectory()) {
          scanDir(fullPath);
        } else if (file.endsWith('.js')) {

          const content = fs.readFileSync(fullPath, 'utf8');

          if (
            content.toLowerCase().includes(`command`) &&
            content.toLowerCase().includes(query)
          ) {
            results.push(fullPath);
          }
        }
      }
    }

    try {

      scanDir(folder);

      if (results.length === 0) {
        return sock.sendMessage(chat, {
          text:
`╭━━━〔 🔎 CBUSCAR 〕━━━⬣

❌ No se encontraron comandos con:
👉 ${query}

╰━━━━━━━━━━━━━━━`
        }, { quoted: msg });
      }

      const text =
`╭━━━〔 🔍 RESULTADOS 〕━━━⬣

📌 Búsqueda: ${query}

📁 Archivos encontrados:

${results.map((f, i) => `➤ ${i + 1}. ${f}`).join('\n')}

╰━━━━━━━━━━━━━━━`;

      return sock.sendMessage(chat, { text }, { quoted: msg });

    } catch (e) {
      console.error(e);

      return sock.sendMessage(chat, {
        text:
`╭━━━〔 🚫 ERROR 〕━━━⬣

⚠️ Error al buscar archivos

╰━━━━━━━━━━━━━━━`
      }, { quoted: msg });
    }
  }
};
