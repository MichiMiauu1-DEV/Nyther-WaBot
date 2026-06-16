import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { exec } from 'child_process'

export default {
  command: ['togif'],
  category: 'tools',

  run: async ({ msg, sock, isOwner }) => {

    const chat = msg.chat;
    const quoted = msg.quoted;

    // Validación de la esencia según el rol del usuario
    const userTitle = isOwner ? 'mi estimado dueño' : 'Estimado humano.';

    if (!quoted) {
      return sock.sendMessage(chat, {
        text: `《✧》 ¡RECHORCHOLIS! ¡Para realizar esta magnífica transmutación visual primero debes responder a un sticker animado! ¡Mi sombrero de copa necesita materia prima para hacer la magia, ${userTitle}!`
      }, { quoted: msg });
    }

    const id = crypto.randomBytes(4).toString('hex');
    const webpPath = path.join('./tmp', `${id}.webp`);
    const gifPath = path.join('./tmp', `${id}.gif`);

    try {

      await msg.react('🕒');

      const buffer = await quoted.download();

      if (!buffer) {
        await msg.react('❌');
        return sock.sendMessage(chat, {
          text: '《✧》 ¡ALERTA EXCEPCIONAL! ¡Los hilos digitales se han enredado y no he podido descargar el sticker de los servidores! Inténtalo de nuevo antes de que perdamos la cordura.'
        }, { quoted: msg });
      }

      if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp');

      fs.writeFileSync(webpPath, buffer);

      const ffmpegPath = process.env.FFMPEG_PATH || 'ffmpeg';

      // CONVERTIR CON FFMPEG
      await new Promise((resolve, reject) => {
        exec(`"${ffmpegPath}" -i ${webpPath} -vf "fps=15,scale=512:-1:flags=lanczos" ${gifPath}`, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      if (!fs.existsSync(gifPath)) {
        await msg.react('❌');
        return sock.sendMessage(chat, {
          text: '《✧》 ...¿Donde esta kinger?'
        }, { quoted: msg });
      }

      const gifBuffer = fs.readFileSync(gifPath);

      await sock.sendMessage(chat, {
        video: gifBuffer,
        gifPlayback: true,
        caption: '《✧》 ¡ESPECTACULAR! ¡Hemos extraído el sticker animado de su prisión estática y aquí tienes tu deslumbrante bucle infinito de diversión digital!'
      }, { quoted: msg });

      await msg.react('✔️');

    } catch (e) {
      console.error('Anomalía en el comando togif registrada en la consola principal:', e);
      await msg.react('✖️');

      return sock.sendMessage(chat, {
        text: '《✧》 ...¿Donde esta kinger?'
      }, { quoted: msg });
      
    } finally {
      if (fs.existsSync(webpPath)) fs.unlinkSync(webpPath);
      if (fs.existsSync(gifPath)) fs.unlinkSync(gifPath);
    }
  }
};
