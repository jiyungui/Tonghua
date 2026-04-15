/**
 * storage.js — 本地持久化
 * 使用 localStorage 存储所有用户数据
 */
const Storage = {
    KEY: 'starphone_data',

    _data: null,

    _defaults() {
        return {
            motto: '',
            baby: '',
            contact: '',
            avatarUrl: '',
            widgetLeftImg: '',
            widgetLeftCaption: '',
            widgetRightImg: '',
            wallpaper: '',       // '' = 默认色
            wallpaperType: 'color' // 'color' | 'image'
        };
    },

    load() {
        try {
            const raw = localStorage.getItem(this.KEY);
            this._data = raw ? { ...this._defaults(), ...JSON.parse(raw) } : this._defaults();
        } catch {
            this._data = this._defaults();
        }
        return this._data;
    },

    save(key, value) {
        if (!this._data) this.load();
        this._data[key] = value;
        try {
            localStorage.setItem(this.KEY, JSON.stringify(this._data));
        } catch (e) {
            console.warn('Storage save failed:', e);
        }
    },

    get(key) {
        if (!this._data) this.load();
        return this._data[key];
    },

    saveAll(obj) {
        if (!this._data) this.load();
        Object.assign(this._data, obj);
        try {
            localStorage.setItem(this.KEY, JSON.stringify(this._data));
        } catch (e) {
            console.warn('Storage saveAll failed:', e);
        }
    }
};
