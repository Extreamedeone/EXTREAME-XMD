const axios = require('axios');
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
async function memeCommand(ben, chatId) {
const sock = ben;

    try {
        // Fetch memes from the Imgflip API
        const response = await axios.get('https://api.imgflip.com/get_memes');
        
        if (response.data.success) {
            const memes = response.data.data.memes;

            // Pick a random meme from the list
            const randomMeme = memes[Math.floor(Math.random() * memes.length)];

            // Send the meme image to the chat
            await sock.sendMessage(chatId, { image: { url: randomMeme.url }, caption: randomMeme.name });
        } else {
            await sock.sendMessage(chatId, { text: 'Failed to fetch memes. Please try again later.', ...channelInfo });
        }
    } catch (error) {
        console.error('Error fetching meme:', error);
        await sock.sendMessage(chatId, { text: 'An error occurred while fetching a meme.', ...channelInfo });
    }
}

module.exports ={ memeCommand };
