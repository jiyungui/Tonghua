/**
 * settings.js — 设置页面逻辑
 */
const Settings = (() => {

    const KEY_MODELS = 'settings_models';
    const KEY_ACTIVE = 'settings_activeModel';
    const KEY_MINIMAX = 'settings_minimax';

    function getModels() { return Storage.get(KEY_MODELS, []); }
    function saveModels(list) { Storage.set(KEY_MODELS, list); }
    function getActiveIdx() { return Storage.get(KEY_ACTIVE, -1); }
    function setActiveIdx(i) { Storage.set(KEY_ACTIVE, i); }

    function getMM() {
        return Storage.get(KEY_MINIMAX, {
            apiKey: '', groupId: '', voiceId: 'female-tianmei', speed: 1, volume: 5
        });
    }
    function saveMM(d) { Storage.set(KEY_MINIMAX, d); }

    let _dom = {};
    let _audio = null;   // 当前播放的 Audio 实例

    function cacheDOM() {
        _dom = {
            settingsScreen: document.getElementById('settingsScreen'),
            apiScreen: document.getElementById('apiScreen'),
            settingsBack: document.getElementById('settingsBack'),
            apiBack: document.getElementById('apiBack'),
            settingsCards: document.querySelectorAll('.settings-card'),

            apiName: document.getElementById('apiName'),
            apiUrl: document.getElementById('apiUrl'),
            apiKey: document.getElementById('apiKey'),
            apiKeyToggle: document.getElementById('apiKeyToggle'),
            apiFetchModels: document.getElementById('apiFetchModels'),
            apiModelSelect: document.getElementById('apiModelSelect'),
            apiModelManual: document.getElementById('apiModelManual'),
            apiTestModel: document.getElementById('apiTestModel'),
            apiSaveModel: document.getElementById('apiSaveModel'),
            apiTestResult: document.getElementById('apiTestResult'),
            apiModelList: document.getElementById('apiModelList'),
            apiModelCount: document.getElementById('apiModelCount'),

            mmApiKey: document.getElementById('mmApiKey'),
            mmKeyToggle: document.getElementById('mmKeyToggle'),
            mmGroupId: document.getElementById('mmGroupId'),
            mmVoiceId: document.getElementById('mmVoiceId'),
            mmSpeed: document.getElementById('mmSpeed'),
            mmSpeedVal: document.getElementById('mmSpeedVal'),
            mmVolume: document.getElementById('mmVolume'),
            mmVolumeVal: document.getElementById('mmVolumeVal'),
            mmSave: document.getElementById('mmSave'),
            mmTest: document.getElementById('mmTest'),
            mmStop: document.getElementById('mmStop'),
            mmPreviewText: document.getElementById('mmPreviewText'),
            mmTestResult: document.getElementById('mmTestResult'),
        };
    }

    /* ── 导航 ── */
    function openSettings() { _dom.settingsScreen.classList.add('active'); }
    function closeSettings() { _dom.settingsScreen.classList.remove('active'); }
    function openApiScreen() {
        _dom.apiScreen.classList.add('active');
        renderModelList();
        loadMMConfig();
    }
    function closeApiScreen() { _dom.apiScreen.classList.remove('active'); }

    /* ── 眼睛切换 ── */
    function bindEyeToggle(inputEl, btnEl) {
        btnEl.addEventListener('click', () => {
            const show = inputEl.type === 'password';
            inputEl.type = show ? 'text' : 'password';
            btnEl.style.opacity = show ? '1' : '0.5';
        });
    }

    /* ── 拉取模型 ── */
    async function fetchModels() {
        const url = _dom.apiUrl.value.trim();
        const apiKey = _dom.apiKey.value.trim();
        if (!url) { showToast('请先填写 API URL'); return; }

        _dom.apiFetchModels.classList.add('loading');
        _dom.apiFetchModels.disabled = true;
        try {
            const endpoint = url.replace(/\/$/, '') + '/models';
            const resp = await fetch(endpoint, {
                headers: apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}
            });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const json = await resp.json();
            const list = Array.isArray(json) ? json
                : Array.isArray(json.data) ? json.data : [];
            if (!list.length) throw new Error('未找到可用模型');

            _dom.apiModelSelect.innerHTML = '<option value="">— 请选择模型 —</option>';
            list.forEach(m => {
                const id = m.id || m.name || String(m);
                const opt = document.createElement('option');
                opt.value = id; opt.textContent = id;
                _dom.apiModelSelect.appendChild(opt);
            });
            showToast(`已拉取 ${list.length} 个模型 ✓`, 'success');
        } catch (err) {
            showToast(`拉取失败：${err.message}`, 'error');
        } finally {
            _dom.apiFetchModels.classList.remove('loading');
            _dom.apiFetchModels.disabled = false;
        }
    }

    function getCurrentModel() {
        return _dom.apiModelManual.value.trim() || _dom.apiModelSelect.value || '';
    }

    /* ── 测试模型 ── */
    async function testModel() {
        const url = _dom.apiUrl.value.trim();
        const apiKey = _dom.apiKey.value.trim();
        const model = getCurrentModel();
        if (!url || !model) { showResult('请填写 API URL 并选择/输入模型', 'error'); return; }

        _dom.apiTestModel.disabled = true;
        showResult('测试中…', '');
        try {
            const endpoint = url.replace(/\/$/, '') + '/chat/completions';
            const resp = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {})
                },
                body: JSON.stringify({
                    model,
                    messages: [{ role: 'user', content: 'Hello! Reply with one word only.' }],
                    max_tokens: 10
                })
            });
            const json = await resp.json();
            if (!resp.ok) throw new Error(json.error?.message || `HTTP ${resp.status}`);
            const reply = json.choices?.[0]?.message?.content || '(无回复)';
            showResult(`✓ 连接成功！模型回复：${reply}`, 'success');
        } catch (err) {
            showResult(`✗ 测试失败：${err.message}`, 'error');
        } finally {
            _dom.apiTestModel.disabled = false;
        }
    }

    /* ── 保存模型 ── */
    function saveModel() {
        const name = _dom.apiName.value.trim();
        const url = _dom.apiUrl.value.trim();
        const key = _dom.apiKey.value.trim();
        const model = getCurrentModel();
        if (!name) { showToast('请填写 API 名称'); return; }
        if (!url) { showToast('请填写 API URL'); return; }
        if (!model) { showToast('请选择或输入模型名称'); return; }

        const list = getModels();
        const existIdx = list.findIndex(m => m.name === name);
        const entry = { name, url, key, model, savedAt: Date.now() };
        if (existIdx >= 0) {
            list[existIdx] = entry;
            showToast(`已更新：${name}`, 'success');
        } else {
            list.push(entry);
            showToast(`已保存：${name}`, 'success');
        }
        saveModels(list);
        setActiveIdx(existIdx >= 0 ? existIdx : list.length - 1);
        renderModelList();
    }

    /* ── 渲染模型列表 ── */
    function renderModelList() {
        const list = getModels();
        const activeIdx = getActiveIdx();
        const container = _dom.apiModelList;
        _dom.apiModelCount.textContent = list.length;

        if (!list.length) {
            container.innerHTML = '<div class="api-model-empty">暂无保存的模型</div>';
            return;
        }
        container.innerHTML = '';
        list.forEach((m, i) => {
            const item = document.createElement('div');
            item.className = 'api-model-item' + (i === activeIdx ? ' active' : '');
            item.innerHTML = `
              <div class="api-model-dot"></div>
              <div class="api-model-info">
                <div class="api-model-name">${escHtml(m.name)}</div>
                <div class="api-model-meta">${escHtml(m.model)} · ${escHtml(m.url)}</div>
              </div>
              <button class="api-model-del" title="删除">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
                </svg>
              </button>`;

            item.addEventListener('click', e => {
                if (e.target.closest('.api-model-del')) return;
                setActiveIdx(i); fillForm(m); renderModelList();
                showToast(`已切换：${m.name}`, 'success');
            });
            item.querySelector('.api-model-del').addEventListener('click', e => {
                e.stopPropagation();
                const nl = getModels(); nl.splice(i, 1); saveModels(nl);
                if (getActiveIdx() >= nl.length) setActiveIdx(nl.length - 1);
                renderModelList(); showToast('已删除');
            });
            container.appendChild(item);
        });
    }

    function fillForm(m) {
        _dom.apiName.value = m.name || '';
        _dom.apiUrl.value = m.url || '';
        _dom.apiKey.value = m.key || '';
        _dom.apiModelManual.value = m.model || '';
    }

    /* ── MiniMax 配置 ── */
    function loadMMConfig() {
        const d = getMM();
        _dom.mmApiKey.value = d.apiKey || '';
        _dom.mmGroupId.value = d.groupId || '';
        _dom.mmVoiceId.value = d.voiceId || 'female-tianmei';
        _dom.mmSpeed.value = d.speed ?? 1;
        _dom.mmVolume.value = d.volume ?? 5;
        _dom.mmSpeedVal.textContent = parseFloat(_dom.mmSpeed.value).toFixed(1);
        _dom.mmVolumeVal.textContent = parseFloat(_dom.mmVolume.value).toFixed(1);
    }

    function saveMMConfig() {
        saveMM({
            apiKey: _dom.mmApiKey.value.trim(),
            groupId: _dom.mmGroupId.value.trim(),
            voiceId: _dom.mmVoiceId.value.trim() || 'female-tianmei',
            speed: parseFloat(_dom.mmSpeed.value),
            volume: parseFloat(_dom.mmVolume.value)
        });
        showToast('MiniMax 配置已保存 ✓', 'success');
    }

    /* ── 语音试听（自定义文字）── */
    async function previewVoice() {
        const d = getMM();
        const text = _dom.mmPreviewText.value.trim();

        if (!d.apiKey || !d.groupId) {
            showMMResult('请先保存 MiniMax API Key 和 Group ID', 'error'); return;
        }
        if (!text) { showMMResult('请先输入试听文字', 'error'); return; }

        /* 如正在播放则先停止 */
        stopVoice();

        _dom.mmTest.style.display = 'none';
        _dom.mmStop.style.display = '';
        showMMResult('合成中…', '');

        try {
            const resp = await fetch(
                `https://api.minimax.chat/v1/text_to_speech?GroupId=${d.groupId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${d.apiKey}`
                },
                body: JSON.stringify({
                    model: 'speech-01',
                    text,
                    voice_id: d.voiceId || 'female-tianmei',
                    speed: d.speed,
                    vol: d.volume,
                    audio_sample_rate: 32000,
                    bitrate: 128000,
                    format: 'mp3'
                })
            });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const blob = await resp.blob();
            const url = URL.createObjectURL(blob);
            _audio = new Audio(url);
            _audio.play();
            showMMResult('▶ 正在播放…', 'success');
            _audio.onended = () => {
                URL.revokeObjectURL(url);
                stopVoice();
                showMMResult('✓ 播放完毕', 'success');
            };
        } catch (err) {
            showMMResult(`✗ 试听失败：${err.message}`, 'error');
            stopVoice();
        }
    }

    function stopVoice() {
        if (_audio) { _audio.pause(); _audio = null; }
        _dom.mmTest.style.display = '';
        _dom.mmStop.style.display = 'none';
    }

    /* ── 工具函数 ── */
    let _toastTimer = null;

    function showResult(msg, type) {
        const el = _dom.apiTestResult;
        el.textContent = msg;
        el.className = 'api-test-result show' + (type ? ` ${type}` : '');
    }

    function showMMResult(msg, type) {
        const el = _dom.mmTestResult;
        el.textContent = msg;
        el.className = 'api-test-result show' + (type ? ` ${type}` : '');
    }

    function escHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function showToast(msg, type = '') {
        let toast = document.getElementById('settingsToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'settingsToast';
            toast.style.cssText = `
              position:fixed; bottom:90px; left:50%;
              transform:translateX(-50%) translateY(20px);
              font-size:12.5px; font-weight:500; color:#fff;
              padding:9px 22px; border-radius:999px; z-index:9999; opacity:0;
              transition:opacity 0.22s, transform 0.22s; pointer-events:none;
              white-space:nowrap; box-shadow:0 4px 18px rgba(0,0,0,0.18);
            `;
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.style.background =
            type === 'success' ? 'rgba(30,120,60,0.9)' :
                type === 'error' ? 'rgba(160,30,30,0.9)' :
                    'rgba(30,30,30,0.88)';
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
        clearTimeout(_toastTimer);
        _toastTimer = setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(10px)';
        }, 2200);
    }

    /* ── 初始化 ── */
    function init() {
        cacheDOM();

        _dom.settingsBack.addEventListener('click', closeSettings);
        _dom.apiBack.addEventListener('click', closeApiScreen);

        _dom.settingsCards.forEach(card => {
            card.addEventListener('click', () => {
                const target = card.dataset.settings;
                if (target === 'api') openApiScreen();
                else if (target === 'display') {
                    if (typeof Display !== 'undefined') Display.openDisplay();
                }
                else showToast('该功能即将上线 ✦');
            });
        });

        bindEyeToggle(_dom.apiKey, _dom.apiKeyToggle);
        bindEyeToggle(_dom.mmApiKey, _dom.mmKeyToggle);

        _dom.apiFetchModels.addEventListener('click', fetchModels);
        _dom.apiTestModel.addEventListener('click', testModel);
        _dom.apiSaveModel.addEventListener('click', saveModel);

        _dom.mmSpeed.addEventListener('input', () => {
            _dom.mmSpeedVal.textContent = parseFloat(_dom.mmSpeed.value).toFixed(1);
        });
        _dom.mmVolume.addEventListener('input', () => {
            _dom.mmVolumeVal.textContent = parseFloat(_dom.mmVolume.value).toFixed(1);
        });

        _dom.mmSave.addEventListener('click', saveMMConfig);
        _dom.mmTest.addEventListener('click', previewVoice);
        _dom.mmStop.addEventListener('click', stopVoice);
    }

    return { init, openSettings };
})();
