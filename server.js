const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const os = require('os');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
    transports: ['websocket', 'polling'],
    maxHttpBufferSize: 100 * 1024 * 1024
});

app.use(express.static(path.join(__dirname, 'public')));

const onlineUsers = new Map(); // username -> socket.id
let messageHistory = []; // для общего чата
let privateMessages = new Map(); // chatId -> [messages]
let maintenanceMode = false;
let maintenanceReason = '';

io.on('connection', (socket) => {
    console.log('✅ Новое подключение:', socket.id);
    socket.emit('maintenance mode', { enabled: maintenanceMode, reason: maintenanceReason });

    socket.on('set username', (username) => {
        if (maintenanceMode && username !== 'Lilmopss_admin') {
            socket.emit('system message', { text: 'Чат на техобслуживании', timestamp: new Date() });
            return;
        }
        
        if (onlineUsers.has(username)) {
            socket.emit('username taken', 'Имя занято');
        } else {
            socket.username = username;
            onlineUsers.set(username, socket.id);
            socket.emit('username set', username);
            io.emit('users list', Array.from(onlineUsers.keys()));
            
            // Отправляем историю общего чата
            messageHistory.forEach(msg => socket.emit('new message', msg));
            
            // Отправляем личные сообщения
            for (let [chatId, messages] of privateMessages) {
                if (chatId.includes(username)) {
                    messages.forEach(msg => {
                        if (msg.to === username || msg.from === username) {
                            socket.emit('new message', msg);
                        }
                    });
                }
            }
            
            io.emit('system message', {
                text: `${username} присоединился`,
                timestamp: new Date().toISOString()
            });
        }
    });

    // Обработка текстовых сообщений
    socket.on('send message', (data) => {
        if (!socket.username) return;
        if (maintenanceMode && socket.username !== 'Lilmopss_admin') return;
        
        const chat = data.chat;
        const msg = {
            username: socket.username,
            text: data.text,
            type: 'text',
            timestamp: new Date().toISOString(),
            chat: chat
        };
        
        if (chat.type === 'global') {
            // Общий чат
            messageHistory.push(msg);
            if (messageHistory.length > 100) messageHistory.shift();
            io.emit('new message', msg);
        } else if (chat.type === 'dm') {
            // Личный чат
            const chatId = chat.id;
            if (!privateMessages.has(chatId)) privateMessages.set(chatId, []);
            privateMessages.get(chatId).push(msg);
            if (privateMessages.get(chatId).length > 100) privateMessages.get(chatId).shift();
            
            // Отправляем обоим участникам
            const participants = chatId.replace('dm_', '').split('_');
            participants.forEach(participant => {
                const socketId = onlineUsers.get(participant);
                if (socketId) {
                    io.to(socketId).emit('new message', msg);
                }
            });
        }
    });

    // Обработка медиа
    socket.on('send media', (data) => {
        if (!socket.username) return;
        if (maintenanceMode && socket.username !== 'Lilmopss_admin') return;
        
        const chat = data.chat;
        const msg = {
            username: socket.username,
            type: data.type,
            data: data.data,
            name: data.name,
            size: data.size,
            timestamp: new Date().toISOString(),
            chat: chat
        };
        
        if (chat.type === 'global') {
            messageHistory.push(msg);
            if (messageHistory.length > 100) messageHistory.shift();
            io.emit('new message', msg);
        } else if (chat.type === 'dm') {
            const chatId = chat.id;
            if (!privateMessages.has(chatId)) privateMessages.set(chatId, []);
            privateMessages.get(chatId).push(msg);
            if (privateMessages.get(chatId).length > 100) privateMessages.get(chatId).shift();
            
            const participants = chatId.replace('dm_', '').split('_');
            participants.forEach(participant => {
                const socketId = onlineUsers.get(participant);
                if (socketId) {
                    io.to(socketId).emit('new message', msg);
                }
            });
        }
    });

    // Админ-функции
    socket.on('admin kick user', (data) => {
        if (socket.username === 'Lilmopss_admin') {
            const targetId = onlineUsers.get(data.username);
            if (targetId) {
                io.to(targetId).emit('user kicked', { username: data.username });
                io.sockets.sockets.get(targetId)?.disconnect();
                onlineUsers.delete(data.username);
                io.emit('users list', Array.from(onlineUsers.keys()));
                io.emit('system message', { text: `${data.username} выгнан администратором`, timestamp: new Date() });
            }
        }
    });

    socket.on('admin clear chat', () => {
        if (socket.username === 'Lilmopss_admin') {
            messageHistory = [];
            privateMessages.clear();
            io.emit('system message', { text: 'Весь чат очищен администратором', timestamp: new Date() });
        }
    });

    socket.on('admin broadcast', (data) => {
        if (socket.username === 'Lilmopss_admin') {
            io.emit('admin broadcast', { message: data.message, timestamp: new Date() });
        }
    });

    socket.on('admin toggle maintenance', (data) => {
        if (socket.username === 'Lilmopss_admin') {
            maintenanceMode = data.enabled;
            maintenanceReason = data.reason || '';
            io.emit('maintenance mode', { enabled: maintenanceMode, reason: maintenanceReason });
            
            if (maintenanceMode) {
                for (let [user, id] of onlineUsers) {
                    if (user !== 'Lilmopss_admin') {
                        io.to(id).emit('system message', { text: `⚠️ Чат закрыт: ${maintenanceReason}`, timestamp: new Date() });
                        io.sockets.sockets.get(id)?.disconnect();
                    }
                }
                onlineUsers.clear();
                onlineUsers.set('Lilmopss_admin', socket.id);
                io.emit('users list', ['Lilmopss_admin']);
            }
        }
    });

    socket.on('typing', (isTyping) => {
        if (socket.username && !maintenanceMode) {
            socket.broadcast.emit('user typing', { username: socket.username, isTyping });
        }
    });

    socket.on('disconnect', () => {
        if (socket.username) {
            onlineUsers.delete(socket.username);
            io.emit('users list', Array.from(onlineUsers.keys()));
            io.emit('system message', { text: `${socket.username} покинул чат`, timestamp: new Date() });
        }
    });
});

const PORT = 3000;
const localIP = Object.values(os.networkInterfaces())
    .flat()
    .find(i => i.family === 'IPv4' && !i.internal)?.address || 'localhost';

server.listen(PORT, '0.0.0.0', () => {
    console.log('\n💎 RUMESSAGE - Личные чаты и профили\n=================================');
    console.log(`✅ Основная версия: http://${localIP}:${PORT}`);
    console.log(`👑 Админ: Lilmopss_admin | Пароль: admin123`);
    console.log(`💬 Поддержка личных чатов и профилей`);
    console.log('=================================\n');
});