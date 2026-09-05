// P2 小组件逻辑控制器（支持指定容器渲染，使第一页与第二页可同时复用）
import { storage } from './storage.js';
import { DEFAULT_GRAY_IMAGES } from './quotes.js';

export const P2Widget = {
  defaultData: {
    searchPlaceholder: '검색',
    line1Text: 'yummy',
    line2Text: '재생 키를 누르다 ♡',
    line3Text: 'plog .!′ ૮₍ ≧ . ≦ ₎ა'
  },

  async render(container, onEditClick, storagePrefix = 'p2') {
    const data = await this.getData(storagePrefix);
    const imgUrl = await storage.getImageURL(`${storagePrefix}_image`) || DEFAULT_GRAY_IMAGES.square;

    container.innerHTML = `
      <div class="widget-p2-card" id="widget-${storagePrefix}-inner">
        <button class="widget-edit-btn" title="编辑P2小组件" id="${storagePrefix}-edit-trigger">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        </button>

        <div class="p2-search-bar">
          <div class="p2-search-icon">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7A7C80" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <span class="p2-search-text">${data.searchPlaceholder}</span>
        </div>

        <div class="p2-content-row">
          <div class="p2-image-box">
            <img src="${imgUrl}" alt="Card Image" class="p2-img" id="${storagePrefix}-display-img">
          </div>
          <div class="p2-text-col">
            <div class="p2-symbols-row">
              <svg class="p2-symbol-svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <svg class="p2-symbol-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
            </div>
            <div class="p2-serif-text">₍ ᐢ..ᐢ ₎ ♡ ${data.line1Text}</div>
            <div class="p2-sub-korean">▶ ${data.line2Text}</div>
            <div class="p2-plog-tag">° ${data.line3Text}</div>
          </div>
        </div>
      </div>
    `;

    container.querySelector(`#${storagePrefix}-edit-trigger`).addEventListener('click', (e) => {
      e.stopPropagation();
      onEditClick(storagePrefix);
    });
  },

  async getData(storagePrefix = 'p2') {
    const saved = await storage.get(`${storagePrefix}_data`);
    return saved ? { ...this.defaultData, ...saved } : this.defaultData;
  },

  async saveData(newData, imageFile, storagePrefix = 'p2') {
    await storage.set(`${storagePrefix}_data`, newData);
    if (imageFile) {
      await storage.saveImageBlob(`${storagePrefix}_image`, imageFile);
    }
  }
};
