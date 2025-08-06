const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
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
async function attpCommand(ben, chatId, m) {
const sock = ben;
const message = m;
    const userMessage = message.message.conversation || message.message.extendedTextMessage?.text || '';
    const text = userMessage.split(' ').slice(1).join(' ');

    if (!text) {
        await sock.sendMessage(chatId, { text: 'Please provide text after the .attp command.', ...channelInfo });
        return;
    }

    const width = 512;
    const height = 512;
    const stickerPath = path.join(__dirname, './temp', `sticker-${Date.now()}.png`);

    try {
        const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
        const image = new Jimp(width, height, '#FFFFFF');

        const textWidth = Jimp.measureText(font, text);
        const textHeight = Jimp.measureTextHeight(font, text, width);

        const x = (width - textWidth) / 2;
        const y = (height - textHeight) / 2;

        image.print(font, x, y, text, width);
        await image.writeAsync(stickerPath);

        const stickerBuffer = await sharp(stickerPath)
            .resize(512, 512, { fit: 'cover' })
            .webp()
            .toBuffer();

        await sock.sendMessage(chatId, {
            sticker: stickerBuffer,
            mimetype: 'image/webp',
            packname: 'fury', 
            author: 'EXTREAME-XMD', 
        });

        fs.unlinkSync(stickerPath);
    } catch (error) {
        console.error('Error generating sticker:', error);
        await sock.sendMessage(chatId, { text: 'Failed to generate the sticker. Please try again later.', ...channelInfo });
    }
}

module.exports = { attpCommand };
