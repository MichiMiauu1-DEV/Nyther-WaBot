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
      return sock.reply(msg.chat, '《✧》 Debes escribir un comando a ejecutar.', msg);
    }
    
    // Limpia comillas tipográficas que pone WhatsApp: ‘ ’ “ ”
    let code = text.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
    let _return, _syntax = '';    

    try {
      await msg.react('🕒');
      let i = 15;
      let f = { exports: {} };
      
      // LÓGICA DE EVAL REAL: Si el código no incluye un 'return' explícito, no es un bloque de llaves,
      // y es una expresión simple, le agregamos el 'return' automáticamente para capturar su valor.
      let readyCode = code.trim();
      if (!readyCode.includes('return') && !readyCode.includes(';') && !readyCode.startsWith('{')) {
        readyCode = `return (${readyCode})`;
      } else {
        readyCode = code;
      }

      let exec = new (async () => {}).constructor(
        'print', 'msg', 'sock', 'require', 'Array', 'process', 'args', 'module', 'exports', 'argument',
        `try {
          ${readyCode}
        } catch (e) {
          throw e;
        }`
      );
      
      _return = await exec.call(
        sock, 
        (...args) => {
          if (--i < 1) return;
          return sock.reply(msg.chat, format(...args), msg);
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
      // Te envía el resultado formateado sí o sí
      await sock.reply(msg.chat, _syntax + format(_return), msg);
    }
  }
};
