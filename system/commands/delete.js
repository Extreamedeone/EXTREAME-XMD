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

async function deleteCommand(ben, chatId, m, senderId) {
const sock = ben;
const message = m;

    const { isSenderAdmin, isBotAdmin } = await isAdmin(sock, chatId, senderId);

    if (!isBotAdmin) {
        await sock.sendMessage(chatId, { text: 'I need to be an admin to delete messages.',
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
        return;
    }

    if (!isSenderAdmin) {
        await sock.sendMessage(chatId, { text: 'Only admins can use the .delete command.',
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
        return;
    }

    const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.stanzaId;
    const quotedParticipant = message.message?.extendedTextMessage?.contextInfo?.participant;

    if (quotedMessage) {
        await sock.sendMessage(chatId, { delete: { remoteJid: chatId, fromMe: false, id: quotedMessage, participant: quotedParticipant } });
    } else {
        await sock.sendMessage(chatId, { text: 'Please reply to a message you want to delete.',
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
}

module.exports = { deleteCommand } ;
