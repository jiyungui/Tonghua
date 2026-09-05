// P1 小组件逻辑控制器
import { storage } from './storage.js';

export const P1Widget = {
  defaultData: {
    title: 'Inny',
    tags: 'Nearby, Game, Dressing Style, Pet',
    bio: 'A violinist who loves to eat and play, he usually likes to go shopping with friends...',
    bubbleText: "It's very close to you",
    bgImage: '图片/IMG_6065等22项文件/7.jpg',
    avatarImage: '图片/IMG_6065等22项文件/7.jpg'
  },

  async render(container, onEditClick) {
    const data = await this.getData();
    const bgUrl = await storage.getImageURL('p1_bg_image') || data.bgImage;
    const avatarUrl = await storage.getImageURL('p1_avatar_image') || data.avatarImage;

    const tagsArray = data.tags.split(',').map(t => t.trim()).filter(Boolean);
    const tagsHtml = tagsArray.map(tag => `<span class="p1-tag-item">${tag}</span>`).join('');

    container.innerHTML = `
      <div class="widget-p1-card" id="widget-p1-inner">
        <!-- 回形针拟态装饰 -->
        <svg class="p1-paperclip" viewBox="0 0 32 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 6V48C16 54.6274 21.3726 60 28 60C34.6274 60 40 54.6274 40 48V16C40 7.16344 32.8366 0 24 0C15.1634 0 8 7.16344 8 16V48" transform="translate(-6, 2) scale(0.9)" stroke="#4A4A4A" stroke-width="3" stroke-linecap="round"/>
        </svg>

        <button class="widget-edit-btn" title="编辑P1小组件" id="p1-edit-trigger">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        </button>

        <div class="p1-image-container">
          <img src="${bgUrl}" alt="Card Banner" class="p1-bg-image" id="p1-display-bg">
          
          <div class="p1-bubble-tag">
            <img src="${avatarUrl}" alt="Avatar" class="p1-bubble-avatar" id="p1-display-avatar">
            <span class="p1-bubble-text">${data.bubbleText}</span>
          </div>

          <div class="p1-action-buttons">
            <div class="p1-action-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#3A3A3C"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </div>
            <div class="p1-action-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3A3A3C" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div class="p1-action-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3A3A3C" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </div>
          </div>
        </div>

        <div class="p1-details-section">
          <h2 class="p1-name-title">${data.title}</h2>
          <div class="p1-tags-row">
            ${tagsHtml}
          </div>
          <p class="p1-bio-text">${data.bio}</p>
        </div>
      </div>
    `;

    container.querySelector('#p1-edit-trigger').addEventListener('click', (e) => {
      e.stopPropagation();
      onEditClick('p1');
    });
  },

  async getData() {
    const saved = await storage.get('p1_data');
    return saved ? { ...this.defaultData, ...saved } : this.defaultData;
  },

  async saveData(newData, bgFile, avatarFile) {
    await storage.set('p1_data', newData);
    if (bgFile) {
      await storage.saveImageBlob('p1_bg_image', bgFile);
    }
    if (avatarFile) {
      await storage.saveImageBlob('p1_avatar_image', avatarFile);
    }
  }
};
