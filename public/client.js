// public/client.js - обновленная версия
const socket = io({
    transports: ['websocket', 'polling'], // Поддержка разных транспортов
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000
});

// Добавьте обработку ошибок подключения
socket.on('connect_error', (error) => {
    console.error('Ошибка подключения:', error);
    showConnectionError('Не удалось подключиться к серверу. Проверьте настройки сети.');
});

socket.on('reconnect_attempt', (attemptNumber) => {
    console.log('Попытка переподключения:', attemptNumber);
});

function showConnectionError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'connection-error';
    errorDiv.innerHTML = `
        <div class="error-content">
            <span>⚠️</span>
            <p>${message}</p>
            <button onclick="location.reload()">Перезагрузить</button>
        </div>
    `;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="theme-color" content="#667eea">
    <title>RUMESSAGE | Liquid Glass Messenger</title>
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', Oxygen, Ubuntu, sans-serif;
            background: #0a0a2a;
            min-height: 100vh;
            overflow-x: hidden;
            position: relative;
        }

        /* Liquid Glass Background */
        .liquid-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            overflow: hidden;
        }

        .liquid-blob {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.5;
            animation: liquidFloat 20s infinite ease-in-out;
        }

        .blob-1 {
            width: 600px;
            height: 600px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            top: -200px;
            left: -200px;
            animation-delay: 0s;
        }

        .blob-2 {
            width: 700px;
            height: 700px;
            background: linear-gradient(135deg, #f093fb, #f5576c);
            bottom: -300px;
            right: -250px;
            animation-delay: 5s;
        }

        .blob-3 {
            width: 500px;
            height: 500px;
            background: linear-gradient(135deg, #4facfe, #00f2fe);
            top: 40%;
            left: 30%;
            animation-delay: 2s;
        }

        .blob-4 {
            width: 400px;
            height: 400px;
            background: linear-gradient(135deg, #43e97b, #38f9d7);
            bottom: 20%;
            right: 20%;
            animation-delay: 8s;
        }

        @keyframes liquidFloat {
            0%, 100% {
                transform: translate(0, 0) scale(1) rotate(0deg);
            }
            25% {
                transform: translate(50px, -30px) scale(1.1) rotate(5deg);
            }
            50% {
                transform: translate(-30px, 40px) scale(0.9) rotate(-5deg);
            }
            75% {
                transform: translate(30px, -20px) scale(1.05) rotate(3deg);
            }
        }

        .glass-card {
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(20px);
            border-radius: 32px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .container {
            position: relative;
            z-index: 1;
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* Login Screen */
        .login-wrapper {
            width: 100%;
            max-width: 480px;
            animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .login-card {
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(25px);
            border-radius: 48px;
            padding: 50px 40px;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.25);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .login-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 35px 60px rgba(0, 0, 0, 0.3);
        }

        .logo {
            margin-bottom: 40px;
        }

        .logo-icon {
            font-size: 80px;
            margin-bottom: 20px;
            animation: logoGlow 2s infinite, floatIcon 3s infinite;
            display: inline-block;
        }

        @keyframes logoGlow {
            0%, 100% {
                filter: drop-shadow(0 0 5px rgba(102, 126, 234, 0.5));
            }
            50% {
                filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.8));
            }
        }

        @keyframes floatIcon {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-10px);
            }
        }

        .logo h1 {
            font-size: 48px;
            font-weight: 800;
            background: linear-gradient(135deg, #fff, #a8c0ff, #667eea);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -1px;
            margin-bottom: 10px;
        }

        .tagline {
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
            letter-spacing: 2px;
        }

        .input-group {
            position: relative;
            margin-bottom: 15px;
        }

        .input-group input {
            width: 100%;
            padding: 18px 24px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 60px;
            font-size: 16px;
            color: white;
            transition: all 0.3s;
            font-family: inherit;
        }

        .input-group input:focus {
            outline: none;
            border-color: rgba(255, 255, 255, 0.6);
            background: rgba(255, 255, 255, 0.15);
            box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
        }

        .input-group input::placeholder {
            color: rgba(255, 255, 255, 0.5);
        }

        .glass-button {
            width: 100%;
            padding: 18px;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9));
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 60px;
            color: white;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            transition: all 0.3s;
            backdrop-filter: blur(10px);
            margin-bottom: 15px;
        }

        .glass-button:hover {
            transform: translateY(-2px);
            background: linear-gradient(135deg, rgba(102, 126, 234, 1), rgba(118, 75, 162, 1));
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }

        .error-message {
            color: #ff6b6b;
            margin-top: 15px;
            font-size: 14px;
            animation: shake 0.5s ease;
        }

        .register-link {
            text-align: right;
            margin-bottom: 20px;
        }

        .register-link a {
            color: #a8c0ff;
            text-decoration: none;
            font-size: 12px;
            cursor: pointer;
        }

        .register-link a:hover {
            text-decoration: underline;
        }

        .success-message {
            color: #4ade80;
            margin-top: 15px;
            font-size: 14px;
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }

        /* Chat Screen */
        .chat-wrapper {
            width: 100%;
            height: 90vh;
            display: flex;
            flex-direction: column;
            animation: fadeIn 0.6s ease;
        }

        .chat-header {
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(20px);
            border-radius: 28px;
            padding: 18px 24px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 1px solid rgba(255, 255, 255, 0.2);
            flex-wrap: wrap;
            gap: 15px;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 20px;
            flex-wrap: wrap;
        }

        .logo-mini {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .logo-mini-icon {
            font-size: 32px;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        .logo-mini h2 {
            font-size: 24px;
            font-weight: 700;
            background: linear-gradient(135deg, #fff, #a8c0ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .status-badge {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 14px;
            background: rgba(74, 222, 128, 0.2);
            border-radius: 60px;
            backdrop-filter: blur(5px);
        }

        .status-dot {
            width: 8px;
            height: 8px;
            background: #4ade80;
            border-radius: 50%;
            animation: blink 1.5s infinite;
        }

        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .user-pill {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            padding: 8px 24px;
            border-radius: 60px;
            display: flex;
            align-items: center;
            gap: 10px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .user-avatar {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
        }

        .admin-panel-btn {
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            border: none;
            padding: 8px 20px;
            border-radius: 60px;
            color: white;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s;
        }

        .admin-panel-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
        }

        .chat-layout {
            display: flex;
            gap: 20px;
            flex: 1;
            min-height: 0;
        }

        .sidebar-glass {
            width: 280px;
            background: rgba(255, 255, 255, 0.06);
            backdrop-filter: blur(15px);
            border-radius: 28px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .sidebar-header {
            padding: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .sidebar-header h3 {
            color: white;
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .count-badge {
            background: rgba(255, 255, 255, 0.2);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            color: white;
        }

        .users-list {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
        }

        .user-item {
            padding: 12px 14px;
            margin-bottom: 8px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            color: white;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s;
            border: 1px solid transparent;
            flex-wrap: wrap;
        }

        .user-item:hover {
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(255, 255, 255, 0.2);
            transform: translateX(5px);
        }

        .user-status {
            width: 8px;
            height: 8px;
            background: #4ade80;
            border-radius: 50%;
        }

        .user-prefix {
            font-size: 12px;
            padding: 2px 6px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.2);
        }

        .admin-badge {
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            padding: 2px 8px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: bold;
        }

        .chat-main-glass {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: rgba(255, 255, 255, 0.04);
            backdrop-filter: blur(15px);
            border-radius: 28px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            overflow: hidden;
        }

        .messages-container {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
        }

        .message {
            margin-bottom: 20px;
            animation: messageSlideIn 0.3s ease;
        }

        @keyframes messageSlideIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .message.system {
            text-align: center;
        }

        .message.system .message-bubble {
            background: rgba(255, 255, 255, 0.08);
            display: inline-block;
            padding: 6px 18px;
            border-radius: 20px;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
        }

        .message.own {
            display: flex;
            justify-content: flex-end;
        }

        .message.other {
            display: flex;
            justify-content: flex-start;
        }

        .message-header {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.5);
            margin-bottom: 5px;
            margin-left: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
        }

        .message-bubble {
            background: rgba(255, 255, 255, 0.1);
            padding: 10px 18px;
            border-radius: 20px;
            max-width: 70%;
            word-wrap: break-word;
            border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .message.own .message-bubble {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8));
            border: 1px solid rgba(255, 255, 255, 0.3);
        }

        /* Стили для медиа-сообщений */
        .media-preview {
            max-width: 300px;
            max-height: 300px;
            border-radius: 12px;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .media-preview:hover {
            transform: scale(1.02);
        }

        .video-preview {
            max-width: 300px;
            border-radius: 12px;
        }

        .file-name {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
            margin-top: 5px;
            word-break: break-all;
        }

        .message-time {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.4);
            margin-top: 4px;
            margin-left: 12px;
        }

        .typing-area {
            padding: 8px 24px;
            min-height: 44px;
        }

        .typing-animation {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.5);
        }

        .input-glass {
            display: flex;
            gap: 12px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.06);
            backdrop-filter: blur(15px);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            flex-wrap: wrap;
        }

        .input-wrapper {
            flex: 1;
            display: flex;
            gap: 10px;
        }

        .message-input-field {
            flex: 1;
            padding: 14px 20px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 28px;
            color: white;
            font-family: inherit;
            font-size: 14px;
            resize: none;
        }

        .message-input-field:focus {
            outline: none;
            border-color: rgba(255, 255, 255, 0.5);
            background: rgba(255, 255, 255, 0.15);
        }

        .file-buttons {
            display: flex;
            gap: 8px;
        }

        .file-btn {
            width: 48px;
            height: 48px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .file-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.05);
        }

        .send-button {
            width: 52px;
            height: 52px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            transition: all 0.3s;
        }

        .send-button:hover {
            transform: scale(1.05) rotate(5deg);
            box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
        }

        .welcome-card {
            text-align: center;
            padding: 50px 20px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 24px;
            margin: 20px;
        }

        .welcome-icon {
            font-size: 64px;
            margin-bottom: 20px;
            animation: floatIcon 3s infinite;
        }

        /* Modal */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            z-index: 10000;
            align-items: center;
            justify-content: center;
        }

        .modal.active {
            display: flex;
        }

        .modal-content {
            background: rgba(20, 20, 40, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 32px;
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            border: 1px solid rgba(255, 255, 255, 0.2);
            animation: modalSlideIn 0.3s ease;
        }

        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        .modal-header {
            padding: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-header h2 {
            color: white;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .close-modal {
            background: none;
            border: none;
            color: white;
            font-size: 28px;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .close-modal:hover {
            transform: rotate(90deg);
        }

        .modal-body {
            padding: 20px;
        }

        .admin-stat {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 15px;
            margin-bottom: 20px;
        }

        .admin-stat h3 {
            color: #ff6b6b;
            margin-bottom: 10px;
            font-size: 14px;
        }

        .admin-action-btn {
            width: 100%;
            padding: 12px;
            margin-bottom: 10px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            color: white;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .admin-action-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateX(5px);
        }

        .admin-action-btn.danger {
            background: rgba(255, 107, 107, 0.2);
            border-color: rgba(255, 107, 107, 0.5);
        }

        .user-list-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            margin-bottom: 8px;
            flex-wrap: wrap;
            gap: 8px;
        }

        .user-controls {
            display: flex;
            gap: 5px;
            flex-wrap: wrap;
        }

        .role-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            padding: 4px 10px;
            border-radius: 20px;
            color: white;
            cursor: pointer;
            font-size: 11px;
        }

        .prefix-select {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            padding: 4px 8px;
            border-radius: 20px;
            color: white;
            font-size: 11px;
            cursor: pointer;
        }

        .kick-btn {
            background: rgba(255, 107, 107, 0.3);
            border: none;
            padding: 4px 10px;
            border-radius: 20px;
            color: white;
            cursor: pointer;
            font-size: 11px;
        }

        /* Панель диагностики */
        .diag-panel {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 9999;
        }
        .diag-btn {
            background: rgba(0,0,0,0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 30px;
            padding: 10px 20px;
            color: white;
            cursor: pointer;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s;
        }
        .diag-btn:hover {
            background: rgba(0,0,0,0.8);
            transform: scale(1.02);
        }
        .diag-menu {
            display: none;
            position: absolute;
            bottom: 50px;
            left: 0;
            background: rgba(20,20,40,0.95);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.2);
            min-width: 280px;
            padding: 15px;
            animation: fadeInUp 0.2s ease;
        }
        .transport-btn {
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 20px;
            padding: 8px 15px;
            color: white;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
        }
        .transport-btn:hover {
            background: rgba(255,255,255,0.2);
        }
        .transport-btn.active {
            background: linear-gradient(135deg, #667eea, #764ba2) !important;
            border-color: transparent !important;
        }
        .diagnostic-notification {
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 10001;
            background: rgba(0,0,0,0.9);
            backdrop-filter: blur(20px);
            padding: 12px 20px;
            border-radius: 12px;
            color: white;
            font-size: 13px;
            animation: slideInRight 0.3s ease;
            border-left: 3px solid #667eea;
        }
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(100px); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .hidden {
            display: none !important;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        ::-webkit-scrollbar {
            width: 6px;
        }

        ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 10px;
        }

        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }

            .chat-layout {
                flex-direction: column;
            }

            .sidebar-glass {
                width: 100%;
                max-height: 200px;
            }

            .message-bubble {
                max-width: 85%;
            }

            .chat-header {
                flex-direction: column;
                text-align: center;
            }

            .login-card {
                padding: 40px 25px;
            }

            .media-preview, .video-preview {
                max-width: 200px;
            }
        }
    </style>
</head>
<body>
    <div class="liquid-background">
        <div class="liquid-blob blob-1"></div>
        <div class="liquid-blob blob-2"></div>
        <div class="liquid-blob blob-3"></div>
        <div class="liquid-blob blob-4"></div>
    </div>

    <div class="container">
        <!-- Login Screen -->
        <div id="loginScreen" class="login-wrapper">
            <div class="login-card">
                <div class="logo">
                    <div class="logo-icon">💎</div>
                    <h1>RUMESSAGE</h1>
                    <div class="tagline">LIQUID GLASS MESSENGER</div>
                </div>
                
                <div id="loginForm">
                    <div class="input-group">
                        <input type="text" id="usernameInput" placeholder="Имя пользователя" autocomplete="off">
                    </div>
                    <div class="input-group">
                        <input type="password" id="passwordInput" placeholder="Пароль">
                    </div>
                    <button id="loginButton" class="glass-button">🔓 Войти</button>
                    <div class="register-link">
                        <a onclick="showRegisterForm()">Нет аккаунта? Зарегистрироваться</a>
                    </div>
                </div>

                <div id="registerForm" style="display: none;">
                    <div class="input-group">
                        <input type="text" id="regUsernameInput" placeholder="Имя пользователя" autocomplete="off">
                    </div>
                    <div class="input-group">
                        <input type="password" id="regPasswordInput" placeholder="Пароль">
                    </div>
                    <div class="input-group">
                        <input type="password" id="regConfirmPasswordInput" placeholder="Подтвердите пароль">
                    </div>
                    <button id="registerButton" class="glass-button">📝 Зарегистрироваться</button>
                    <div class="register-link">
                        <a onclick="showLoginForm()">Уже есть аккаунт? Войти</a>
                    </div>
                </div>

                <div id="loginError" class="error-message"></div>
                <div id="loginSuccess" class="success-message"></div>
                
                <div class="proxy-info" style="margin-top: 25px; padding: 15px 20px; background: rgba(255,255,255,0.05); border-radius: 20px;">
                    <div style="text-align: center; margin: 10px 0;">
                        <a href="http://192.168.1.78:3000/proxy.html" class="proxy-link" style="color: #a8c0ff; text-decoration: none;">🌐 Proxy версия (без медиа)</a>
                    </div>
                    <div style="font-size: 11px; color: rgba(255,255,255,0.4); text-align: center;">
                        ⚡ Если не работают фото/видео - используйте proxy версию
                    </div>
                </div>
            </div>
        </div>

        <!-- Chat Screen -->
        <div id="chatScreen" class="chat-wrapper hidden">
            <div class="chat-header">
                <div class="header-left">
                    <div class="logo-mini">
                        <div class="logo-mini-icon">💎</div>
                        <h2>RUMESSAGE</h2>
                    </div>
                    <div class="status-badge">
                        <div class="status-dot" id="statusDot"></div>
                        <span class="status-text" id="statusText">Online</span>
                    </div>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button id="adminPanelBtn" class="admin-panel-btn hidden">
                        <span>👑</span>
                        <span>Admin Panel</span>
                    </button>
                    <div class="user-pill">
                        <div class="user-avatar">👤</div>
                        <span id="currentUserName"></span>
                    </div>
                </div>
            </div>

            <div class="chat-layout">
                <div class="sidebar-glass">
                    <div class="sidebar-header">
                        <h3>👥 Участники</h3>
                        <span id="userCountBadge" class="count-badge">0</span>
                    </div>
                    <div id="usersList" class="users-list"></div>
                </div>

                <div class="chat-main-glass">
                    <div id="messagesArea" class="messages-container">
                        <div class="welcome-card">
                            <div class="welcome-icon">💎</div>
                            <h3>Добро пожаловать в RUMESSAGE</h3>
                            <p>Начните общение в стиле Liquid Glass</p>
                            <p style="font-size: 12px; margin-top: 10px;">📷 Поддерживается отправка фото и видео</p>
                        </div>
                    </div>
                    <div id="typingArea" class="typing-area"></div>
                    <div class="input-glass">
                        <div class="input-wrapper">
                            <textarea id="messageInput" class="message-input-field" placeholder="Введите сообщение..." rows="1"></textarea>
                            <div class="file-buttons">
                                <input type="file" id="photoInput" accept="image/*" style="display: none;">
                                <button id="photoBtn" class="file-btn" title="Отправить фото">📷</button>
                                <input type="file" id="videoInput" accept="video/*" style="display: none;">
                                <button id="videoBtn" class="file-btn" title="Отправить видео">🎥</button>
                            </div>
                        </div>
                        <button id="sendButton" class="send-button">📤</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Maintenance Overlay -->
    <div id="maintenanceOverlay" class="modal" style="display: none;">
        <div class="modal-content" style="max-width: 400px; text-align: center;">
            <div class="modal-header">
                <h2>🔧 Технические работы</h2>
            </div>
            <div class="modal-body">
                <div style="font-size: 48px; margin-bottom: 20px;">🔧</div>
                <p>Чат временно закрыт на техническое обслуживание</p>
                <div id="maintenanceReason" style="background: rgba(255,107,107,0.2); padding: 10px; border-radius: 12px; margin: 15px 0;"></div>
                <button class="glass-button" onclick="location.reload()">🔄 Проверить снова</button>
            </div>
        </div>
    </div>

    <!-- Admin Panel Modal -->
    <div id="adminModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>👑 Admin Panel</h2>
                <button class="close-modal" onclick="closeAdminModal()">✕</button>
            </div>
            <div class="modal-body">
                <div class="admin-stat">
                    <h3>📊 Статистика</h3>
                    <p id="adminUserCount">0</p>
                    <p style="font-size: 12px;">пользователей онлайн</p>
                </div>

                <div class="admin-stat">
                    <h3>🔧 Управление чатом</h3>
                    <button id="toggleMaintenanceBtn" class="admin-action-btn">
                        <span>🔧</span>
                        <span id="maintenanceBtnText">Включить техобслуживание</span>
                    </button>
                </div>

                <div class="admin-stat">
                    <h3>👥 Управление пользователями</h3>
                    <div id="adminUsersList"></div>
                </div>

                <div class="admin-stat">
                    <h3>⚡ Действия</h3>
                    <button id="clearChatBtn" class="admin-action-btn danger">🗑️ Очистить чат</button>
                    <button id="broadcastBtn" class="admin-action-btn">📢 Системное сообщение</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Панель диагностики -->
    <div class="diag-panel">
        <button id="diagToggle" class="diag-btn">🔌 Диагностика сети</button>
        <div id="diagMenu" class="diag-menu">
            <div style="margin-bottom: 15px;">
                <h4 style="color: white; margin-bottom: 8px;">🔧 Транспорт</h4>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <button data-transport="websocket" class="transport-btn">⚡ WebSocket</button>
                    <button data-transport="polling" class="transport-btn">🔄 Polling</button>
                    <button data-transport="auto" class="transport-btn active">🤖 Авто</button>
                </div>
                <div id="currentTransport" style="margin-top: 8px; font-size: 11px; color: rgba(255,255,255,0.5);">Текущий: Авто</div>
            </div>
            <button id="runDiagBtn" style="width:100%; background: rgba(102,126,234,0.3); border: none; padding: 8px; border-radius: 20px; color: white; margin-bottom: 10px;">🔍 Проверить соединение</button>
            <div id="diagResults" style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 8px; font-size: 11px; max-height: 150px; overflow-y: auto;">
                <div style="color: rgba(255,255,255,0.5); text-align: center;">Нажмите "Проверить"</div>
            </div>
            <div style="margin-top: 10px; font-size: 10px; color: rgba(255,255,255,0.4); text-align: center;">
                WebSocket – быстро, но может блокироваться<br>Polling – медленнее, но стабильнее
            </div>
        </div>
    </div>

    <script src="/socket.io/socket.io.js"></script>
    <script>
        // RUMESSAGE с поддержкой фото, видео и диагностикой сети
        console.log('💎 RUMESSAGE загружен');

        // Ключ для сохранения выбранного транспорта
        const TRANSPORT_KEY = 'rumessage_transport_mode';

        // ========== Функции диагностики ==========
        async function testWebSocket() {
            return new Promise((resolve) => {
                const ws = new WebSocket(`ws://${location.hostname}:3000/socket.io/?EIO=4&transport=websocket`);
                const timeout = setTimeout(() => {
                    ws.close();
                    resolve({ ok: false, msg: 'Таймаут' });
                }, 4000);
                ws.onopen = () => {
                    clearTimeout(timeout);
                    ws.close();
                    resolve({ ok: true, msg: 'WebSocket работает' });
                };
                ws.onerror = () => {
                    clearTimeout(timeout);
                    resolve({ ok: false, msg: 'Ошибка подключения' });
                };
            });
        }

        async function testPolling() {
            return new Promise((resolve) => {
                const xhr = new XMLHttpRequest();
                const timeout = setTimeout(() => {
                    xhr.abort();
                    resolve({ ok: false, msg: 'Таймаут' });
                }, 4000);
                xhr.open('GET', `http://${location.hostname}:3000/socket.io/?EIO=4&transport=polling&t=${Date.now()}`);
                xhr.onload = () => {
                    clearTimeout(timeout);
                    resolve({ ok: true, msg: 'Polling работает' });
                };
                xhr.onerror = () => {
                    clearTimeout(timeout);
                    resolve({ ok: false, msg: 'Ошибка запроса' });
                };
                xhr.send();
            });
        }

        async function runDiagnostics() {
            const resultsDiv = document.getElementById('diagResults');
            if (!resultsDiv) return;
            resultsDiv.innerHTML = '<div style="color: #ffd700;">🔍 Проверка соединения...</div>';
            
            const ws = await testWebSocket();
            const poll = await testPolling();
            
            let html = `<div>🔌 WebSocket: ${ws.ok ? '✅' : '❌'} ${ws.msg}</div>`;
            html += `<div>📡 Polling: ${poll.ok ? '✅' : '❌'} ${poll.msg}</div>`;
            
            if (!ws.ok && poll.ok) {
                html += '<div style="color:#4facfe; margin-top:5px;">💡 Рекомендуется режим Polling</div>';
            } else if (ws.ok && !poll.ok) {
                html += '<div style="color:#4facfe; margin-top:5px;">💡 Рекомендуется WebSocket</div>';
            } else if (!ws.ok && !poll.ok) {
                html += '<div style="color:#ff6b6b; margin-top:5px;">⚠️ Сервер недоступен! Проверьте запущен ли сервер и открыт ли порт 3000.</div>';
            } else {
                html += '<div style="color:#4ade80; margin-top:5px;">✅ Оба транспорта работают</div>';
            }
            resultsDiv.innerHTML = html;
        }

        function setTransportMode(mode) {
            localStorage.setItem(TRANSPORT_KEY, mode);
            // Обновляем активную кнопку в меню (если меню открыто)
            document.querySelectorAll('.transport-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.transport === mode) btn.classList.add('active');
            });
            const names = { websocket: '⚡ WebSocket', polling: '🔄 Polling', auto: '🤖 Авто' };
            document.getElementById('currentTransport').innerHTML = `Текущий: ${names[mode]}`;
            showDiagnosticNotification(`Режим изменён на ${names[mode]}. Страница перезагрузится.`);
            setTimeout(() => location.reload(), 1500);
        }

        function showDiagnosticNotification(msg) {
            const div = document.createElement('div');
            div.className = 'diagnostic-notification';
            div.style.borderLeftColor = '#4ade80';
            div.innerHTML = `✅ ${msg}`;
            document.body.appendChild(div);
            setTimeout(() => div.remove(), 3000);
        }

        // ========== Основной код ==========
        // Определяем транспорт из localStorage
        const savedTransport = localStorage.getItem(TRANSPORT_KEY);
        let transportsList = ['websocket', 'polling'];
        if (savedTransport === 'websocket') transportsList = ['websocket'];
        else if (savedTransport === 'polling') transportsList = ['polling'];
        
        const socket = io({
            transports: transportsList,
            reconnection: true,
            reconnectionAttempts: 15
        });
        console.log(`🔌 Инициализирован транспорт: ${transportsList.join(', ')}`);

        // Хранилище пользователей
        let usersDB = JSON.parse(localStorage.getItem('rumessage_users') || '{}');
        
        if (!usersDB['Lilmopss_admin']) {
            usersDB['Lilmopss_admin'] = {
                password: 'admin123',
                role: 'admin',
                prefix: '👑'
            };
        }

        function saveUsersDB() {
            localStorage.setItem('rumessage_users', JSON.stringify(usersDB));
        }

        function showRegisterForm() {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('registerForm').style.display = 'block';
            document.getElementById('loginError').style.display = 'none';
        }

        function showLoginForm() {
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('loginError').style.display = 'none';
        }

        window.showRegisterForm = showRegisterForm;
        window.showLoginForm = showLoginForm;

        document.addEventListener('DOMContentLoaded', () => {
            let currentUser = null;
            let currentUserData = null;
            let typingTimeout = null;
            let isAdmin = false;
            let allUsers = [];
            let isMaintenanceMode = false;

            // DOM элементы
            const loginScreen = document.getElementById('loginScreen');
            const chatScreen = document.getElementById('chatScreen');
            const usernameInput = document.getElementById('usernameInput');
            const passwordInput = document.getElementById('passwordInput');
            const loginButton = document.getElementById('loginButton');
            const registerButton = document.getElementById('registerButton');
            const regUsernameInput = document.getElementById('regUsernameInput');
            const regPasswordInput = document.getElementById('regPasswordInput');
            const regConfirmPasswordInput = document.getElementById('regConfirmPasswordInput');
            const loginError = document.getElementById('loginError');
            const loginSuccess = document.getElementById('loginSuccess');
            const messagesArea = document.getElementById('messagesArea');
            const messageInput = document.getElementById('messageInput');
            const sendButton = document.getElementById('sendButton');
            const usersList = document.getElementById('usersList');
            const userCountBadge = document.getElementById('userCountBadge');
            const currentUserName = document.getElementById('currentUserName');
            const typingArea = document.getElementById('typingArea');
            const adminPanelBtn = document.getElementById('adminPanelBtn');
            const adminModal = document.getElementById('adminModal');
            const maintenanceOverlay = document.getElementById('maintenanceOverlay');
            
            // Файловые элементы
            const photoInput = document.getElementById('photoInput');
            const videoInput = document.getElementById('videoInput');
            const photoBtn = document.getElementById('photoBtn');
            const videoBtn = document.getElementById('videoBtn');

            // Панель диагностики
            const diagToggle = document.getElementById('diagToggle');
            const diagMenu = document.getElementById('diagMenu');
            const runDiagBtn = document.getElementById('runDiagBtn');
            const transportBtns = document.querySelectorAll('.transport-btn');

            if (diagToggle && diagMenu) {
                diagToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    diagMenu.style.display = diagMenu.style.display === 'block' ? 'none' : 'block';
                });
                document.addEventListener('click', (e) => {
                    if (!diagToggle.contains(e.target) && !diagMenu.contains(e.target)) {
                        diagMenu.style.display = 'none';
                    }
                });
            }
            if (runDiagBtn) runDiagBtn.addEventListener('click', runDiagnostics);
            transportBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const mode = btn.dataset.transport;
                    setTransportMode(mode);
                });
            });
            // Отображаем текущий транспорт в меню
            if (savedTransport) {
                const names = { websocket: '⚡ WebSocket', polling: '🔄 Polling', auto: '🤖 Авто' };
                document.getElementById('currentTransport').innerHTML = `Текущий: ${names[savedTransport] || 'Авто'}`;
                document.querySelectorAll('.transport-btn').forEach(btn => {
                    if (btn.dataset.transport === savedTransport) btn.classList.add('active');
                    else if (!savedTransport && btn.dataset.transport === 'auto') btn.classList.add('active');
                });
            }

            function showError(msg) {
                loginError.textContent = msg;
                loginError.style.display = 'block';
                setTimeout(() => {
                    loginError.style.display = 'none';
                }, 3000);
            }

            function showSuccess(msg) {
                loginSuccess.textContent = msg;
                loginSuccess.style.display = 'block';
                setTimeout(() => {
                    loginSuccess.style.display = 'none';
                }, 3000);
            }

            function showNotification(message, isError = false) {
                const notif = document.createElement('div');
                notif.style.cssText = `
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 10000;
                    animation: slideDown 0.3s ease;
                `;
                notif.innerHTML = `
                    <div style="background: ${isError ? 'rgba(255, 59, 48, 0.9)' : 'rgba(0,0,0,0.9)'}; backdrop-filter: blur(20px); padding: 12px 24px; border-radius: 60px; color: white; font-size: 14px; display: flex; align-items: center; gap: 12px;">
                        <span>${isError ? '⚠️' : '✅'}</span>
                        <span>${message}</span>
                    </div>
                `;
                document.body.appendChild(notif);
                setTimeout(() => notif.remove(), 3000);
            }

            function getPrefix(role, customPrefix) {
                if (customPrefix) return customPrefix;
                if (role === 'admin') return '👑';
                if (role === 'moder') return '🛡️';
                if (role === 'vip') return '⭐';
                return '👤';
            }

            function getRoleBadge(role) {
                if (role === 'admin') return '<span class="admin-badge">ADMIN</span>';
                if (role === 'moder') return '<span style="background:#4facfe;padding:2px 8px;border-radius:20px;font-size:10px;">MODER</span>';
                if (role === 'vip') return '<span style="background:#f093fb;padding:2px 8px;border-radius:20px;font-size:10px;">VIP</span>';
                return '';
            }

            function fileToBase64(file) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            }

            async function sendPhoto(file) {
                if (!file) return;
                if (file.size > 10 * 1024 * 1024) {
                    showNotification('Файл слишком большой (макс. 10МБ)', true);
                    return;
                }
                try {
                    const base64 = await fileToBase64(file);
                    socket.emit('send media', { type: 'photo', data: base64, name: file.name, size: file.size });
                    showNotification('📷 Фото отправляется...');
                } catch (error) {
                    showNotification('Ошибка отправки фото', true);
                }
            }

            async function sendVideo(file) {
                if (!file) return;
                if (file.size > 50 * 1024 * 1024) {
                    showNotification('Видео слишком большое (макс. 50МБ)', true);
                    return;
                }
                try {
                    const base64 = await fileToBase64(file);
                    socket.emit('send media', { type: 'video', data: base64, name: file.name, size: file.size });
                    showNotification('🎥 Видео отправляется...');
                } catch (error) {
                    showNotification('Ошибка отправки видео', true);
                }
            }

            function addMediaMessage(message) {
                const welcomeCard = messagesArea.querySelector('.welcome-card');
                if (welcomeCard && messagesArea.children.length === 1) welcomeCard.remove();

                const userData = usersDB[message.username] || { role: 'user', prefix: '👤' };
                const prefix = getPrefix(userData.role, userData.customPrefix);
                const isAdminUser = userData.role === 'admin';
                
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${message.username === currentUser ? 'own' : 'other'} ${isAdminUser && message.username !== currentUser ? 'admin-message' : ''}`;
                const time = new Date(message.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

                let mediaHtml = '';
                if (message.type === 'photo') {
                    mediaHtml = `<img src="${message.data}" class="media-preview" onclick="window.open('${message.data}', '_blank')" alt="Фото"><div class="file-name">📷 ${escapeHtml(message.name || 'фото')}</div>`;
                } else if (message.type === 'video') {
                    mediaHtml = `<video controls class="video-preview" preload="metadata"><source src="${message.data}" type="video/mp4">Ваш браузер не поддерживает видео</video><div class="file-name">🎥 ${escapeHtml(message.name || 'видео')}</div>`;
                }

                messageDiv.innerHTML = `
                    <div class="message-header"><span class="user-prefix">${prefix}</span>${message.username === currentUser ? 'Вы' : escapeHtml(message.username)}${getRoleBadge(userData.role)}</div>
                    <div class="message-bubble">${mediaHtml}</div>
                    <div class="message-time">${time}</div>
                `;
                messagesArea.appendChild(messageDiv);
                scrollToBottom();
            }

            function addMessage(message) {
                if (message.type === 'photo' || message.type === 'video') {
                    addMediaMessage(message);
                    return;
                }
                const welcomeCard = messagesArea.querySelector('.welcome-card');
                if (welcomeCard && messagesArea.children.length === 1) welcomeCard.remove();

                const userData = usersDB[message.username] || { role: 'user', prefix: '👤' };
                const prefix = getPrefix(userData.role, userData.customPrefix);
                const isAdminUser = userData.role === 'admin';
                
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${message.username === currentUser ? 'own' : 'other'} ${isAdminUser && message.username !== currentUser ? 'admin-message' : ''}`;
                const time = new Date(message.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

                messageDiv.innerHTML = `
                    <div class="message-header"><span class="user-prefix">${prefix}</span>${message.username === currentUser ? 'Вы' : escapeHtml(message.username)}${getRoleBadge(userData.role)}</div>
                    <div class="message-bubble">${escapeHtml(message.text)}</div>
                    <div class="message-time">${time}</div>
                `;
                messagesArea.appendChild(messageDiv);
                scrollToBottom();
            }

            function addSystemMessage(text, isAdminAction = false) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message system';
                messageDiv.innerHTML = `<div class="message-bubble">${isAdminAction ? '👑 ' : '📢 '}${escapeHtml(text)}</div>`;
                messagesArea.appendChild(messageDiv);
                scrollToBottom();
            }

            function updateUsersList(users) {
                allUsers = users;
                usersList.innerHTML = '';
                users.forEach(user => {
                    const userData = usersDB[user] || { role: 'user', prefix: '👤' };
                    const prefix = getPrefix(userData.role, userData.customPrefix);
                    const userDiv = document.createElement('div');
                    userDiv.className = 'user-item';
                    userDiv.innerHTML = `
                        <div class="user-status"></div>
                        <span class="user-prefix">${prefix}</span>
                        <span>${escapeHtml(user)}</span>
                        ${userData.role === 'admin' ? '<span class="admin-badge">ADMIN</span>' : ''}
                    `;
                    usersList.appendChild(userDiv);
                });
                userCountBadge.textContent = users.length;
                if (adminModal.classList.contains('active')) updateAdminPanel();
            }

            function updateAdminPanel() {
                const adminUserCount = document.getElementById('adminUserCount');
                const adminUsersListDiv = document.getElementById('adminUsersList');
                if (adminUserCount) adminUserCount.textContent = allUsers.length;
                if (adminUsersListDiv) {
                    adminUsersListDiv.innerHTML = '';
                    allUsers.forEach(user => {
                        const userData = usersDB[user] || { role: 'user', prefix: '👤' };
                        if (user === 'Lilmopss_admin') {
                            adminUsersListDiv.innerHTML += `<div style="background:rgba(255,255,255,0.05);padding:10px;border-radius:12px;margin-bottom:5px;">👑 ${escapeHtml(user)} (Главный админ)</div>`;
                        } else {
                            adminUsersListDiv.innerHTML += `
                                <div class="user-list-item">
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <span>${getPrefix(userData.role, userData.customPrefix)}</span>
                                        <span>${escapeHtml(user)}</span>
                                    </div>
                                    <div class="user-controls">
                                        <select class="prefix-select" data-user="${user}" onchange="changeUserPrefix('${user}', this.value)">
                                            <option value="👤" ${userData.customPrefix === '👤' ? 'selected' : ''}>👤</option>
                                            <option value="👑" ${userData.customPrefix === '👑' ? 'selected' : ''}>👑</option>
                                            <option value="⭐" ${userData.customPrefix === '⭐' ? 'selected' : ''}>⭐</option>
                                            <option value="💎" ${userData.customPrefix === '💎' ? 'selected' : ''}>💎</option>
                                            <option value="🔥" ${userData.customPrefix === '🔥' ? 'selected' : ''}>🔥</option>
                                        </select>
                                        <button class="role-btn" onclick="changeUserRole('${user}', 'user')">👤</button>
                                        <button class="role-btn" onclick="changeUserRole('${user}', 'vip')">⭐</button>
                                        <button class="role-btn" onclick="changeUserRole('${user}', 'moder')">🛡️</button>
                                        <button class="kick-btn" onclick="kickUser('${user}')">🚪</button>
                                    </div>
                                </div>
                            `;
                        }
                    });
                }
            }

            function scrollToBottom() {
                messagesArea.scrollTop = messagesArea.scrollHeight;
            }

            function escapeHtml(text) {
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            }

            function sendMessage() {
                if (isMaintenanceMode && !isAdmin) {
                    showNotification('Чат на техническом обслуживании', true);
                    return;
                }
                const text = messageInput.value.trim();
                if (text && currentUser) {
                    socket.emit('send message', { text });
                    messageInput.value = '';
                    messageInput.style.height = 'auto';
                    messageInput.focus();
                }
            }

            window.changeUserPrefix = function(username, prefix) {
                if (isAdmin && usersDB[username]) {
                    usersDB[username].customPrefix = prefix;
                    saveUsersDB();
                    showNotification(`Префикс для ${username} изменён`);
                    updateAdminPanel();
                }
            };

            window.changeUserRole = function(username, role) {
                if (isAdmin && username !== 'Lilmopss_admin') {
                    usersDB[username].role = role;
                    saveUsersDB();
                    showNotification(`Роль ${username} → ${role.toUpperCase()}`);
                    updateAdminPanel();
                    socket.emit('admin broadcast', { message: `${username} получил роль ${role.toUpperCase()}!` });
                }
            };

            window.kickUser = function(username) {
                if (isAdmin && username !== 'Lilmopss_admin' && confirm(`Выгнать ${username}?`)) {
                    socket.emit('admin kick user', { username });
                    showNotification(`${username} выгнан`);
                }
            };

            function clearChat() {
                if (isAdmin && confirm('Очистить чат?')) {
                    socket.emit('admin clear chat');
                    messagesArea.innerHTML = '';
                    addSystemMessage('Чат очищен администратором', true);
                }
            }

            function broadcastMessage() {
                if (isAdmin) {
                    const msg = prompt('Введите сообщение для всех:');
                    if (msg) socket.emit('admin broadcast', { message: msg });
                }
            }

            function toggleMaintenance() {
                if (isAdmin) {
                    const enabled = !isMaintenanceMode;
                    const reason = enabled ? prompt('Причина техобслуживания:', 'Технические работы') : '';
                    socket.emit('admin toggle maintenance', { enabled, reason: reason || 'Технические работы' });
                }
            }

            function openAdminModal() {
                updateAdminPanel();
                adminModal.classList.add('active');
            }

            window.closeAdminModal = function() {
                adminModal.classList.remove('active');
            };

            // Регистрация
            registerButton.addEventListener('click', () => {
                const username = regUsernameInput.value.trim();
                const password = regPasswordInput.value;
                const confirm = regConfirmPasswordInput.value;

                if (!username || !password) {
                    showError('Заполните все поля');
                    return;
                }
                if (password.length < 4) {
                    showError('Пароль минимум 4 символа');
                    return;
                }
                if (password !== confirm) {
                    showError('Пароли не совпадают');
                    return;
                }
                if (usersDB[username]) {
                    showError('Пользователь уже существует');
                    return;
                }

                usersDB[username] = {
                    password: password,
                    role: 'user',
                    customPrefix: '👤'
                };
                saveUsersDB();
                showSuccess('Регистрация успешна!');
                showLoginForm();
                regUsernameInput.value = '';
                regPasswordInput.value = '';
                regConfirmPasswordInput.value = '';
            });

            // Вход
            loginButton.addEventListener('click', () => {
                const username = usernameInput.value.trim();
                const password = passwordInput.value;

                if (!username || !password) {
                    showError('Введите имя и пароль');
                    return;
                }

                const user = usersDB[username];
                if (!user || user.password !== password) {
                    showError('Неверное имя или пароль');
                    return;
                }

                if (isMaintenanceMode && user.role !== 'admin') {
                    showError('Чат на техобслуживании');
                    return;
                }

                currentUser = username;
                currentUserData = user;
                isAdmin = user.role === 'admin';
                
                socket.emit('set username', username);
            });

            usernameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') loginButton.click();
            });
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') loginButton.click();
            });

            // Файловые события
            photoBtn.addEventListener('click', () => photoInput.click());
            videoBtn.addEventListener('click', () => videoInput.click());
            photoInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    sendPhoto(e.target.files[0]);
                    photoInput.value = '';
                }
            });
            videoInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    sendVideo(e.target.files[0]);
                    videoInput.value = '';
                }
            });

            // Socket события
            socket.on('connect', () => {
                console.log('✅ Подключено');
                if (currentUser) socket.emit('set username', currentUser);
            });

            socket.on('maintenance mode', (data) => {
                isMaintenanceMode = data.enabled;
                if (data.enabled && currentUserData?.role !== 'admin') {
                    document.getElementById('maintenanceReason').innerHTML = `<p>🔧 ${data.reason || 'Технические работы'}</p>`;
                    maintenanceOverlay.style.display = 'flex';
                } else {
                    maintenanceOverlay.style.display = 'none';
                }
            });

            socket.on('username set', (username) => {
                const prefix = getPrefix(currentUserData.role, currentUserData.customPrefix);
                currentUserName.innerHTML = `${prefix} ${username}`;
                if (isAdmin) adminPanelBtn.classList.remove('hidden');
                loginScreen.classList.add('hidden');
                chatScreen.classList.remove('hidden');
                messageInput.focus();
                showNotification(`Добро пожаловать, ${username}!`);
            });

            socket.on('username taken', (msg) => showError(msg));
            socket.on('users list', (users) => updateUsersList(users));
            socket.on('new message', (msg) => addMessage(msg));
            socket.on('system message', (msg) => addSystemMessage(msg.text));
            socket.on('admin broadcast', (data) => addSystemMessage(data.message, true));
            socket.on('user kicked', (data) => {
                if (data.username === currentUser) {
                    showNotification('Вы выгнаны!', true);
                    setTimeout(() => location.reload(), 2000);
                }
            });

            socket.on('user typing', (data) => {
                if (data.isTyping && data.username !== currentUser && !isMaintenanceMode) {
                    typingArea.innerHTML = `<div class="typing-animation"><span>${escapeHtml(data.username)}</span> печатает...</div>`;
                } else {
                    typingArea.innerHTML = '';
                }
            });

            // UI события
            sendButton.addEventListener('click', sendMessage);
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
            messageInput.addEventListener('input', () => {
                if (!isMaintenanceMode || isAdmin) {
                    socket.emit('typing', messageInput.value.trim().length > 0);
                    clearTimeout(typingTimeout);
                    typingTimeout = setTimeout(() => socket.emit('typing', false), 1000);
                }
                messageInput.style.height = 'auto';
                messageInput.style.height = Math.min(messageInput.scrollHeight, 100) + 'px';
            });

            if (adminPanelBtn) adminPanelBtn.addEventListener('click', openAdminModal);
            document.getElementById('clearChatBtn')?.addEventListener('click', clearChat);
            document.getElementById('broadcastBtn')?.addEventListener('click', broadcastMessage);
            document.getElementById('toggleMaintenanceBtn')?.addEventListener('click', toggleMaintenance);

            adminModal.addEventListener('click', (e) => {
                if (e.target === adminModal) closeAdminModal();
            });
        });
    </script>
