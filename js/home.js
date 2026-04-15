/* ═══════════════════════════════════════════════════════
   home.js  主屏幕：APP 路由
═══════════════════════════════════════════════════════ */
'use strict';

const APP_NAMES = {
    chat: '聊天',
    worldbook: '世界书',
    voice: '心声',
    forum: '论坛',
    diary: '小芽日记',
    street: '街の声',
    candy: '糖果铺',
    music: '音乐',
    settings: '设置'
};

/* settings 已开发，其余后续追加 */
const DEVELOPED_APPS = ['settings'];

function openApp(appId) {
    if (appId === 'settings') {
        openSettingsApp();   /* 来自 settings.js */
        return;
    }
    if (DEVELOPED_APPS.includes(appId)) {
        return;
    }
    /* 未开发提示 */
    const overlay = document.getElementById('appOverlay');
    document.getElementById('overlayAppName').textContent = APP_NAMES[appId] || appId;
    overlay.style.animation = '';
    overlay.classList.remove('hidden');
    void overlay.offsetWidth;
    overlay.style.animation = 'slideUp 0.3s cubic-bezier(0.34,1.2,0.64,1)';
}

function closeApp() {
    const overlay = document.getElementById('appOverlay');
    overlay.style.animation = 'slideDown 0.22s ease forwards';
    setTimeout(() => {
        overlay.classList.add('hidden');
        overlay.style.animation = '';
    }, 220);
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeApp();
});
