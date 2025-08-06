

const settings = require("./../../settings/config.js");

async function aliveCommand(ben, chatId) {

  const sock = ben;

  try {

    await sock.sendMessage(chatId, {

      audio: { url: "https://files.catbox.moe/j7dxem.mp3"},

      mimetype: "audio/mpeg",

      ptt: false,

      contextInfo: {

        forwardingScore: 999,

        isForwarded: true,

        externalAdReply: {

          title: "🤖 EXTREAME-XMD is Active!",

          body: "Status: Online",

          mediaType: 2,

          mediaUrl: "https://files.catbox.moe/j7dxem.mp3",

          sourceUrl: "https://files.catbox.moe/j7dxem.mp3"

},

        quotedMessage: {

          conversation: "*🤖 EXTREAME-XMD is Active!*\n\n*Status:* Online"

},

        forwardedNewsletterMessageInfo: {

          newsletterJid: '120363419072079836@newsletter',

          newsletterName: 'EXTREAME-XMD',

          serverMessageId: -1

}

}

});

} catch (error) {

    console.error('Error in alive command:', error);

    await sock.sendMessage(chatId, { text: 'Bot is alive and running!'});

}

}

module.exports = { aliveCommand};
/*
```

const settings = require("./../../settings/config.js");

async function aliveCommand(ben, chatId) {

  const sock = ben;

  try {

    await sock.sendMessage(chatId, {

      audio: { url: "https://files.catbox.moe/j7dxem.mp3"},

      mimetype: "audio/mpeg",

      ptt: false,

      caption: "*🤖 EXTREAME-XMD is Active!*\n\n*Status:* Online",

      contextInfo: {

        forwardingScore: 999,

        isForwarded: true,

        externalAdReply: {

          title: "EXTREAME-XMD Bot Status",

          body: "Online and operational",

          mediaType: 2,

          mediaUrl: "https://files.catbox.moe/j7dxem.mp3",

          sourceUrl: "https://files.catbox.moe/j7dxem.mp3"

},

        forwardedNewsletterMessageInfo: {

          newsletterJid: '120363419072079836@newsletter',

          newsletterName: 'EXTREAME-XMD',

          serverMessageId: -1

}

}

});

} catch (error) {

    console.error('Error in alive command:', error);

    await sock.sendMessage(chatId, { text: 'Bot is alive and running!'});

}

}

module.exports = { aliveCommand};
*/
