// IndexedDB 存储通道：支持超大容量存储（几十GB）、原图原画质 Blob 无压缩存储、文本与配置持久化
const DB_NAME = 'QiqiPhoneDB';
const DB_VERSION = 1;
const STORE_NAME = 'app_storage';

class StorageDB {
  constructor() {
    this.db = null;
    this.initPromise = this.init();
  }

  init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        }
      };
      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };
      request.onerror = (e) => {
        console.error('IndexedDB 打开失败:', e);
        reject(e);
      };
    });
  }

  async set(key, value) {
    await this.initPromise;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({ key, value });
      req.onsuccess = () => resolve(true);
      req.onerror = (err) => reject(err);
    });
  }

  async get(key, defaultValue = null) {
    await this.initPromise;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([STORE_NAME], 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => {
        if (req.result && req.result.value !== undefined) {
          resolve(req.result.value);
        } else {
          resolve(defaultValue);
        }
      };
      req.onerror = (err) => reject(err);
    });
  }

  async remove(key) {
    await this.initPromise;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve(true);
      req.onerror = (err) => reject(err);
    });
  }

  // 存储原画质 Blob/File 对象
  async saveImageBlob(key, fileOrBlob) {
    return this.set(key, fileOrBlob);
  }

  // 获取图片为 ObjectURL（原画质直读）
  async getImageURL(key) {
    const data = await this.get(key);
    if (!data) return null;
    if (typeof data === 'string') return data; // 普通URL或Base64
    if (data instanceof Blob || data instanceof File) {
      return URL.createObjectURL(data);
    }
    return null;
  }
}

export const storage = new StorageDB();
