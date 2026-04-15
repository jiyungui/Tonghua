/* ═══════════════════════════════════════════════════════
   settings.js  设置APP完整逻辑
   · API配置 + 模型管理
   · MiniMax语音配置
   · 屏幕调整 / 壁纸 / 图标 / 字体 / 数据管理
   · 全部持久化到 localStorage / IndexedDB
═══════════════════════════════════════════════════════ */
'use strict';

/* ════════════════════════════════
   设置专用存储（独立key空间）
════════════════════════════════ */
const SettingStore = {
    prefix: 'xxj_set_',
    set(k, v) { try { localStorage.setItem(this.prefix + k, JSON.stringify(v)); } catch (e) { } },
    get(k, fb) {
        try {
            const v = localStorage.getItem(this.prefix + k);
            return v === null ? fb : JSON.parse(v);
        } catch { return fb; }
    },
    remove(k) { try { localStorage.removeItem(this.prefix + k); } catch { } }
};

/* ════════════════════════════════
   页面导航
════════════════════════════════ */
function openSettingsApp() {
    const el = document.getElementById('settingsApp');
    el.classList.remove('hidden');
    el.style.animation = '';
    void el.offsetWidth;
    el.style.animation = 'saSlideIn 0.3s cubic-bezier(0.34,1.1,0.64,1)';
    saShowPage('saHome');
    loadSettingsState();
}

function closeSettingsApp() {
    const el = document.getElementById('settingsApp');
    el.style.animation = 'saSlideOut 0.22s ease forwards';
    setTimeout(() => {
        el.classList.add('hidden');
        el.style.animation = '';
    }, 220);
}

function saNav(pageId) {
    saShowPage(pageId);
}

function saBack(pageId) {
    saShowPage(pageId);
}

function saShowPage(pageId) {
    document.querySelectorAll('#settingsApp .sa-page').forEach(p => {
        p.classList.add('hidden');
    });
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.remove('hidden');
        target.style.animation = '';
        void target.offsetWidth;
        target.style.animation = 'saPageIn 0.22s cubic-bezier(0.34,1.1,0.64,1)';
    }
}

/* ════════════════════════════════
   加载已保存设置到界面
════════════════════════════════ */
function loadSettingsState() {
    /* API字段 */
    _setVal('apiName', SettingStore.get('apiName', ''));
    _setVal('apiUrl', SettingStore.get('apiUrl', ''));
    _setVal('apiKey', SettingStore.get('apiKey', ''));

    /* MiniMax */
    _setVal('minimaxKey', SettingStore.get('minimaxKey', ''));
    _setVal('minimaxGroupId', SettingStore.get('minimaxGroupId', ''));
    _setVal('minimaxVoice', SettingStore.get('minimaxVoice', ''));
    const speed = SettingStore.get('minimaxSpeed', 1.0);
    _setVal('minimaxSpeed', speed);
    const speedEl = document.getElementById('minimaxSpeedVal');
    if (speedEl) speedEl.textContent = parseFloat(speed).toFixed(1);

    /* 渲染模型列表 */
    renderSavedModels();

    /* 存储用量 */
    calcStorage();

    /* 壁纸 */
    const wpColor = SettingStore.get('wpColor', null);
    if (wpColor) applyColorWallpaper(wpColor, false);

    /* 字体 */
    const font = SettingStore.get('font', 'system');
    applyFontToPage(font, false);
    _setActive('fontList', '.sa-font-item', `[data-font="${font}"]`);

    /* 图标风格 */
    const iconStyle = SettingStore.get('iconStyle', 'default');
    applyIconStyleToPage(iconStyle, false);
    _setActive('iconStyleList', '.sa-icon-style-item', `[data-style="${iconStyle}"]`);

    /* 图标背景 */
    const iconBg = SettingStore.get('iconBg', 'glass');
    applyIconBgToPage(iconBg, false);
    _setActive(null, '.sa-icon-bg-item', `[data-bg="${iconBg}"]`);

    /* 屏幕 */
    const scale = SettingStore.get('scale', 100);
    const brightness = SettingStore.get('brightness', 100);
    const gap = SettingStore.get('gridGap', 16);
    _setVal('scaleRange', scale);
    document.getElementById('scaleVal') && (document.getElementById('scaleVal').textContent = scale + '%');
    _setVal('brightnessRange', brightness);
    document.getElementById('brightnessVal') && (document.getElementById('brightnessVal').textContent = brightness + '%');
    _setVal('gridGapRange', gap);
    document.getElementById('gridGapVal') && (document.getElementById('gridGapVal').textContent = gap + 'px');
    applyScaleToPage(scale, false);
    applyBrightnessToPage(brightness, false);
    applyGridGapToPage(gap, false);

    /* 屏幕调整扩展 */
    const filter = SettingStore.get('screenFilter', 'none');
    _setActive(null, '.sc-filter-item', `[data-filter="${filter}"]`);
    applyFilterToPage(filter, false);

    const nightMode = SettingStore.get('nightMode', false);
    const el_nm = document.getElementById('nightModeToggle');
    if (el_nm) el_nm.checked = nightMode;
    applyNightMode(nightMode, false);

    const eyeCare = SettingStore.get('eyeCare', false);
    const el_ec = document.getElementById('eyeCareToggle');
    if (el_ec) el_ec.checked = eyeCare;
    applyEyeCare(eyeCare, false);

    const hideStatus = SettingStore.get('hideStatusBar', false);
    const el_hs = document.getElementById('hideStatusBar');
    if (el_hs) el_hs.checked = hideStatus;
    toggleStatusBar(hideStatus);

    const hideDI = SettingStore.get('hideDynamicIsland', false);
    const el_hdi = document.getElementById('hideDynamicIsland');
    if (el_hdi) el_hdi.checked = hideDI;
    toggleDynamicIsland(hideDI);

    const topWidget = SettingStore.get('topWidget', 'info');
    _setActive(null, '.sc-widget-opt', `[data-widget="${topWidget}"]`);
    applyTopWidget(topWidget, false);

    const tz = SettingStore.get('timezone', 'local');
    _setActive('tzGrid', '.sc-tz-item', `[data-tz="${tz}"]`);

    _setVal('weatherCity', SettingStore.get('weatherCity', ''));
    _setVal('weatherApiKey', SettingStore.get('weatherApiKey', ''));

    const pos = SettingStore.get('screenPos', { x: 0, y: 0 });
    _applyScreenPos(pos, false);

    _updateTzTimes();
    _startTzTimer();

    /* 字号 */
    const fontSize = SettingStore.get('fontSize', 100);
    _setVal('fontSizeRange', fontSize);
    document.getElementById('fontSizeVal') && (document.getElementById('fontSizeVal').textContent = fontSize + '%');
    applyFontSizeToPage(fontSize, false);
}

