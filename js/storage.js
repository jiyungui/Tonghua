// IndexedDB 超大容量储存引擎 (无损 Blob、网络 URL 代理、防冲突 Key-Value 储存)
const DB_NAME = 'QiqiPhoneDB_v3';
const DB_VERSION = 1;
const STORE_NAME = 'kv_store';

class StorageDB {
  constructor() {
    this.db = null;
    this.initPromise = this.init();
  }

  init() {
    return new Promise((resolve) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        // 创建纯粹的 key-value store (明确不使用 in-line keyPath，彻底杜绝 DataError 报错)
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };

      request.onerror = (e) => {
        console.error('IndexedDB 打开失败:', e);
        resolve(null);
      };
    });
  }

  async get(key) {
    await this.initPromise;
    if (!this.db) return null;
    return new Promise((resolve) => {
      try {
        const transaction = this.db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
      } catch (err) {
        resolve(null);
      }
    });
  }

  async set(key, value) {
    await this.initPromise;
    if (!this.db) return false;
    return new Promise((resolve) => {
      try {
        const transaction = this.db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(value, key);
        request.onsuccess = () => resolve(true);
        request.onerror = (err) => {
          console.warn('Storage set error:', err);
          resolve(false);
        };
      } catch (err) {
        console.warn('Storage transaction error:', err);
        resolve(false);
      }
    });
  }

  // 保存原画质图片（支持本地 File/Blob，或网络 URL）
  async saveImageResource(key, source) {
    if (!source) return;
    if (source instanceof Blob || source instanceof File) {
      // 本地相册原画质 Blob 存储（原生二进制，0 压缩）
      await this.set(`img_type_${key}`, 'blob');
      await this.set(key, source);
    } else if (typeof source === 'string') {
      // 网络 URL 存储
      await this.set(`img_type_${key}`, 'url');
      await this.set(key, source);
    }
  }

  // 别名兼容
  async saveImageBlob(key, fileOrBlob) {
    return this.saveImageResource(key, fileOrBlob);
  }

  // 读取图片并生成即时展示的 URL
  async getImageURL(key) {
    const type = await this.get(`img_type_${key}`);
    const data = await this.get(key);
    if (!data) return null;

    if (type === 'blob' && (data instanceof Blob || data instanceof File)) {
      return URL.createObjectURL(data);
    }
    if (typeof data === 'string') {
      return data;
    }
    return null;
  }
}

export const storage = new StorageDB();
