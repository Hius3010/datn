import fs from 'fs';
import { Telegraf } from 'telegraf';
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, LOG_FILE_PATH } from "./api/config/index.js";
import TelegramBot from "node-telegram-bot-api";

// Tao bot moi
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true, request: {
    agentOptions: {
        keepAlive: true,
        family: 4
    }
}});

// Lay kich thuoc ban dau cua file log
let initialSize = getFileSize(LOG_FILE_PATH);
let lastErrorLine = null;

// Theo doi su thay doi cua file log
fs.watchFile(LOG_FILE_PATH, (curr, prev) => {
    if (curr.size !== prev.size) {
        // Doc du lieu moi trong file log
        const logContent = fs.readFileSync(LOG_FILE_PATH, 'utf8', { start: prev.size });
        const lines = logContent.split('\n');

        // Tim kiem 'error code'
        let newErrorLine = null;
        for (let line of lines) {
            if (line.includes('error code: 401')) {
                newErrorLine = line;
            }
        }

        if (newErrorLine && newErrorLine !== lastErrorLine) {
            sendTelegramMessage(`🚨 Phát hiện truy cập trái phép:\n${newErrorLine}`);
            lastErrorLine = newErrorLine; // Cập nhật lại dòng lỗi cuối cùng
        }

        initialSize = curr.size;
    }
});

async function sendTelegramMessage(message) {
    try {
        await bot.sendMessage(TELEGRAM_CHAT_ID, message);
    } catch (error) {
        console.error(`Lỗi khi gửi tin nhắn Telegram: ${error}`);
    }
}

// Func lay kich thuoc file
function getFileSize(LOG_FILE_PATH) {
    try {
        const stats = fs.statSync(LOG_FILE_PATH);
        return stats.size;
    } catch (err) {
        console.error(`Error getting file size: ${err}`);
        return 0;
    }
}

export const monitor = () => {};