function _setVal(id, val) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.tagName === 'SELECT' || el.tagName === 'INPUT') el.value = val;
}

function _setActive(containerId, itemSelector, targetSelector) {
    const container = containerId ? document.getElementById(containerId) : document;
    if (!container) return;
    container.querySelectorAll(itemSelector).forEach(el => el.classList.remove('active'));
    const target = container.querySelector(targetSelector);
    if (target) target.classList.add('active');
}

/* ════════════════════════════════
   API 设置
════════════════════════════════ */
function toggleApiKeyVisible() {
    const input = document.getElementById('apiKey');
    const icon = document.getElementById('eyeIcon');
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        icon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
    } else {
        input.type = 'password';
        icon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
    }
}

function toggleMinimaxKeyVisible() {
    const input = document.getElementById('minimaxKey');
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
}

/* 拉取模型列表 */
async function fetchModels() {
    const url = document.getElementById('apiUrl').value.trim();
    const key = document.getElementById('apiKey').value.trim();
    const btn = document.getElementById('fetchModelsBtn');

    if (!url || !key) {
        saToast('请先填写 API URL 和 API Key');
        return;
    }

    btn.textContent = '拉取中…';
    btn.disabled = true;

    try {
        /* 尝试标准 OpenAI /models 接口 */
        const modelsUrl = url.replace(/\/$/, '') + '/models';
        const res = await fetch(modelsUrl, {
            headers: { 'Authorization': 'Bearer ' + key }
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const models = (data.data || data.models || [])
            .map(m => m.id || m.name || m)
            .filter(Boolean)
            .sort();

        if (!models.length) throw new Error('未获取到模型');

        const select = document.getElementById('modelSelect');
        select.innerHTML = models.map(m =>
            `<option value="${m}">${m}</option>`
        ).join('');

        saToast(`已拉取 ${models.length} 个模型`);
    } catch (err) {
        saToast('拉取失败：' + err.message, 'error');
        /* 失败时提供手动输入fallback */
        const select = document.getElementById('modelSelect');
        if (select.options.length <= 1) {
            select.innerHTML = '<option value="">— 拉取失败，请手动输入 —</option>';
        }
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15"/></svg>拉取模型`;
    }
}

/* 测试模型 */
async function testModel() {
    const url = document.getElementById('apiUrl').value.trim();
    const key = document.getElementById('apiKey').value.trim();
    const model = document.getElementById('modelSelect').value;
    const resultEl = document.getElementById('testResult');

    if (!url || !key || !model) {
        saToast('请填写完整配置并选择模型');
        return;
    }

    resultEl.className = 'sa-test-result';
    resultEl.textContent = '测试中…';
    resultEl.classList.remove('hidden');

    try {
        const chatUrl = url.replace(/\/$/, '') + '/chat/completions';
        const res = await fetch(chatUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + key
            },
            body: JSON.stringify({
                model,
                messages: [{ role: 'user', content: 'Hi, reply with one word: OK' }],
                max_tokens: 10
            })
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error?.message || `HTTP ${res.status}`);
        }

        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content || '（无回复）';
        resultEl.className = 'sa-test-result success';
        resultEl.textContent = `✓ 测试通过  模型回复：${reply.trim()}`;
    } catch (err) {
        resultEl.className = 'sa-test-result error';
        resultEl.textContent = `✗ 测试失败：${err.message}`;
    }
}

