import syntaxerror from 'syntax-error';
import { format } from 'util';
import { createRequire } from 'module';

export default {
  command: ['ex', 'e'],
  category: 'owner',
  description: 'Ejecutar código JavaScript en el bot.',
  isOwner: true,
  run: async ({ msg, sock, args, command, text, __dirname }) => {
    const require = createRequire(__dirname);
    if (!text.trim()) {
      return sock.reply ? await sock.reply(msg.chat, '《✧》 Debes escribir un comando a ejecutar.', msg) : console.log('sock.reply no definido');
    }
    
    // Limpia comillas tipográficas que pone WhatsApp: ‘ ’ “ ”
    let code = text.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
    
    let _return, _syntax = '';    

    try {
      await msg.react('🕒');
      let i = 15;
      let f = { exports: {} };
      
      // Ya no necesitamos envolver en una IIFE porque el constructor ya genera la función asíncrona.
      // Simplemente retornamos el resultado del código inyectado.
      let exec = new (async () => {}).constructor(
        'print', 'msg', 'sock', 'require', 'Array', 'process', 'args', 'module', 'exports', 'argument',
        `return (async () => { ${code} })()`
      );
      
      _return = await exec.call(
        sock, 
        (...args) => {
          if (--i < 1) return;
          return sock.reply ? sock.reply(msg.chat, format(...args), msg) : null;
        }, 
        msg, sock, require, Array, process, args, f, f.exports, 
      );
      
      await msg.react('✔️');
    } catch (e) {
      let err = syntaxerror(code, 'Execution Function', { 
        allowReturnOutsideFunction: true, 
        allowAwaitOutsideFunction: true, 
        sourceType: 'module' 
      });
      if (err) _syntax = '```' + err + '```\n\n';
      _return = e;
      await msg.react('✖️');
    } finally {
      // Aseguramos que responda si el formato del log devuelve algo válido o el error
      const output = _syntax + format(_return);
      if (output && output.trim() !== 'undefined') {
        if (sock.reply) await sock.reply(msg.chat, output, msg);
      }
    }
  }
};
