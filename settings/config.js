const fs = require('fs')
const {channelInfo}=require('../system/inf.js')

global.prefix='.',
global.owner= ['254791231068'],
global.name= 'Extreame',
global.SESSION_ID= process.env.SESSION_ID || '',
//Don't change this part
global.sudo= ['254791231068'],
//🤖🤖
global.autobio = true
global.autostatusview = true
global.welcome = true
global.antispam = true
global.autoreact = true
global.autoread = false
global.autoview = true
global.autoTyping = true
global.autoRecording = false
global.react=[ '👿, 🤤, 💧, ✨, ❤️, 💙, 💖, 👁️, 💝, 💋, 💞, 💘, 👀,  👣, 😂' ]
//extreame
global.packname = 'fury',
global.author = 'extreame',

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

global.badwords = [];
global.badwords.push("fuck");
global.badwords.push("stupid");
global.badwords.push("idiot");

global.antiCall = {};
global.antiCall["254791231068@s.whatsapp.net"] = true;

global.protections = {};
global.protections["120363383707634434@g.us"] = { antibot: false, antisticker: false, antibadword: false};
global.protections["120363383707634434@g.us"]["antibot"] = true;
global.protections["120363383707634434@g.us"]["antibadword"] = true;
global.protections["120363383707634434@g.us"]["antisticker"] = true;
