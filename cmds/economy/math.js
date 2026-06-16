//me volvere loca Jsjs
import db from '#db';
global.math = global.math || {};

const limits = { facil: 10, medio: 50, dificil: 90, imposible: 100, imposible2: 160 };
const rewardRanges = { facil: [500, 1000], medio: [1000, 2000], dificil: [2000, 3500], imposible: [3500, 4800], imposible2: [5000, 6500] };

const generateRandomNumber = (max) => Math.floor(Math.random() * max) + 1;
const getOperation = () => ['+', '-', '*', '/'][Math.floor(Math.random() * 4)];

const generarProblema = (dificultad) => {
  const maxLimit = limits[dificultad] || 30;
  const num1 = generateRandomNumber(maxLimit);
  const num2 = generateRandomNumber(maxLimit);
  const operador = getOperation();
  
  // Ajuste para evitar divisiones con decimales infinitos
  let resultado;
  if (operador === '/') {
    resultado = Math.round((num1 / num2) * 100) / 100;
  } else {
    resultado = eval(`${num1} ${operador} ${num2}`);
  }
  
  const simbolo = operador === '*' ? '×' : operador === '/' ? '÷' : operador;
  return { problema: `${num1} ${simbolo} ${num2}`, resultado: resultado.toString() };
};

export default {
  command: ['math', 'mates'],
  category: 'economy',
  description: 'Desafía a tu mente en el examen matemático del Circo.',
  before: async ({ msg, sock }) => {
    const chatId = msg.chat;
    const juego = global.math[chatId];
    if (!juego?.juegoActivo) return;
    
    const respuestaUsuario = parseFloat(msg.text?.trim());
    if (isNaN(respuestaUsuario)) return;
    
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const chat = db.getChat(chatId);
    if (chat.primaryBot && chat.primaryBot !== botId) return;
    
    const user = db.getChatUser(chatId, msg.sender);
    const respuestaCorrecta = parseFloat(juego.respuesta);
    
    if (Math.abs(respuestaUsuario - respuestaCorrecta) < 0.01) {
      const [min, max] = rewardRanges[juego.dificultad] || [500, 1000];
      const coinsAleatorio = Math.floor(Math.random() * (max - min + 1)) + min;
      db.setChatUser(chatId, msg.sender, 'coins', (user.coins || 0) + coinsAleatorio);
      
      clearTimeout(juego.tiempoLimite);
      delete global.math[chatId];
      await sock.reply(chatId, `《✧》 ¡CORRECTO! ¡Tus circuitos funcionan a la perfección!\n> Ganaste: *¥${coinsAleatorio.toLocaleString()}*`, msg);
    } else {
      juego.intentos += 1;
      if (juego.intentos >= 3) {
        clearTimeout(juego.tiempoLimite);
        delete global.math[chatId];
        await sock.reply(chatId, '《✧》 ¡TE HAS QUEDADO SIN INTENTOS! El examen ha terminado. ¡Intenta de nuevo más tarde!', msg);
      } else {
        await sock.reply(chatId, `《✧》 ¡ERROR DE CÁLCULO! Respuesta incorrecta. Te quedan *${3 - juego.intentos}* intentos.`, msg);
      }
    }
    return true;
  },
  
  run: async ({ msg, sock, args, usedPrefix, command }) => {
    const chatId = msg.chat;
    const chat = db.getChat(chatId);
    
    if (chat.adminonly || !chat.economy) {
      return msg.reply(`《✧》 ¡RECHORCHOLIS! ¡La economía de nuestro maravilloso Circo Digital está clausurada en esta carpa!\n\nDile a tu administrador que encienda los motores de la diversión con el comando:\n» *${usedPrefix}economy on*`);
    }
    
    if (global.math[chatId]?.juegoActivo) {
      return sock.reply(chatId, '《✧》 ¡YA HAY UNA PRUEBA EN CURSO! Espera a que termine o a que el tiempo se agote.', msg);
    }
    
    const dificultad = args[0]?.toLowerCase();
    if (!limits[dificultad]) {
      return sock.reply(chatId, '《✧》 ¡ELÍGE TU NIVEL DE SUFRIMIENTO!\n> Dificultades: *facil, medio, dificil, imposible, imposible2*', msg);
    }
    
    const { problema, resultado } = generarProblema(dificultad);
    const problemMessage = await sock.reply(chatId, `*《✧》 EXAMEN MATEMÁTICO DEL CIRCO* \`🎪\`\n\n> Tienes 60 segundos para resolver:\n> *${problema}*\n\n✐ _¡Responde con el número correcto!_`, msg);
    
    global.math[chatId] = { 
      juegoActivo: true, 
      problema, 
      respuesta: resultado, 
      intentos: 0, 
      dificultad, 
      timeout: Date.now() + 60000, 
      problemMessageId: problemMessage.key?.id, 
      tiempoLimite: setTimeout(() => {
        if (global.math[chatId]?.juegoActivo) {
          delete global.math[chatId];
          sock.reply(chatId, `《✧》 ¡TIEMPO AGOTADO! El examen ha terminado. La respuesta era *${resultado}*.`, msg);
        }
      }, 60000)
    };
  }
};
