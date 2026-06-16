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
      
      // Lógica de eval para expresiones simples
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
      
      // Promesa de la ejecución del código
      const executionPromise = exec.call(
        sock, 
        (...args) => {
          if (--i < 1) return;
          return sock.reply(msg.chat, format(...args), msg);
        }, 
        msg, sock, require, Array, process, args, f, f.exports, 
      );

      // Promesa que actúa como temporizador (7 segundos de límite)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Tiempo de espera agotado (Timeout de 7s). El código tardó demasiado en responder.')), 7000)
      );

      // Promise.race hace que compitan. Si el código tarda más de 7s, gana el timeout y desbloquea el comando
      _return = await Promise.race([executionPromise, timeoutPromise]);
      
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
      // Garantiza que el bot siempre te devuelva una respuesta en el chat, pase lo que pase
      await sock.reply(msg.chat, _syntax + format(_return), msg);
    }
  }
};import syntaxerror from 'syntax-error';
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
      
      // Lógica de eval para expresiones simples
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
      
      // Promesa de la ejecución del código
      const executionPromise = exec.call(
        sock, 
        (...args) => {
          if (--i < 1) return;
          return sock.reply(msg.chat, format(...args), msg);
        }, 
        msg, sock, require, Array, process, args, f, f.exports, 
      );

      // Promesa que actúa como temporizador (7 segundos de límite)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Tiempo de espera agotado (Timeout de 7s). El código tardó demasiado en responder.')), 7000)
      );

      // Promise.race hace que compitan. Si el código tarda más de 7s, gana el timeout y desbloquea el comando
      _return = await Promise.race([executionPromise, timeoutPromise]);
      
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
      // Garantiza que el bot siempre te devuelva una respuesta en el chat, pase lo que pase
      await sock.reply(msg.chat, _syntax + format(_return), msg);
    }
  }
};
