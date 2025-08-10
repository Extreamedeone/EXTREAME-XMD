/*
courtesy of EXTREAME-XMD
*/
// Channel info for message context
const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363419072079836@newsletter',
            newsletterName: 'EXTREAME-XMD',
            serverMessageId: -1
        }
    }
};

async function songCommand(ben, chatId, m) {
  const axios = require('axios');

  const body = typeof m.text === 'string'? m.text: '';
  const bodyTrimmed = body.trim();
  const args = bodyTrimmed.split(/\s+/).slice(1);
  const query = args.join(' ');

  if (!query) {
    return ben.sendMessage(chatId, {
      text: '*_Provide a search query for song unleashing_*',
...channelInfo
}, { quoted: m});
}

  const apiUrl = `https://apis-keith.vercel.app/download/spotify?q=${encodeURIComponent(query)}`;

  try {
    const res = await axios.get(apiUrl);
    const data = res?.data?.result?.track;

    if (!data ||!data.downloadLink ||!data.thumbnail) {
      return ben.sendMessage(chatId, {
        text: '❌ Song not found or missing media info.',
...channelInfo
}, { quoted: m});
}

    await ben.sendMessage(chatId, {
      image: { url: data.thumbnail},
      caption: `🎶 *EXTREAME-XMD Music Drop* 🎶

╭───★彡 🎧 彡★───╮
🎼 *Title:* ${data.title}
🎤 *Artist:* ${data.artist}
⏱️ *Duration:* ${data.duration}
╰───★彡 🎶 彡★───╯

🔥 Powered by EXTREAME-XMD`,
...channelInfo
}, { quoted: m});

    const audioRes = await axios.get(data.downloadLink, { responseType: 'arraybuffer'});

    await ben.sendMessage(chatId, {
      audio: { mimetype: 'audio/mp4', buffer: audioRes.data},
      ptt: false
}, { quoted: m});

} catch (err) {
    console.error(err);
    await ben.sendMessage(chatId, {
      text: '⚠️ Error fetching song.',
...channelInfo
}, { quoted: m});
}
}

module.exports = {songCommand}; 
