const fs = require('fs');
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
const words = ['javascript', 'bot', 'hangman', 'whatsapp', 'nodejs'];
let hangmanGames = {};

function startHangman(ben, chatId) {
const sock = ben;

    const word = words[Math.floor(Math.random() * words.length)];
    const maskedWord = '_ '.repeat(word.length).trim();

    hangmanGames[chatId] = {
        word,
        maskedWord: maskedWord.split(' '),
        guessedLetters: [],
        wrongGuesses: 0,
        maxWrongGuesses: 6,
    };

    sock.sendMessage(chatId, { text: `Game started! The word is: ${maskedWord}`, ...channelInfo });
}

function guessLetter(ben, chatId, letter) {
const sock = ben;

    if (!hangmanGames[chatId]) {
        sock.sendMessage(chatId, { text: 'No game in progress. Start a new game with .hangman', ...channelInfo });
        return;
    }

    const game = hangmanGames[chatId];
    const { word, guessedLetters, maskedWord, maxWrongGuesses } = game;

    if (guessedLetters.includes(letter)) {
        sock.sendMessage(chatId, { text: `You already guessed "${letter}". Try another letter.`, ...channelInfo });
        return;
    }

    guessedLetters.push(letter);

    if (word.includes(letter)) {
        for (let i = 0; i < word.length; i++) {
            if (word[i] === letter) {
                maskedWord[i] = letter;
            }
        }
        sock.sendMessage(chatId, { text: `Good guess! ${maskedWord.join(' ')}`, ...channelInfo });

        if (!maskedWord.includes('_')) {
            sock.sendMessage(chatId, { text: `Congratulations! You guessed the word: ${word}`, ...channelInfo });
            delete hangmanGames[chatId];
        }
    } else {
        game.wrongGuesses += 1;
        sock.sendMessage(chatId, { text: `Wrong guess! You have ${maxWrongGuesses - game.wrongGuesses} tries left.`, ...channelInfo });

        if (game.wrongGuesses >= maxWrongGuesses) {
            sock.sendMessage(chatId, { text: `Game over! The word was: ${word}`, ...channelInfo });
            delete hangmanGames[chatId];
        }
    }
}

module.exports = { startHangman, guessLetter };
