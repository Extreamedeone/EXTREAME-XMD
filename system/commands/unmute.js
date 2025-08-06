
async function unmuteCommand(ben, chatId) {
    await ben.groupSettingUpdate(chatId, 'not_announcement'); // Unmute the group
    await ben.sendMessage(chatId, { text: 'The group has been unmuted.',
				    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363419072079836@newsletter',
            newsletterName: 'EXTREAME-XMD',
            serverMessageId: -1
        }
    }
 });
}

module.exports = {unmuteCommand};