</body>
</html>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>RUMESSAGE | Proxy Version (Без медиа)</title>
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .glass-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(15px);
            border-radius: 30px;
            padding: 30px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .container {
            width: 100%;
            max-width: 500px;
        }

        /* Login Screen */
        .login-box {
            text-align: center;
        }

        .logo {
            margin-bottom: 30px;
        }

        .logo-icon {
            font-size: 60px;
            margin-bottom: 10px;
        }

        .logo h1 {
            font-size: 32px;
            color: white;
            margin-bottom: 5px;
        }

        .logo p {
            color: rgba(255, 255, 255, 0.7);
            font-size: 12px;
        }

        .input-field {
            width: 100%;
            padding: 14px 18px;
            margin-bottom: 12px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 50px;
            font-size: 14px;
            color: white;
        }

        .input-field:focus {
            outline: none;
            border-color: rgba(255, 255, 255, 0.5);
        }

        .input-field::placeholder {
            color: rgba(255, 255, 255, 0.5);
        }

        .btn {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border: none;
            border-radius: 50px;
            color: white;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            margin-bottom: 12px;
            transition: transform 0.2s;
        }

        .btn:hover {
            transform: translateY(-2px);
        }

        .link {
            color: #a8c0ff;
            cursor: pointer;
            font-size: 12px;
            margin-top: 10px;
            display: inline-block;
        }

        .error-msg {
            color: #ff6b6b;
            font-size: 12px;
            margin-top: 10px;
        }

        /* Chat Screen */
        .chat-box {
            height: 85vh;
            display: flex;
            flex-direction: column;
        }

        .chat-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            flex-wrap: wrap;
            gap: 10px;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .logo-small {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .logo-small span {
            font-size: 24px;
        }

        .logo-small h2 {
            font-size: 18px;
            color: white;
        }

        .status {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.7);
        }

        .status-dot {
            width: 8px;
            height: 8px;
            background: #4ade80;
            border-radius: 50%;
            animation: blink 1.5s infinite;
        }

        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .user-info {
            background: rgba(255, 255, 255, 0.15);
            padding: 6px 16px;
            border-radius: 50px;
            color: white;
            font-size: 14px;
        }

        .admin-btn {
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            border: none;
            padding: 6px 16px;
            border-radius: 50px;
            color: white;
            cursor: pointer;
            font-size: 12px;
        }

        .chat-layout {
            display: flex;
            gap: 15px;
            flex: 1;
            min-height: 0;
        }

        .sidebar {
            width: 220px;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .sidebar-header {
            padding: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            justify-content: space-between;
            color: white;
            font-size: 12px;
        }

        .users-list {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
        }

        .user-item {
            padding: 8px 10px;
            margin-bottom: 5px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            color: white;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .chat-main {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            overflow: hidden;
        }

        .messages {
            flex: 1;
            overflow-y: auto;
            padding: 15px;
        }

        .message {
            margin-bottom: 12px;
            animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .message.system {
            text-align: center;
        }

        .message.system .msg-text {
            background: rgba(255, 255, 255, 0.1);
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.6);
        }

        .message.own {
            display: flex;
            justify-content: flex-end;
        }

        .message.other {
            display: flex;
            justify-content: flex-start;
        }

        .msg-header {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.5);
            margin-bottom: 3px;
            margin-left: 10px;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .msg-bubble {
            background: rgba(255, 255, 255, 0.1);
            padding: 8px 14px;
            border-radius: 18px;
            max-width: 80%;
            word-wrap: break-word;
            font-size: 13px;
        }

        .message.own .msg-bubble {
            background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .msg-time {
            font-size: 9px;
            color: rgba(255, 255, 255, 0.4);
            margin-top: 3px;
            margin-left: 10px;
        }

        .typing {
            padding: 5px 15px;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.5);
            min-height: 28px;
        }

        .input-area {
            display: flex;
            gap: 10px;
            padding: 12px;
            background: rgba(255, 255, 255, 0.05);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .msg-input {
            flex: 1;
            padding: 10px 15px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 25px;
            color: white;
            font-family: inherit;
            font-size: 13px;
            resize: none;
        }

        .msg-input:focus {
            outline: none;
            border-color: rgba(255, 255, 255, 0.5);
        }

        .send-btn {
            width: 42px;
            height: 42px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
        }

        .file-warning {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.5);
            text-align: center;
            padding: 5px;
            background: rgba(0,0,0,0.3);
            border-radius: 20px;
            margin-top: 5px;
        }

        .hidden {
            display: none !important;
        }

        @media (max-width: 600px) {
            .chat-layout {
                flex-direction: column;
            }
            .sidebar {
                width: 100%;
                max-height: 150px;
            }
            .msg-bubble {
                max-width: 90%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Login Screen -->
        <div id="loginScreen" class="glass-card login-box">
            <div class="logo">
                <div class="logo-icon">💎</div>
                <h1>RUMESSAGE</h1>
                <p>Proxy Version (Без медиа)</p>
            </div>
            
            <div id="loginForm">
                <input type="text" id="loginUsername" class="input-field" placeholder="Имя пользователя">
                <input type="password" id="loginPassword" class="input-field" placeholder="Пароль">
                <button id="loginBtn" class="btn">🔓 Войти</button>
                <a class="link" onclick="showRegister()">Нет аккаунта? Зарегистрироваться</a>
            </div>

            <div id="registerForm" style="display: none;">
                <input type="text" id="regUsername" class="input-field" placeholder="Имя пользователя">
                <input type="password" id="regPassword" class="input-field" placeholder="Пароль (мин. 4 символа)">
                <input type="password" id="regConfirm" class="input-field" placeholder="Подтвердите пароль">
                <button id="registerBtn" class="btn">📝 Зарегистрироваться</button>
                <a class="link" onclick="showLogin()">Уже есть аккаунт? Войти</a>
            </div>

            <div id="loginMsg" class="error-msg"></div>
            
            <div class="file-warning" style="margin-top: 15px;">
                ⚡ Proxy версия: фото/видео отображаются как текст
            </div>
        </div>

        <!-- Chat Screen -->
        <div id="chatScreen" class="glass-card chat-box hidden">
            <div class="chat-header">
                <div class="header-left">
                    <div class="logo-small">
                        <span>💎</span>
                        <h2>RUMESSAGE</h2>
                    </div>
                    <div class="status">
                        <div class="status-dot"></div>
                        <span>Proxy Mode</span>
                    </div>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button id="adminPanelBtn" class="admin-btn hidden">👑 Admin</button>
                    <div class="user-info">
                        <span id="currentUserPrefix">👤</span>
                        <span id="currentUserName"></span>
                    </div>
                </div>
            </div>

            <div class="chat-layout">
                <div class="sidebar">
                    <div class="sidebar-header">
                        <span>👥 Участники</span>
                        <span id="userCount">0</span>
                    </div>
                    <div id="usersList" class="users-list"></div>
                </div>

                <div class="chat-main">
                    <div id="messagesArea" class="messages">
                        <div style="text-align: center; color: rgba(255,255,255,0.5); padding: 20px;">
                            💎 RUMESSAGE Proxy Version
                        </div>
                    </div>
                    <div id="typingIndicator" class="typing"></div>
                    <div class="input-area">
                        <textarea id="messageInput" class="msg-input" placeholder="Сообщение..." rows="1"></textarea>
                        <button id="sendBtn" class="send-btn">📤</button>
                    </div>
                    <div class="file-warning">
                        📷 Фото → [ФОТО] | 🎥 Видео → [ВИДЕО] | 📁 Файл → [ФАЙЛ]
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="/socket.io/socket.io.js"></script>
    <script>
        // RUMESSAGE Proxy Version - медиа отображаются как текст
        console.log('💎 RUMESSAGE Proxy Version загружен');

        let usersDB = JSON.parse(localStorage.getItem('rumessage_users') || '{}');
        
        if (!usersDB['Lilmopss_admin']) {
            usersDB['Lilmopss_admin'] = {
                password: 'admin123',
                role: 'admin',
                prefix: '👑'
            };
        }

        function saveUsers() {
            localStorage.setItem('rumessage_users', JSON.stringify(usersDB));
        }

        function showRegister() {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('registerForm').style.display = 'block';
            document.getElementById('loginMsg').innerHTML = '';
        }

        function showLogin() {
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('loginMsg').innerHTML = '';
        }

        window.showRegister = showRegister;
        window.showLogin = showLogin;

        document.addEventListener('DOMContentLoaded', () => {
            const socket = io({
                transports: ['polling', 'websocket'],
                reconnection: true
            });

            let currentUser = null;
            let currentUserData = null;
            let isAdmin = false;
            let isMaintenance = false;
            let typingTimeout = null;
            let allUsers = [];

            // DOM элементы
            const loginScreen = document.getElementById('loginScreen');
            const chatScreen = document.getElementById('chatScreen');
            const loginUsername = document.getElementById('loginUsername');
            const loginPassword = document.getElementById('loginPassword');
            const loginBtn = document.getElementById('loginBtn');
            const registerBtn = document.getElementById('registerBtn');
            const regUsername = document.getElementById('regUsername');
            const regPassword = document.getElementById('regPassword');
            const regConfirm = document.getElementById('regConfirm');
            const loginMsg = document.getElementById('loginMsg');
            const messagesArea = document.getElementById('messagesArea');
            const messageInput = document.getElementById('messageInput');
            const sendBtn = document.getElementById('sendBtn');
            const usersList = document.getElementById('usersList');
            const userCount = document.getElementById('userCount');
            const currentUserName = document.getElementById('currentUserName');
            const currentUserPrefix = document.getElementById('currentUserPrefix');
            const typingIndicator = document.getElementById('typingIndicator');
            const adminPanelBtn = document.getElementById('adminPanelBtn');

            function showError(msg) {
                loginMsg.innerHTML = msg;
                loginMsg.className = 'error-msg';
                setTimeout(() => loginMsg.innerHTML = '', 3000);
            }

            function showNotification(msg, isError = false) {
                const div = document.createElement('div');
                div.style.cssText = 'position:fixed;top:10px;left:50%;transform:translateX(-50%);z-index:9999;background:rgba(0,0,0,0.9);backdrop-filter:blur(10px);padding:8px 20px;border-radius:40px;color:white;font-size:12px;';
                div.innerHTML = `${isError ? '⚠️' : '✅'} ${msg}`;
                document.body.appendChild(div);
                setTimeout(() => div.remove(), 2000);
            }

            function getPrefix(role, customPrefix) {
                if (customPrefix) return customPrefix;
                if (role === 'admin') return '👑';
                if (role === 'moder') return '🛡️';
                if (role === 'vip') return '⭐';
                return '👤';
            }

            function getRoleBadge(role) {
                if (role === 'admin') return '<span style="background:#ff6b6b;padding:2px 6px;border-radius:10px;font-size:9px;">ADMIN</span>';
                if (role === 'moder') return '<span style="background:#4facfe;padding:2px 6px;border-radius:10px;font-size:9px;">MODER</span>';
                if (role === 'vip') return '<span style="background:#f093fb;padding:2px 6px;border-radius:10px;font-size:9px;">VIP</span>';
                return '';
            }

            // Функция для преобразования медиа в текст (для proxy версии)
            function convertMediaToText(message) {
                if (message.type === 'photo') {
                    return `📷 [ФОТО] ${message.name || 'изображение'}`;
                } else if (message.type === 'video') {
                    return `🎥 [ВИДЕО] ${message.name || 'видео'}`;
                } else if (message.type === 'file') {
                    return `📁 [ФАЙЛ] ${message.name || 'файл'}`;
                }
                return message.text;
            }

            function addMessage(msg) {
                const welcomeMsg = messagesArea.querySelector('.welcome-placeholder');
                if (welcomeMsg) welcomeMsg.remove();
                
                const userData = usersDB[msg.username] || { role: 'user', prefix: '👤' };
                const prefix = getPrefix(userData.role, userData.customPrefix);
                
                // Для proxy версии конвертируем медиа в текст
                let messageText = msg.text;
                if (msg.type === 'photo') {
                    messageText = `📷 [ФОТО] ${msg.name || 'изображение'}`;
                } else if (msg.type === 'video') {
                    messageText = `🎥 [ВИДЕО] ${msg.name || 'видео'}`;
                } else if (msg.type === 'file') {
                    messageText = `📁 [ФАЙЛ] ${msg.name || 'файл'}`;
                }
                
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${msg.username === currentUser ? 'own' : 'other'}`;
                const time = new Date(msg.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
                
                messageDiv.innerHTML = `
                    <div class="msg-header">
                        <span>${prefix}</span>
                        <span>${msg.username === currentUser ? 'Вы' : escapeHtml(msg.username)}</span>
                        ${getRoleBadge(userData.role)}
                    </div>
                    <div class="msg-bubble">${escapeHtml(messageText)}</div>
                    <div class="msg-time">${time}</div>
                `;
                messagesArea.appendChild(messageDiv);
                messagesArea.scrollTop = messagesArea.scrollHeight;
            }

            function addSystemMessage(text) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message system';
                messageDiv.innerHTML = `<div class="msg-text">📢 ${escapeHtml(text)}</div>`;
                messagesArea.appendChild(messageDiv);
                messagesArea.scrollTop = messagesArea.scrollHeight;
            }

            function updateUsersList(users) {
                allUsers = users;
                usersList.innerHTML = '';
                users.forEach(user => {
                    const userData = usersDB[user] || { role: 'user', prefix: '👤' };
                    const prefix = getPrefix(userData.role, userData.customPrefix);
                    const userDiv = document.createElement('div');
                    userDiv.className = 'user-item';
                    userDiv.innerHTML = `
                        <span>${prefix}</span>
                        <span>${escapeHtml(user)}</span>
                        ${userData.role === 'admin' ? '<span style="background:#ff6b6b;padding:2px 6px;border-radius:10px;font-size:9px;">ADMIN</span>' : ''}
                    `;
                    usersList.appendChild(userDiv);
                });
                userCount.textContent = users.length;
            }

            function escapeHtml(text) {
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            }

            function sendMessage() {
                if (isMaintenance && !isAdmin) {
                    showNotification('Чат на техобслуживании', true);
                    return;
                }
                const text = messageInput.value.trim();
                if (text && currentUser) {
                    socket.emit('send message', { text });
                    messageInput.value = '';
                    messageInput.style.height = 'auto';
                }
            }

            // Админ-функции
            window.kickUser = function(username) {
                if (isAdmin && username !== 'Lilmopss_admin' && confirm(`Выгнать ${username}?`)) {
                    socket.emit('admin kick user', { username });
                    showNotification(`${username} выгнан`);
                }
            };

            function clearChat() {
                if (isAdmin && confirm('Очистить чат?')) {
                    socket.emit('admin clear chat');
                    messagesArea.innerHTML = '';
                    addSystemMessage('Чат очищен администратором');
                }
            }

            function broadcastMessage() {
                if (isAdmin) {
                    const msg = prompt('Сообщение для всех:');
                    if (msg) socket.emit('admin broadcast', { message: msg });
                }
            }

            function toggleMaintenance() {
                if (isAdmin) {
                    const enabled = !isMaintenance;
                    const reason = enabled ? prompt('Причина техобслуживания:', 'Технические работы') : '';
                    socket.emit('admin toggle maintenance', { enabled, reason: reason || '' });
                }
            }

            function openAdminPanel() {
                if (!isAdmin) return;
                const usersListHtml = allUsers.filter(u => u !== 'Lilmopss_admin').map(user => `
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:8px;background:rgba(255,255,255,0.05);border-radius:8px;margin-bottom:5px;">
                        <span>${escapeHtml(user)}</span>
                        <button onclick="kickUser('${user}')" style="background:#ff6b6b;border:none;padding:4px 12px;border-radius:20px;color:white;cursor:pointer;">Выгнать</button>
                    </div>
                `).join('');
                
                const modalHtml = `
                    <div id="adminModal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);backdrop-filter:blur(10px);z-index:10000;display:flex;align-items:center;justify-content:center;">
                        <div style="background:rgba(20,20,40,0.95);border-radius:24px;width:90%;max-width:400px;max-height:80vh;overflow-y:auto;padding:20px;">
                            <div style="display:flex;justify-content:space-between;margin-bottom:15px;">
                                <h3 style="color:white;">👑 Admin Panel</h3>
                                <button onclick="this.closest('#adminModal').remove()" style="background:none;border:none;color:white;font-size:24px;cursor:pointer;">✕</button>
                            </div>
                            <div style="margin-bottom:15px;padding:10px;background:rgba(255,255,255,0.05);border-radius:12px;">
                                <p>👥 Онлайн: ${allUsers.length}</p>
                            </div>
                            <button onclick="toggleMaintenance();this.closest('#adminModal').remove()" style="width:100%;padding:10px;margin-bottom:10px;background:rgba(255,255,255,0.1);border:none;border-radius:12px;color:white;cursor:pointer;">🔧 Техобслуживание</button>
                            <button onclick="clearChat();this.closest('#adminModal').remove()" style="width:100%;padding:10px;margin-bottom:10px;background:rgba(255,107,107,0.2);border:none;border-radius:12px;color:white;cursor:pointer;">🗑️ Очистить чат</button>
                            <button onclick="broadcastMessage();this.closest('#adminModal').remove()" style="width:100%;padding:10px;margin-bottom:15px;background:rgba(255,255,255,0.1);border:none;border-radius:12px;color:white;cursor:pointer;">📢 Системное сообщение</button>
                            <div><h4 style="color:white;margin-bottom:10px;">👥 Пользователи</h4>${usersListHtml || '<p style="color:rgba(255,255,255,0.5);">Нет пользователей</p>'}</div>
                        </div>
                    </div>
                `;
                document.body.insertAdjacentHTML('beforeend', modalHtml);
            }

            // Регистрация
            registerBtn.addEventListener('click', () => {
                const username = regUsername.value.trim();
                const password = regPassword.value;
                const confirm = regConfirm.value;

                if (!username || !password) {
                    showError('Заполните все поля');
                    return;
                }
                if (password.length < 4) {
                    showError('Пароль минимум 4 символа');
                    return;
                }
                if (password !== confirm) {
                    showError('Пароли не совпадают');
                    return;
                }
                if (usersDB[username]) {
                    showError('Пользователь уже существует');
                    return;
                }

                usersDB[username] = {
                    password: password,
                    role: 'user',
                    customPrefix: '👤'
                };
                saveUsers();
                showNotification('Регистрация успешна!');
                showLogin();
                regUsername.value = '';
                regPassword.value = '';
                regConfirm.value = '';
            });

            // Вход
            loginBtn.addEventListener('click', () => {
                const username = loginUsername.value.trim();
                const password = loginPassword.value;

                if (!username || !password) {
                    showError('Введите имя и пароль');
                    return;
                }

                const user = usersDB[username];
                if (!user || user.password !== password) {
                    showError('Неверное имя или пароль');
                    return;
                }

                if (isMaintenance && user.role !== 'admin') {
                    showError('Чат на техобслуживании');
                    return;
                }

                currentUser = username;
                currentUserData = user;
                isAdmin = user.role === 'admin';
                
                socket.emit('set username', username);
            });

            loginUsername.addEventListener('keypress', e => e.key === 'Enter' && loginBtn.click());
            loginPassword.addEventListener('keypress', e => e.key === 'Enter' && loginBtn.click());

            // Socket события
            socket.on('connect', () => {
                console.log('✅ Подключено (Proxy)');
                if (currentUser) socket.emit('set username', currentUser);
            });

            socket.on('maintenance mode', (data) => {
                isMaintenance = data.enabled;
                if (data.enabled && currentUserData?.role !== 'admin') {
                    alert(`🔧 Чат на техобслуживании\n${data.reason || 'Технические работы'}`);
                    location.reload();
                }
            });

            socket.on('username set', (username) => {
                const prefix = getPrefix(currentUserData.role, currentUserData.customPrefix);
                currentUserPrefix.textContent = prefix;
                currentUserName.textContent = username;
                if (isAdmin) adminPanelBtn.classList.remove('hidden');
                loginScreen.classList.add('hidden');
                chatScreen.classList.remove('hidden');
                messageInput.focus();
            });

            socket.on('username taken', (msg) => showError(msg));
            socket.on('users list', (users) => updateUsersList(users));
            socket.on('new message', (msg) => addMessage(msg));
            socket.on('system message', (msg) => addSystemMessage(msg.text));
            socket.on('admin broadcast', (data) => addSystemMessage(data.message));
            socket.on('user kicked', (data) => {
                if (data.username === currentUser) {
                    alert('Вы были выгнаны!');
                    location.reload();
                }
            });

            socket.on('user typing', (data) => {
                if (data.isTyping && data.username !== currentUser && !isMaintenance) {
                    typingIndicator.innerHTML = `✍️ ${escapeHtml(data.username)} печатает...`;
                } else {
                    typingIndicator.innerHTML = '';
                }
            });

            // UI события
            sendBtn.addEventListener('click', sendMessage);
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
            messageInput.addEventListener('input', () => {
                if (!isMaintenance || isAdmin) {
                    socket.emit('typing', messageInput.value.trim().length > 0);
                    clearTimeout(typingTimeout);
                    typingTimeout = setTimeout(() => socket.emit('typing', false), 1000);
                }
                messageInput.style.height = 'auto';
                messageInput.style.height = Math.min(messageInput.scrollHeight, 80) + 'px';
            });

            adminPanelBtn.addEventListener('click', openAdminPanel);
            
            // Глобальные функции для админ-панели
            window.kickUser = kickUser;
            window.clearChat = clearChat;
            window.broadcastMessage = broadcastMessage;
            window.toggleMaintenance = toggleMaintenance;
        });
    </script>
</body>
</html>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
}

/* Анимированные жидкие фоны */
.liquid-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    overflow: hidden;
}

.liquid-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.6;
    animation: float 20s infinite ease-in-out;
}

.blob-1 {
    width: 500px;
    height: 500px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    top: -200px;
    left: -200px;
    animation-delay: 0s;
}

.blob-2 {
    width: 600px;
    height: 600px;
    background: linear-gradient(135deg, #f093fb, #f5576c);
    bottom: -250px;
    right: -200px;
    animation-delay: 5s;
}

.blob-3 {
    width: 400px;
    height: 400px;
    background: linear-gradient(135deg, #4facfe, #00f2fe);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: 2s;
}

@keyframes float {
    0%, 100% {
        transform: translate(0, 0) scale(1);
    }
    33% {
        transform: translate(30px, -50px) scale(1.1);
    }
    66% {
        transform: translate(-20px, 20px) scale(0.9);
    }
}

.container {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Glass Card Effect */
.glass-card {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(12px);
    border-radius: 32px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Экран входа */
.login-screen {
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    animation: fadeInUp 0.6s ease;
}

.login-card {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(20px);
    border-radius: 40px;
    padding: 48px 40px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 25px 45px rgba(0, 0, 0, 0.2);
}

.logo {
    margin-bottom: 32px;
}

.logo-icon {
    font-size: 64px;
    margin-bottom: 16px;
    animation: pulse 2s infinite;
}

.logo h1 {
    font-size: 36px;
    font-weight: 700;
    background: linear-gradient(135deg, #fff, #a8c0ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.5px;
}

.tagline {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    margin-top: 8px;
}

.input-group {
    position: relative;
    margin-bottom: 24px;
}

.input-group input {
    width: 100%;
    padding: 16px 20px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 60px;
    font-size: 16px;
    color: white;
    font-family: inherit;
    transition: all 0.3s ease;
}

.input-group input:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.15);
}

.input-group input::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

.input-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 60px;
    pointer-events: none;
    transition: box-shadow 0.3s ease;
}

.input-group input:focus + .input-glow {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.4);
}

.glass-button {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8));
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 60px;
    color: white;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.glass-button:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9));
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.button-icon {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
}

.glass-button:hover .button-icon {
    transform: translateX(4px);
}

.error-message {
    color: #ff6b6b;
    margin-top: 16px;
    font-size: 14px;
}

/* Чат интерфейс */
.chat-screen {
    width: 100%;
    height: 85vh;
    display: flex;
    flex-direction: column;
    animation: fadeIn 0.5s ease;
}

.glass-header {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(20px);
    border-radius: 28px;
    padding: 16px 24px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.header-left {
    display: flex;
    align-items: center;
    gap: 20px;
}

.logo-small {
    display: flex;
    align-items: center;
    gap: 10px;
}

.logo-icon-small {
    font-size: 28px;
}

.logo-small h2 {
    font-size: 20px;
    font-weight: 600;
    background: linear-gradient(135deg, #fff, #a8c0ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.status-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
}

.status-dot {
    width: 8px;
    height: 8px;
    background: #4ade80;
    border-radius: 50%;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.5;
        transform: scale(1.2);
    }
}

.glass-pill {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    padding: 8px 20px;
    border-radius: 60px;
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.user-avatar {
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 50%;
}

.chat-layout {
    display: flex;
    gap: 20px;
    flex: 1;
    min-height: 0;
}

.glass-sidebar {
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(15px);
    border-radius: 28px;
    width: 280px;
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(255, 255, 255, 0.15);
    overflow: hidden;
}

.sidebar-header {
    padding: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.sidebar-header h3 {
    color: white;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
}

.user-count-badge {
    background: rgba(255, 255, 255, 0.2);
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    color: white;
}

.users-list {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
}

.user-item {
    padding: 12px;
    margin-bottom: 8px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    color: white;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s ease;
    border: 1px solid transparent;
}

.user-item:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateX(4px);
}

.user-item::before {
    content: "●";
    color: #4ade80;
    font-size: 12px;
}

.chat-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(15px);
    border-radius: 28px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    overflow: hidden;
}

.messages {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
}

.welcome-message {
    text-align: center;
    padding: 40px;
    color: rgba(255, 255, 255, 0.7);
}

.welcome-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.welcome-message h3 {
    color: white;
    margin-bottom: 8px;
}

.message {
    margin-bottom: 20px;
    animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.message.system {
    text-align: center;
}

.message.system .message-text {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    display: inline-block;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
}

.message.own {
    display: flex;
    justify-content: flex-end;
}

.message.other {
    display: flex;
    justify-content: flex-start;
}

.message-header {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 5px;
    margin-left: 12px;
}

.message-text {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 10px 18px;
    border-radius: 20px;
    max-width: 70%;
    word-wrap: break-word;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.message.own .message-text {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.6), rgba(118, 75, 162, 0.6));
    border-color: rgba(255, 255, 255, 0.3);
}

.message-time {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.4);
    margin-top: 4px;
    margin-left: 12px;
}

.typing-indicator {
    padding: 12px 24px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    font-style: italic;
    min-height: 44px;
}

.glass-input-area {
    display: flex;
    gap: 12px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(15px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-input-area textarea {
    flex: 1;
    padding: 12px 18px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 24px;
    color: white;
    font-family: inherit;
    font-size: 14px;
    resize: none;
    transition: all 0.3s ease;
}

.glass-input-area textarea:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.15);
}

.glass-input-area textarea::placeholder {
    color: rgba(255, 255, 255, 0.4);
}

.send-button {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.send-button:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.send-button svg {
    color: white;
}

/* Скроллбар */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
}

/* Анимации */
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

/* Адаптивность */
@media (max-width: 768px) {
    .container {
        padding: 10px;
    }
    
    .chat-layout {
        flex-direction: column;
    }
    
    .glass-sidebar {
        width: 100%;
        max-height: 200px;
    }
    
    .message-text {
        max-width: 85%;
    }
    
    .glass-header {
        flex-direction: column;
        gap: 12px;
    }
    
    .header-left {
        width: 100%;
        justify-content: space-between;
    }
}
