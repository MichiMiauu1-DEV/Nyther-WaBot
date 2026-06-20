import fs from 'fs';
import path from 'path';

export default {
  // --- EL CATÁLOGO ---
  command: ['viewcmd', 'vercmd'],
  category: 'developer',
  description: 'Busca el código de cualquier archivo del bot.',
  usage: '*viewcmd <nombre.js>',
  isOwner: true,
  // -------------------

  run: async ({ msg, args }) => {
    const nombreArchivo = args[0];
    if (!nombreArchivo) return msg.reply("⚠️ Debes indicar el nombre del archivo.");

    const buscarArchivo = (dir, target) => {
      let resultado = null;
      const items = fs.readdirSync(dir);
      for (const item of items) {
        if (['node_modules', '.git', '.cache', 'dist'].includes(item)) continue;
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
          resultado = buscarArchivo(fullPath, target);
          if (resultado) return resultado;
        } else if (item === target) {
          return fullPath;
        }
      }
      return resultado;
    };

    try {
      const rutaEncontrada = buscarArchivo(process.cwd(), nombreArchivo);

      if (rutaEncontrada) {
        const codigo = fs.readFileSync(rutaEncontrada, 'utf-8');
        
        // --- AQUÍ ESTÁ EL ESTILO DE "CATÁLOGO" ---
        const texto = `╭━━━〔 📁 𝙑𝙄𝙀𝙒 𝘾𝙊𝙈𝙈𝘼𝙉𝘿 〕━━━⬣
┃
┃ 📄 *Archivo:* ${nombreArchivo}
┃ 📍 *Ruta:* ${rutaEncontrada.replace(process.cwd(), '')}
┃
╰━━━━━━━━━━━━━━━

\`\`\`javascript
${codigo}
\`\`\``;
        
        await msg.reply(texto);
      } else {
        msg.reply(`❌ *No encontré el archivo:* "${nombreArchivo}"`);
      }
    } catch (err) {
      msg.reply(`❌ *Error crítico:* ${err.message}`);
    }
  }
};