/* 保存模型 */
function saveModel() {
    const name = document.getElementById('apiName').value.trim();
    const url = document.getElementById('apiUrl').value.trim();
    const key = document.getElementById('apiKey').value.trim();
    const model = document.getElementById('modelSelect').value;

    if (!name || !url || !key || !model) {
        saToast('请填写 API名称、URL、Key 并选择模型');
        return;
    }

    /* 同时保存当前配置的快照 */
    SettingStore.set('apiName', name);
    SettingStore.set('apiUrl', url);
    SettingStore.set('apiKey', key);

    const list = SettingStore.get('modelList', []);
    const id = Date.now().toString(36);

    /* 避免同名同模型重复 */
    const dup = list.find(m => m.name === name && m.model === model);
    if (dup) { saToast('该配置已存在'); return; }

    list.push({ id, name, url, key, model, createdAt: Date.now() });
    SettingStore.set('modelList', list);

    /* 自动激活刚保存的模型 */
    SettingStore.set('activeModelId', id);

    renderSavedModels();
    saToast('模型已保存并激活');
}

/* 渲染模型列表 */
function renderSavedModels() {
    const list = SettingStore.get('modelList', []);
    const activeId = SettingStore.get('activeModelId', null);
    const container = document.getElementById('savedModelList');
    const badge = document.getElementById('modelCountBadge');
    if (!container) return;

    if (badge) badge.textContent = list.length;

    if (!list.length) {
        container.innerHTML = '<div class="sa-empty-tip">暂无保存的模型</div>';
        return;
    }

    container.innerHTML = list.map(m => `
    <div class="sa-model-card ${m.id === activeId ? 'active' : ''}"
         onclick="activateModel('${m.id}')">
      <div class="sa-model-dot"></div>
      <div class="sa-model-info">
        <div class="sa-model-name">${_escHtml(m.name)}</div>
        <div class="sa-model-sub">${_escHtml(m.model)} · ${_escHtml(_shortUrl(m.url))}</div>
      </div>
      <button class="sa-model-del" onclick="deleteModel(event,'${m.id}')" title="删除">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
          <path d="M10 11v6M14 11v6"/>
        </svg>
      </button>
    </div>
  `).join('');
}

/* 激活模型（加载到输入框） */
function activateModel(id) {
    const list = SettingStore.get('modelList', []);
    const m = list.find(x => x.id === id);
    if (!m) return;

    SettingStore.set('activeModelId', id);
    _setVal('apiName', m.name);
    _setVal('apiUrl', m.url);
    _setVal('apiKey', m.key);

    /* 把模型填入select */
    const select = document.getElementById('modelSelect');
    let opt = Array.from(select.options).find(o => o.value === m.model);
    if (!opt) {
        opt = new Option(m.model, m.model);
        select.add(opt);
    }
    select.value = m.model;

    renderSavedModels();
    saToast(`已切换到：${m.name} / ${m.model}`);
}

/* 删除模型 */
function deleteModel(e, id) {
    e.stopPropagation();
    if (!confirm('确认删除此模型配置？')) return;
    let list = SettingStore.get('modelList', []);
    list = list.filter(m => m.id !== id);
    SettingStore.set('modelList', list);
    const activeId = SettingStore.get('activeModelId', null);
    if (activeId === id) SettingStore.remove('activeModelId');
    renderSavedModels();
}

/* ── MiniMax 语音配置 ── */
function saveMinimaxConfig() {
    SettingStore.set('minimaxKey', document.getElementById('minimaxKey').value.trim());
    SettingStore.set('minimaxGroupId', document.getElementById('minimaxGroupId').value.trim());
    SettingStore.set('minimaxVoice', document.getElementById('minimaxVoice').value.trim());
    SettingStore.set('minimaxSpeed', document.getElementById('minimaxSpeed').value);
    saToast('语音配置已保存');
}

/* 对外接口：获取当前激活模型（供聊天等APP调用） */
function getActiveModel() {
    const list = SettingStore.get('modelList', []);
    const activeId = SettingStore.get('activeModelId', null);
    return list.find(m => m.id === activeId) || null;
}

function getMinimaxConfig() {
    return {
        key: SettingStore.get('minimaxKey', ''),
        groupId: SettingStore.get('minimaxGroupId', ''),
        voice: SettingStore.get('minimaxVoice', ''),
        speed: parseFloat(SettingStore.get('minimaxSpeed', 1.0))
    };
}

/* ════════════════════════════════
   MiniMax 试听
════════════════════════════════ */
let _previewAudioUrl = null;

