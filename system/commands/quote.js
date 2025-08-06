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
async function quoteCommand(ben, chatId) {
const sock = ben;

    try {
        const response = await axios.get('https://zenquotes.io/api/random', {
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });
        const quote = response.data[0];
        await sock.sendMessage(chatId, { 
            text: `"${quote.q}"\n- ${quote.a}`,
            ...channelInfo
        });
    } catch (error) {
        console.error('Error fetching quote:', error);
        await sock.sendMessage(chatId, { 
            text: 'Sorry, I could not fetch a quote right now.',
	    ...channelInfo
        });
    }
};
module.exports = { quoteCommand}
