const { setChatbot, getChatbot, removeChatbot } = require('./ut.js');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
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
// Load chatbot config
function loadChatbotConfig(groupId) {
    try {
        const configPath = path.join(__dirname, '../data/chatbot.json');
        if (!fs.existsSync(configPath)) {
            return null;
        }
        const data = JSON.parse(fs.readFileSync(configPath));
        return data[groupId];
    } catch (error) {
        console.error('❌ Error loading chatbot config:', error.message);
        return null;
    }
}

async function handleChatbotCommand(ben, chatId, m, q) {
const sock = ben;
const message = m;
const match = q;

    if (!match) {
        return sock.sendMessage(chatId, {
            text: `*CHATBOT SETUP*\n\n*.chatbot on*\nEnable chatbot\n\n*.chatbot off*\nDisable chatbot in this group`,
	    ...channelInfo
        });
    }

    if (match === 'on') {
        const existingConfig = await getChatbot(chatId);
        if (existingConfig?.enabled) {
            return sock.sendMessage(chatId, { text: '*Chatbot is already enabled for this group*', ...channelInfo });
        }
        await setChatbot(chatId, true);
        console.log(`✅ Chatbot settings updated for group ${chatId}`);
        return sock.sendMessage(chatId, { text: '*Chatbot has been enabled for this group*' , ...channelInfo });
    }

    if (match === 'off') {
        const config = await getChatbot(chatId);
        if (!config?.enabled) {
            return sock.sendMessage(chatId, { text: '*Chatbot is already disabled for this group*', ...channelInfo });
        }
        await removeChatbot(chatId);
        console.log(`✅ Chatbot settings updated for group ${chatId}`);
        return sock.sendMessage(chatId, { text: '*Chatbot has been disabled for this group*', ...channelInfo });
    }

    return sock.sendMessage(chatId, { text: '*Invalid command. Use .chatbot to see usage*', channelInfo });
}

async function handleChatbotResponse(ben, chatId, m, userMessage, senderId) {
const sock = ben;
const message = m;

    const config = loadChatbotConfig(chatId);
    if (!config?.enabled) return;

    try {
        // Debug logs
        console.log('Starting chatbot response handler');
        console.log('Chat ID:', chatId);
        console.log('User Message:', userMessage);

        // Get bot's ID
        const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        console.log('Bot Number:', botNumber);

        // Check for mentions and replies
        let isBotMentioned = false;
        let isReplyToBot = false;

        // Check if message is a reply and contains bot mention
        if (message.message?.extendedTextMessage) {
            const mentionedJid = message.message.extendedTextMessage.contextInfo?.mentionedJid || [];
            const quotedParticipant = message.message.extendedTextMessage.contextInfo?.participant;
            
            // Check if bot is mentioned in the reply
            isBotMentioned = mentionedJid.some(jid => jid === botNumber);
            
            // Check if replying to bot's message
            isReplyToBot = quotedParticipant === botNumber;
            
            console.log('Message is a reply with mention:', {
                mentionedJid,
                quotedParticipant,
                isBotMentioned,
                isReplyToBot
            });
        }
        // Also check regular mentions in conversation
        else if (message.message?.conversation) {
            isBotMentioned = userMessage.includes(`@${botNumber.split('@')[0]}`);
        }

        if (!isBotMentioned && !isReplyToBot) {
            console.log('Bot not mentioned or replied to');
            return;
        }

        // Clean the message
        let cleanedMessage = userMessage;
        if (isBotMentioned) {
            cleanedMessage = cleanedMessage.replace(new RegExp(`@${botNumber.split('@')[0]}`, 'g'), '').trim();
        }

        // Get GPT-3 response
        const response = await getChatbotResponse(cleanedMessage || "hi");
        console.log('GPT-3 Response:', response);

        if (!response) {
            await sock.sendMessage(chatId, { 
                text: "I couldn't process your request at the moment.",
                ...channelInfo,
		 quoted: message
            });
            return;
        }

        // Send response as a reply with mention
        await sock.sendMessage(chatId, {
            text: `@${senderId.split('@')[0]} ${response}`,
	    ...channelInfo,
            quoted: message,
            mentions: [senderId]
        });

        // Only log successful responses
        console.log(`✅ Chatbot responded in group ${chatId}`);
    } catch (error) {
        console.error('❌ Error in chatbot response:', error.message);
        await sock.sendMessage(chatId, { 
            text: "Sorry, I encountered an error while processing your message.",
	    ...channelInfo,
            quoted: message,
            mentions: [senderId]
        });
    }
}

async function getChatbotResponse(userMessage) {
  try {
    console.log('Getting chatbot response for:', userMessage);

    const api = `https://apis.davidcyriltech.my.id/ai/chatbot?query=${encodeURIComponent(userMessage)}`;
    const response = await fetch(api);

    if (!response.ok) {
      console.error('Chatbot API response not ok:', response.status);
      throw new Error("API call failed");
}

    const data = await response.json();
    console.log('Chatbot API response:', data);
    return data.result;

} catch (error) {
    console.error("Chatbot API error:", error);
    return null;
}
}

// Example usage:
getChatbotResponse("Hello").then(reply => {
  console.log("🤖 Bot says:", reply);
});

module.exports = {
    handleChatbotCommand,
    handleChatbotResponse
}; 
