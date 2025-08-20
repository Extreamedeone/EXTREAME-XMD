const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
});

const envPrefix = process.env.BOT_PREFIX;

global.prefix = envPrefix || '.';
const number= process.env.OWNER_NUMBER;

global.owner= [`${number}`]
global.name= process.env.OWNER_NAME || 'Extreame';
global.SESSION_ID= process.env.SESSION_ID || '';
//Don't change this part
global.sudo= ['254791231068']
//🤖🤖
global.autobio = process.env.AUTOBIO === 'true';
global.autostatusview = process.env.AUTOSTATUSVIEW === 'true';
global.welcome = process.env.WELCOME === 'true';
global.antispam = true
global.autoreact = process.env.AUTOREACT === 'true';
global.autoread = process.env.AUTOREAD === 'false';
global.autoview = process.env.AUTOVIEW === 'true';
global.autoTyping = process.env.AUTOTYPING === 'true';
global.autoRecording = process.env.AUTORECORDING === 'false';
global.packname = process.env.STICKER_NAME || 'fury';
global.author = 'extreame';

global.react=[ '👿, 🤤, 💧, ✨, ❤️, 💙, 💖, 👁️, 💝, 💋, 💞, 💘, 👀,  👣, 😂' ]

global.linkch = 'https://whatsapp.com/channel/0029VanySqUBPzjYa2929d0U',

global.mess = {
    group: `*_This is a group command!!!_*`,
    admin: `*_Bot must be admin,make me admin first😌_*`,
    owner: `*_You aren't authorized to use owner only command_*`,
    botadmin: `*_Bot requires admin privileges!!!_*`
}

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})
