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

async function joke(ben, chatId) {
const sock = ben;
    try {
        const response = await axios.get('https://icanhazdadjoke.com/', {
            headers: { Accept: 'application/json' }
        });
        const en = response.data.joke;
        await sock.sendMessage(chatId, { text: en, ...channelInfo });
    } catch (error) {
        console.error('Error fetching joke:', error);
        await sock.sendMessage(chatId, { text: 'Sorry, I could not fetch a joke right now.', ...channelInfo });
    }
};

module.exports= { joke };
