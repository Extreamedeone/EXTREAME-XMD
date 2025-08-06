const { addWelcome, delWelcome, isWelcomeOn, addGoodbye, delGoodBye, isGoodByeOn } = require('./ut.js');
const { delay } = require('@whiskeysockets/baileys');
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
async function handleWelcome(sock, chatId, message, match) {
    if (!match) {
        return sock.sendMessage(chatId, {
            text: `📥 *Welcome Message Setup*\n\nUse the following commands:\n\n✅ *.welcome on* — Enable welcome messages\n🛠️ *.welcome set Your custom message* — Set a custom welcome message\n🚫 *.welcome off* — Disable welcome messages`,
	    ...channelInfo,
            quoted: message
        });
    }

    const [command, ...args] = match.split(' ');
    const lowerCommand = command.toLowerCase();
    const customMessage = args.join(' ');

    if (lowerCommand === 'on') {
        if (await isWelcomeOn(chatId)) {
            return sock.sendMessage(chatId, { text: '⚠️ Welcome messages are *already enabled*.', ...channelInfo, quoted: message });
        }
        await addWelcome(chatId, true, null);
        return sock.sendMessage(chatId, { text: '✅ Welcome messages *enabled*. Use *.welcome set [your message]* to customize.', ...channelInfo, quoted: message });
    }

    if (lowerCommand === 'off') {
        if (!(await isWelcomeOn(chatId))) {
            return sock.sendMessage(chatId, { text: '⚠️ Welcome messages are *already disabled*.', ...channelInfo, quoted: message });
        }
        await delWelcome(chatId);
        return sock.sendMessage(chatId, { text: '✅ Welcome messages *disabled* for this group.', ...channelInfo, quoted: message });
    }

    if (lowerCommand === 'set') {
        if (!customMessage) {
            return sock.sendMessage(chatId, { text: '⚠️ Please provide a custom welcome message. Example: *.welcome set Welcome to the group!*', ...channelInfo, quoted: message });
        }
        await addWelcome(chatId, true, customMessage);
        return sock.sendMessage(chatId, { text: '✅ Custom welcome message *set successfully*.', ...channelInfo, quoted: message });
    }

    // If no valid command is provided
    return sock.sendMessage(chatId, {
        text: `❌ Invalid command. Use:\n*.welcome on* - Enable\n*.welcome set [message]* - Set custom message\n*.welcome off* - Disable`,
	...channelInfo,
        quoted: message
    });
}

async function welcomeCommand(ben, chatId, m, match) {
const sock = ben;
const message= m;

    // Check if it's a group
    if (!chatId.endsWith('@g.us')) {
        await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo });
        return;
    }

    // Extract match from message
    const text = message.message?.conversation || 
                message.message?.extendedTextMessage?.text || '';
    const matchText = text.split(' ').slice(1).join(' ');

    await handleWelcome(sock, chatId, message, matchText);
}

module.exports = { welcomeCommand} ;
