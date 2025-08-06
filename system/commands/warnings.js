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
};
const warningsFilePath = path.join(__dirname, '../data/warnings.json');

function loadWarnings() {
    if (!fs.existsSync(warningsFilePath)) {
        fs.writeFileSync(warningsFilePath, JSON.stringify({}), 'utf8');
    }
    const data = fs.readFileSync(warningsFilePath, 'utf8');
    return JSON.parse(data);
}

async function warningsCommand(ben, chatId, mentionedJidList) {
const sock = ben;
    const warnings = loadWarnings();

    if (mentionedJidList.length === 0) {
        await sock.sendMessage(chatId, { text: 'Please mention a user to check warnings.', ...channelInfo });
        return;
    }

    const userToCheck = mentionedJidList[0];
    const warningCount = warnings[userToCheck] || 0;

    await sock.sendMessage(chatId, { text: `User has ${warningCount} warning(s).`, ...channelInfo });
}

module.exports = {warningsCommand}
