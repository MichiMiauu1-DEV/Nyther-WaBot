import os from 'os';

export default {
  command: ['ping', 'p'],
  category: 'info',
  run: async ({ msg, sock }) => { // Ajustado para recibir el objeto desestructurado tal como en main.js
    const start = Date.now();
    
    // Obtener ID del bot de forma segura usando sock
    const botId = sock.user?.id?.split(':')[0] + "@s.whatsapp.net";
    const nameBot = global.db?.data?.settings?.[botId]?.namebot || 'Bot';
    
    // Enviamos el mensaje inicial
    const sent = await sock.sendMessage(msg.chat, { 
        text: '《✧》 Calculando...' 
    }, { quoted: msg });
    
    const latency = Date.now() - start;
    
    // Información del sistema
    const cpus = os.cpus();
    const cpuModel = cpus.length > 0 ? cpus[0].model.trim() : 'Desconocido';
    const cpuSpeed = cpus.length > 0 ? cpus[0].speed : '0';
    const cpuCores = cpus.length;

    const totalRamGB = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(1);
    const usedRamMB = (process.memoryUsage().rss / (1024 * 1024)).toFixed(2);

    const uptime = process.uptime();
    const days = Math.floor(uptime / (60 * 60 * 24));
    const hours = Math.floor((uptime % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((uptime % (60 * 60)) / 60);
    const seconds = Math.floor(uptime % 60);

    // Edición del mensaje
    await sock.sendMessage(msg.chat, { 
      text: `《✧》 ${nameBot}\n\n` +
            `» Speed : ${latency} ms\n` +
            `» Processor : ${cpuModel}\n` +
            `» CPU : ${cpuSpeed} MHz (${cpuCores} nucleos)\n` +
            `» RAM : ${usedRamMB} MB / ${totalRamGB} GB\n` +
            `» Active time : ${days}d ${hours}h ${minutes}m ${seconds}s`, 
      edit: sent.key 
    }, { quoted: msg });
  },
};
