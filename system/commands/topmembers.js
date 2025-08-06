const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'data', 'messageCount.json');
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
function loadMessageCounts() {
    if (fs.existsSync(dataFilePath)) {
        const data = fs.readFileSync(dataFilePath);
        return JSON.parse(data);
    }
    return {};
}

function saveMessageCounts(messageCounts) {
    fs.writeFileSync(dataFilePath, JSON.stringify(messageCounts, null, 2));
}

function incrementMessageCount(groupId, userId) {
    const messageCounts = loadMessageCounts();

    if (!messageCounts[groupId]) {
        messageCounts[groupId] = {};
    }

    if (!messageCounts[groupId][userId]) {
        messageCounts[groupId][userId] = 0;
    }

    messageCounts[groupId][userId] += 1;

    saveMessageCounts(messageCounts);
}

function topMembers(ben, chatId, isGroup) {
const sock = ben;

    if (!isGroup) {
        sock.sendMessage(chatId, { text: 'This command is only available in group chats.', ...channelInfo });
        return;
    }

    const messageCounts = loadMessageCounts();
    const groupCounts = messageCounts[chatId] || {};

    const sortedMembers = Object.entries(groupCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5); // Get top 5 members

    if (sortedMembers.length === 0) {
        sock.sendMessage(chatId, { text: 'No message activity recorded yet.', ...channelInfo });
        return;
    }

    let message = '🏆 Top Members Based on Message Count:\n\n';
    sortedMembers.forEach(([userId, count], index) => {
        message += `${index + 1}. @${userId.split('@')[0]} - ${count} messages\n`;
    });

    sock.sendMessage(chatId, { text: message, ...channelInfo, mentions: sortedMembers.map(([userId]) => userId) });
}

module.exports = { incrementMessageCount, topMembers };
