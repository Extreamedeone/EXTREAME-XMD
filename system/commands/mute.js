const { channelInfo}=require('./../inf.js')

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
};}

async function muteCommand(ben, chatId, senderId, durationInMinutes) {
const sock = ben;

    console.log(`Attempting to mute the group for ${durationInMinutes} minutes.`); // Log for debugging

    const { isSenderAdmin, isBotAdmin } = await isAdmin(sock, chatId, senderId);
    if (!isBotAdmin) {
        await sock.sendMessage(chatId, { text: 'Please make the bot an admin first.', ...channelInfo });
        return;
    }

    if (!isSenderAdmin) {
        await sock.sendMessage(chatId, { text: 'Only group admins can use the mute command.', ...channelInfo });
        return;
    }

    const durationInMilliseconds = durationInMinutes * 60 * 1000;
    try {
        await sock.groupSettingUpdate(chatId, 'announcement'); // Mute the group
        await sock.sendMessage(chatId, { text: `The group has been muted for ${durationInMinutes} minutes.`, ...channelInfo });

        setTimeout(async () => {
            await sock.groupSettingUpdate(chatId, 'not_announcement'); // Unmute after the duration
            await sock.sendMessage(chatId, { text: 'The group has been unmuted.', ...channelInfo });
        }, durationInMilliseconds);
    } catch (error) {
        console.error('Error muting/unmuting the group:', error);
        await sock.sendMessage(chatId, { text: 'An error occurred while muting/unmuting the group. Please try again.', ...channelInfo });
    }
}

module.exports = {muteCommand}
