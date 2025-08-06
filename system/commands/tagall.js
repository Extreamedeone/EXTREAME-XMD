async function isAdmin(sock, chatId, senderId) {
    const groupMetadata = await sock.groupMetadata(chatId);

    // Normalize the bot's JID (remove any device-specific info like ":39")
    const botJidNormalized = sock.user.id.split(':')[0] + '@s.whatsapp.net';

    // Find the sender and bot in the group participant list
    const participant = groupMetadata.participants.find(p => p.id === senderId);
    const bot = groupMetadata.participants.find(p => p.id === botJidNormalized);

    //console.log("Bot's Normalized ID:", botJidNormalized);
    //console.log("Bot participant data:", bot);

    const isBotAdmin = bot && (bot.admin === 'admin' || bot.admin === 'superadmin');
    const isSenderAdmin = participant && (participant.admin === 'admin' || participant.admin === 'superadmin');

    //console.log("Is Bot Admin?", isBotAdmin);
    //console.log("Is Sender Admin?", isSenderAdmin);

    return { isSenderAdmin, isBotAdmin };
}
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
async function tagAllCommand(ben, chatId, senderId) {
const sock = ben;

    try {
/*        const { isSenderAdmin, isBotAdmin } = await isAdmin(sock, chatId, senderId);
        
        if (!isSenderAdmin && !isBotAdmin) {
            await sock.sendMessage(chatId, {
                text: 'Only admins can use the .tagall command.',
		...channelInfo
            });
            return;
        }
*/
        // Get group metadata
        const groupMetadata = await sock.groupMetadata(chatId);
        const participants = groupMetadata.participants;

        if (!participants || participants.length === 0) {
            await sock.sendMessage(chatId, { text: 'No participants found in the group.', ...channelInfo });
            return;
        }

        // Create message with each member on a new line
        let message = '🔊 *Group Members:*\n\n';
        participants.forEach(participant => {
            message += `@${participant.id.split('@')[0]}\n`; // Add \n for new line
        });

        // Send message with mentions
        await sock.sendMessage(chatId, {
            text: message,
	    ...channelInfo,
            mentions: participants.map(p => p.id)
        });

    } catch (error) {
        console.error('Error in tagall command:', error);
        await sock.sendMessage(chatId, { text: 'Failed to tag all members.', ...channelInfo });
    }
}

module.exports = { tagAllCommand };  // Export directly
