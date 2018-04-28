// Activate strict mode
'use strict';

// Include "dotenv" module to initialize process env
require('dotenv').config();

// Inject Express.js framework
const express = require('express');

// Initialize express.js application
const app = express();

// Initialize express router class
let router = express.Router();

// Get environment mode from system variables
const environment = process.env.NODE_ENV;

// Get application port from system variables
const port = process.env.PORT;

// Get website url from system variable
const URL = process.env.URL;

// Telegraf injection and configuration
const Telegraf = require('telegraf');
const session = require('telegraf/session');
const bot = new Telegraf(process.env.BOT_TOKEN);

let processChatId = process.env.CHAT_ID;

// Add error "watch dog" to log unexpected errors
bot.catch((err) => {
  console.log('Ooops', err)
});

// Words blacklist
let wordsBlacklist = [
    'http',
    'https',
    'www',
    '.com',
    '.io',
    't.me',
    'telegram.me',
    'telegram.dog',
    '.net',
    '.org',
    '.ge'
]

// Start session with bot
bot.use(session());

// Send message every 1 hour
setInterval(function () {
    bot.telegram.sendMessage(processChatId, 'Community Rules...')
    .then((success) => {
        // console.log(success);
    })
    .catch((err) => {
        console.log(err);
    });
}, 3600000);

// Send welcome message to new members
bot.on('new_chat_members', (ctx, next) => {
    ctx.reply('Welcome').then((response) => {

    });
});

// Catch sticker event
bot.on('sticker', (ctx, next) => {
    // Variables
    let messageId = ctx.message.message_id;

    // Delete user's written message
    ctx.deleteMessage(messageId)
    .then((success) => {
        // console.log(success);
    })
    .catch((err) => {
        console.log(err);
    });
});

// Catch photo event
bot.on('photo', (ctx, next) => {
    // Variables
    let messageId = ctx.message.message_id;

    // Delete user's written message
    ctx.deleteMessage(messageId)
    .then((success) => {
        // console.log(success);
    })
    .catch((err) => {
        console.log(err);
    });
});

// Catch video event
bot.on('video', (ctx, next) => {
    // Variables
    let messageId = ctx.message.message_id;

    // Delete user's written message
    ctx.deleteMessage(messageId)
    .then((success) => {
        // console.log(success);
    })
    .catch((err) => {
        console.log(err);
    });
});

// Catch audio event
bot.on('audio', (ctx, next) => {
    // Variables
    let messageId = ctx.message.message_id;

    // Delete user's written message
    ctx.deleteMessage(messageId)
    .then((success) => {
        // console.log(success);
    })
    .catch((err) => {
        console.log(err);
    });
});

// Catch voice event
bot.on('voice', (ctx, next) => {
    // Variables
    let messageId = ctx.message.message_id;

    // Delete user's written message
    ctx.deleteMessage(messageId)
    .then((success) => {
        // console.log(success);
    })
    .catch((err) => {
        console.log(err);
    });
});

// Catch document event
bot.on('document', (ctx, next) => {
    // Variables
    let messageId = ctx.message.message_id;

    // Delete user's written message
    ctx.deleteMessage(messageId)
    .then((success) => {
        // console.log(success);
    })
    .catch((err) => {
        console.log(err);
    });
});

// Catch text event
bot.on('text', (ctx, next) => {
    // Variables
    let text = ctx.message.text;
    let userId = ctx.message.from.id;
    let chatId = ctx.message.chat.id;
    let messageId = ctx.message.message_id;

    // Update chatId
    if (processChatId !== chatId) {
        processChatId = chatId;
    }

    // Check members messages to avoid spam and kick spammers off
    for (var i = 0; i < wordsBlacklist.length; i++) {
        if (text.toLowerCase().indexOf(wordsBlacklist[i]) > -1) {

            // Get user's role info
            ctx.getChatMember(userId).then((member) => {

                // If member is not creator or administrator, then delete spam message
                if (member && (member.status !== 'creator' && member.status !== 'administrator')) {

                    if (!ctx.session.warn) {
                        ctx.session.warn = 1;
                    } else {
                        ctx.session.warn += 1;
                    }

                    // Delete user's written message
                    ctx.deleteMessage(messageId)
                    .then((success) => {
                        // console.log(success);
                    })
                    .catch((err) => {
                        console.log(err);
                    });

                    if (ctx.session.warn >= 5) {
                        ctx.restrictChatMember(userId)
                        .then((success) => {
                            // console.log(success);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                    }

                }

            });

        }

    }

});

// Open socket
bot.startPolling();

// Host application on dedicated port
app.listen(port || 3001);

process.on('SIGINT', () => {
    console.log('Application terminated');
    process.exit(0);
});
