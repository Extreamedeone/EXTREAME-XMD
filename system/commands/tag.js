const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
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
};/*
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
*/
async function downloadMediaMessage(message, mediaType) {
    const stream = await downloadContentFromMessage(message, mediaType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    const filePath = path.join(__dirname, '../temp/', `${Date.now()}.${mediaType}`);
    fs.writeFileSync(filePath, buffer);
    return filePath;
}

async function tagCommand(ben, chatId, senderId, messageText, replyMessage) {
const sock = ben;
/*
    const { isSenderAdmin, isBotAdmin } = await isAdmin(sock, chatId, senderId);

    if (!isBotAdmin) {
        await sock.sendMessage(chatId, { text: 'Please make the bot an admin first.' });
        return;
    }

    if (!isSenderAdmin) {
        const stickerPath = './assets/sticktag.webp';  // Path to your sticker
        if (fs.existsSync(stickerPath)) {
            const stickerBuffer = fs.readFileSync(stickerPath);
            await sock.sendMessage(chatId, { sticker: stickerBuffer });
        }
        return;
    }
*/
    const groupMetadata = await sock.groupMetadata(chatId);
    const participants = groupMetadata.participants;
    const mentionedJidList = participants.map(p => p.id);

    if (replyMessage) {
        let messageContent = {};

        // Handle image messages
        if (replyMessage.imageMessage) {
            const filePath = await downloadMediaMessage(replyMessage.imageMessage, 'image');
            messageContent = {
                image: { url: filePath },
                caption: messageText || replyMessage.imageMessage.caption || '',
                mentions: mentionedJidList
            };
        }
        // Handle video messages
        else if (replyMessage.videoMessage) {
            const filePath = await downloadMediaMessage(replyMessage.videoMessage, 'video');
            messageContent = {
                video: { url: filePath },
                caption: messageText || replyMessage.videoMessage.caption || '',
                mentions: mentionedJidList
            };
        }
        // Handle text messages
        else if (replyMessage.conversation || replyMessage.extendedTextMessage) {
            messageContent = {
                text: replyMessage.conversation || replyMessage.extendedTextMessage.text,
                mentions: mentionedJidList
            };
        }
        // Handle document messages
        else if (replyMessage.documentMessage) {
            const filePath = await downloadMediaMessage(replyMessage.documentMessage, 'document');
            messageContent = {
                document: { url: filePath },
                fileName: replyMessage.documentMessage.fileName,
                caption: messageText || '',
		...channelInfo,
                mentions: mentionedJidList
            };
        }

        if (Object.keys(messageContent).length > 0) {
            await sock.sendMessage(chatId, messageContent);
        }
    } else {
        await sock.sendMessage(chatId, {
            text: messageText || "Tagged message",
	    ...channelInfo,
            mentions: mentionedJidList
        });
    }
}

module.exports = {tagCommand};
