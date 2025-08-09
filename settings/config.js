const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
});

const envPrefix = process.env.BOT_PREFIX;

global.prefix = envPrefix || '.';

global.owner= process.env.OWNER_NUMBER?.split(',') || ['254791231068']
global.name= process.env.NAME || 'Extreame';
global.SESSION_ID= process.env.SESSION_ID || '';
//Don't change this part
global.sudo= ['254791231068']
//🤖🤖
global.autobio = process.env.autobio === 'true';
global.autostatusview = process.env.autostatusview === 'true';
global.welcome = process.env.welcome === 'true';
global.antispam = true
global.autoreact = process.env.autoreact === 'true';
global.autoread = process.env.autoread === 'false';
global.autoview = process.env.autoview === 'true';
global.autoTyping = process.env.autoTyping === 'true';
global.autoRecording = process.env.autoRecording === 'false';
global.packname = process.env.STICKER_NAME || 'fury';
global.author = 'extreame';

global.react=[ '👿, 🤤, 💧, ✨, ❤️, 💙, 💖, 👁️, 💝, 💋, 💞, 💘, 👀,  👣, 😂' ]

global.linkch = 'https://whatsapp.com/channel/0029VanySqUBPzjYa2929d0U',

global.mess = {
    group: `𝙊𝙣𝙡𝙮 𝙂𝙧𝙤𝙪𝙥 👿`,
    admin: `𝙊𝙣𝙡𝙮 𝘼𝙙𝙢𝙞𝙣 👹`,
    owner: `𝙊𝙣𝙡𝙮 𝙊𝙬𝙣𝙚𝙧 𝘼𝙘𝙘𝙚𝙨𝙨 🤡`,
    botadmin: `𝙊𝙣𝙡𝙮 𝘽𝙤𝙩 𝘼𝙙𝙢𝙞𝙣`
}

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})
