
const axios = require('axios');

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

async function spotifyCommand(ben, chatId, message) {
  const sock = ben;
  const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
  const searchQuery = text?.split(' ').slice(1).join(' ').trim();

  if (!searchQuery) {
    return await sock.sendMessage(chatId, {
      text: "Type something like: *.spotify Doja*",
...channelInfo
});
}

  try {
    await sock.sendMessage(chatId, {
      text: "_Searching Spotify. Please wait..._",
...channelInfo
});

    const res = await axios.get(`https://api.siputzx.my.id/api/s/sp?query=${encodeURIComponent(searchQuery)}`);
    const tracks = res.data?.data;

    if (!tracks || tracks.length === 0) {
      return await sock.sendMessage(chatId, {
        text: "No Spotify tracks found.",
...channelInfo
});
}

    const track = tracks[0];
    const caption = `🎵 *${track.title}*\n👤 Artist: ${track.artist}\n📀 Album: ${track.album}\n⏱️ Duration: ${track.duration}\n🗓️ Released: ${track.release_date}\n🔗 [Open in Spotify](${track.track_url})`;

    await sock.sendMessage(chatId, {
      image: { url: track.thumbnail},
      caption,
...channelInfo
}, { quoted: message});

} catch (error) {
    console.error("Spotify search error:", error);
    await sock.sendMessage(chatId, {
      text: "⚠️ Failed to load Spotify track. Try again later.",
...channelInfo
});
}
}

module.exports = { spotifyCommand};