async function previewMinimaxVoice() {
    const cfg = getMinimaxConfig();
    const text = document.getElementById('minimaxPreviewText').value.trim();

    if (!cfg.key) { saToast('请先填写并保存 MiniMax API Key', 'error'); return; }
    if (!cfg.groupId) { saToast('请先填写并保存 Group ID', 'error'); return; }
    if (!cfg.voice) { saToast('请先填写并保存 Voice ID', 'error'); return; }
    if (!text) { saToast('请输入试听文字', 'error'); return; }

    const playBtn = document.getElementById('previewPlayBtn');
    const stopBtn = document.getElementById('previewStopBtn');
    const statusEl = document.getElementById('previewStatus');

    /* UI：加载中 */
    playBtn.disabled = true;
    playBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16v.5"/></svg>合成中…`;
    statusEl.className = 'sa-voice-preview-status loading';
    statusEl.textContent = '正在合成语音，请稍候…';
    statusEl.classList.remove('hidden');
    stopBtn.style.display = 'none';

    try {
        const apiUrl = `https://api.minimax.chat/v1/text_to_speech?GroupId=${cfg.groupId}`;
        const body = {
            model: 'speech-01',
            text: text,
            voice_id: cfg.voice,
            speed: cfg.speed,
            vol: 1.0,
            pitch: 0
        };

        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cfg.key}`
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.base_resp?.status_msg || `HTTP ${res.status}`);
        }

        /* 释放旧的 Blob URL */
        if (_previewAudioUrl) {
            URL.revokeObjectURL(_previewAudioUrl);
            _previewAudioUrl = null;
        }

        const blob = await res.blob();
        _previewAudioUrl = URL.createObjectURL(blob);

        const audio = document.getElementById('minimaxPreviewAudio');
        audio.src = _previewAudioUrl;
        audio.play();

        /* UI：播放中 */
        statusEl.className = 'sa-voice-preview-status';
        statusEl.textContent = '▶ 正在播放…';
        stopBtn.style.display = '';
        playBtn.disabled = false;
        playBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><polygon points="5 3 19 12 5 21 5 3"/></svg>试听`;

        audio.onended = () => {
            stopBtn.style.display = 'none';
            statusEl.textContent = '✓ 播放完毕';
        };

    } catch (err) {
        statusEl.className = 'sa-voice-preview-status error';
        statusEl.textContent = `✗ 合成失败：${err.message}`;
        playBtn.disabled = false;
        playBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><polygon points="5 3 19 12 5 21 5 3"/></svg>试听`;
    }
}

function stopMinimaxPreview() {
    const audio = document.getElementById('minimaxPreviewAudio');
    const stopBtn = document.getElementById('previewStopBtn');
    const statusEl = document.getElementById('previewStatus');
    if (audio) { audio.pause(); audio.currentTime = 0; }
    stopBtn.style.display = 'none';
    if (statusEl) statusEl.textContent = '已停止';
}

/* ════════════════════════════════
   壁纸更换
════════════════════════════════ */
let _wpPendingDataUrl = null;

function handleWallpaperUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        _wpPendingDataUrl = e.target.result;
        const preview = document.getElementById('wpPreview');
        const previewImg = document.getElementById('wpPreviewImg');
        if (preview && previewImg) {
            previewImg.src = _wpPendingDataUrl;
            preview.classList.remove('hidden');
        }
    };
    reader.readAsDataURL(file);
    event.target.value = '';
}

function applyWallpaper() {
    if (!_wpPendingDataUrl) { saToast('请先选择图片'); return; }
    const layer = document.getElementById('wallpaperLayer');
    if (layer) {
        layer.style.backgroundImage = `url(${_wpPendingDataUrl})`;
        layer.style.backgroundSize = 'cover';
        layer.style.backgroundPosition = 'center';
        layer.style.backgroundColor = 'transparent';
    }
    /* 存 IndexedDB */
    if (typeof ImgDB !== 'undefined') {
        ImgDB.set('wallpaper', _wpPendingDataUrl).catch(() => { });
    }
    SettingStore.remove('wpColor');
    saToast('壁纸已设置');
}

function applyColorWallpaper(color, save = true) {
    const layer = document.getElementById('wallpaperLayer');
    if (layer) {
        layer.style.backgroundImage = 'none';
        layer.style.backgroundColor = color;
    }
    if (save) {
        SettingStore.set('wpColor', color);
        if (typeof ImgDB !== 'undefined') ImgDB.remove('wallpaper').catch(() => { });
        saToast('颜色壁纸已设置');
    }
}

function resetWallpaper() {
    applyColorWallpaper('#dfdfdd');
    _wpPendingDataUrl = null;
    const preview = document.getElementById('wpPreview');
    if (preview) preview.classList.add('hidden');
    if (typeof ImgDB !== 'undefined') ImgDB.remove('wallpaper').catch(() => { });
}

/* ════════════════════════════════
   屏幕调整 — 完整版
════════════════════════════════ */

/* ── 亮度 / 缩放 / 间距（合并保存） ── */
function previewScale(val) {
    document.getElementById('scaleVal').textContent = val + '%';
    applyScaleToPage(val, false);
}
function previewBrightness(val) {
    document.getElementById('brightnessVal').textContent = val + '%';
    applyBrightnessToPage(val, false);
}
function previewGridGap(val) {
    document.getElementById('gridGapVal').textContent = val + 'px';
    applyGridGapToPage(val, false);
}

function applyDisplaySettings() {
    const scale = document.getElementById('scaleRange').value;
    const brightness = document.getElementById('brightnessRange').value;
    const gap = document.getElementById('gridGapRange').value;
    applyScaleToPage(scale, true);
    applyBrightnessToPage(brightness, true);
    applyGridGapToPage(gap, true);
    saToast('显示设置已保存');
}

function applyScaleToPage(val, save) {
    const screen = document.getElementById('homeScreen');
    if (screen) screen.style.zoom = (val / 100);
    if (save) SettingStore.set('scale', parseInt(val));
}

function applyBrightnessToPage(val, save) {
    _rebuildScreenFilter();
    if (save) SettingStore.set('brightness', parseInt(val));
}

function applyGridGapToPage(val, save) {
    const grid = document.getElementById('appsGrid');
    if (grid) grid.style.gap = `${val}px ${Math.max(4, val - 8)}px`;
    if (save) SettingStore.set('gridGap', parseInt(val));
}

/* ── 色调滤镜 ── */
const FILTER_PRESETS = {
    none: '',
    retro: 'sepia(0.45) contrast(1.05) brightness(0.97)',
    dopamine: 'saturate(1.8) brightness(1.05) hue-rotate(10deg)',
    cream: 'sepia(0.2) brightness(1.04) saturate(0.85)',
    cool: 'hue-rotate(20deg) saturate(1.1) brightness(0.98)',
    warm: 'sepia(0.15) hue-rotate(-15deg) saturate(1.2) brightness(1.02)',
    ink: 'grayscale(0.6) contrast(1.15) brightness(0.95)',
    sakura: 'hue-rotate(-20deg) saturate(1.3) brightness(1.06)'
};

function selectFilter(filter) {
    _setActive(null, '.sc-filter-item', `[data-filter="${filter}"]`);
    applyFilterToPage(filter, true);
    saToast('滤镜已应用');
}

function applyFilterToPage(filter, save) {
    SettingStore.set('_tmpFilter', filter); // 临时写入供 _rebuildScreenFilter 读取
    _rebuildScreenFilter();
    if (save) SettingStore.set('screenFilter', filter);
}

/* 统一重建 filter（亮度 + 色调 + 护眼叠加） */
function _rebuildScreenFilter() {
    const screen = document.getElementById('phoneScreen');
    if (!screen) return;

    const brightness = SettingStore.get('brightness', 100);
    const filter = SettingStore.get('_tmpFilter', null) || SettingStore.get('screenFilter', 'none');
    const eyeCare = SettingStore.get('eyeCare', false);
    const nightMode = SettingStore.get('nightMode', false);

    let parts = [];
    if (brightness !== 100) parts.push(`brightness(${brightness / 100})`);
    if (filter && filter !== 'none' && FILTER_PRESETS[filter]) parts.push(FILTER_PRESETS[filter]);
    if (eyeCare) parts.push('sepia(0.25) brightness(0.96) saturate(0.9)');
    if (nightMode) parts.push('brightness(0.55) saturate(0.7)');

    screen.style.filter = parts.join(' ') || 'none';
}

/* ── 夜间 & 护眼 ── */
function toggleNightMode(on) {
    SettingStore.set('nightMode', on);
    applyNightMode(on, true);
}

function applyNightMode(on, save) {
    const screen = document.getElementById('phoneScreen');
    if (!screen) return;
    if (on) {
        screen.classList.add('night-mode');
    } else {
        screen.classList.remove('night-mode');
    }
    _rebuildScreenFilter();
    if (save) SettingStore.set('nightMode', on);
}

function toggleEyeCare(on) {
    SettingStore.set('eyeCare', on);
    applyEyeCare(on, true);
}

function applyEyeCare(on, save) {
    _rebuildScreenFilter();
    if (save) SettingStore.set('eyeCare', on);
}

/* ── 状态栏 & 灵动岛 ── */
function toggleStatusBar(hide) {
    const el = document.getElementById('phoneScreen') &&
        document.querySelector('.status-bar');
    if (el) el.style.display = hide ? 'none' : '';
    SettingStore.set('hideStatusBar', hide);
}

function toggleDynamicIsland(hide) {
    const el = document.querySelector('.dynamic-island');
    if (el) el.style.display = hide ? 'none' : '';
    SettingStore.set('hideDynamicIsland', hide);
}

/* ── 屏幕位置 ── */
let _screenPos = { x: 0, y: 0 };

function nudgeScreen(dir) {
    const step = parseInt(document.getElementById('nudgeStepRange')?.value || 4);
    if (dir === 'up') _screenPos.y -= step;
    if (dir === 'down') _screenPos.y += step;
    if (dir === 'left') _screenPos.x -= step;
    if (dir === 'right') _screenPos.x += step;
    _applyScreenPos(_screenPos, true);
}

function resetScreenPosition() {
    _screenPos = { x: 0, y: 0 };
    _applyScreenPos(_screenPos, true);
    saToast('位置已重置');
}

function _applyScreenPos(pos, save) {
    _screenPos = { ...pos };
    const shell = document.getElementById('phoneShell');
    if (shell) shell.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    const info = document.getElementById('screenPosInfo');
    if (info) info.textContent = `偏移：X ${pos.x >= 0 ? '+' : ''}${pos.x}px  Y ${pos.y >= 0 ? '+' : ''}${pos.y}px`;
    if (save) SettingStore.set('screenPos', { x: pos.x, y: pos.y });
}

/* ── 顶部小组件切换 ── */
function selectTopWidget(type) {
    _setActive(null, '.sc-widget-opt', `[data-widget="${type}"]`);
    applyTopWidget(type, true);
    saToast(type === 'clock' ? '已切换为时钟小组件' : '已切换为个人信息卡');
}

function applyTopWidget(type, save) {
    const infoWidget = document.getElementById('topWidget');
    const clockWidget = document.getElementById('clockWidget');
    if (type === 'clock') {
        if (infoWidget) infoWidget.classList.add('hidden');
        if (clockWidget) { clockWidget.classList.remove('hidden'); _startClockWidget(); }
    } else {
        if (infoWidget) infoWidget.classList.remove('hidden');
        if (clockWidget) clockWidget.classList.add('hidden');
    }
    if (save) SettingStore.set('topWidget', type);
}

/* ── 时钟小组件逻辑 ── */
let _clockTimer = null;
let _weatherCache = null;

function _startClockWidget() {
    _updateClockWidget();
    if (_clockTimer) clearInterval(_clockTimer);
    _clockTimer = setInterval(_updateClockWidget, 10000);
    _fetchWeather();
}

function _updateClockWidget() {
    const tz = SettingStore.get('timezone', 'local');
    const cwTime = document.getElementById('cwTime');
    const cwDate = document.getElementById('cwDate');

    if (!cwTime) return;

    const now = new Date();
    let timeStr, dateStr;

    if (tz === 'local') {
        timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
        dateStr = now.toLocaleDateString('zh-CN', { weekday: 'short', month: 'long', day: 'numeric' });
    } else {
        timeStr = new Intl.DateTimeFormat('zh-CN', {
            hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz
        }).format(now);
        dateStr = new Intl.DateTimeFormat('zh-CN', {
            weekday: 'short', month: 'long', day: 'numeric', timeZone: tz
        }).format(now);
    }

    cwTime.textContent = timeStr;
    cwDate.textContent = dateStr;

    /* 地理位置（只获取一次） */
    _getLocationName();
}

let _locationFetched = false;
function _getLocationName() {
    if (_locationFetched) return;
    _locationFetched = true;
    if (!navigator.geolocation) {
        _setTextContent('cwLocationText', '未知位置');
        return;
    }
    navigator.geolocation.getCurrentPosition(
        pos => {
            const { latitude, longitude } = pos.coords;
            /* 使用 BigDataCloud 免费逆地理编码 */
            fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=zh`)
                .then(r => r.json())
                .then(d => {
                    const city = d.city || d.locality || d.countryName || '未知';
                    _setTextContent('cwLocationText', city);
                })
                .catch(() => _setTextContent('cwLocationText', '位置未知'));
        },
        () => _setTextContent('cwLocationText', '未授权定位')
    );
}

