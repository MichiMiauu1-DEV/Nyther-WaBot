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
      return sock.reply(msg.chat, '《✧》 ¡RECHORCHOLIS! ¡Para encender los motores de la genialidad primero debes proporcionarme un comando a ejecutar! ¡No puedo sacar conejos de un sombrero completamente vacío, mi estimado dueño!', msg);
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
        'print', 'msg', 'sock', 'require', 'Array', 'process', 'args', 'module', 'exports',
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

      // Promesa que actúa como temporizador usando el WackyWatch (7 segundos de límite)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('¡ALERTA DE ABSTRACCIÓN! ¡Mi fiel WackyWatch me indica que tu código ha entrado en un bucle infinito de desesperación existencial y se le ha agotado el tiempo de pantalla! (Timeout de 7s)')), 7000)
      );

      // Promise.race hace que compitan para que el comando no se quede colgado
      _return = await Promise.race([executionPromise, timeoutPromise]);
      
      await msg.react('✔️');
    } catch (e) {
      let err = syntaxerror(code, 'Execution Function', { 
        allowReturnOutsideFunction: true, 
        allowAwaitOutsideFunction: true, 
        sourceType: 'module' 
      });
      if (err) _syntax = '《✧》 *¡VAYA, VAYA! ¡PARECE QUE HUBO UN PEQUEÑO DESLIZ EN LA SINTAXIS!* Aquí tienes el mapa del desastre:\n```' + err + '```\n\n';
      _return = e;
      await msg.react('✖️');
    } finally {
      // Garantiza que el bot siempre te devuelva una respuesta en el chat con el toque de Caine
      const finalOutput = _return instanceof Error 
        ? `《✧》 *¡SANTO DIOS!* Algo salió terriblemente mal en nuestro maravilloso simulador digital:\n> ${format(_return)}`
        : `《✧》 *¡ESPECTACULAR!* El gran vacío de la terminal nos ha devuelto esta magnífica reliquia de datos:\n\n${_syntax}${format(_return)}`;
        
      await sock.reply(msg.chat, finalOutput, msg);
    }
  }
};
