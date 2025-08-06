const axios = require('axios');
const { sleep } = require('./../myfunc');
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
async function pairCommand(ben, chatId, m, q) {
const sock = ben;
const message = m;
    try {
        if (!q) {
            return await sock.sendMessage(chatId, {
                text: "Please provide valid WhatsApp number\nExample: .pair 254XXXX",
		...channelInfo
            });
        }

        const numbers = q.split(',')
            .map((v) => v.replace(/[^0-9]/g, ''))
            .filter((v) => v.length > 5 && v.length < 20);

        if (numbers.length === 0) {
            return await sock.sendMessage(chatId, {
                text: "Invalid number❌️ Please use the correct format!",
		...channelInfo
            });
        }

        for (const number of numbers) {
            const whatsappID = number + '@s.whatsapp.net';
            const result = await sock.onWhatsApp(whatsappID);

            if (!result[0]?.exists) {
                return await sock.sendMessage(chatId, {
                    text: `That number is not registered on WhatsApp❗️`,
		    ...channelInfo
                });
            }

            await sock.sendMessage(chatId, {
                text: "Wait a moment for the code",
		...channelInfo
            });

            try {
                const response = await axios.get(`https://extreame-xmd.onrender.com/code?number=${number}`);
                
                if (response.data && response.data.code) {
                    const code = response.data.code;
                    if (code === "Service Unavailable") {
                        throw new Error('Service Unavailable');
                    }
                    
                    await sleep(5000);
                    await sock.sendMessage(chatId, {
                        text: `*How to link device*
1. Open WhatsApp on your phone.

2. Go to *Linked devices*.

3. Tap *Link a device*.

4. Tap *Link with phone number instead*

5. Paste the code below 👇 👇 
> Courtesy EXTREAME-XMD `,
           ...channelInfo
                        }, {quoted: m});
                                           
                    await sock.sendMessage(chatId, {
                        text: code,
			...channelInfo
                    });
                } else {
                    throw new Error('Invalid response from server');
                }
            } catch (apiError) {
                console.error('API Error:', apiError);
                const errorMessage = apiError.message === 'Service Unavailable' 
                    ? "Service is currently unavailable. Please try again later."
                    : "Failed to generate pairing code. Please try again later.";
                
                await sock.sendMessage(chatId, {
                    text: errorMessage,
		     ...channelInfo
                });
            }
        }
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, {
            text: "An error occurred. Please try again later.",
	    ...channelInfo
        });
    }
}

module.exports = { pairCommand }; 