async function _fetchWeather() {
    const city = SettingStore.get('weatherCity', '');
    const apiKey = SettingStore.get('weatherApiKey', '');
    if (!city || !apiKey) {
        _setTextContent('cwWeatherText', '— °C');
        return;
    }
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=zh_cn`;
        const res = await fetch(url);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const temp = Math.round(data.main.temp);
        const desc = data.weather?.[0]?.description || '';
        _setTextContent('cwWeatherText', `${temp}°C ${desc}`);
    } catch {
        _setTextContent('cwWeatherText', '天气获取失败');
    }
}

function saveClockWidgetConfig() {
    const tz = document.querySelector('#tzGrid .sc-tz-item.active')?.dataset.tz || 'local';
    const city = document.getElementById('weatherCity')?.value.trim() || '';
    const apiKey = document.getElementById('weatherApiKey')?.value.trim() || '';
    SettingStore.set('timezone', tz);
    SettingStore.set('weatherCity', city);
    SettingStore.set('weatherApiKey', apiKey);
    _weatherCache = null;
    _locationFetched = false;
    _updateClockWidget();
    _fetchWeather();
    saToast('时钟配置已保存');
}

/* ── 时区面板实时显示 ── */
const TZ_IDS = ['local', 'America/New_York', 'America/Los_Angeles', 'Asia/Tokyo',
    'Asia/Seoul', 'Europe/London', 'Europe/Paris', 'Asia/Shanghai',
    'Asia/Singapore', 'Australia/Sydney'];
let _tzTimer = null;

function _updateTzTimes() {
    const now = new Date();
    TZ_IDS.forEach(tz => {
        const el = document.getElementById(`tz-${tz}`);
        if (!el) return;
        try {
            el.textContent = tz === 'local'
                ? now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })
                : new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }).format(now);
        } catch { el.textContent = '--:--'; }
    });
}

function _startTzTimer() {
    if (_tzTimer) return;
    _tzTimer = setInterval(_updateTzTimes, 10000);
}

function selectTimezone(tz) {
    _setActive('tzGrid', '.sc-tz-item', `[data-tz="${tz}"]`);
    SettingStore.set('timezone', tz);
    _updateClockWidget();
}

/* ════════════════════════════════
   图标风格
════════════════════════════════ */
function selectIconStyle(style) {
    _setActive('iconStyleList', '.sa-icon-style-item', `[data-style="${style}"]`);
    applyIconStyleToPage(style, true);
}

function applyIconStyleToPage(style, save) {
    const icons = document.querySelectorAll('.app-icon, .dock-icon');
    icons.forEach(icon => {
        icon.dataset.iconStyle = style;
        const svgEls = icon.querySelectorAll('svg');
        svgEls.forEach(svg => {
            if (style === 'filled') {
                svg.setAttribute('fill', 'currentColor');
                svg.setAttribute('stroke', 'none');
            } else if (style === 'rounded') {
                svg.setAttribute('fill', 'none');
                svg.setAttribute('stroke', 'currentColor');
                svg.setAttribute('stroke-width', '2.2');
            } else {
                svg.setAttribute('fill', 'none');
                svg.setAttribute('stroke', 'currentColor');
                svg.setAttribute('stroke-width', '1.4');
            }
        });
    });
    if (save) SettingStore.set('iconStyle', style);
}

function selectIconBg(bg) {
    _setActive(null, '.sa-icon-bg-item', `[data-bg="${bg}"]`);
    applyIconBgToPage(bg, true);
}

function applyIconBgToPage(bg, save) {
    const icons = document.querySelectorAll('.app-icon, .dock-icon');
    const bgStyles = {
        glass: '',   /* 保持 .glass-icon 原样 */
        white: 'rgba(255,255,255,0.92)',
        dark: 'rgba(40,40,40,0.88)',
        none: 'transparent'
    };
    icons.forEach(icon => {
        if (bg === 'glass') {
            icon.classList.add('glass-icon');
            icon.style.background = '';
            icon.style.border = '';
        } else {
            icon.classList.remove('glass-icon');
            icon.style.background = bgStyles[bg] || '';
            icon.style.border = bg === 'none'
                ? 'none'
                : '1px solid rgba(200,200,198,0.3)';
            if (bg === 'dark') {
                icon.querySelectorAll('svg').forEach(s => s.style.color = '#f0f0ee');
            } else {
                icon.querySelectorAll('svg').forEach(s => s.style.color = '');
            }
        }
    });
    if (save) SettingStore.set('iconBg', bg);
}

/* ════════════════════════════════
   字体更换
════════════════════════════════ */
const FONT_MAP = {
    system: "-apple-system,'PingFang SC','Helvetica Neue',sans-serif",
    serif: "Georgia,'Times New Roman',serif",
    mono: "'Courier New','Menlo',monospace"
};

function selectFont(font) {
    _setActive('fontList', '.sa-font-item', `[data-font="${font}"]`);
    applyFontToPage(font, false);
}

function previewFontSize(val) {
    document.getElementById('fontSizeVal').textContent = val + '%';
    applyFontSizeToPage(val, false);
}

function applyFont() {
    const fontItems = document.querySelectorAll('#fontList .sa-font-item.active');
    const font = fontItems.length ? fontItems[0].dataset.font : 'system';
    const fontSize = document.getElementById('fontSizeRange').value;
    applyFontToPage(font, true);
    applyFontSizeToPage(fontSize, true);
    saToast('字体设置已应用');
}

function applyFontToPage(font, save) {
    const family = FONT_MAP[font] || FONT_MAP.system;
    document.getElementById('homeScreen').style.fontFamily = family;
    if (save) SettingStore.set('font', font);
}

function applyFontSizeToPage(val, save) {
    document.getElementById('homeScreen').style.fontSize = (val / 100) + 'rem';
    if (save) SettingStore.set('fontSize', parseInt(val));
}

/* ════════════════════════════════
   数据管理
════════════════════════════════ */
function calcStorage() {
    /* 文字（localStorage） */
    let textBytes = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('xxj_')) {
            textBytes += (localStorage.getItem(k) || '').length * 2; /* UTF-16 */
        }
    }

    const fmt = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    };

    _setTextContent('textDataSize', fmt(textBytes));

    /* 图片（IndexedDB，异步估算） */
    if (typeof ImgDB !== 'undefined') {
        Promise.all([
            ImgDB.get('img_avatar'),
            ImgDB.get('img_noteImg'),
            ImgDB.get('img_photoImg'),
            ImgDB.get('wallpaper')
        ]).then(results => {
            let imgBytes = results.reduce((sum, r) =>
                sum + (r ? r.length * 2 : 0), 0);
            _setTextContent('imgDataSize', fmt(imgBytes));
            _setTextContent('totalDataSize', fmt(textBytes + imgBytes));
        }).catch(() => {
            _setTextContent('imgDataSize', '无法估算');
            _setTextContent('totalDataSize', '—');
        });
    } else {
        _setTextContent('imgDataSize', '—');
        _setTextContent('totalDataSize', fmt(textBytes));
    }
}

function exportData() {
    const data = {};
    /* 收集 localStorage */
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('xxj_')) data[k] = localStorage.getItem(k);
    }

    /* 异步收集图片 */
    const imgKeys = ['img_avatar', 'img_noteImg', 'img_photoImg', 'wallpaper'];
    Promise.all(
        imgKeys.map(k => (typeof ImgDB !== 'undefined' ? ImgDB.get(k) : Promise.resolve(null))
            .then(v => ({ k: 'idb_' + k, v })))
    ).then(pairs => {
        pairs.forEach(({ k, v }) => { if (v) data[k] = v; });
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `xingxingji_backup_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        saToast('备份已导出');
    });
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            Object.keys(data).forEach(k => {
                if (k.startsWith('idb_')) {
                    /* IndexedDB图片 */
                    const idbKey = k.replace('idb_', '');
                    if (typeof ImgDB !== 'undefined') ImgDB.set(idbKey, data[k]).catch(() => { });
                } else if (k.startsWith('xxj_')) {
                    localStorage.setItem(k, data[k]);
                }
            });
            saToast('导入成功，即将刷新…');
            setTimeout(() => location.reload(), 1200);
        } catch {
            saToast('导入失败：文件格式不正确', 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function clearTextData() {
    if (!confirm('确认清除所有文字数据？此操作不可撤销')) return;
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('xxj_text_')) keys.push(k);
    }
    keys.forEach(k => localStorage.removeItem(k));
    saToast('文字数据已清除');
    calcStorage();
}

