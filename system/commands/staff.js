async function staffCommand(ben, chatId, m) {
const sock = ben;
const msg = m;
    try {
        // Get group metadata

const normalizeJid = jid =>
  jid
.replace(/:[0-9]+/g, "")
.replace(/@s\.whatsapp\.net$/, "")
.replace(/@lid$/, "")
.replace(/@g\.us$/, "")
.trim();

const isGroup = chatId?.endsWith("@g.us");
const groupMetadata = isGroup
? await ben.groupMetadata(chatId).catch(() => ({}))
: {};

let pp;
try {
  pp = await sock.profilePictureUrl(chatId, 'image');
} catch {
  pp = 'https://i.imgur.com/2wzGhpF.jpeg';
}
const groupName = isGroup? groupMetadata.subject: "";
const participants = isGroup? groupMetadata.participants || []: [];

const groupAdmins = isGroup
? participants
.filter(v => v.admin || v.isAdmin)
.map(v => {
        const id = v.id || v.jid || v.participant || "";
        const jid = normalizeJid(id);
        return jid &&!jid.includes("@")? jid: "";
})
: [];

const listAdmin = await Promise.all(
  groupAdmins.map(async (v, i) => {
    const number = v.split('@')[0];
    const [contact] = await sock.onWhatsApp(number);
    const realNumber = contact?.jid? contact.jid.split('@')[0]: number;
    return `${i + 1}. +${realNumber}`;
})
).then(admins => admins.join('\n▢ '));

const owner =
  groupMetadata.owner ||
  groupAdmins.find(p => p.admin === 'superadmin')?.id ||
  chatId.split('-')[0] + '@s.whatsapp.net';

const text = `
≡ *GROUP ADMINS* _${groupName}_

┌─⊷ *ADMINS*
▢ ${listAdmin}
└───────────
`.trim();

/*        const participants = groupMetadata.participants;
        const groupAdmins = participants.filter(p => p.admin);
        const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n▢ ');
        
        // Get group owner
        const owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || chatId.split('-')[0] + '@s.whatsapp.net';

        // Create staff text
        const text = `
≡ *GROUP ADMINS* _${groupMetadata.subject}_

┌─⊷ *ADMINS*
▢ ${listAdmin}
└───────────
`.trim();
*/
        // Send the message with image and mentions
        await sock.sendMessage(chatId, {
            image: { url: pp },
            caption: text,
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363419072079836@newsletter',
            newsletterName: 'EXTREAME-XMD',
            serverMessageId: -1
        }
    },
            mentions: [...groupAdmins.map(v => v.id), owner]
        });

    } catch (error) {
        console.error('Error in staff command:', error);
        await sock.sendMessage(chatId, { text: 'Failed to get admin list!',
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

module.exports = { staffCommand}; 
