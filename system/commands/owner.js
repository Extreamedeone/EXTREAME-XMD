require('./../../settings/config');

async function ownerCommand(ben, chatId) {
    const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${global.name}
TEL;waid=${global.owner}:${global.owner}
END:VCARD
`;

    await ben.sendMessage(chatId, {
        contacts: { displayName: global.name, contacts: [{ vcard }] },
    });
}

module.exports ={ ownerCommand}