function clearImgData() {
    if (!confirm('确认清除所有图片数据？')) return;
    if (typeof ImgDB !== 'undefined') {
        ['img_avatar', 'img_noteImg', 'img_photoImg', 'wallpaper'].forEach(k =>
            ImgDB.remove(k).catch(() => { })
        );
    }
    saToast('图片数据已清除，刷新后生效');
    calcStorage();
}

function clearAllData() {
    if (!confirm('确认重置全部数据？所有设置、图片、文字将清空！')) return;
    /* localStorage */
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('xxj_')) keys.push(k);
    }
    keys.forEach(k => localStorage.removeItem(k));
    /* IndexedDB */
    if (typeof ImgDB !== 'undefined') {
        ['img_avatar', 'img_noteImg', 'img_photoImg', 'wallpaper'].forEach(k =>
            ImgDB.remove(k).catch(() => { })
        );
    }
    saToast('已重置，即将刷新…');
    setTimeout(() => location.reload(), 1200);
}

/* ════════════════════════════════
   启动时恢复设置（页面加载时调用）
════════════════════════════════ */
function restoreSettings() {
    /* 壁纸：图片优先，否则颜色 */
    if (typeof ImgDB !== 'undefined') {
        ImgDB.get('wallpaper').then(dataUrl => {
            if (dataUrl) {
                const layer = document.getElementById('wallpaperLayer');
                if (layer) {
                    layer.style.backgroundImage = `url(${dataUrl})`;
                    layer.style.backgroundSize = 'cover';
                    layer.style.backgroundPosition = 'center';
                }
            } else {
                const wpColor = SettingStore.get('wpColor', null);
                if (wpColor) applyColorWallpaper(wpColor, false);
            }
        }).catch(() => { });
    }

    /* 屏幕 */
    const scale = SettingStore.get('scale', 100);
    const brightness = SettingStore.get('brightness', 100);
    const gap = SettingStore.get('gridGap', 16);
    applyScaleToPage(scale, false);
    applyBrightnessToPage(brightness, false);
    applyGridGapToPage(gap, false);

    /* 字体 */
    applyFontToPage(SettingStore.get('font', 'system'), false);
    applyFontSizeToPage(SettingStore.get('fontSize', 100), false);

    /* 图标 */
    applyIconStyleToPage(SettingStore.get('iconStyle', 'default'), false);
    applyIconBgToPage(SettingStore.get('iconBg', 'glass'), false);

    /* ── 屏幕调整扩展恢复 ── */
    applyFilterToPage(SettingStore.get('screenFilter', 'none'), false);
    applyNightMode(SettingStore.get('nightMode', false), false);
    applyEyeCare(SettingStore.get('eyeCare', false), false);
    toggleStatusBar(SettingStore.get('hideStatusBar', false));
    toggleDynamicIsland(SettingStore.get('hideDynamicIsland', false));
    applyTopWidget(SettingStore.get('topWidget', 'info'), false);
    const savedPos = SettingStore.get('screenPos', { x: 0, y: 0 });
    _applyScreenPos(savedPos, false);
    _rebuildScreenFilter();
}

