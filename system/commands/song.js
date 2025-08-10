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

const fetch = require('node-fetch');
const axios = require('axios');

const body = typeof m.text === 'string'? m.text: '';
const bodyTrimmed = body.trim();
const args = bodyTrimmed.split(/\s+/).slice(1);
const query = args.join(' ');

  if (!query) return ben.sendMessage(chatId, { text: '*_Provide a search query for song unleashing_*', ...channelInfo}, {quoted: m})

  const apiUrl = `https://keith.vercel.app/download/spotify?q=${encodeURIComponent(query)}`;

  try {

const res = await fetch(apiUrl);
const data = (await res.json())?.res?.result;

    if (!data.downloadLink) {
      return await ben.sendMessage(chatId, { text: '❌ Song not found or no download link available.', ...channelInfo}, { quoted: m});
}

    await ben.sendMessage(chatId, {
      image: { url: data.thumbnail},
      caption: `🎵 *Title:* ${data.title}\n🎤 *Artist:* ${data.artist}\n⏱️ *Duration:* ${data.duration}`,
      ...channelInfo
}, { quoted: m});

    const audioRes = await axios.get(data.downloadLink, { responseType: 'arraybuffer'});

    await ben.sendMessage(chatId, {
      audio: { mimetype: 'audio/mp4', buffer: audioRes.data},
      ptt: false
}, { quoted: m});

} catch (err) {
    console.error(err);
    await ben.sendMessage(chatId, { text: '⚠️ Error fetching song.', ...channelInfo}, { quoted: m});
}
}

module.exports = {songCommand}; 
