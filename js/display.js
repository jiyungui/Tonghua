/**
 * display.js — 屏幕调整：色调滤镜 / 屏幕位置 / 状态栏隐藏
 */
const Display = (() => {

    const KEY_FILTER = 'display_filter';
    const KEY_OPACITY = 'display_filterOpacity';
    const KEY_OFFSET_X = 'display_offsetX';
    const KEY_OFFSET_Y = 'display_offsetY';
    const KEY_STATUSBAR = 'display_statusBarHidden';

    /* 各滤镜对应的 CSS 颜色 */
    const FILTER_COLORS = {
        none: null,
        vintage: 'rgba(160, 120, 60, VAL)',
        dopamine: 'rgba(255, 100, 180, VAL)',
        cream: 'rgba(245, 220, 160, VAL)',
        nightblue: 'rgba(20, 40, 100, VAL)',
        rosegold: 'rgba(220, 140, 120, VAL)',
        forest: 'rgba(60, 110, 50, VAL)',
        mono: 'rgba(80, 80, 80, VAL)',
    };

    let _dom = {};
    let _currentFilter = 'none';
    let _opacity = 30;

    function cacheDOM() {
        _dom = {
            displayScreen: document.getElementById('displayScreen'),
            displayBack: document.getElementById('displayBack'),
            filterGrid: document.getElementById('filterGrid'),
            filterOpacity: document.getElementById('filterOpacity'),
            filterOpacityVal: document.getElementById('filterOpacityVal'),
            screenOffsetX: document.getElementById('screenOffsetX'),
            screenOffsetXVal: document.getElementById('screenOffsetXVal'),
            screenOffsetY: document.getElementById('screenOffsetY'),
            screenOffsetYVal: document.getElementById('screenOffsetYVal'),
            screenResetPos: document.getElementById('screenResetPos'),
            toggleStatusBar: document.getElementById('toggleStatusBar'),
            statusBarToggle: document.getElementById('statusBarToggle'),
            screenFilter: document.getElementById('screenFilter'),
            phoneShell: document.getElementById('phoneShell'),
            statusBar: document.querySelector('.status-bar'),
        };
    }

    /* ── 滤镜应用 ── */
    function applyFilter(filterName, opacity) {
        const color = FILTER_COLORS[filterName];
        const el = _dom.screenFilter;
        if (!color) {
            el.style.opacity = '0';
            el.style.background = 'transparent';
        } else {
            const alpha = (opacity / 100).toFixed(2);
            el.style.background = color.replace('VAL', alpha);
            el.style.opacity = '1';
        }
    }

    /* ── 位置应用 ── */
    function applyPosition(x, y) {
        /* 用 padding 偏移内容区，模拟整体位移 */
        const shell = _dom.phoneShell;
        shell.style.transform = `translate(${x}px, ${y}px)`;
    }

    /* ── 状态栏隐藏 ── */
    function applyStatusBar(hidden) {
        const bar = _dom.statusBar;
        if (!bar) return;
        bar.style.display = hidden ? 'none' : '';
        const toggle = _dom.statusBarToggle;
        if (hidden) toggle.classList.add('on');
        else toggle.classList.remove('on');
    }

    /* ── 从 Storage 恢复设置 ── */
    function restore() {
        cacheDOM();
        _currentFilter = Storage.get(KEY_FILTER, 'none');
        _opacity = Storage.get(KEY_OPACITY, 30);
        const ox = Storage.get(KEY_OFFSET_X, 0);
        const oy = Storage.get(KEY_OFFSET_Y, 0);
        const sbHidden = Storage.get(KEY_STATUSBAR, false);

        applyFilter(_currentFilter, _opacity);
        applyPosition(ox, oy);
        applyStatusBar(sbHidden);
    }

    /* ── 打开屏幕调整页面 ── */
    function openDisplay() {
        /* 同步 UI 控件状态 */
        _dom.filterOpacity.value = _opacity;
        _dom.filterOpacityVal.textContent = _opacity + '%';

        const ox = Storage.get(KEY_OFFSET_X, 0);
        const oy = Storage.get(KEY_OFFSET_Y, 0);
        _dom.screenOffsetX.value = ox;
        _dom.screenOffsetXVal.textContent = ox + 'px';
        _dom.screenOffsetY.value = oy;
        _dom.screenOffsetYVal.textContent = oy + 'px';

        /* 高亮当前滤镜按钮 */
        _dom.filterGrid.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === _currentFilter);
        });

        /* 状态栏开关 */
        const sbHidden = Storage.get(KEY_STATUSBAR, false);
        applyStatusBar(sbHidden);

        _dom.displayScreen.classList.add('active');
    }

    function closeDisplay() {
        _dom.displayScreen.classList.remove('active');
    }

    /* ── 初始化（绑事件）── */
    function init() {
        restore();

        /* 滤镜按钮 */
        _dom.filterGrid.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                _currentFilter = btn.dataset.filter;
                _dom.filterGrid.querySelectorAll('.filter-btn')
                    .forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                applyFilter(_currentFilter, _opacity);
                Storage.set(KEY_FILTER, _currentFilter);
            });
        });

        /* 滤镜强度 */
        _dom.filterOpacity.addEventListener('input', () => {
            _opacity = parseInt(_dom.filterOpacity.value);
            _dom.filterOpacityVal.textContent = _opacity + '%';
            applyFilter(_currentFilter, _opacity);
            Storage.set(KEY_OPACITY, _opacity);
        });

        /* 上下偏移 */
        _dom.screenOffsetY.addEventListener('input', () => {
            const v = parseInt(_dom.screenOffsetY.value);
            _dom.screenOffsetYVal.textContent = v + 'px';
            const x = parseInt(_dom.screenOffsetX.value);
            applyPosition(x, v);
            Storage.set(KEY_OFFSET_Y, v);
        });

        /* 左右偏移 */
        _dom.screenOffsetX.addEventListener('input', () => {
            const v = parseInt(_dom.screenOffsetX.value);
            _dom.screenOffsetXVal.textContent = v + 'px';
            const y = parseInt(_dom.screenOffsetY.value);
            applyPosition(v, y);
            Storage.set(KEY_OFFSET_X, v);
        });

        /* 重置位置 */
        _dom.screenResetPos.addEventListener('click', () => {
            _dom.screenOffsetX.value = 0;
            _dom.screenOffsetY.value = 0;
            _dom.screenOffsetXVal.textContent = '0px';
            _dom.screenOffsetYVal.textContent = '0px';
            applyPosition(0, 0);
            Storage.set(KEY_OFFSET_X, 0);
            Storage.set(KEY_OFFSET_Y, 0);
        });

        /* 状态栏开关 */
        _dom.toggleStatusBar.addEventListener('click', () => {
            const hidden = !Storage.get(KEY_STATUSBAR, false);
            Storage.set(KEY_STATUSBAR, hidden);
            applyStatusBar(hidden);
        });

        /* 返回按钮 */
        _dom.displayBack.addEventListener('click', closeDisplay);
    }

    return { init, openDisplay };
})();
