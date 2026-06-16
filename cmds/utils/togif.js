import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { exec } from 'child_process'

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

      const id = crypto.randomBytes(4).toString('hex');

      const webpPath = path.join('./tmp', `${id}.webp`);
      const gifPath = path.join('./tmp', `${id}.gif`);

      if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp');

      fs.writeFileSync(webpPath, buffer);

      // 🎞️ CONVERTIR CON FFMPEG
      await new Promise((resolve, reject) => {
        exec(`ffmpeg -i ${webpPath} -vf "fps=15,scale=512:-1:flags=lanczos" ${gifPath}`, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      if (!fs.existsSync(gifPath)) {
        await msg.react('❌');
        return sock.sendMessage(chat, {
          text:
`╭━━━〔 ❌ 𝙀𝙍𝙍𝙊𝙍 〕━━━⬣

🚫 No se pudo convertir el sticker

╰━━━━━━━━━━━━━━━`
        }, { quoted: msg });
      }

      const gifBuffer = fs.readFileSync(gifPath);

      await sock.sendMessage(chat, {
        video: gifBuffer,
        gifPlayback: true,
        caption:
`╭━━━〔 🎞️ 𝙏𝙊𝙂𝙄𝙁 〕━━━⬣

✨ Sticker animado convertido a GIF

╰━━━━━━━━━━━━━━━`
      }, { quoted: msg });

      // 🧹 CLEAN UP
      fs.unlinkSync(webpPath);
      fs.unlinkSync(gifPath);

      await msg.react('✔️');

    } catch (e) {
      console.error(e);

      return sock.sendMessage(chat, {
        text:
`╭━━━〔 🚫 𝙀𝙍𝙍𝙊𝙍 〕━━━⬣

⚠️ Falló la conversión del sticker

╰━━━━━━━━━━━━━━━`
      }, { quoted: msg });
    }
  }
};
