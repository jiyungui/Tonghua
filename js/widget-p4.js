// P4 第二页顶部小组件控制器 (Story Mode 卡片 + 4相框 + 语录胶囊)
import { storage } from './storage.js';
import { DEFAULT_GRAY_IMAGES, RANDOM_QUOTES } from './quotes.js';

export const P4Widget = {
  defaultData: {
    userName: '测试员',
    userMotto: 'If onli I were in your eye...',
    quoteText: RANDOM_QUOTES[0],
    dateStr: '2026年06月13日',
    timeStr: '08:58'
  },

  async render(container, onEditClick, onRerollQuote) {
    const data = await this.getData();
    const avatarUrl = await storage.getImageURL('p4_avatar') || DEFAULT_GRAY_IMAGES.avatar;
    const photo1Url = await storage.getImageURL('p4_photo_1') || DEFAULT_GRAY_IMAGES.square;
    const photo2Url = await storage.getImageURL('p4_photo_2') || DEFAULT_GRAY_IMAGES.square;
    const photo3Url = await storage.getImageURL('p4_photo_3') || DEFAULT_GRAY_IMAGES.square;
    const photo4Url = await storage.getImageURL('p4_photo_4') || null;

    let slot4Content = photo4Url 
      ? `<img src="${photo4Url}" alt="Photo 4" class="p4-photo-img">`
      : `<span class="p4-plus-icon">+</span>`;

    container.innerHTML = `
      <div class="widget-p4-card" id="widget-p4-inner">
        <button class="widget-edit-btn" title="编辑Story小组件" id="p4-edit-trigger">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        </button>

        <!-- 顶部 Story Mode 标题 -->
        <div class="p4-top-header">
          <span class="p4-heart-badge">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#6E6E73"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </span>
          <span class="p4-top-title">Story Mode</span>
          <span class="p4-heart-badge">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#6E6E73"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </span>
        </div>

        <!-- 二级导航胶囊 -->
        <div class="p4-sub-nav">
          <span class="p4-story-pill">‹ STORY</span>
        </div>

        <!-- 个人资料行 -->
        <div class="p4-profile-bar">
          <div class="p4-profile-left">
            <div class="p4-avatar-box">
              <img src="${avatarUrl}" alt="User Avatar" class="p4-avatar-img">
            </div>
            <div class="p4-profile-info">
              <span class="p4-profile-name">${data.userName}</span>
              <span class="p4-profile-motto">${data.userMotto}</span>
            </div>
          </div>
          <div class="p4-profile-right">
            <svg class="p4-heart-icon" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <svg class="p4-heart-icon" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <span style="font-size: 11px; margin-left: 2px;">#1</span>
          </div>
        </div>

        <!-- 4格相框 -->
        <div class="p4-photos-row">
          <div class="p4-photo-slot">
            <img src="${photo1Url}" alt="Photo 1" class="p4-photo-img">
          </div>
          <div class="p4-photo-slot">
            <img src="${photo2Url}" alt="Photo 2" class="p4-photo-img">
          </div>
          <div class="p4-photo-slot">
            <img src="${photo3Url}" alt="Photo 3" class="p4-photo-img">
          </div>
          <div class="p4-photo-slot ${!photo4Url ? 'p4-slot-add' : ''}" id="p4-slot-4-btn">
            ${slot4Content}
          </div>
        </div>

        <!-- 语录胶囊框与黑白日期条 -->
        <div class="p4-quote-container">
          <div class="p4-quote-body" id="p4-quote-text-el">
            ${data.quoteText}
          </div>
          <div class="p4-quote-footer">
            <div class="p4-footer-left">
              <span>${data.dateStr}</span>
              <span>${data.timeStr}</span>
            </div>
            <div class="p4-footer-stars">
              <span>✦</span><span>✦</span><span>✦</span><span>✦</span><span>✦</span>
            </div>
            <div class="p4-footer-trash">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </div>
          </div>
        </div>

        <!-- 底部功能条 -->
        <div class="p4-bottom-action-bar">
          <div class="p4-phone-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
          </div>
          <div class="p4-reroll-pill" id="p4-reroll-btn">
            <span style="font-size: 14px; font-weight: 300;">+</span>
            <span>Latest Re-roll</span>
            <span>›</span>
          </div>
        </div>
      </div>
    `;

    container.querySelector('#p4-edit-trigger').addEventListener('click', (e) => {
      e.stopPropagation();
      onEditClick('p4');
    });

    container.querySelector('#p4-reroll-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      if (onRerollQuote) onRerollQuote();
    });
  },

  async getData() {
    const saved = await storage.get('p4_data');
    return saved ? { ...this.defaultData, ...saved } : this.defaultData;
  },

  async saveData(newData, files) {
    await storage.set('p4_data', newData);
    if (files) {
      if (files.p4_avatar) await storage.saveImageBlob('p4_avatar', files.p4_avatar);
      if (files.p4_photo_1) await storage.saveImageBlob('p4_photo_1', files.p4_photo_1);
      if (files.p4_photo_2) await storage.saveImageBlob('p4_photo_2', files.p4_photo_2);
      if (files.p4_photo_3) await storage.saveImageBlob('p4_photo_3', files.p4_photo_3);
      if (files.p4_photo_4) await storage.saveImageBlob('p4_photo_4', files.p4_photo_4);
    }
  },

  async rerollQuote() {
    const data = await this.getData();
    const otherQuotes = RANDOM_QUOTES.filter(q => q !== data.quoteText);
    const randomQuote = otherQuotes[Math.floor(Math.random() * otherQuotes.length)] || RANDOM_QUOTES[0];
    
    const now = new Date();
    const dateStr = `${now.getFullYear()}年${String(now.getMonth() + 1).padStart(2, '0')}月${String(now.getDate()).padStart(2, '0')}日`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    data.quoteText = randomQuote;
    data.dateStr = dateStr;
    data.timeStr = timeStr;
    await storage.set('p4_data', data);
    return data;
  }
};
