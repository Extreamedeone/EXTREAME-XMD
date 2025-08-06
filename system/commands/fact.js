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
async function fact(ben, chatId) {
const sock = ben;

    try {
        const response = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
        const Fact = response.data.text;
        await sock.sendMessage(chatId, { text: Fact, ...channelInfo });
    } catch (error) {
        console.error('Error fetching fact:', error);
        await sock.sendMessage(chatId, { text: 'Sorry, I could not fetch a fact right now.', ...channelInfo });
    }
};
module.export = {fact}
