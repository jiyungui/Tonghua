// P2 小组件逻辑控制器（搜索框 + 饮品图文卡片）
import { storage } from './storage.js';

export const P2Widget = {
  defaultData: {
    searchPlaceholder: '검색',
    line1Text: 'yummy',
    line2Text: '재생 키를 누르다 ♡',
    line3Text: 'plog .!′ ૮₍ ≧ . ≦ ₎ა',
    image: '图片/IMG_6065等22项文件/6.jpg'
  },

  async render(container, onEditClick) {
    const data = await this.getData();
    const imgUrl = await storage.getImageURL('p2_image') || data.image;

    container.innerHTML = `
      <div class="widget-p2-card" id="widget-p2-inner">
        <button class="widget-edit-btn" title="编辑P2小组件" id="p2-edit-trigger">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        </button>

        <!-- 极简搜索条 -->
        <div class="p2-search-bar">
          <div class="p2-search-icon">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7A7C80" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <span class="p2-search-text">${data.searchPlaceholder}</span>
        </div>

        <!-- 图文排版区 -->
        <div class="p2-content-row">
          <div class="p2-image-box">
            <img src="${imgUrl}" alt="Coffee" class="p2-img" id="p2-display-img">
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

    container.querySelector('#p2-edit-trigger').addEventListener('click', (e) => {
      e.stopPropagation();
      onEditClick('p2');
    });
  },

  async getData() {
    const saved = await storage.get('p2_data');
    return saved ? { ...this.defaultData, ...saved } : this.defaultData;
  },

  async saveData(newData, imageFile) {
    await storage.set('p2_data', newData);
    if (imageFile) {
      await storage.saveImageBlob('p2_image', imageFile);
    }
  }
};
