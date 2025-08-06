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
const dares = [
    "Sing a song for the group!",
    "Do 10 push-ups.",
    "Talk in a funny accent for the next 5 minutes.",
    "Send a selfie doing a funny face.",
    "Let someone text anything they want from your phone."
];

async function dareCommand(ben, chatId) {
    const randomDare = dares[Math.floor(Math.random() * dares.length)];
    await ben.sendMessage(chatId, { text: `🔥 Dare: ${randomDare}`, ...channelInfo });
}

module.exports = { dareCommand };
