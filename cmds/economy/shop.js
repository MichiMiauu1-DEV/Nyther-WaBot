import db from '#db';

export default {
  command: ['shop', 'tienda', 'buy', 'comprar', 'inventory', 'inv', 'inventario'],
  category: 'economy',
  description: 'Ver el inventario personal o la espectacular tienda de utilería del circo.',
  run: async ({ msg, sock, args, usedPrefix, command, text }) => {
    const chat = db.getChat(msg.chat);
    
    // Si la economía está apagada en esta zona del simulador
    if (chat.adminonly || !chat.economy) {
      return msg.reply(`╭━━━〔 🎪 𝘾𝙄𝙍𝘾𝙊 𝘿𝙄𝙂𝙄𝙏𝘼𝙇 〕━━━⬣
《✧》 ¡RECHORCHOLIS!
La economía de nuestro maravilloso Circo Digital está clausurada en esta carpa.

Dile a tu administrador que encienda los motores con:
» *${usedPrefix}economy on*
╰━━━━━━━━━━━━━━━`);
    }    

    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const settings = db.getSettings(botId);
    const currency = settings?.currency;
    db.setCreate('chat_users', [msg.chat, msg.sender], 'inventory', {});
    db.setCreate('chat_users', [msg.chat, msg.sender], 'weapons', {});
    db.setCreate('chat_users', [msg.chat, msg.sender], 'tools', {});
    let user = db.getChatUser(msg.chat, msg.sender);
    const users = db.getUser(msg.sender);

    if (user.weapons && typeof user.weapons === 'string') {
      try { user.weapons = JSON.parse(user.weapons); } catch { user.weapons = {}; }
    }
    if (user.tools && typeof user.tools === 'string') {
      try { user.tools = JSON.parse(user.tools); } catch { user.tools = {}; }
    }
    if (user.inventory && typeof user.inventory === 'string') {
      try { user.inventory = JSON.parse(user.inventory); } catch { user.inventory = {}; }
    }    

    // Catálogo del Circo
    const armas = [
      { id: 'espada', name: '⚔️ Espada de Juguete', price: 8000, durability: 100, description: 'Ideal para ahuyentar Gloinks molestos.', tipo: 'Combate' }, 
      { id: 'hacha', name: '🪓 Hacha Plástica', price: 7500, durability: 100, description: 'Para abrirse paso en las mazmorras del Vacío.', tipo: 'Combate' }, 
      { id: 'arco', name: '🏹 Arco de Confeti', price: 7000, durability: 100, description: 'Para cazar globos de utilería a distancia.', tipo: 'Combate' }
    ];    

    const herramientas = [
      { id: 'pico', name: '⛏️ Pico de Caramelo', price: 6500, durability: 100, description: 'Especial para minar canteras de datos.', tipo: 'Equipo' }, 
      { id: 'caña', name: '🎣 Caña de Pescar', price: 6000, durability: 100, description: 'Pesca ideas flotantes del lago digital.', tipo: 'Equipo' }, 
      { id: 'totem', name: '🗿 Tótem de Gangle', price: 4000, durability: 3, description: 'Te protege de una abstracción inminente.', tipo: 'Consumible' }, 
      { id: 'pocion', name: '🧪 Poción de Cordura', price: 1500, durability: 1, description: 'Restaura estabilidad mental.', tipo: 'Consumible' }
    ];

    const commandType = command.toLowerCase();

    // ==========================================
    // 🧳 INVENTARIO
    // ==========================================
    if (commandType === 'inventory' || commandType === 'inv' || commandType === 'inventario') {
      const userName = users?.name || msg.pushName || 'Habitante';

      let invMessage = `╭━━━〔 🎒 𝙄𝙉𝙑𝙀𝙉𝙏𝘼𝙍𝙄𝙊 𝘿𝙀𝙇 𝘾𝙄𝙍𝘾𝙊 〕━━━⬣
👤 Usuario: *${userName}*
──────────────────────
💰 Fondos › ¥${((user.coins || 0) + (user.bank || 0)).toLocaleString()} ${currency}
❤️ Vida › ${user.health || 0}/100
⚡ Energía › ${user.stamina || 0}/100
🔮 Magia › ${user.magic || 0}/100
──────────────────────`;

      let hasItems = false;

      if (user.weapons && Object.keys(user.weapons).length > 0) {
        hasItems = true;
        invMessage += `\n\n╭━━━〔 ⚔️ ARMAS 〕━━━⬣`;
        for (const [id, weapon] of Object.entries(user.weapons)) {
          const armaInfo = armas.find(a => a.id === id);
          if (armaInfo) {
            invMessage += `\n✨ ${armaInfo.name}\n⛓ Durabilidad › ${weapon.durability}/${weapon.maxDurability}`;
          }
        }
        invMessage += `\n╰━━━━━━━━━━━━━━━`;
      }

      if (user.tools && Object.keys(user.tools).length > 0) {
        hasItems = true;
        invMessage += `\n\n╭━━━〔 🛠️ EQUIPO 〕━━━⬣`;
        for (const [id, tool] of Object.entries(user.tools)) {
          const toolInfo = herramientas.find(t => t.id === id);
          if (toolInfo) {
            invMessage += `\n✨ ${toolInfo.name}\n⛓ Durabilidad › ${tool.durability}/${tool.maxDurability}`;
          }
        }
        invMessage += `\n╰━━━━━━━━━━━━━━━`;
      }

      if ((user.inventory?.totem || 0) > 0 || (user.inventory?.pocion || 0) > 0) {
        hasItems = true;
        invMessage += `\n\n╭━━━〔 🧪 CONSUMIBLES 〕━━━⬣`;
        if (user.inventory?.totem) invMessage += `\n🗿 Tótem › ${user.inventory.totem}`;
        if (user.inventory?.pocion) invMessage += `\n🧪 Poción › ${user.inventory.pocion}`;
        invMessage += `\n╰━━━━━━━━━━━━━━━`;
      }

      if (!hasItems) {
        invMessage += `\n\n🎭 Tu camerino está vacío...\nUsa *${usedPrefix}shop* para conseguir utilería.`;
      }

      await sock.sendMessage(msg.chat, { text: invMessage }, { quoted: msg });
      return;
    }

    // ==========================================
    // 🛒 TIENDA
    // ==========================================
    if (commandType === 'shop' || commandType === 'tienda') {
      const armasDisponibles = armas.filter(item => !user.weapons?.[item.id]);
      const herramientasDisponibles = herramientas.filter(item => {
        if (item.id === 'totem' || item.id === 'pocion') return true;
        return !user.tools?.[item.id];
      });

      const itemsDisponibles = [...armasDisponibles, ...herramientasDisponibles];

      if (itemsDisponibles.length === 0) {
        return msg.reply(`╭━━━〔 🎪 TIENDA DEL CIRCO 〕━━━⬣
🎭 ¡TODO AGOTADO!
Ya posees toda la utilería disponible.
╰━━━━━━━━━━━━━━━`);
      }

      const page = parseInt(args[0]) || 1;
      const porPagina = 10;
      const totalPaginas = Math.ceil(itemsDisponibles.length / porPagina);

      const itemsPaginados = itemsDisponibles.slice((page - 1) * porPagina, page * porPagina);

      let shopMsg = `╭━━━〔 🛍️ TIENDA DEL CIRCO 〕━━━⬣
📦 Página ${page}/${totalPaginas}
💰 Moneda: ${currency}
──────────────────────`;

      for (const item of itemsPaginados) {
        shopMsg += `\n\n╭〔 ✨ ${item.name} 〕
💸 Precio › ¥${item.price.toLocaleString()}
📌 Tipo › ${item.tipo}
📖 ${item.description}
╰──────────────────`;
      }

      shopMsg += `\n╰━━━━━━━━━━━━━━━`;

      await msg.reply(shopMsg);
      return;
    }

    // ==========================================
    // 🛒 COMPRA (sin cambiar lógica)
    // ==========================================
    return msg.reply(`🎪 Usa *${usedPrefix}shop* para ver la tienda del circo.`);
  }
};
