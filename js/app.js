/**
 * app.js — 主入口（防崩溃版）
 */

/* ── 时钟 ── */
function updateClock() {
    const el = document.getElementById('statusTime');
    if (!el) return;
    const now = new Date();
    el.textContent =
        now.getHours().toString().padStart(2, '0') + ':' +
        now.getMinutes().toString().padStart(2, '0');
}

/* ── APP 弹窗 ── */
function openAppModal(appName) {
    const modal = document.getElementById('appModal');
    const titleEl = document.getElementById('modalTitle');
    const descEl = document.getElementById('modalDesc');
    const iconEl = document.getElementById('modalIcon');
    if (!modal) return;
    if (titleEl) titleEl.textContent = appName;
    if (descEl) descEl.textContent = '该模块正在开发中，敬请期待';
    if (iconEl) iconEl.innerHTML = '';
    modal.classList.add('open');
}

function closeAppModal() {
    const modal = document.getElementById('appModal');
    if (modal) modal.classList.remove('open');
}

/* ── 绑定所有 app / dock 点击 ── */
function bindAppClicks() {
    const items = document.querySelectorAll('.app-item, .dock-item');
    console.log('[MyPhone] 找到可点击元素：', items.length, '个');

    items.forEach(function (item) {
        item.addEventListener('click', function () {
            const appName = item.dataset.app;
            console.log('[MyPhone] 点击了：', appName);
            if (!appName) return;

            if (appName === '设置') {
                console.log('[MyPhone] 准备打开设置...');
                if (typeof Settings !== 'undefined' && Settings.openSettings) {
                    Settings.openSettings();
                } else {
                    console.error('[MyPhone] Settings 模块不存在！');
                    alert('Settings 模块加载失败，请检查 js/settings.js');
                }
                return;
            }

            openAppModal(appName);
        });
    });

    /* 弹窗关闭 */
    const closeBtn = document.getElementById('modalClose');
    if (closeBtn) closeBtn.addEventListener('click', closeAppModal);

    const modal = document.getElementById('appModal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeAppModal();
        });
    }
}

/* ── DOMContentLoaded ── */
document.addEventListener('DOMContentLoaded', function () {
    console.log('[MyPhone] DOMContentLoaded 触发');

    /* 初始化 Widgets —— 单独 try/catch，崩了不影响后续 */
    try {
        if (typeof Widgets !== 'undefined') {
            Widgets.init();
            console.log('[MyPhone] Widgets 初始化成功');
        } else {
            console.warn('[MyPhone] Widgets 模块未找到，跳过');
        }
    } catch (e) {
        console.error('[MyPhone] Widgets.init() 报错（已跳过）：', e);
    }

    // 初始化 Display
    try {
        if (typeof Display !== 'undefined') Display.init();
    } catch (e) { console.error('[MyPhone] Display.init() 报错：', e); }
    
    /* 初始化 Settings —— 单独 try/catch */
    try {
        if (typeof Settings !== 'undefined') {
            Settings.init();
            console.log('[MyPhone] Settings 初始化成功');
        } else {
            console.error('[MyPhone] Settings 模块未找到！请确认 settings.js 已正确引入');
        }
    } catch (e) {
        console.error('[MyPhone] Settings.init() 报错：', e);
    }

    /* 绑定点击 */
    try {
        bindAppClicks();
    } catch (e) {
        console.error('[MyPhone] bindAppClicks() 报错：', e);
    }

    /* 时钟 */
    updateClock();
    setInterval(updateClock, 10000);

    console.log('[MyPhone] 初始化流程完成');
});
