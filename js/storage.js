/**
 * storage.js
 * 本地数据持久化 - localStorage
 * 修复：增加写入异常捕获与容量提示
 */

const Storage = (() => {
    const PREFIX = 'myphone_';

    function get(key, defaultVal = null) {
        try {
            const raw = localStorage.getItem(PREFIX + key);
            if (raw === null) return defaultVal;
            return JSON.parse(raw);
        } catch (e) {
            console.warn('[Storage] get 解析失败:', key, e);
            return defaultVal;
        }
    }

    function set(key, val) {
        try {
            const serialized = JSON.stringify(val);
            localStorage.setItem(PREFIX + key, serialized);
            // 写入验证
            const check = localStorage.getItem(PREFIX + key);
            if (check !== serialized) {
                console.error('[Storage] 写入校验失败:', key);
            }
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                console.error('[Storage] localStorage 已满！尝试清理旧数据...');
                // 策略：清除旧的图片缓存，保留文字配置
                _tryFreeSpace(key, val);
            } else {
                console.warn('[Storage] set 失败:', key, e);
            }
        }
    }

    /* 容量不足时，压缩策略：降低图片质量再存 */
    function _tryFreeSpace(key, val) {
        // 删除所有图片 dataUrl，保留文字
        const keys = Object.keys(localStorage);
        keys.forEach(k => {
            if (k.startsWith(PREFIX)) {
                try {
                    const item = JSON.parse(localStorage.getItem(k));
                    if (item && typeof item === 'object') {
                        // 清除超大图片字段
                        Object.keys(item).forEach(field => {
                            if (typeof item[field] === 'string' && item[field].startsWith('data:image')) {
                                item[field] = '';
                            }
                        });
                        localStorage.setItem(k, JSON.stringify(item));
                    }
                } catch { }
            }
        });
        // 再次尝试写入
        try {
            localStorage.setItem(PREFIX + key, JSON.stringify(val));
        } catch (e2) {
            console.error('[Storage] 二次写入失败，存储容量严重不足');
        }
    }

    function remove(key) {
        localStorage.removeItem(PREFIX + key);
    }

    /* ---- 顶部组件 ---- */
    function getTopWidget() {
        return get('widget_top', {
            title: '幸好爱是小小的奇迹',
            baby: 'call Aero',
            contact: "http//>Aero's love.com",
            avatarDataUrl: ''
        });
    }
    function saveTopWidget(data) { set('widget_top', data); }

    /* ---- 拍立得组件 ---- */
    function getPolaroid() {
        return get('widget_polaroid', {
            caption: 'First Choice',
            imgDataUrl: ''
        });
    }
    function savePolaroid(data) { set('widget_polaroid', data); }

    /* ---- 右侧图片组件 ---- */
    function getPhotoWidget() {
        return get('widget_photo', {
            imgDataUrl: ''
        });
    }
    function savePhotoWidget(data) { set('widget_photo', data); }

    return {
        get, set, remove,
        getTopWidget, saveTopWidget,
        getPolaroid, savePolaroid,
        getPhotoWidget, savePhotoWidget
    };
})();
