import fs from 'fs';
import path from 'path';

export default {
  command: ['addcmd'],
  category: 'developer',
  isOwner: true,
  description: 'Crea un nuevo comando dinámicamente usando: ruta-código',
  run: async ({ msg, args }) => {
    // Unimos todo el texto después del comando en una sola cadena
    const input = args.join(' '); 
    
    // Separamos por el primer guion que encontremos
    const splitIndex = input.indexOf('-');
    
    if (splitIndex === -1) {
      return msg.reply("⚠️ Formato incorrecto. Usa: *addcmd nombre.js-código");
    }

    const rutaArchivo = input.substring(0, splitIndex).trim(); // Lo que está antes del guion
    const contenido = input.substring(splitIndex + 1).trim();  // Lo que está después del guion

    if (!rutaArchivo || !contenido) {
      return msg.reply("⚠️ Debes proporcionar tanto la ruta como el código.");
    }

    try {
      const dir = path.dirname(rutaArchivo);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(rutaArchivo, contenido);
      
      msg.reply(`✅ Comando forjado con éxito en: *${rutaArchivo}*\n\n¡Reinicia el bot para que tome efecto!`);
    } catch (err) {
      msg.reply(`❌ Error al escribir el archivo: ${err.message}`);
    }
  }
};