/* ════════════════════════════════
   工具函数
════════════════════════════════ */

/* Toast 提示 */
function saToast(msg, type = 'success') {
    const existing = document.getElementById('saToast');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.id = 'saToast';
    el.textContent = msg;
    Object.assign(el.style, {
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: type === 'error' ? 'rgba(180,50,50,0.92)' : 'rgba(42,42,42,0.88)',
        color: '#fff',
        padding: '9px 18px',
        borderRadius: '20px',
        fontSize: '13px',
        letterSpacing: '0.3px',
        zIndex: '9999',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
        animation: 'saToastIn 0.22s ease',
    });

    /* 追加动画 */
    if (!document.getElementById('saToastStyle')) {
        const s = document.createElement('style');
        s.id = 'saToastStyle';
        s.textContent = `
      @keyframes saToastIn  { from { opacity:0; transform:translateX(-50%) translateY(8px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
      @keyframes saToastOut { from { opacity:1; } to { opacity:0; } }
    `;
        document.head.appendChild(s);
    }

    document.body.appendChild(el);
    setTimeout(() => {
        el.style.animation = 'saToastOut 0.22s ease forwards';
        setTimeout(() => el.remove(), 220);
    }, 2200);
}

function _escHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function _shortUrl(url) {
    try { return new URL(url).hostname; } catch { return url; }
}

function _setTextContent(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}
