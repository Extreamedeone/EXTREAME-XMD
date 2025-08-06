const fetch = require('node-fetch');
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
async function lyricsCommand(ben, chatId, q) {
const sock = ben;
const songTitle = q.split(' ')[1];

    if (!songTitle) {
        await sock.sendMessage(chatId, { 
            text: '🔍 Please enter the song name to get the lyrics! Usage: *lyrics <song name>*',
	    ...channelInfo
        });
        return;
    }

    try {
        // Fetch song lyrics using the some-random-api.com API
        const apiUrl = `https://some-random-api.com/lyrics?title=${encodeURIComponent(songTitle)}`;
        const res = await fetch(apiUrl);
        
        if (!res.ok) {
            throw await res.text();
        }
        
        const json = await res.json();
        
        if (!json.lyrics) {
            await sock.sendMessage(chatId, { 
                text: `❌ Sorry, I couldn't find any lyrics for "${songTitle}".`,
		...channelInfo
            });
            return;
        }
        
        // Sending the formatted result to the user
        await sock.sendMessage(chatId, {
            text: `🎵 *Song Lyrics* 🎶\n\n▢ *Title:* ${json.title || songTitle}\n▢ *Artist:* ${json.author || 'Unknown'}\n\n📜 *Lyrics:*\n${json.lyrics}\n\nHope you enjoy the music! 🎧 🎶`,
	    ...channelInfo
        });
    } catch (error) {
        console.error('Error in lyrics command:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ An error occurred while fetching the lyrics for "${songTitle}".`,
	    ...channelInfo
        });
    }
}

module.exports = { lyricsCommand };
