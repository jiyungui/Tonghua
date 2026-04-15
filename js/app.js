/**
 * app.js — 主逻辑入口
 * 时钟、APP 点击、弹窗、PWA 注册
 */

/* ===== 已开发 APP 列表（点击不弹"未开发"） ===== */
const DEVELOPED_APPS = new Set([
    // 目前留空，根据你的开发进度往这里加
    // 例如: 'settings', 'music'
]);

/* APP 中文名映射 */
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

/* ===== 时钟 ===== */
function updateTime() {
    const el = document.getElementById('statusTime');
    if (!el) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    el.textContent = `${h}:${m}`;
}

/* ===== 弹窗 ===== */
function showModal(appKey) {
    const overlay = document.getElementById('modalOverlay');
    const title = document.getElementById('modalTitle');
    title.textContent = `${APP_NAMES[appKey] || appKey} · 开发中`;
    overlay.classList.add('show');
}

function hideModal() {
    document.getElementById('modalOverlay').classList.remove('show');
}

/* ===== APP 点击处理 ===== */
function handleAppClick(appKey) {
    if (DEVELOPED_APPS.has(appKey)) {
        // 已开发：跳转到对应模块（后续路由）
        console.log('Open app:', appKey);
        // window.location.href = `apps/${appKey}/index.html`;
    } else {
        showModal(appKey);
    }
}

/* ===== 绑定所有 APP 和 Dock 点击 ===== */
function bindAppClicks() {
    // 主屏 APP
    document.querySelectorAll('.app-item[data-app]').forEach(el => {
        el.addEventListener('click', () => handleAppClick(el.dataset.app));
    });

    // Dock APP
    document.querySelectorAll('.dock-item[data-app]').forEach(el => {
        el.addEventListener('click', () => handleAppClick(el.dataset.app));
    });

    // 弹窗关闭
    document.getElementById('modalClose').addEventListener('click', hideModal);
    document.getElementById('modalOverlay').addEventListener('click', e => {
        if (e.target === e.currentTarget) hideModal();
    });
}

/* ===== PWA Service Worker 注册 ===== */
function registerSW() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js').catch(err => {
                console.warn('SW register failed:', err);
            });
        });
    }
}

/* ===== 防止系统双击缩放 ===== */
function preventDoubleTapZoom() {
    let last = 0;
    document.addEventListener('touchend', e => {
        const now = Date.now();
        if (now - last < 300) e.preventDefault();
        last = now;
    }, { passive: false });
}

/* ===== 入口 ===== */
document.addEventListener('DOMContentLoaded', () => {
    // 恢复持久化数据
    restoreWidgets();

    // 初始化小组件交互
    initWidgets();

    // 绑定 APP 点击
    bindAppClicks();

    // 时钟
    updateTime();
    setInterval(updateTime, 10000);

    // PWA
    registerSW();

    // 防双击缩放
    preventDoubleTapZoom();

    console.log('星星机 启动完成');
});
