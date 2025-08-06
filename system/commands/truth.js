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

const truths = [
    "What's your biggest fear?",
    "What was your most embarrassing moment?",
    "If you could be invisible for a day, what would you do?",
    "Who was your first crush?",
    "What’s one thing you’ve never told anyone?"
];

async function truthCommand(ben, chatId) {
    const randomTruth = truths[Math.floor(Math.random() * truths.length)];
    await ben.sendMessage(chatId, { text: `😃 Truth: ${randomTruth}`, ...channelInfo });
}

module.exports = { truthCommand };
